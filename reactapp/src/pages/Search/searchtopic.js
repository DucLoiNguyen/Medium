import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function SearchTopic({ query, sortBy, page }) {
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
    }, [query, sortBy]);

    const fetchResults = async (pageToFetch, isNewSearch = false) => {
        isNewSearch ? setLoading(true) : setLoadingMore(true);

        try {
            const url = `http://localhost:3030/api/topic/search?q=${ query }&page=${ pageToFetch }&sortBy=${ sortBy }`;
            const res = await axios.get(url, { withCredentials: true });

            if ( isNewSearch ) {
                setResults(res.data.data);
            } else {
                setResults(prevResults => [...prevResults, ...res.data.data]);
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
                to={ `/home/search?q=${ query }&sortBy=relevance` }
                className={ `text-sm ${ sortBy === 'relevance' ? 'font-bold text-black' : 'text-gray-500' }` }
            >
                Relevance
            </Link>
            <Link
                to={ `/home/search?q=${ query }&sortBy=date` }
                className={ `text-sm ${ sortBy === 'date' ? 'font-bold text-black' : 'text-gray-500' }` }
            >
                Latest
            </Link>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
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

                    <div className="relative flex flex-wrap">
                        { results.map((topic, index) => (
                            <div key={ `${ topic.tag }-${ index }` }
                                 className="rounded-full w-fit px-4 py-2 mb-3 mr-2 hover:shadow-2xl transition-shadow hover:ring-2 hover:ring-gray-300 hover:ring-offset-2">
                                <a className="text-sm" href={ `/home/tag/${ topic.tag }` }>
                                    { topic.tag }
                                </a>
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

export default SearchTopic;