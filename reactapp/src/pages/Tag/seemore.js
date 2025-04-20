import { useParams, useSearchParams } from 'react-router-dom';
import Avatar from '~/components/partial/Avatar/avatar.component';
import moment from 'moment';
import Likes from '~/components/partial/Likes/likes.component';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

function SeeMore() {
    const { id, type } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const [dataRecommend, setDataRecommend] = useState(null);
    const [dataFiltered, setDataFiltered] = useState(null);
    const [currentFilter, setCurrentFilter] = useState(searchParams.get('filter') || 'latest');

    let arrayfetch = [];

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                // Always fetch recommended data (sorted by view)
                const responseDataRecommend = await axios.get('http://localhost:3030/api/post/getbytag', {
                    params: {
                        tag: id,
                        filter: 'view'
                    },
                    withCredentials: true
                });
                setDataRecommend(responseDataRecommend.data);

                // Fetch data based on current filter
                const responseDataFiltered = await axios.get('http://localhost:3030/api/post/getbytag', {
                    params: {
                        tag: id,
                        filter: currentFilter
                    },
                    withCredentials: true
                });
                setDataFiltered(responseDataFiltered.data);

            } catch ( e ) {
                setDataFiltered(null);
                toast.error(e.response?.data?.message || 'Error loading data');
            }
        };
        fetchInitialData();
    }, [id, currentFilter]);

    const handleFilterChange = (newFilter) => {
        setCurrentFilter(newFilter);
        setSearchParams({ filter: newFilter });
    };

    if ( type === 'recommendations' ) {
        arrayfetch = dataRecommend;
    }

    if ( type === 'lastest' ) {
        arrayfetch = dataFiltered;
    }

    // Filter options for the UI
    const filterOptions = [
        { value: 'latest', label: 'Latest' },
        { value: 'oldest', label: 'Oldest' }
        // { value: '10mostread', label: '10 Most Read' }
    ];

    return (
        <>
            <div className="flex justify-evenly mx-auto divide-x mt-10 pt-4">
                <div className="block py-24 sticky h-screen">
                    <div className="pr-6 max-w-md min-w-96">
                        <h1 className="font-customs text-4xl font-semibold">
                            { type === 'recommendations' ? `Recommended stories in "${ id }"` : '' }
                            { type === 'lastest' ? `Archive of stories in "${ id }"` : '' }
                        </h1>

                        {/* Filter options section - Only show for lastest type */ }
                        { type === 'lastest' && (
                            <div className="mt-6">
                                <h3 className="text-sm font-customs mb-2">Filter by:</h3>
                                <div className="flex flex-wrap gap-2">
                                    { filterOptions.map((option) => (
                                        <button
                                            key={ option.value }
                                            onClick={ () => handleFilterChange(option.value) }
                                            className={ `px-3 py-1 rounded-full text-sm font-customs ${
                                                currentFilter === option.value
                                                    ? 'bg-black text-white'
                                                    : 'bg-gray-100 hover:bg-gray-200'
                                            }` }
                                        >
                                            { option.label }
                                        </button>
                                    )) }
                                </div>
                            </div>
                        ) }
                    </div>
                </div>
                <div className="py-24 pl-6">
                    <div className="space-y-6">
                        { arrayfetch && arrayfetch.length > 0 ? (
                            arrayfetch.map((item) => (
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
                                                            <p className="h-12 line-clamp-2 max-w-full text-[#6b6b6b]">
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
                            ))
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-gray-500">No stories found for this tag.</p>
                            </div>
                        ) }
                    </div>
                </div>
            </div>
        </>
    );
}

export default SeeMore;