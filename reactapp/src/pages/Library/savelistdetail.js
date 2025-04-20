// src/pages/SavedListDetail.jsx
import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeftIcon } from '@heroicons/react/outline';
import SaveListButton from '~/components/partial/Bookmark/savelistbutton.component';

const SavedListDetail = () => {
    const { listId } = useParams();
    const navigate = useNavigate();
    const [listInfo, setListInfo] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchListAndPosts = async () => {
            try {

                // Lấy thông tin tất cả danh sách để tìm danh sách hiện tại
                const listsRes = await axios.get('http://localhost:3030/api/user/lists', {
                    withCredentials: true
                });

                const currentList = listsRes.data.find(list => list._id === listId);
                if ( !currentList ) {
                    setError('Không tìm thấy danh sách');
                    setLoading(false);
                    return;
                }

                setListInfo(currentList);

                // Lấy các bài viết trong danh sách
                const postsRes = await axios.get(`http://localhost:3030/api/user/lists/${ listId }/posts`, {
                    withCredentials: true
                });

                setPosts(postsRes.data);
                setLoading(false);
            } catch ( err ) {
                setError('Không thể tải dữ liệu danh sách');
                setLoading(false);
                console.error(err);
            }
        };

        fetchListAndPosts();
    }, [listId]);

    const handleRemoveFromList = async (postId) => {
        try {
            await axios.delete(`http://localhost:3030/api/user/lists/${ listId }/posts/${ postId }`, {
                withCredentials: true
            });

            // Cập nhật state
            setPosts(posts.filter(post => post._id !== postId));
        } catch ( error ) {
            console.error('Error removing post from list:', error);
            alert('Không thể xóa bài viết khỏi danh sách');
        }
    };

    if ( loading ) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if ( error ) {
        return (
            <div className="text-center py-10">
                <p className="text-red-500">{ error }</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-10">
            <div className="mb-8">
                <button
                    onClick={ () => navigate('/home/library') }
                    className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
                >
                    <ArrowLeftIcon className="w-4 h-4 mr-1" />
                    Trở về danh sách đã lưu
                </button>

                <h1 className="text-3xl font-bold">{ listInfo?.name }</h1>
                { listInfo?.description && (
                    <p className="text-gray-600 mt-2">{ listInfo.description }</p>
                ) }
            </div>

            { posts.length === 0 ? (
                <div className="bg-gray-50 p-8 rounded-lg text-center">
                    <p className="text-gray-600 mb-4">Danh sách này chưa có bài viết nào.</p>
                    <Link to="/home" className="text-green-600 hover:text-green-700 font-medium">
                        Khám phá bài viết
                    </Link>
                </div>
            ) : (
                <div className="grid gap-6">
                    { posts.map(post => (
                        <div key={ post._id } className="border-b pb-6">
                            <div className="flex flex-col md:flex-row gap-4">
                                { post.thumbnail && (
                                    <Link to={ `/home/post/${ post._id }` } className="block w-full md:w-1/4 shrink-0">
                                        <img
                                            src={ post.thumbnail }
                                            alt={ post.tittle }
                                            className="w-full h-40 object-cover rounded"
                                        />
                                    </Link>
                                ) }

                                <div className="flex-1">
                                    <div className="flex items-center text-sm mb-2">
                                        { post.author?.authorName && (
                                            <span className="font-medium">{ post.author.authorName }</span>
                                        ) }

                                        { post.topic?.topicName && (
                                            <>
                                                <span className="mx-2">•</span>
                                                <Link to={ `/home/tag/${ post.topic.topicName }` }
                                                      className="text-gray-600 hover:text-gray-900">
                                                    { post.topic.topicName }
                                                </Link>
                                            </>
                                        ) }
                                    </div>

                                    <Link to={ `/post/${ post._id }` }>
                                        <h2 className="text-xl font-bold mb-2 hover:text-green-600">{ post.tittle }</h2>
                                    </Link>

                                    { post.subtittle && (
                                        <p className="text-gray-600 mb-3">{ post.subtittle }</p>
                                    ) }

                                    <div className="flex items-center justify-between text-sm text-gray-500">
                                        <div className="flex items-center space-x-4">
                                            <span>{ new Date(post.createdAt).toLocaleDateString('vi-VN') }</span>
                                            <span>{ Math.ceil(post.views / 60) } min</span>
                                        </div>

                                        <div className="flex items-center space-x-3">
                                            <SaveListButton postId={ post._id } />

                                            <button
                                                onClick={ () => handleRemoveFromList(post._id) }
                                                className="text-gray-500 hover:text-red-600 text-sm"
                                            >
                                                Xóa khỏi danh sách
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )) }
                </div>
            ) }
        </div>
    );
};

export default SavedListDetail;