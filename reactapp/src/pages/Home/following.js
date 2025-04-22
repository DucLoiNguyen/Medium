import { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import Avatar from '~/components/partial/Avatar/avatar.component';
import moment from 'moment/moment';
import Likes from '~/components/partial/Likes/likes.component';
import { toast } from 'sonner';
import SaveListButton from '~/components/partial/Bookmark/savelistbutton.component';

function Following() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [nextCursor, setNextCursor] = useState(null);
    const observer = useRef();

    const fetchData = useCallback(async (cursor = null) => {
        try {
            setLoading(true);
            const url = 'http://localhost:3030/api/post/getbyfollow';
            const params = { limit: 10 };

            if ( cursor ) {
                params.cursor = cursor;
            }

            const response = await axios.get(url, {
                params,
                withCredentials: true
            });

            if ( response.data.data.length === 0 ) {
                setHasMore(false);
            } else {
                setPosts(prev => cursor ? [...prev, ...response.data.data] : response.data.data);
                setHasMore(response.data.pagination.hasMore);
                setNextCursor(response.data.pagination.nextCursor);
            }
        } catch ( err ) {
            console.error('Error fetching posts:', err);
            toast.error('Failed to load posts');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleShowless = async (id) => {
        try {
            await axios.patch('http://localhost:3030/api/user/hidestories',
                { postId: id },
                { withCredentials: true }
            );
            setPosts(prev => prev.filter(item => item._id !== id));
        } catch ( error ) {
            console.error('Error hiding post:', error);
            toast.error('Failed to hide the post');
        }
    };

    // Set up the intersection observer for infinite scroll
    const lastPostElementRef = useCallback(node => {
        // Skip if loading or no more posts
        if ( loading || !hasMore ) return;

        // Disconnect previous observer if exists
        if ( observer.current ) observer.current.disconnect();

        // Create new observer
        observer.current = new IntersectionObserver(entries => {
            if ( entries[0].isIntersecting && hasMore ) {
                fetchData(nextCursor);
            }
        }, { threshold: 0.5 });

        // Observe the node
        if ( node ) observer.current.observe(node);
    }, [loading, hasMore, nextCursor, fetchData]);

    return (
        <>
            <div className="space-y-6">
                { posts.length > 0 ? (
                    posts.map((item, index) => (
                        <div
                            key={ item._id }
                            ref={ index === posts.length - 1 ? lastPostElementRef : null }
                            className="hover:shadow-lg hover:transition-shadow p-4 rounded-lg duration-300 transition-all ease-in-out"
                        >
                            <div className="relative">
                                <a href={ `/home/post/${ item._id }` }>
                                    <div>
                                        <div>
                                            <div className="flex place-items-center">
                                                <Avatar username={ item.author?.authorName } width={ 24 }
                                                        height={ 24 } />
                                                <div className="ml-2">
                                                    <h4 className="text-sm">{ item.author?.authorName }</h4>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex mt-3 justify-between">
                                        <div className="grow">
                                            <div>
                                                <div>
                                                    <h2 className="font-bold text-2xl">
                                                        { item.tittle }
                                                    </h2>
                                                </div>
                                            </div>
                                            <div className="">
                                                <div>
                                                    <p className="h-[48px] line-clamp-2 max-w-full text-[#6b6b6b]">
                                                        { item.subtittle }
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex justify-between mt-3 align-middle">
                                                <div className="flex text-sm text-[#6b6b6b] font-customs">
                                                    <div className="flex">
                                                        <span>{ moment(item.createdAt).fromNow() }</span>
                                                    </div>
                                                    <div className="flex mx-4">
                                                        <Likes postId={ item._id } initialLikes={ item.likes }>
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
                                                                <span className="mx-0.5">{ }</span>
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
                                                src={ item.thumbnail === '' ? 'content1.jpg' : `http://localhost:3030${ item.thumbnail }` }
                                                width="112"
                                                height="112"
                                                loading="lazy"
                                            />
                                        </div>
                                    </div>
                                </a>
                                <div className="absolute bottom-0 right-[150px] text-[#6b6b6b]">
                                    <div className="flex space-x-4">
                                        <SaveListButton postId={ item._id } />
                                        <button onClick={ () => {
                                            toast('Hide this story?', {
                                                action: {
                                                    label: 'confirm and hide',
                                                    onClick: () => {
                                                        handleShowless(item._id);
                                                    }
                                                }
                                            });
                                        } }>
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
                    ))
                ) : (
                    <div className="text-center py-6">No posts found</div>
                ) }

                { loading && (
                    <div className="text-center py-4">
                        <div
                            className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
                        <p className="mt-2 text-gray-600">Loading more posts...</p>
                    </div>
                ) }

                { !hasMore && posts.length > 0 && (
                    <div className="text-center py-4 text-gray-500 text-sm">
                        No more posts to load
                    </div>
                ) }
            </div>
        </>
    );
}

export default Following;