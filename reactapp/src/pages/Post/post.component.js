import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import CommentSection from '~/components/partial/Comments/comments.component';
import { useAuth } from '~/pages/Authen/authcontext';
import Avatar from '~/components/partial/Avatar/avatar.component';
import { trackReading } from '~/util';
import Likes from '~/components/partial/Likes/likes.component';
import { toast } from 'sonner';

function Post() {
    const [article, setArticle] = useState(null);
    const [follow, setFollow] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const params = useParams();
    const { isMember, user } = useAuth();
    const [liked, setLiked] = useState(false);
    const [hearts, setHearts] = useState([]);
    const buttonRef = useRef(null);

    const createHeart = (e) => {
        if ( !buttonRef.current ) return;

        // Toggle liked state
        setLiked(true);

        // Calculate position relative to button
        const buttonRect = e.currentTarget.getBoundingClientRect();
        const offsetX = e.clientX - buttonRect.left;
        const offsetY = e.clientY - buttonRect.top;

        // Create multiple hearts
        const newHearts = Array(5).fill().map((_, i) => {
            return {
                id: Date.now() + i,
                x: offsetX,
                y: offsetY,
                opacity: 1,
                scale: 1,
                rotation: Math.random() * 30 - 15
            };
        });

        setHearts([...hearts, ...newHearts]);

        // Remove hearts after animation completes
        setTimeout(() => {
            setHearts(hearts => hearts.filter(heart => !newHearts.find(h => h.id === heart.id)));
        }, 1000);
    };

    useEffect(() => {
        const fetchArticle = async () => {
            // Validate ID before making request
            if ( !params.id ) {
                setError('Post ID is required');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                const response = await axios.get(`http://localhost:3030/api/post/getpostbyid/${ params.id }`);

                if ( !response.data ) {
                    setError('No post data received');
                    setLoading(false);
                    return;
                }

                setArticle(response);

                // Fetch current user follow state
                if ( user && user._id ) {
                    const currentUser = await axios.get('http://localhost:3030/api/user/getbyid', {
                        params: { id: user._id },
                        withCredentials: true
                    });

                    const initialUserFollowState = currentUser.data.following.includes(response.data.author.authorId);
                    setFollow(initialUserFollowState);
                }

                setLoading(false);
            } catch ( err ) {
                console.error('Error fetching post:', err);

                // Handle different error types based on backend response
                if ( err.response?.status === 404 ) {
                    setError('Post not found');
                } else if ( err.response?.status === 400 ) {
                    setError(err.response.data?.error || 'Invalid post ID format');
                } else if ( err.response?.status >= 500 ) {
                    setError('Server error. Please try again later.');
                } else {
                    setError('Failed to load post');
                }

                setArticle(null);
                setFollow(false);
                setLoading(false);
            }
        };

        fetchArticle();
    }, [params.id, user]);

    useEffect(() => {
        // Start tracking when post is loaded
        if ( article ) {
            const tracker = trackReading(article.data._id);
            tracker.start();

            // Cleanup function to stop tracking when unmounting component
            return () => {
                tracker.stop();
            };
        }
    }, [article]);

    const toggleUserFollow = (id) => {
        const isCurrentlyFollowed = follow;
        const apiUrl = isCurrentlyFollowed
            ? 'http://localhost:3030/api/user/unfollow'
            : 'http://localhost:3030/api/user/follow';

        axios.post(apiUrl, { anotherUserId: id }, { withCredentials: true })
            .then((response) => {
                toast.success(response.data.message);
                setFollow(!isCurrentlyFollowed);
            })
            .catch((err) => {
                toast.error(err.message);
            });
    };

    // Loading state
    if ( loading ) {
        return (
            <div className="min-h-screen bg-white">
                <div className="max-w-3xl mx-auto px-8 pt-20">
                    <div className="animate-pulse">
                        {/* Title skeleton */ }
                        <div className="h-12 bg-gray-200 rounded mb-4"></div>
                        <div className="h-8 bg-gray-200 rounded w-3/4 mb-6"></div>

                        {/* Author skeleton */ }
                        <div className="flex items-center mb-8 space-x-5">
                            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                            <div>
                                <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                                <div className="h-3 bg-gray-200 rounded w-24"></div>
                            </div>
                        </div>

                        {/* Content skeleton */ }
                        <div className="space-y-4">
                            <div className="h-4 bg-gray-200 rounded"></div>
                            <div className="h-4 bg-gray-200 rounded"></div>
                            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if ( error ) {
        // Check if it's a "Post not found" error specifically
        if ( error === 'Post not found' || error.includes('not found') ) {
            return (
                <div className="min-h-screen bg-white">
                    <div className="max-w-2xl mx-auto px-6 pt-20 font-customs2">
                        <div className="text-center">
                            {/* Large illustrative icon */ }
                            <div className="text-8xl font-light text-gray-300 mb-8">404</div>

                            {/* Main message */ }
                            <h1 className="text-4xl font-normal text-gray-900 mb-4">
                                Story not found
                            </h1>

                            {/* Subtitle */ }
                            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                                The story you're looking for doesn't exist or may have been removed by the author.
                            </p>

                            {/* Action buttons */ }
                            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                <button
                                    onClick={ () => window.history.back() }
                                    className="px-6 py-3 bg-gray-900 text-white rounded-full hover:opacity-75 transition-colors duration-200 font-medium"
                                >
                                    Go back
                                </button>
                                <button
                                    onClick={ () => window.location.href = '/home' }
                                    className="px-6 py-3 text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium"
                                >
                                    Browse stories
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        // For other errors (400, 500, etc.)
        return (
            <div className="min-h-screen bg-white">
                <div className="max-w-2xl mx-auto px-6 pt-20 font-customs2">
                    <div className="text-center">
                        <div className="text-6xl font-light text-gray-300 mb-8">⚠</div>

                        <h1 className="text-3xl font-normal text-gray-900 mb-4">
                            Something went wrong
                        </h1>

                        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                            { error }
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <button
                                onClick={ () => window.location.reload() }
                                className="px-6 py-3 bg-gray-900 text-white rounded-full hover:opacity-75 transition-colors duration-200 font-medium"
                            >
                                Try again
                            </button>
                            <button
                                onClick={ () => window.history.back() }
                                className="px-6 py-3 text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium"
                            >
                                Go back
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // No data state (shouldn't happen if backend is working correctly)
    if ( !article ) {
        return (
            <div className="min-h-screen bg-white">
                <div className="max-w-2xl mx-auto px-6 pt-20">
                    <div className="text-center">
                        <div className="text-6xl font-light text-gray-300 mb-8">📄</div>
                        <div className="text-lg text-gray-500">No story data available</div>
                    </div>
                </div>
            </div>
        );
    }

    // Split content into two parts for member-only content
    const contentPart = article.data.content.length / 3;
    const firstPart = article.data.content.substring(0, contentPart * 2);
    const secondPart = article.data.content.substring(contentPart);

    return (
        <div className="bg-white min-h-screen">
            {/* Article Content */ }
            <div className="max-w-3xl mx-auto">
                <div className="rounded-lg px-8 py-8">
                    {/* Title */ }
                    <h1 className="text-6xl font-bold mb-4">{ article.data.tittle }</h1>
                    <h2 className="text-2xl text-gray-600 mb-6">{ article.data.subtittle }</h2>

                    {/* Author info */ }
                    <div className="flex items-center mb-8 space-x-5">
                        <Avatar username={ article.data.author?.authorName } width={ 40 } height={ 40 }
                                avatar={ article.data.author?.ava } />
                        <div>
                            <div className="flex items-center">
                                <span className="font-medium mr-2">{ article.data.author?.authorName }</span>
                                <button className="text-green-600 text-sm font-medium"
                                        onClick={ () => toggleUserFollow(article.data.author?.authorId) }>
                                    { follow ? 'Following' : 'Follow' }
                                </button>
                            </div>
                            <div className="text-gray-500 text-sm flex items-center mt-1">
                                <span>{ new Date(article.data.createdAt).toLocaleDateString('vi-VN', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric'
                                }) }</span>
                                <span className="mx-2">·</span>
                                <span>{ Math.ceil(article.data.views / 60) } min</span>
                            </div>
                        </div>
                    </div>

                    {/* Share buttons */ }
                    <div className="flex space-x-4 mb-8 border-b border-gray-200 pb-8 justify-between">
                        <div className="flex space-x-5">
                            <div className="relative">
                                <Likes postId={ article.data._id } initialLikes={ article.data.likes }>
                                    { (postId, likes, handleLikes) => (
                                        <button className="flex items-center text-gray-500 hover:text-gray-700"
                                                ref={ buttonRef }
                                                onClick={ (e) => {
                                                    handleLikes();
                                                    createHeart(e);
                                                } }>
                                            <svg xmlns="http://www.w3.org/2000/svg"
                                                 className={ `h-5 w-5 mr-1 transition-colors duration-200 ${ liked ? 'text-current fill-current' : '' }` }
                                                 fill="none"
                                                 viewBox="0 0 24 24"
                                                 stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={ 2 }
                                                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                            </svg>

                                            {/* Flying hearts */ }
                                            { hearts.map(heart => (
                                                <div
                                                    key={ heart.id }
                                                    className="absolute pointer-events-none"
                                                    style={ {
                                                        left: `${ heart.x }px`,
                                                        top: `${ heart.y }px`,
                                                        transform: `translate(-50%, -50%) scale(${ heart.scale }) rotate(${ heart.rotation }deg)`,
                                                        opacity: heart.opacity,
                                                        animation: 'float-heart 1s ease-out forwards'
                                                    } }
                                                >
                                                    <svg
                                                        className="w-5 h-5 text-current fill-current"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                                    </svg>
                                                </div>
                                            )) }

                                            { likes }
                                        </button>
                                    ) }
                                </Likes>

                                <style jsx>{ `
                                    @keyframes float-heart {
                                        0% {
                                            transform: translate(-50%, -50%) scale(0.7) rotate(0deg);
                                            opacity: 1;
                                        }
                                        100% {
                                            transform: translate(-50%, -150%) scale(1.4) rotate(20deg);
                                            opacity: 0;
                                        }
                                    }
                                ` }</style>
                            </div>
                            <a href="#comment" type="button"
                               className="flex items-center text-gray-500 hover:text-gray-700">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none"
                                     viewBox="0 0 24 24"
                                     stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={ 2 }
                                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                { article.comments }
                            </a>
                        </div>
                    </div>

                    {/* Article content */ }
                    { isMember === false && article.data.memberonly === true ? (
                        // Content with lower half blurred
                        <div>
                            {/* Display first half of the article */ }
                            <div className="prose max-w-none font-customs2 mb-4"
                                 dangerouslySetInnerHTML={ { __html: firstPart } }></div>

                            {/* Container for blurred lower half */ }
                            <div className="relative text-center">
                                {/* Upgrade overlay */ }
                                <div
                                    className="text-center flex flex-col justify-center items-center px-4 absolute bottom-0 left-0 mx-auto bg-gradient-to-t from-white w-full h-96">
                                </div>
                            </div>

                            <div className="flex justify-center w-full">
                                <div className="max-w-md text-base text-center">
                                    <h2 className="mb-4 font-customs2">Become a member to read this story,
                                        and all of Medium.</h2>

                                    <p className="text-gray-700 mb-6 font-customs text-sm">
                                        { article.data.author?.authorName } put this story behind our paywall, so
                                        it's only available to
                                        read with a paid Medium membership, which comes with a host of benefits:
                                    </p>

                                    <a
                                        href="/home/your-plan"
                                        className="bg-green-700 hover:bg-green-800 text-white font-customs py-2 px-4 rounded-full transition duration-200 text-sm">
                                        Upgrade
                                    </a>
                                </div>
                            </div>
                        </div>
                    ) : (
                        // Full content for members
                        <div className="prose max-w-none font-customs2"
                             dangerouslySetInnerHTML={ { __html: article.data.content } }></div>
                    ) }

                    {/* Tags */ }
                    <div className="mt-8 flex flex-wrap gap-2">
                        {/* Add tags here if needed */ }
                    </div>
                </div>

                <div className="pt-8 mt-12 border-t border-gray-200 rounded-lg px-8 py-8" id="comment">
                    <CommentSection postId={ params.id } />
                </div>
            </div>
        </div>
    );
}

export default Post;