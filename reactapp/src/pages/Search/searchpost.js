import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Avatar from '~/components/partial/Avatar/avatar.component';
import Likes from '~/components/partial/Likes/likes.component';

function SearchPost({ query, tag, author, sortBy, page }) {
    const [results, setResults] = useState([]);
    const [totalResults, setTotalResults] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        // Reset states when search parameters change
        setResults([]);
        setCurrentPage(1);
        setHasMore(true);
        fetchResults(1, true);
    }, [query, tag, author, sortBy]);

    const fetchResults = async (pageToFetch, isNewSearch = false) => {
        isNewSearch ? setLoading(true) : setLoadingMore(true);

        try {
            const url = `http://localhost:3030/api/post/search?q=${ query }&page=${ pageToFetch }&tag=${ tag }&author=${ author }&sortBy=${ sortBy }`;
            const res = await axios.get(url, { withCredentials: true });

            if ( isNewSearch ) {
                setResults(res.data.posts);
            } else {
                setResults(prevResults => [...prevResults, ...res.data.posts]);
            }

            setTotalResults(res.data.total);
            setTotalPages(res.data.totalPages);
            setHasMore(pageToFetch < res.data.totalPages);
        } catch ( err ) {
            console.error('Error fetching search results:', err);
            setError('Failed to fetch search results');
        } finally {
            isNewSearch ? setLoading(false) : setLoadingMore(false);
        }
    };

    const handleLoadMore = () => {
        const nextPage = currentPage + 1;
        if ( nextPage <= totalPages ) {
            setCurrentPage(nextPage);
            fetchResults(nextPage);
        }
    };

    const renderSortOptions = () => (
        <div className="flex space-x-2 mb-4 font-customs">
            <span className="text-gray-500 text-sm">Sort by:</span>
            <Link
                to={ `/home/search?q=${ query }&sortBy=relevance&tag=${ tag }&author=${ author }` }
                className={ `text-sm ${ sortBy === 'relevance' ? 'font-bold text-black' : 'text-gray-500' }` }
            >
                Relevance
            </Link>
            <Link
                to={ `/home/search?q=${ query }&sortBy=date&tag=${ tag }&author=${ author }` }
                className={ `text-sm ${ sortBy === 'date' ? 'font-bold text-black' : 'text-gray-500' }` }
            >
                Latest
            </Link>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            { renderSortOptions() }

            { loading ? (
                <div className="flex justify-center py-10">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
                </div>
            ) : error ? (
                <div className="text-red-500 text-center py-10">{ error }</div>
            ) : results.length === 0 ? (
                <div className="text-center py-10 text-gray-500 text-sm">
                    <p>No results found. Try a different search term.</p>
                </div>
            ) : (
                <>
                    <p className="text-gray-500 mb-6 text-sm font-customs">{ totalResults } results</p>

                    <div className="space-y-8">
                        { results.map(post => (
                            <div key={ post._id }
                                 className="hover:shadow-lg hover:transition-shadow p-4 rounded-lg duration-300 transition-all ease-in-out">
                                <div className="relative">
                                    <a href={ `/home/post/${ post._id }` }>
                                        <div>
                                            <div>
                                                <div className="flex place-posts-center">
                                                    <Avatar username={ post.author?.authorName } width={ 24 }
                                                            height={ 24 } avatar={ post.author.ava } />
                                                    <div className="ml-2">
                                                        <h4 className="text-sm">{ post.author?.authorName }</h4>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex mt-3 justify-between">
                                            <div className="grow">
                                                <div>
                                                    <div>
                                                        <h2 className="font-bold text-2xl">
                                                            { post.tittle }
                                                        </h2>
                                                    </div>
                                                </div>
                                                <div className="">
                                                    <div>
                                                        <p className="h-[48px] line-clamp-2 max-w-full text-[#6b6b6b]">
                                                            { post.subtittle }
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex justify-between mt-3 align-middle">
                                                    <div className="flex text-sm text-[#6b6b6b] font-customs">
                                                        <div className="flex">
                                                            <span>{ new Date(post.createdAt).toLocaleDateString() }</span>
                                                        </div>
                                                        <div className="flex mx-4">
                                                            <Likes postId={ post._id }
                                                                   initialLikes={ post.likes }>
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
                                                                    <span className="mx-0.5">{ post.comments }</span>
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
                                                    src={ post.thumbnail === '' ? '/content1.jpg' : `http://localhost:3030${ post.thumbnail }` }
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
                                        </button>
                                        <button>
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
                        )) }
                    </div>

                    {/* See More Button */ }
                    { hasMore && (
                        <div className="flex justify-center mt-10">
                            <button
                                onClick={ handleLoadMore }
                                disabled={ loadingMore }
                                className="px-4 py-2 ring-1 ring-[#419d3f] rounded-full text-[#419d3f] hover:ring-offset-2 transition duration-200 text-sm"
                            >
                                { loadingMore ? (
                                    <>
                                        <div
                                            className="animate-spin rounded-full h-4 w-4 border-2 border-white mr-2"></div>
                                        Loading...
                                    </>
                                ) : (
                                    'See More'
                                ) }
                            </button>
                        </div>
                    ) }

                    {/* Show "No more results" message when all content is loaded */ }
                    { !hasMore && results.length > 0 && (
                        <div className="text-center py-6 text-gray-500 text-sm mt-6">
                            <p>You've reached the end of the results</p>
                        </div>
                    ) }
                </>
            ) }
        </div>
    );
}

export default SearchPost;