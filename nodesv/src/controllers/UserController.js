import user from '../models/UserModel.js';
import post from '../models/PostModel.js';
import notification from '../models/NotificationModel.js';
import slugify from 'slugify';
import { nanoid } from 'nanoid';

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
        const { id } = req.query;
        user
            .findById(id)
            .then(( data ) => res.send(data))
            .catch(( err ) => console.log(err.message));
    }

    GetByDomain( req, res, next ) {
        const { subdomain } = req.query;
        user
            .find({ subdomain: subdomain })
            .then(( data ) => res.send(data))
            .catch(( err ) => console.log(err.message));
    }

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

    async GetUserFollowing( req, res, next ) {
        try {
            const { userId } = req.query;
            const User = await user.findById(userId)
                .select('following')
                .populate({
                    path: 'following',
                    select: 'username email bio ava subdomain',
                })
                .lean();

            if ( !User ) {
                throw new Error('Không tìm thấy người dùng');
            }

            return res.status(200).json({
                success: true,
                followingCount: User.following.length,
                followingUsers: User.following
            });
        } catch ( error ) {
            console.error('Lỗi khi lấy danh sách following:', error);
            return res.status(500).json({
                success: false,
                message: error.message || 'Có lỗi xảy ra khi lấy danh sách following',
                error: error
            });
        }
    }

    async GetUserFollower( req, res, next ) {
        try {
            const { userId } = req.query;
            const User = await user.findById(userId)
                .select('followers')
                .populate({
                    path: 'followers',
                    select: 'username email bio ava subdomain',
                })
                .lean();

            if ( !User ) {
                throw new Error('Không tìm thấy người dùng');
            }

            return res.status(200).json({
                success: true,
                followingCount: User.followers.length,
                followingUsers: User.followers
            });
        } catch ( error ) {
            console.error('Lỗi khi lấy danh sách followers:', error);
            return res.status(500).json({
                success: false,
                message: error.message || 'Có lỗi xảy ra khi lấy danh sách followers',
                error: error
            });
        }
    }

    async GetTopicFollowing( req, res ) {
        try {
            const { userId } = req.query;
            const userData = await user.findById(userId)
                .select('topicFollowing tagFollowing')
                .populate([
                    {
                        path: 'topicFollowing',
                        select: 'topicname tags followers tag'
                    },
                    {
                        path: 'tagFollowing',
                        select: 'tag topic followers'
                    }
                ])
                .lean();

            const data = [...userData.topicFollowing, ...userData.tagFollowing];

            res.status(200).json(data);
        } catch ( error ) {
            console.error('Lỗi khi lấy danh sách topc, tag following:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Có lỗi xảy ra khi lấy danh sách following',
                error: error
            });
        }
    };

    async Create( username, email, address, phone, topics, tagFollowing ) {
        try {
            const base = slugify(username, { lower: true, strict: true }); // VD: "Poseidon" => "poseidon"
            let subdomain = '';
            let exists = true;

            while ( exists ) {
                const randomPart = nanoid(5); // VD: ab12z
                subdomain = `@${ base }${ randomPart }`;

                exists = await user.exists({ subdomain });
            }

            const newUser = new user({ username, email, address, phone, tagFollowing, subdomain });
            newUser.save({});

            res.status(200).json({
                message: 'User saved successfully'
            });
        } catch ( err ) {
            res.status(500).json({ message: err.message });
        }
    }

    async Update( req, res, next ) {
        const { username, email, address, phone, bio, ava, subdomain } = req.body;

        try {
            if ( bio ) {
                // Profile information update
                await user.updateOne(
                    { _id: req.session.user._id },
                    { $set: { username, bio, ava } }
                );

                // Send success response with updated data
                res.status(200).json({
                    success: true,
                    message: 'Profile updated successfully',
                    data: { username, bio, ava }
                });
            } else {
                // Other information update
                await user.updateOne(
                    { _id: req.session.user._id },
                    { $set: { subdomain, email, address, phone } }
                );

                // Send success response with updated data
                res.status(200).json({
                    success: true,
                    message: 'Information updated successfully',
                    data: { subdomain, email, address, phone }
                });
            }
        } catch ( err ) {
            // Error handling
            console.error('Update error:', err);
            res.status(500).json({
                success: false,
                message: err.message || 'An error occurred during update'
            });
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

    async Search( req, res, next ) {
        try {
            const { q, page = 1, limit = 10, sortBy = 'relevance' } = req.query;
            const skip = ( page - 1 ) * limit;

            // Xây dựng query
            const query = {};

            // Tìm kiếm gần đúng sử dụng regex thay vì $text
            if ( q ) {
                // Tạo regex có tính năng tìm kiếm gần đúng (case insensitive)
                const regex = new RegExp(q, 'i');

                // Tìm trong nhiều trường - giả sử tìm trong name, email, username
                query.$or = [
                    { email: regex },
                    { username: regex },
                    { phone: regex },
                    { bio: regex }
                    // Thêm các trường khác cần tìm kiếm
                ];
            }

            // Thiết lập sắp xếp
            let sort = {};
            if ( sortBy === 'date' ) {
                sort = { createdAt: -1 };
            } else if ( sortBy === 'popular' ) {
                sort = { views: -1 };
            }
            // Lưu ý: không còn dùng textScore nữa vì không sử dụng $text

            // Thực hiện truy vấn với phân trang
            const users = await user.find(query)
                .sort(sort)
                .skip(skip)
                .limit(parseInt(limit));

            // Đếm tổng số kết quả
            const total = await user.countDocuments(query);

            res.json({
                users,
                total,
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit)
            });
        } catch ( err ) {
            console.error(err);
            res.status(500).send('Server Error');
        }
    }

    async HideStories( req, res, next ) {
        try {
            const { postId } = req.body;

            console.log('session', req.session.user);

            const User = await user.findById(req.session.user._id);

            const isHidden = User.hiddenStories.some(
                id => id.toString() === postId
            );

            if ( isHidden ) {
                return res.status(400).json({ message: 'Bài viết này đã bị ẩn trước đó' });
            }

            User.hiddenStories.push(postId);
            await User.save();

            res.json({ message: 'Đã ẩn bài viết khỏi danh sách đề xuất' });
        } catch ( error ) {
            console.log(error);
            res.status(500).json({ message: 'Lỗi server' });
        }
    }

    async HideAuthor( req, res, next ) {
        try {
            const { authorId } = req.body;

            const User = await user.findById(req.session.user._id);

            const isHidden = User.hiddenAuthors.some(
                id => id.toString() === authorId
            );

            if ( isHidden ) {
                return res.status(400).json({ message: 'Tác giả này đã bị ẩn trước đó' });
            }

            User.hiddenAuthors.push(authorId);
            await User.save();

            res.json({ message: 'Đã ẩn bài viết của tác giả này khỏi danh sách đề xuất' });
        } catch ( error ) {
            console.error(err);
            res.status(500).json({ message: 'Lỗi server' });
        }
    }

    async CreateList( req, res ) {
        try {
            const { name, description } = req.body;
            const userId = req.session.user._id;

            if ( !name ) {
                return res.status(400).json({ message: 'List name cannot be empty' });
            }

            const User = await user.findById(userId);

            // Check if a list with this name already exists
            const existingList = User.savedLists.find(list => list.name === name);
            if ( existingList ) {
                return res.status(400).json({ message: 'A list with this name already exists' });
            }

            // Create new list
            const newList = {
                name,
                description: description || '',
                posts: [],
                isDefault: false,
                createdAt: Date.now()
            };

            User.savedLists.push(newList);
            await User.save();

            res.status(201).json(newList);
        } catch ( err ) {
            console.error(err);
            res.status(500).json({ message: 'Server error' });
        }
    }

// Get all saved lists for a user
    async GetAllLists( req, res ) {
        try {
            const userId = req.session.user._id;
            const User = await user.findById(userId)
                .populate('savedLists.posts', 'tittle subtittle thumbnail');

            // Create default list if user has no lists
            if ( User.savedLists.length === 0 ) {
                User.savedLists.push({
                    name: 'Default List',
                    description: 'Default saved list',
                    posts: [],
                    isDefault: true,
                    createdAt: Date.now()
                });
                await User.save();
            }

            res.status(200).json(User.savedLists);
        } catch ( err ) {
            console.error(err);
            res.status(500).json({ message: 'Server error' });
        }
    }

// Update list information
    async UpdateList( req, res ) {
        try {
            const { name, description } = req.body;
            const userId = req.session.user._id;
            const listId = req.params.listId;

            const User = await user.findById(userId);

            // Find the list to update
            const listIndex = User.savedLists.findIndex(list => list._id.toString() === listId);

            if ( listIndex === -1 ) {
                return res.status(404).json({ message: 'List not found' });
            }

            // Check if another list is using this name
            const nameExists = User.savedLists.some(( list, index ) =>
                index !== listIndex && list.name === name
            );

            if ( nameExists ) {
                return res.status(400).json({ message: 'A list with this name already exists' });
            }

            // Update information
            if ( name ) User.savedLists[listIndex].name = name;
            if ( description !== undefined ) User.savedLists[listIndex].description = description;

            await User.save();

            res.status(200).json(User.savedLists[listIndex]);
        } catch ( err ) {
            console.error(err);
            res.status(500).json({ message: 'Server error' });
        }
    }

// Delete a list
    async DeleteList( req, res ) {
        try {
            const userId = req.session.user._id;
            const listId = req.params.listId;

            const User = await user.findById(userId);

            // Find the list to delete
            const list = User.savedLists.id(listId);

            if ( !list ) {
                return res.status(404).json({ message: 'List not found' });
            }

            // Don't allow deletion of default list
            if ( list.isDefault ) {
                return res.status(400).json({ message: 'Cannot delete the default list' });
            }

            // Delete the list
            await user.updateOne(
                { _id: userId },
                { $pull: { savedLists: { _id: listId } } }
            );

            res.status(200).json({ message: 'List deleted successfully' });
        } catch ( err ) {
            console.error(err);
            res.status(500).json({ message: 'Server error' });
        }
    }

// Add a post to a list
    async AddPostToList( req, res ) {
        try {
            const userId = req.session.user._id;
            const { listId, postId } = req.params;

            // Check if post exists
            const Post = await post.findById(postId);
            if ( !Post ) {
                return res.status(404).json({ message: 'Post does not exist' });
            }

            const User = await user.findById(userId);

            // Find the list
            const listIndex = User.savedLists.findIndex(list => list._id.toString() === listId);

            if ( listIndex === -1 ) {
                return res.status(404).json({ message: 'List not found' });
            }

            // Check if post is already in the list
            const postExists = User.savedLists[listIndex].posts.includes(postId);

            if ( postExists ) {
                return res.status(400).json({ message: 'Post is already in this list' });
            }

            // Add post to the list
            User.savedLists[listIndex].posts.push(postId);
            await User.save();

            res.status(200).json({ message: 'Post added to list successfully' });
        } catch ( err ) {
            console.error(err);
            res.status(500).json({ message: 'Server error' });
        }
    }

// Remove a post from a list
    async RemovePostFromList( req, res ) {
        try {
            const userId = req.session.user._id;
            const { listId, postId } = req.params;

            const User = await user.findById(userId);

            // Find the list
            const listIndex = User.savedLists.findIndex(list => list._id.toString() === listId);

            if ( listIndex === -1 ) {
                return res.status(404).json({ message: 'List not found' });
            }

            // Find the post's position in the list
            const postIndex = User.savedLists[listIndex].posts.findIndex(id => id.toString() === postId);

            if ( postIndex === -1 ) {
                return res.status(404).json({ message: 'Post is not in this list' });
            }

            // Remove post from the list
            User.savedLists[listIndex].posts.splice(postIndex, 1);
            await User.save();

            res.status(200).json({ message: 'Post removed from list successfully' });
        } catch ( err ) {
            console.error(err);
            res.status(500).json({ message: 'Server error' });
        }
    }

// Get all posts in a list
    async GetPostsInList( req, res ) {
        try {
            const userId = req.session.user._id;
            const listId = req.params.listId;

            const User = await user.findById(userId);

            // Find the list
            const list = User.savedLists.id(listId);

            if ( !list ) {
                return res.status(404).json({ message: 'List not found' });
            }

            // Get detailed information of posts in the list
            const Posts = await post.find({ _id: { $in: list.posts } })
                .populate('author.authorId', 'username ava')
                .populate('topic.topicId', 'topicName')
                .select('tittle subtittle content thumbnail author topic tags likes comments views createdAt');

            res.status(200).json(Posts);
        } catch ( err ) {
            console.error(err);
            res.status(500).json({ message: 'Server error' });
        }
    }

// Check if a post is saved in any lists
    async CheckPostInLists( req, res ) {
        try {
            const userId = req.session.user._id;
            const postId = req.params.postId;

            const User = await user.findById(userId);

            // Find lists containing this post
            const containingLists = User.savedLists
                .filter(list => list.posts.some(id => id.toString() === postId))
                .map(list => ( {
                    _id: list._id,
                    name: list.name,
                    isDefault: list.isDefault
                } ));

            res.status(200).json({
                isSaved: containingLists.length > 0,
                lists: containingLists
            });
        } catch ( err ) {
            console.error(err);
            res.status(500).json({ message: 'Server error' });
        }
    }
}

export default new UserController();