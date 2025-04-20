import account from '../models/AccountModel.js';
import user from '../models/UserModel.js';
import tag from '../models/TagModel.js';
import resetsession from '../models/ResetPassSessionModel.js';
import EmailController from './EmailController.js';
import { nanoid } from 'nanoid';
import mongoose from 'mongoose';
import slugify from 'slugify';

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

    Login( req, res, next ) {
        account
            .findOne({
                email: req.body.email,
                password: req.body.password
            })
            .then(( data ) => {
                if ( data ) {
                    user.findOne({ email: data.email })
                        .then(( user ) => {
                            console.log(user);
                            req.session.user = user;
                            res.status(200).json({
                                message: 'Login successfully',
                            });
                        })
                        .catch(( err ) => console.log(err));
                } else {
                    res.status(404).json({
                        message: 'Not Found',
                    });
                }
            })
            .catch(( err ) => res.status(500).send(error));
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
            res.status(200).json({ message: 'Logout successful' });
        });
    }

    async CheckPassword( req, res, next ) {
        try {
            await account.findOne({
                email: req.body.email,
                password: req.body.password
            });

            res.status(200).json({ exist: true });
        } catch ( err ) {
            res.status(500).json({ exist: false });
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
        try {
            const { email } = req.body;
            const accounts = await account.findOne({
                email: email,
            });

            if ( !account ) return res.status(404).json({ message: 'tài khoản không tồn tại' });

            const users = await user.findOne({ email });
            const sessionId = nanoid(10);
            const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

            await resetsession.create({ sessionId, accId: accounts._id, expiresAt });

            await EmailController.sendPasswordResetEmail(users.email, sessionId);

            res.status(200).send();
        } catch ( err ) {
            res.status(500).send(err);
        }
    }

    async ValidateResetSession( req, res, next ) {
        try {
            const { sessionId } = req.query;

            const session = await resetsession.findOne({ sessionId });
            if ( !session || session.expiresAt < new Date() ) {
                return res.status(401).json({ message: 'Phiên không hợp lệ hoặc đã hết hạn' });
            }

            res.status(200).json({ valid: true });
        } catch ( err ) {
            res.status(500).json(err);
        }
    }

    async ResetPassword( req, res, next ) {
        try {
            const { newPassword, sessionId } = req.body;

            if ( !sessionId || !newPassword )
                return res.status(400).json({ message: 'Thiếu thông tin' });

            const session = await resetsession.findOne({ sessionId });
            if ( !session || session.expiresAt < new Date() ) {
                return res.status(401).json({ message: 'Phiên không hợp lệ hoặc đã hết hạn' });
            }

            await account.updateOne({ _id: session.accId }, { $set: { password: newPassword } });

            await resetsession.deleteOne({ sessionId });

            res.status(200).json({ message: 'Changed password successfully' });

        } catch ( error ) {
            console.log(error);
            res.status(500).json({ message: error.message });
        }
    }
}

export default new AuthController();