import { useParams } from 'react-router-dom';
import Avatar from '~/components/partial/Avatar/avatar.component';
import moment from 'moment/moment';
import Likes from '~/components/partial/Likes/likes.component';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import axios from 'axios';
import { useAuth } from '~/pages/Authen/authcontext';

function Tag() {
    const tagname = useParams();
    const [dataRecommend, setDataRecommend] = useState(null);
    const [dataRecent, setDataRecent] = useState(null);
    const [dataTag, setDataTag] = useState(null);
    const [topicFollowed, setTopicFollowed] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const responseDataRecommend = await axios.get('http://localhost:3030/api/post/getbytag', {
                    params: {
                        tag: tagname.id,
                        sortType: 'view'
                    }, withCredentials: true
                });
                setDataRecommend(responseDataRecommend.data);

                const responseDataRecent = await axios.get('http://localhost:3030/api/post/getbytag', {
                    params: {
                        tag: tagname.id,
                        sortType: 'time'
                    }, withCredentials: true
                });
                setDataRecent(responseDataRecent.data);

                const responseDataTag = await axios.get('http://localhost:3030/api/tag/gettag', {
                    params: {
                        tag: tagname.id
                    }, withCredentials: true
                });
                setDataTag(responseDataTag.data);

                const currentUser = await axios.get('http://localhost:3030/api/user/getbyid', {
                    params: { id: user._id },
                    withCredentials: true
                });

                let topictagfollowing = [...currentUser.data.topicFollowing, ...currentUser.data.tagFollowing];
                const initialTopicFollowState = topictagfollowing.includes(responseDataTag.data[0]._id);
                setTopicFollowed(initialTopicFollowState);

            } catch ( e ) {
                setDataRecommend(null);
                setDataRecent(null);
                setDataTag(null);
                setTopicFollowed(false);
                toast.error(e.response.data.message);
            }
        };
        fetchInitialData();
    }, [tagname, user]);

    const toggleTopicFollow = (id) => {
        const isCurrentlyFollowed = topicFollowed;
        const apiUrl = isCurrentlyFollowed
            ? 'http://localhost:3030/api/tag/unfollow'
            : 'http://localhost:3030/api/tag/follow';

        axios.post(apiUrl, { topicId: id, tagId: id }, { withCredentials: true })
            .then((response) => {
                toast.success(response.data.message);
                setTopicFollowed(!isCurrentlyFollowed);
            })
            .catch((err) => {
                toast.error(err.message);
            });
    };

    return (
        <>
            <div className="mt-20">
                <h2 className="w-full text-5xl font-bold text-center"><span>{ tagname.id }</span></h2>
                <div className="flex justify-center mt-4 mb-6 divide-x divide-dotted">
                    <span className="px-4 text-base text-[#6b6b6b]">Topic</span>
                    <span className="px-4 text-base text-[#6b6b6b]">{ dataTag && dataTag[0].followers } Followers</span>
                    <span className="px-4 text-base text-[#6b6b6b]">{ dataRecent && dataRecent.length } Stories</span>
                </div>
                <div className="flex justify-center">
                    { dataTag && topicFollowed ?
                        <button onClick={ () => toggleTopicFollow(dataTag[0]._id) }
                                className="px-4 py-2 ring-2 ring-black rounded-full hover:ring-offset-2 transition-all">
                            <span className="text-black">Following</span>
                        </button>
                        :
                        <button onClick={ () => toggleTopicFollow(dataTag[0]._id) }
                                className="px-4 py-2 bg-black rounded-full ring-2 ring-black hover:ring-offset-2 transition-all">
                            <span className="text-white">Follow</span>
                        </button>
                    }
                </div>
            </div>
            <div className="space-y-20 mt-20">
                <div className="px-20">
                    <div className="my-4">
                        <h1 className="font-customs text-xl font-semibold">recommendations</h1>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        { dataRecommend && dataRecommend.slice(0, 6).map((item, index) => (
                            <div key={ item._id }
                                 className={
                                     index === 0
                                         ? 'md:col-span-2 md:row-span-2p-4'
                                         : index === 1
                                             ? 'md:col-span-2 md:row-span-2 md:col-start-3p-4'
                                             : 'p-4'
                                 }>
                                <div
                                    className="hover:shadow-lg hover:transition-shadow p-4 rounded-lg duration-300 transition-all ease-in-out">
                                    <div className="relative">
                                        <a href={ `/home/post/${ item._id }` }>
                                            <div>
                                                <div className="hidden max-w-full sm:block">
                                                    <img
                                                        className="bg-[#f9f9f9] object-cover object-[position:-1%_-1%] aspect-[1.5/1] w-full"
                                                        alt="Thumbnail"
                                                        src={ item.thumbnail === '' ? '/content1.jpg' : `http://localhost:3030${ item.thumbnail }` }
                                                        width="112"
                                                        height="112"
                                                        loading="lazy"
                                                    />
                                                </div>
                                            </div>
                                            <div className="mt-3">
                                                <div>
                                                    <div className="flex place-items-center">
                                                        <Avatar
                                                            username={ item.author?.authorName }
                                                            width={ 24 }
                                                            height={ 24 }
                                                        />
                                                        <div className="ml-2">
                                                            <h4 className="text-sm">{ item.author?.authorName }</h4>
                                                        </div>
                                                    </div>
                                                </div>
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
                                                                <Likes
                                                                    postId={ item._id }
                                                                    initialLikes={ item.likes }
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
                                                                                <span
                                                                                    className="mx-0.5">{ likes }</span>
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
                                                                        <span
                                                                            className="mx-0.5">{ item.comments }</span>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </a>
                                        <div className="absolute bottom-0 right-0 space-x-2 text-[#6b6b6b] h-[20px]">
                                            <button>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth={ 1.5 }
                                                    stroke="currentColor"
                                                    className="size-5 hover:stroke-black"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
                                                    />
                                                </svg>
                                            </button>
                                            <button>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth={ 1.5 }
                                                    stroke="currentColor"
                                                    className="size-5 hover:stroke-red-700"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )) }
                    </div>
                    <div className="my-4">
                        <a href={ `/home/tag/${ tagname.id }/recommendations` }
                           className="text-sm px-4 py-2 rounded-full ring-1 ring-[#6b6b6b] hover:ring-black text-[#6b6b6b] hover:text-black">See
                            more
                            recommendations</a>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-1 gap-4 justify-end px-20">
                    <div>
                        <h1 className="font-customs text-xl font-semibold">
                            Lastest stories
                        </h1>
                    </div>
                    <div className="col-span-3">
                        <div className="space-y-6">
                            { dataRecent && dataRecent.slice(0, 10).map((item) => (
                                <div
                                    key={ item._id }
                                    className="hover:shadow-lg hover:transition-shadow p-4 rounded-lg duration-300 transition-all ease-in-out"
                                >
                                    <div className="relative">
                                        <a href={ `/home/post/${ item._id }` }>
                                            <div>
                                                <div>
                                                    <div className="flex place-items-center">
                                                        <Avatar
                                                            username={ item.author?.authorName }
                                                            width={ 24 }
                                                            height={ 24 }
                                                        />
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
                                                                <span>{ moment(item.createdAt || item.updatedAt).fromNow() }</span>
                                                            </div>
                                                            <div className="flex mx-4">
                                                                <Likes
                                                                    postId={ item._id }
                                                                    initialLikes={ item.likes }
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
                                                                                <span
                                                                                    className="mx-0.5">{ likes }</span>
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
                                                                        <span
                                                                            className="mx-0.5">{ item.comments }</span>
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
                                                        src={ item.thumbnail === '' ? '/content1.jpg' : `http://localhost:3030${ item.thumbnail }` }
                                                        width="112"
                                                        height="112"
                                                        loading="lazy"
                                                    />
                                                </div>
                                            </div>
                                        </a>
                                        <div className="absolute bottom-0 right-[150px] space-x-4 text-[#6b6b6b]">
                                            <button>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth={ 1.5 }
                                                    stroke="currentColor"
                                                    className="size-5 hover:stroke-black"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
                                                    />
                                                </svg>
                                            </button>
                                            <button>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth={ 1.5 }
                                                    stroke="currentColor"
                                                    className="size-5 hover:stroke-red-700"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )) }
                        </div>
                    </div>
                    <div className="my-4">
                        <a href={ `/home/tag/${ tagname.id }/lastest` }
                           className="text-sm px-4 py-2 rounded-full ring-1 ring-[#6b6b6b] hover:ring-black text-[#6b6b6b] hover:text-black">See
                            more stories</a>
                    </div>
                </div>

            </div>
        </>
    );
}

export default Tag;