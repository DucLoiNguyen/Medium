// src/pages/SavedListDetail.jsx
import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeftIcon } from '@heroicons/react/outline';
import SaveListButton from '~/components/partial/Bookmark/savelistbutton.component';
import Likes from '~/components/partial/Likes/likes.component';
import { toast } from 'sonner';

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
                // Get all lists to find the current one
                const listsRes = await axios.get('http://localhost:3030/api/user/lists', {
                    withCredentials: true
                });

                const currentList = listsRes.data.find(list => list._id === listId);
                if ( !currentList ) {
                    setError('List not found');
                    setLoading(false);
                    return;
                }

                setListInfo(currentList);

                // Get posts from the list
                const postsRes = await axios.get(`http://localhost:3030/api/user/lists/${ listId }/posts`, {
                    withCredentials: true
                });

                setPosts(postsRes.data);
                setLoading(false);
            } catch ( err ) {
                setError('Unable to load list data');
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

            // Update state
            setPosts(posts.filter(post => post._id !== postId));
        } catch ( error ) {
            console.error('Error removing post from list:', error);
            alert('Unable to remove post from list');
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
                    Back to your lists
                </button>

                <h1 className="text-3xl font-bold">{ listInfo?.name }</h1>
                { listInfo?.description && (
                    <p className="text-gray-600 mt-2">{ listInfo.description }</p>
                ) }
            </div>

            { posts.length === 0 ? (
                <div className="bg-gray-50 p-8 rounded-lg text-center">
                    <p className="text-gray-600 mb-4">This list doesn't have any posts yet.</p>
                    <Link to="/home" className="text-green-600 hover:text-green-700 font-medium">
                        Explore articles
                    </Link>
                </div>
            ) : (
                <div className="grid gap-6">
                    { posts.map(post => (
                        <div key={ post._id }
                             className="border-b hover:shadow-lg hover:transition-shadow p-4 rounded-lg duration-300 transition-all ease-in-out">
                            <div className="flex flex-col md:flex-row gap-4">
                                <Link to={ `/home/post/${ post._id }` }
                                      className="hidden w-[112px] h-[112px] md:block shrink-0">
                                    <img
                                        src={ post.thumbnail === '' ? '/content1.jpg' : `http://localhost:3030${ post.thumbnail }` }
                                        alt={ post.tittle }
                                        className="w-[112px] h-[112px] object-cover"
                                    />
                                </Link>
                                <div className="flex-1">
                                    <div className="flex items-center text-sm mb-2 font-customs">
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
                                        <h2 className="text-xl font-bold mb-2 font-customs">{ post.tittle }</h2>
                                    </Link>

                                    { post.subtittle && (
                                        <p className="text-gray-600 mb-3">{ post.subtittle }</p>
                                    ) }

                                    <div className="flex items-center justify-between text-sm text-gray-500">
                                        <div className="flex items-center space-x-4">
                                            <span>{ new Date(post.createdAt).toLocaleDateString('en-US') }</span>
                                            <div className="flex mx-4">
                                                <Likes
                                                    postId={ post._id }
                                                    initialLikes={ post.likes }
                                                >
                                                    { (postId, likes, handleLikes) => (
                                                        <div className="mx-1">
                                                            <button className="flex">
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    className="size-5"
                                                                    fill="none"
                                                                    viewBox="0 0 24 24"
                                                                    stroke="currentColor"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={ 1.5 }
                                                                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                                                    />
                                                                </svg>
                                                                <span className="mx-0.5">{ likes }</span>
                                                            </button>
                                                        </div>
                                                    ) }
                                                </Likes>
                                                <div className="mx-1">
                                                    <button className="flex">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            strokeWidth={ 1.5 }
                                                            stroke="currentColor"
                                                            className="size-5"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={ 1.5 }
                                                                d="M4.804 21.644A6.707 6.707 0 0 0 6 21.75a6.721 6.721 0 0 0 3.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 0 1-.814 1.686.75.75 0 0 0 .44 1.223ZM8.25 10.875a1.125 1.125 0 1 0 0 2.25a1.125 1.125 0 0 0 0-2.25ZM10.875 12a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Zm4.875-1.125a1.125 1.125 0 1 0 0 2.25a1.125 1.125 0 0 0 0-2.25Z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                        <span className="mx-0.5">{ post.comments || 0 }</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-3">
                                            <SaveListButton postId={ post._id } />

                                            <button
                                                onClick={ () => {
                                                    toast('Remove this story from list?', {
                                                        action: {
                                                            label: 'confirm and remove',
                                                            onClick: () => {
                                                                handleRemoveFromList(post._id);
                                                            }
                                                        }
                                                    });
                                                } }
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                                     viewBox="0 0 24 24" strokeWidth={ 1.5 } stroke="currentColor"
                                                     className="size-5 hover:stroke-red-700">
                                                    <path strokeLinecap="round" strokeLinejoin="round"
                                                          d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                                </svg>
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