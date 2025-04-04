import CommentController from './CommentController.js';

class SocketController {
    constructor( io ) {
        this.io = io;
    }

    initializeEvents( socket ) {
        // Join room theo postId khi client kết nối
        socket.on('joinPostRoom', ( postId ) => {
            socket.join(`post_${ postId }`);
            console.log(`Socket ${ socket.id } joined room post_${ postId }`);
        });

        socket.on('newComment', ( data ) => this.handleNewComment(socket, data));
        socket.on('getComments', ( data ) => this.handleGetComments(socket, data));
    }

    async handleNewComment( socket, commentData ) {
        try {
            if ( !this.validateCommentData(commentData) ) {
                return socket.emit('error', {
                    message: 'Dữ liệu comment không hợp lệ'
                });
            }

            const newComment = await CommentController.Create(commentData);

            // Broadcast tới room cụ thể của post
            this.io.to(`post_${ commentData.postId }`).emit('commentAdded', newComment);

            console.log(`New comment created: ${ newComment } for post ${ commentData.postId }`);
        } catch ( error ) {
            console.error('Comment creation error:', error);
            socket.emit('error', {
                message: 'Không thể tạo comment',
                details: error.message
            });
        }
    }

    async handleGetComments( socket, filterOptions = {} ) {
        try {
            // Lấy comments với các tùy chọn lọc
            const comments = await CommentController.GetComments(filterOptions);

            socket.emit('commentList', comments);

            console.log(`Fetched ${ comments.length } comments`);
        } catch ( error ) {
            console.error('Fetch comments error:', error);
            socket.emit('error', {
                message: 'Không thể lấy danh sách comment',
                details: error.message
            });
        }
    }

    // Phương thức validate dữ liệu comment
    validateCommentData( data ) {
        return data &&
            data.content &&
            data.content.trim().length > 0 &&
            data.postId;
    }
}

export default SocketController;