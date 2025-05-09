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
        // Simulating API call to fetch article by ID
        const fetchArticle = async () => {
            try {
                setLoading(true);

                const mockArticle = await axios.get(`http://localhost:3030/api/post/getpostbyid/${ params.id }`);
                setArticle(mockArticle);

                const currentUser = await axios.get('http://localhost:3030/api/user/getbyid', {
                    params: { id: user._id },
                    withCredentials: true
                });

                const initialUserFollowState = currentUser.data.following.includes(mockArticle.data.author.authorId);
                setFollow(initialUserFollowState);

                setLoading(false);

            } catch ( err ) {
                setArticle(null);
                setFollow(false);
                setError(err.message);
                setLoading(false);
            }
        };

        fetchArticle();
    }, [params.id, user]);

    useEffect(() => {
        // Bắt đầu theo dõi khi bài viết được tải xong
        if ( article ) {
            const tracker = trackReading(article.data._id);
            tracker.start();

            // Cleanup function để dừng theo dõi khi unmount component
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
                setFollow(!isCurrentlyFollowed); // Chỉ toggle boolean
            })
            .catch((err) => {
                toast.error(err.message);
            });
    };

    if ( loading ) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div
                    className="w-16 h-16 border-4 border-t-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    if ( error ) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-red-500 text-xl">{ error.message }</div>
            </div>
        );
    }

    if ( !article ) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-gray-500 text-xl">Article not found</div>
            </div>
        );
    }

    // Tách nội dung thành hai phần chính xác bằng nhau
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
                    <h2 className="text-2xl text-[#6b6b6b] mb-6">{ article.data.subtittle }</h2>

                    {/* Author info */ }
                    <div className="flex items-center mb-8 space-x-5">
                        <Avatar username={ article.data.author?.authorName } width={ 40 } height={ 40 } />
                        <div>
                            <div className="flex items-center">
                                <span className="font-medium mr-2">{ article.data.author?.authorName }</span>
                                <button className="text-green-600 text-sm font-medium"
                                        onClick={ () => toggleUserFollow(article.data.author?.authorId) }>{ follow ? 'Following' : 'Follow' }</button>
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
                                <Likes postId={ article.data._id }
                                       initialLikes={ article.data.likes }>
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
                        {/*<div className="flex space-x-5">*/ }
                        {/*    <button className="flex items-center text-gray-500 hover:text-gray-700">*/ }
                        {/*        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none"*/ }
                        {/*             viewBox="0 0 24 24" stroke="currentColor">*/ }
                        {/*            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}*/ }
                        {/*                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>*/ }
                        {/*        </svg>*/ }
                        {/*        Share*/ }
                        {/*    </button>*/ }

                        {/*    <button className="flex items-center text-gray-500 hover:text-gray-700">*/ }
                        {/*        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none"*/ }
                        {/*             viewBox="0 0 24 24" stroke="currentColor">*/ }
                        {/*            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}*/ }
                        {/*                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>*/ }
                        {/*        </svg>*/ }
                        {/*        Save*/ }
                        {/*    </button>*/ }
                        {/*</div>*/ }
                    </div>

                    {/* Article content */ }
                    { isMember === false && article.data.memberonly === true ? (
                        // Nội dung với phần nửa dưới bị làm mờ
                        <div>
                            {/* Hiển thị nửa đầu tiên của bài viết */ }
                            <div className="prose max-w-none font-customs2 mb-4"
                                 dangerouslySetInnerHTML={ { __html: firstPart } }></div>

                            {/* Container cho phần nửa dưới bị làm mờ */ }
                            <div className="relative text-center">
                                {/* Nội dung bị làm mờ */ }
                                {/*<div*/ }
                                {/*    className="prose max-w-none font-customs2 select-none pointer-events-none"*/ }
                                {/*    dangerouslySetInnerHTML={ { __html: secondPart } }></div>*/ }

                                {/* Overlay nâng cấp tài khoản */ }
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
                                        it’s only available to
                                        read with a paid Medium membership, which comes with a host of benefits:
                                    </p>

                                    <a
                                        href="/home/your-plan"
                                        className="bg-[#1a8917] hover:bg-[#0f730c] text-white font-customs py-2 px-4 rounded-full transition duration-200 text-sm">
                                        Upgrade
                                    </a>
                                </div>
                            </div>
                        </div>
                    ) : (
                        // Nội dung đầy đủ cho thành viên
                        <div className="prose max-w-none font-customs2"
                             dangerouslySetInnerHTML={ { __html: article.data.content } }></div>
                    ) }

                    {/* Tags */ }
                    <div className="mt-8 flex flex-wrap gap-2">
                        {/*{article.tags.map((tag, index) => (*/ }
                        {/*  <span key={index} className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-600">*/ }
                        {/*    {tag}*/ }
                        {/*  </span>*/ }
                        {/*))}*/ }
                        {/*<span*/ }
                        {/*    className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-600">{ article.data.topic.topicName }</span>*/ }
                    </div>
                </div>

                <div className="pt-8 mt-12 border-t border-gray-200 rounded-lg px-8 py-8" id="comment">
                    <CommentSection postId={ params.id } />
                </div>

                {/* Related articles - Placeholder */ }
                {/*<div className="mt-12 border-t border-gray-200 pt-8">*/ }
                {/*    <h3 className="text-xl font-bold mb-6">More from MyBlog</h3>*/ }
                {/*    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">*/ }
                {/*        { [1, 2, 3, 4].map((item) => (*/ }
                {/*            <div key={ item } className="mb-6">*/ }
                {/*                <h4 className="font-medium mb-2">Another interesting article title goes here</h4>*/ }
                {/*                <p className="text-gray-600 text-sm mb-2">A brief description of the article that gives*/ }
                {/*                    readers a taste*/ }
                {/*                    of what they can expect.</p>*/ }
                {/*                <div className="flex items-center text-gray-500 text-xs">*/ }
                {/*                    <span>Mar 10</span>*/ }
                {/*                    <span className="mx-1">·</span>*/ }
                {/*                    <span>5 min read</span>*/ }
                {/*                </div>*/ }
                {/*            </div>*/ }
                {/*        )) }*/ }
                {/*    </div>*/ }
                {/*</div>*/ }
            </div>
        </div>
    );
}

export default Post;