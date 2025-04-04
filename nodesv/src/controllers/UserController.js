import user from '../models/UserModel.js';
import notification from '../models/NotificationModel.js';

class UserController {
    GetAll( req, res, next ) {
        user
            .find({})
            .then(( data ) => res.send(
                data.filter(item => item._id.toString() !== req.session.user._id.toString()).sort(() => 0.5 - Math.random()).slice(0, 3)
            ))
            .catch(( err ) => next(err));
    }

    GetById( req, res, next ) {
        const { id } = req.params;
        user
            .findById(id)
            .then(( data ) => res.send(data))
            .catch(( err ) => console.log(err.message));
    }

    // GetByEmail(req, res, next) {
    //   user.findOne({ email: req.params.email })
    //     .then((data) => res.json(data))
    //     .catch((err) => next(err));
    // }

    GetByEmail( req, res, next ) {
        const { email } = req.query; // Lấy email từ query params

        if ( !email ) {
            return res.status(400).json({ error: 'Email is required' });
        }

        user.findOne({ email })
            .then(( data ) => {
                if ( !data ) {
                    return res.status(404).json({ error: 'User not found' });
                }
                res.json(data);
            })
            .catch(( err ) => {
                console.error('❌ Error fetching user:', err);
                next(err);
            });
    }

    async Create( req, res, next ) {
        try {
            // Tạo người dùng mới từ dữ liệu request
            const newUser = new user(req.body);
            // Lưu vào database
            // Lưu user vào session
            req.session.user = await newUser.save();

            res.status(200).json({
                message: 'User saved successfully'
            });
        } catch ( err ) {
            res.status(500).json({ message: err.message });
        }
    }

    async Follow( req, res, next ) {
        try {
            const { anotherUserId } = req.body;

            const userToFollow = await user.findById(anotherUserId);
            if ( !userToFollow ) {
                return res.status(404).json({ message: 'Người dùng không tồn tại' });
            }

            const currentUser = await user.findById(req.session.user._id);

            const alreadyFollowing = currentUser.following.includes(anotherUserId);

            if ( alreadyFollowing ) {
                return res.status(400).json({ message: 'Bạn đã theo dõi người dùng này' });
            }

            currentUser.following.push(anotherUserId);
            await currentUser.save();

            userToFollow.followers.push(req.session.user._id);
            await userToFollow.save();

            const newNotification = new notification({
                recipient: anotherUserId,
                sender: req.session.user._id,
                type: 'FOLLOW',
                content: `${ req.session.user.username } đã follow bạn`
            });

            await newNotification.save();

            req.io.to(anotherUserId.toString()).emit('newNotification', {
                newNotification,
                message: `${ req.session.user.username } follow you`
            });

            return res.json({
                success: true,
                message: `Bạn đã theo dõi ${ userToFollow.username }`,
                followerCount: currentUser.followers.length
            });
        } catch ( error ) {
            console.error(error.message);
            return res.status(500).json({ message: 'Lỗi máy chủ' });
        }
    }

    async Unfollow( req, res, next ) {
        try {
            const { anotherUserId } = req.body;

            const userToUnfollow = await user.findById(anotherUserId);
            if ( !userToUnfollow ) {
                return res.status(404).json({ message: 'Người dùng không tồn tại' });
            }

            const currentUser = await user.findById(req.session.user._id);

            if ( !currentUser.following.includes(anotherUserId) ) {
                return res.status(400).json({ message: 'Bạn chưa theo dõi người dùng này' });
            }

            // const newFollowing = new Set(currentUser.following);
            // newFollowing.delete(anotherUserId);
            // currentUser.following = [...newFollowing];
            // await currentUser.save();
            //
            // const newFollowers = new Set(userToUnfollow.followers);
            // newFollowers.delete(currentUser._id);
            // userToUnfollow.followers = [...newFollowers];
            // await userToUnfollow.save();

            const followingIndex = currentUser.following.indexOf(anotherUserId);
            if ( followingIndex === -1 ) {
                return res.status(400).json({ message: 'Bạn chưa theo dõi người dùng này' });
            }

            currentUser.following.splice(followingIndex, 1);
            await currentUser.save();

            const followerIndex = userToUnfollow.followers.indexOf(req.session.user._id);
            if ( followerIndex !== -1 ) {
                userToUnfollow.followers.splice(followerIndex, 1);
                await userToUnfollow.save();
            }

            return res.json({
                success: true,
                message: `Bạn đã bỏ theo dõi ${ userToUnfollow.username }`,
                followerCount: currentUser.followers.length
            });
        } catch ( err ) {
            console.error(err.message);
            return res.status(500).json({ message: 'Lỗi máy chủ' });
        }
    }
}

export default new UserController();