import account from '../models/AccountModel.js';
import user from '../models/UserModel.js';
import tag from '../models/TagModel.js';
import resetsession from '../models/ResetPassSessionModel.js';
import EmailController from './EmailController.js';
import { nanoid } from 'nanoid';
import mongoose from 'mongoose';
import slugify from 'slugify';
import stripe from 'stripe';

class AuthController {
    CheckAuth( req, res, next ) {
        if ( req.session && req.session.user ) {
            console.log('nhay vao true');
            return res.status(200).json({
                isAuthenticated: true,
                user: req.session.user,
            });
        }
        return res.status(200).json({ isAuthenticated: false });
    }

    async Login( req, res, next ) {
        try {
            // Find account based on email and password
            const accountData = await account.findOne({
                email: req.body.email,
                password: req.body.password
            });

            // Check if account exists
            if ( !accountData ) {
                return res.status(404).json({
                    message: 'Email or password is incorrect',
                });
            }

            // Find detailed user information based on email
            const userData = await user.findOne({ email: accountData.email });

            // Check if user is banned
            if ( userData.isBanned ) {
                return res.status(403).json({
                    message: 'Your account has been banned',
                    reason: userData.banReason || 'No reason provided'
                });
            }

            // User is not banned, proceed with login
            req.session.user = userData;
            req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days

            return res.status(200).json({
                message: 'Login successfully',
                user: userData
            });
        } catch ( error ) {
            console.log(error);
            return res.status(500).json({
                message: 'An error occurred while processing your login request',
                error: error.message
            });
        }
    }

    async Register( req, res, next ) {
        const session = await mongoose.startSession();
        const { email, password, username, address, phone, tagFollowing } = req.body;

        try {
            session.startTransaction();

            const newAccount = new account({ email, password });
            await newAccount.save({ session });

            const base = slugify(username, { lower: true, strict: true });
            let subdomain = '';
            let exists = true;

            while ( exists ) {
                const randomPart = nanoid(5);
                subdomain = `@${ base }${ randomPart }`;

                exists = await user.exists({ subdomain });
            }

            const newUser = new user({ username, email, address, phone, tagFollowing, subdomain });
            await newUser.save({ session });

            await Promise.all(
                tagFollowing.map(( tagId ) =>
                    tag.findByIdAndUpdate(tagId, { $inc: { followers: 1 } }, { new: true })
                )
            );

            await session.commitTransaction();
            console.log('Transaction committed');

            res.status(200).json({ message: 'register successfully' });
        } catch ( error ) {
            await session.abortTransaction();
            console.error('Transaction aborted:', error);
            res.status(500).json({ message: error.message });
        } finally {
            session.endSession();
        }
    }

    Logout( req, res, next ) {
        req.session.destroy(( err ) => {
            if ( err ) {
                console.error('Error destroying session:', err);
                return res.status(500).json({ message: 'Logout failed' });
            }
            res.clearCookie('connect.sid');
            res.status(200).json({ message: 'Logout successful' });
        });
    }

    async CheckPassword( req, res, next ) {
        try {
            const accounts = await account.findOne({
                email: req.body.email,
                password: req.body.password
            });

            if ( accounts ) {
                res.status(200).json({ exist: true });
                return;
            }

            res.status(400).json({ exist: false });

        } catch ( err ) {
            res.status(500).json(err);
        }
    }

    async CheckEmail( req, res, next ) {
        try {
            const accounts = await account.findOne({
                email: req.body.email,
            });

            if ( accounts ) {
                res.status(400).json({ exist: true, message: 'Email already exists!' });
                return;
            }

            res.status(200).json({ exist: false });

        } catch ( err ) {
            res.status(500).json(err);
        }
    }

    async ChangePassword( req, res, next ) {
        try {
            await account.updateOne({ email: req.body.email }, { $set: { password: req.body.password } });
            res.status(200).json({ message: 'Changed password successfully' });
        } catch ( err ) {
            res.status(500).json({ message: err.message });
        }
    }

    async ForgotPassword( req, res, next ) {
        // Start a session for transaction
        const session = await mongoose.startSession();

        try {
            // Start transaction
            session.startTransaction();

            const { email } = req.body;

            // Find the account within the transaction
            const accounts = await account.findOne(
                { email: email },
                null,
                { session }
            );

            if ( !accounts ) {
                await session.abortTransaction();
                session.endSession();
                return res.status(404).json({ message: 'Account does not exist' });
            }

            // Find user details
            const users = await user.findOne({ email }, null, { session });

            if ( !users ) {
                await session.abortTransaction();
                session.endSession();
                return res.status(404).json({ message: 'User details not found' });
            }

            // Generate session ID and expiration
            const sessionId = nanoid(10);
            const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

            // Create reset session within transaction
            await resetsession.create([
                { sessionId, accId: accounts._id, expiresAt }
            ], { session });

            // Commit the transaction
            await session.commitTransaction();

            // Send email after transaction is committed
            await EmailController.sendPasswordResetEmail(users.email, sessionId);

            res.status(200).json({ message: 'An email with instructions has been sent' });
        } catch ( err ) {
            // Abort transaction in case of error
            await session.abortTransaction();

            console.error('Password reset error:', err);
            res.status(500).json({
                message: 'Failed to process password reset request',
                error: err.message
            });
        } finally {
            // End session
            session.endSession();
        }
    }

    async ValidateResetSession( req, res, next ) {
        try {
            const { sessionId } = req.query;

            const session = await resetsession.findOne({ sessionId });
            if ( !session || session.expiresAt < new Date() ) {
                return res.status(401).json({ message: 'Password reset session is invalid or has expired' });
            }

            res.status(200).json({ valid: true });
        } catch ( err ) {
            res.status(500).json(err);
        }
    }

    async ResetPassword( req, res, next ) {
        // Start a session for transaction
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const { newPassword, sessionId } = req.body;

            if ( !sessionId || !newPassword )
                return res.status(400).json({ message: 'Missing information' });

            const resetSession = await resetsession.findOne({ sessionId });
            if ( !resetSession || resetSession.expiresAt < new Date() ) {
                return res.status(401).json({ message: 'Invalid or expired session' });
            }

            await account.updateOne(
                { _id: resetSession.accId },
                { $set: { password: newPassword } },
                { session }
            );

            await resetsession.deleteOne({ sessionId }, { session });

            // Commit the transaction
            await session.commitTransaction();
            session.endSession();

            res.status(200).json({ message: 'Password changed successfully' });

        } catch ( error ) {
            // Abort transaction on error
            await session.abortTransaction();
            session.endSession();

            console.log(error);
            res.status(500).json({ message: 'An error occurred while resetting password' });
        }
    }

    async DeleteAccount( req, res, next ) {
        const session = await mongoose.startSession();

        try {
            session.startTransaction();

            const { email, password } = req.body;
            const currentUser = req.session.user;

            // Validate required fields
            if ( !email || !password ) {
                return res.status(400).json({
                    message: 'Email and password are required'
                });
            }

            // Verify password before deletion
            const accountData = await account.findOne({
                email: email,
                password: password
            }).session(session);

            if ( !accountData ) {
                await session.abortTransaction();
                return res.status(401).json({
                    message: 'Invalid email or password'
                });
            }

            // Ensure user can only delete their own account
            if ( currentUser && currentUser.email !== email ) {
                await session.abortTransaction();
                return res.status(403).json({
                    message: 'You can only delete your own account'
                });
            }

            // Find user data
            const userData = await user.findOne({ email: email }).session(session);

            if ( !userData ) {
                await session.abortTransaction();
                return res.status(404).json({
                    message: 'User data not found'
                });
            }

            // Update followers count for followed tags
            if ( userData.tagFollowing && userData.tagFollowing.length > 0 ) {
                await Promise.all(
                    userData.tagFollowing.map(tagId =>
                        tag.findByIdAndUpdate(
                            tagId,
                            { $inc: { followers: -1 } },
                            { new: true, session }
                        )
                    )
                );
            }

            // Remove user from other users' followers/following lists
            await user.updateMany(
                { followers: userData._id },
                { $pull: { followers: userData._id } },
                { session }
            );

            await user.updateMany(
                { following: userData._id },
                { $pull: { following: userData._id } },
                { session }
            );

            // Remove user from other users' hiddenAuthors lists
            await user.updateMany(
                { hiddenAuthors: userData._id },
                { $pull: { hiddenAuthors: userData._id } },
                { session }
            );

            // Handle subscription cancellation if user is a member
            if ( userData.isMember && userData.stripeCustomerId && userData.subscriptionId ) {
                try {
                    // Immediately cancel the subscription (end it now, not at period end)
                    await stripe.subscriptions.cancel(userData.subscriptionId);

                    console.log(`Cancelled subscription ${ userData.subscriptionId } for user ${ userData.email }`);

                    // Send cancellation email notification
                    await EmailController.sendAccountDeletionNotification({
                        email: userData.email,
                        username: userData.username,
                        subscriptionId: userData.subscriptionId
                    });
                } catch ( stripeError ) {
                    console.error('Error cancelling Stripe subscription:', stripeError);
                    // Log the error but don't abort the transaction
                    // We still want to delete the account even if Stripe fails
                }
            }

            // Delete any active reset password sessions for this account
            await resetsession.deleteMany(
                { accId: accountData._id },
                { session }
            );

            // Delete user document
            await user.deleteOne({ _id: userData._id }, { session });

            // Delete account document
            await account.deleteOne({ _id: accountData._id }, { session });

            // Commit transaction
            await session.commitTransaction();

            // Destroy session if user is deleting their own account
            if ( currentUser && currentUser.email === email ) {
                req.session.destroy(( err ) => {
                    if ( err ) {
                        console.error('Error destroying session after account deletion:', err);
                        return res.status(500).json({
                            message: 'Account was deleted, but an error occurred while destroying the session'
                        });
                    }

                    res.clearCookie('connect.sid');
                    return res.status(200).json({
                        message: 'Account deleted successfully'
                    });
                });
            } else {
                return res.status(200).json({
                    message: 'Account deleted successfully'
                });
            }

        } catch ( error ) {
            // Abort transaction on error
            await session.abortTransaction();
            console.error('Delete account error:', error);

            return res.status(500).json({
                message: 'An error occurred while deleting the account',
                error: error.message
            });
        } finally {
            // End session
            session.endSession();
        }
    }
}

export default new AuthController();