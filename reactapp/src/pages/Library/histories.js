import { useEffect, useState } from 'react';
import axios from 'axios';
import Loading_spinner from '~/components/partial/Loading_spinner/loading_spinner.component';
import Avatar from '~/components/partial/Avatar/avatar.component';
import Likes from '~/components/partial/Likes/likes.component';
import { toast } from 'sonner';

function History() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 2,
        total: 0,
        pages: 1
    });

    const fetchHistory = async (page = 1) => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:3030/api/history?page=${ page }&limit=${ pagination.limit }`, {
                withCredentials: true
            });

            if ( !response ) throw new Error('Failed to fetch reading history');

            setHistory(prevHistory => [...prevHistory, ...response.data.data]);
            setPagination(response.data.pagination);
        } catch ( error ) {
            console.error('Error fetching reading history:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const handlePageChange = (newPage) => {
        fetchHistory(newPage);
    };

    const handleRemoveItem = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:3030/api/history/${ id }`, {
                withCredentials: true
            });

            if ( !response ) throw new Error('Failed to remove item');

            // Cập nhật state để xóa mục đã xóa
            setHistory(history.filter(item => item._id !== id));
        } catch ( error ) {
            console.error('Error removing item from history:', error);
        }
    };

    const handleClearHistory = async () => {
        try {
            const response = await axios.delete('http://localhost:3030/api/history', {
                withCredentials: true
            });

            if ( !response ) throw new Error('Failed to clear history');

            setHistory([]);
            setPagination({ ...pagination, total: 0, pages: 1 });
        } catch ( error ) {
            console.error('Error clearing reading history:', error);
        }
    };

    const formatReadingDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if ( loading ) {
        return (
            <Loading_spinner />
        );
    }
    return (
        <>
            { history.length === 0 ? (<>
                <div className="w-full text-center space-y-6 font-customs">
                    <h2 className="text-base font-semibold">You haven’t read any stories yet</h2>
                    <p className="text-sm">Stories you’ve read on Medium will appear here.</p>
                </div>
            </>) : (
                <>
                    <div className="flex justify-between mb-10">
                        <p className="text-sm">
                            You can clear your reading history for a fresh start.
                        </p>
                        <div className="text-right">
                            <button
                                className="py-[5px] px-5 bg-[#c94a4a] rounded-full hover:bg-[#b63636]"
                                onClick={ () => {
                                    toast('Clear all reading history?', {
                                        action: {
                                            label: 'confirm and clear',
                                            onClick: () => {
                                                handleClearHistory();
                                            }
                                        }
                                    });
                                } }>
                                <span className="text-sm text-white">Clear all history</span>
                            </button>
                        </div>
                    </div>
                    <div className="space-y-6">
                        { history && history.map((item, index) => (
                            <div key={ item._id }
                                 className="hover:shadow-lg hover:transition-shadow p-4 rounded-lg duration-300 transition-all ease-in-out relative">
                                <div className="relative">
                                    <a href={ `/home/post/${ item.post._id }` }>
                                        <div>
                                            <div>
                                                <div className="flex place-items-center">
                                                    <Avatar username={ item.post.author?.authorName } width={ 24 }
                                                            height={ 24 } />
                                                    <div className="ml-2">
                                                        <h4 className="text-sm">{ item.post.author?.authorName }</h4>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex mt-3 justify-between">
                                            <div className="grow">
                                                <div>
                                                    <div>
                                                        <h2 className="font-bold text-2xl">
                                                            { item.post.tittle }
                                                        </h2>
                                                    </div>
                                                </div>
                                                <div className="">
                                                    <div>
                                                        <p className="h-[48px] line-clamp-2 max-w-full text-[#6b6b6b]">
                                                            { item.post.subtittle }
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex justify-between mt-3 align-middle">
                                                    <div className="flex text-sm text-[#6b6b6b] font-customs">
                                                        <div className="flex">
                                                            <span>{ formatReadingDate(item.readAt) }</span>
                                                        </div>
                                                        <div className="flex mx-4">
                                                            <Likes postId={ item.post._id }
                                                                   initialLikes={ item.post.likes }>
                                                                { (postId, likes, handleLikes) => (
                                                                    <div className="mx-1">
                                                                        <button className="flex">
                                                                            <svg xmlns="http://www.w3.org/2000/svg"
                                                                                 className="size-5" fill="none"
                                                                                 viewBox="0 0 24 24"
                                                                                 stroke="currentColor">
                                                                                <path strokeLinecap="round"
                                                                                      strokeLinejoin="round"
                                                                                      strokeWidth={ 1.5 }
                                                                                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                                            </svg>
                                                                            <span className="mx-0.5">{ likes }</span>
                                                                        </button>
                                                                    </div>
                                                                ) }
                                                            </Likes>
                                                            <div className="mx-1">
                                                                <button className="flex">
                                                                    <svg xmlns="http://www.w3.org/2000/svg"
                                                                         viewBox="0 0 24 24" fill="none"
                                                                         strokeWidth={ 1.5 }
                                                                         stroke="currentColor"
                                                                         className="size-5">
                                                                        <path fillRule="evenodd"
                                                                              strokeLinecap="round"
                                                                              strokeLinejoin="round"
                                                                              strokeWidth={ 1.5 }
                                                                              d="M4.804 21.644A6.707 6.707 0 0 0 6 21.75a6.721 6.721 0 0 0 3.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 0 1-.814 1.686.75.75 0 0 0 .44 1.223ZM8.25 10.875a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25ZM10.875 12a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Zm4.875-1.125a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25Z"
                                                                              clipRule="evenodd" />
                                                                    </svg>
                                                                    <span
                                                                        className="mx-0.5">{ item.post.comments.length }</span>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="hidden ml-14 md:block min-w-[112px] right-0">
                                                <img
                                                    className="object-cover w-[112px] h-[112px] object-center"
                                                    alt="Thumbnail"
                                                    src={ item.post.thumbnail === '' ? 'content1.jpg' : `http://localhost:3030${ item.post.thumbnail }` }
                                                    width="112"
                                                    height="112"
                                                    loading="lazy"
                                                />
                                            </div>
                                        </div>
                                    </a>
                                    <div className="absolute bottom-0 right-[150px] space-x-4 text-[#6b6b6b]">
                                        <button>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                 strokeWidth={ 1.5 } stroke="currentColor"
                                                 className="size-5 hover:stroke-black">
                                                <path strokeLinecap="round" strokeLinejoin="round"
                                                      d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                                            </svg>
                                            {/*<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"*/ }
                                            {/*     className="size-5 hover:fill-black">*/ }
                                            {/*    <path fillRule="evenodd"*/ }
                                            {/*          d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z"*/ }
                                            {/*          clipRule="evenodd" />*/ }
                                            {/*</svg>*/ }
                                        </button>
                                        <button onClick={ () => handleRemoveItem(item._id) }>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                                 viewBox="0 0 24 24" strokeWidth={ 1.5 } stroke="currentColor"
                                                 className="size-5 hover:stroke-red-700">
                                                <path strokeLinecap="round" strokeLinejoin="round"
                                                      d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                <div className="my-2 font-customs">
                                    { item.isCompleted ? (
                                        <span
                                            className="text-sm bg-green-100 text-green-800 py-1 px-2 rounded">Completed</span>
                                    ) : (
                                        <div className="flex items-center">
                                            <div className="bg-gray-200 rounded-full h-2 w-full mr-2">
                                                <div
                                                    className="bg-gray-900 h-2 rounded-full"
                                                    style={ { width: `${ item.readPercentage }%` } }
                                                ></div>
                                            </div>
                                            <span className="text-sm text-gray-600">{ item.readPercentage }%</span>
                                        </div>
                                    ) }
                                </div>
                            </div>
                        )) }
                    </div>

                    {/* Phân trang */ }
                    { pagination.pages > 1 && (
                        <div className="flex justify-center mt-8">
                            <nav className="flex items-center space-x-2">
                                <button
                                    onClick={ () => handlePageChange(pagination.page - 1) }
                                    disabled={ pagination.page === 1 }
                                    className={ `px-3 rounded hidden ${
                                        pagination.page === 1
                                            ? 'text-gray-400 cursor-not-allowed'
                                            : 'text-gray-700 hover:bg-gray-100'
                                    }` }
                                >
                                    Trước
                                </button>

                                { [...Array(pagination.pages)].map((_, index) => (
                                    <button
                                        key={ index }
                                        onClick={ () => handlePageChange(index + 1) }
                                        className={ `px-3 rounded hidden ${
                                            pagination.page === index + 1
                                                ? 'bg-blue-600 text-white'
                                                : 'text-gray-700 hover:bg-gray-100'
                                        }` }
                                    >
                                        { index + 1 }
                                    </button>
                                )) }

                                <button
                                    onClick={ () => handlePageChange(pagination.page + 1) }
                                    disabled={ pagination.page === pagination.pages }
                                    className={ `px-3 ring-1 ring-[#419d3f] rounded-full ${
                                        pagination.page === pagination.pages
                                            ? `hidden`
                                            : 'text-[#419d3f] hover:ring-offset-2'
                                    }` }
                                >
                                    more
                                </button>
                            </nav>
                        </div>
                    ) }
                </>
            ) }
        </>
    )
        ;
}

export default History;
