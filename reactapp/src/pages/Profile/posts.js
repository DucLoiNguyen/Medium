import React, { useState, useEffect } from 'react';
import PostApi from '~/api/PostApi';
import Avatar from '~/components/partial/Avatar/avatar.component';
import moment from 'moment/moment';
import Likes from '~/components/partial/Likes/likes.component';

function Post({ id }) {
    const [data, setData] = useState(null);
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const responseData = await PostApi.getPostsByAuthor(id);

                setData(responseData.data.data);
            } catch ( error ) {
                console.error('Error fetching initial data:', error);
            }
        };

        fetchInitialData();
    }, [id]);

    return (
        <>
            { data && (
                <div className="space-y-6">
                    { data.map((item) => (
                        <div key={ item._id }
                             className="hover:shadow-lg hover:transition-shadow p-4 rounded-lg duration-300 transition-all ease-in-out">
                            <div className="relative">
                                <a href={ `/home/post/${ item._id }` }>
                                    <div>
                                        <div>
                                            <div className="flex place-items-center">
                                                <Avatar username={ item.author?.authorName } width={ 24 }
                                                        height={ 24 } avatar={ item.author.ava } />
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
                                                        <Likes postId={ item._id }
                                                               initialLikes={ item.likes }>
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
                                                                        <span
                                                                            className="mx-0.5">{ likes }</span>
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
                                </div>
                            </div>

                        </div>
                    )) }
                </div>
            ) }
        </>
    );
}

export default Post;
