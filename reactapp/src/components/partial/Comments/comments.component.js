import { Fragment, useEffect, useState } from 'react';
import axios from 'axios';
import Avatar from '~/components/partial/Avatar/avatar.component';
import moment from 'moment';
import { useAuth } from '~/pages/Authen/authcontext';
import { XIcon } from '@heroicons/react/outline';

const CommentItem = ({ comment, postId, fetchComments, depth = 0 }) => {
    // Render chi tiết của một comment
    const [isReply, setIsReply] = useState(false);
    // Thêm biến depth để kiểm soát độ sâu của các replies
    const MAX_DEPTH = 3; // Giới hạn độ sâu tối đa cho các replies

    const handleShowReply = () => {
        setIsReply(!isReply);
    };

    return (
        <>
            <div className="comment-item bg-white p-4 rounded-lg shadow-sm mb-4 space-y-4 font-customs">
                <div className="flex justify-between">
                    <div className="flex items-center space-x-4">
                        {/* Avatar người comment */ }
                        <Avatar username={ comment.author.username } width={ 30 } height={ 30 } />

                        {/* Thông tin người comment */ }
                        <div className="flex items-center space-x-4">
                            <h4 className="font-semibold">{ comment.author.username }</h4>
                            <p className="text-gray-500 text-sm">
                                { moment(comment.createdAt).fromNow() }
                            </p>
                        </div>
                    </div>

                    <div>
                        <button>
                            <XIcon className="w-4 h-4 text-gray-500" />
                        </button>
                    </div>
                </div>

                {/* Nội dung comment */ }
                <p className="font-customs text-sm">{ comment.content }</p>

                {/* Các action như reply, like */ }
                <div className="mt-2 font-customs text-[#6b6b6b] hover:text-black text-sm transition-all">
                    {/* Chỉ hiển thị nút Reply nếu chưa đạt đến độ sâu tối đa */ }
                    { depth < MAX_DEPTH && (
                        <button className="mr-3" onClick={ handleShowReply }>
                            <span className="">Reply ({ comment.replies?.length || 0 })</span>
                        </button>
                    ) }
                </div>

                {
                    !isReply ? null : (
                        <>
                            {/* Chỉ hiển thị form reply nếu chưa đạt đến độ sâu tối đa */ }
                            { depth < MAX_DEPTH && (
                                <CommentForm
                                    postId={ postId }
                                    parentCommentId={ comment.id }
                                    fetchComments={ fetchComments }
                                />
                            ) }

                            {/* Render replies nếu có và chưa đạt đến độ sâu tối đa */ }
                            { comment.replies && comment.replies.length > 0 && depth < MAX_DEPTH && (
                                <div className="replies ml-10 mt-4 font-customs">
                                    { comment.replies.map(reply => (
                                        <CommentItem
                                            key={ reply._id }
                                            comment={ reply }
                                            postId={ postId }
                                            fetchComments={ fetchComments }
                                            depth={ depth + 1 } // Tăng độ sâu khi render các replies
                                        />
                                    )) }
                                </div>
                            ) }

                            {/* Thông báo khi đạt giới hạn độ sâu */ }
                            { depth === MAX_DEPTH - 1 && comment.replies && comment.replies.length > 0 && (
                                <div className="ml-10 mt-2 text-gray-500 text-sm">
                                    No more nesting from here, but you can still reply and stay connected!
                                </div>
                            ) }
                        </>
                    )
                }
            </div>
        </>
    );
};

const CommentForm = ({ postId, parentCommentId = null, fetchComments }) => {
    const [newComment, setNewComment] = useState('');

    const handleSubmitComment = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3030/api/comment/comments', {
                content: newComment,
                postId,
                parentCommentId
            }, { withCredentials: true });

            if ( response.status === 201 || response.status === 200 ) {  // Chỉ fetch nếu thành công
                setNewComment('');
                fetchComments();  // Fetch lại dữ liệu
            }
        } catch ( error ) {
            console.error('Lỗi khi gửi comment:', error);
        }
    };

    return (
        <>
            <form className="mb-6" onSubmit={ handleSubmitComment }>
                <div
                    className="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                    <label htmlFor="comment" className="sr-only">Your comment</label>
                    <textarea id="comment" rows="6"
                              className="px-0 w-full text-sm font-customs text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800"
                              placeholder="Write a comment..." required onChange={ (e) => {
                        setNewComment(e.target.value);
                    } } value={ newComment }></textarea>
                </div>
                <button type="submit"
                        className={ `inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white ring-2 ring-[#6b6b6b] hover:ring-offset-2 hover:ring-black rounded-full transition-all ease-in-out bg-black ${ !newComment ? 'opacity-20' : '' }` }
                        disabled={ !newComment }>
                    Post comment
                </button>
            </form>
        </>
    );
};

const CommentSection = ({ postId }) => {
    const [comments, setComments] = useState([]);
    const { isMember } = useAuth();

    const fetchComments = async () => {
        const response = await axios.get(`http://localhost:3030/api/post/comments/${ postId }`, { withCredentials: true });
        setComments(response.data);
    };

    useEffect(() => {
        fetchComments();
    }, []);

    return (
        <div className="comment-section">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">Responses
                    ({ comments.length })</h2>
            </div>
            { isMember ?
                <>
                    <CommentForm postId={ postId } fetchComments={ fetchComments } />

                    { comments.map(comment => (
                        <CommentItem
                            key={ comment._id }
                            comment={ comment }
                            postId={ postId }
                            fetchComments={ fetchComments }
                            depth={ 0 } // Bắt đầu với độ sâu 0 cho comment chính
                        />
                    )) }
                </> :
                <>
                    <span className="text-sm font-customs">
                        <a href="/home/your-plan" className="text-[#419d3f] hover:text-black">Upgrade to be a member</a> to response this post</span>
                </>
            }
        </div>
    );
};

export default CommentSection;