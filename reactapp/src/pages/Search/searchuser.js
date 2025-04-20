import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Avatar from '~/components/partial/Avatar/avatar.component';
import { useAuth } from '~/pages/Authen/authcontext';
import { toast } from 'sonner';

function SearchUser({ query, sortBy, page }) {
    const [results, setResults] = useState([]);
    const [totalResults, setTotalResults] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [userFollowed, setUserFollowed] = useState({});
    const { user } = useAuth();
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
    }, [query, sortBy, user]);

    const fetchResults = async (pageToFetch, isNewSearch = false) => {
        isNewSearch ? setLoading(true) : setLoadingMore(true);

        try {
            const url = `http://localhost:3030/api/user/search?q=${ query }&page=${ pageToFetch }&sortBy=${ sortBy }`;
            const res = await axios.get(url, { withCredentials: true });

            const newUsers = res.data.users;

            if ( isNewSearch ) {
                setResults(newUsers);
            } else {
                setResults(prevResults => [...prevResults, ...newUsers]);
            }

            setTotalResults(res.data.total);
            setTotalPages(res.data.totalPages);
            setHasMore(pageToFetch < res.data.totalPages);

            // Get current user's following information
            const currentUser = await axios.get('http://localhost:3030/api/user/getbyid', {
                params: { id: user._id },
                withCredentials: true
            });

            // Update follow status for the newly loaded users
            const newUserFollowState = newUsers.reduce((acc, item) => {
                acc[item._id] = currentUser.data.following.includes(item._id);
                return acc;
            }, {});

            setUserFollowed(prev => ({
                ...prev,
                ...newUserFollowState
            }));

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

    const toggleUserFollow = (id) => {
        const isCurrentlyFollowed = userFollowed[id]; // Get current state
        const apiUrl = isCurrentlyFollowed
            ? 'http://localhost:3030/api/user/unfollow' // If following → unfollow
            : 'http://localhost:3030/api/user/follow';  // If not following → follow

        axios.post(apiUrl, { anotherUserId: id }, { withCredentials: true })
            .then((response) => {
                toast.success(response.data.message);
                setUserFollowed(prevStates => ({
                    ...prevStates,
                    [id]: !isCurrentlyFollowed // Only update state when request is successful
                }));
            })
            .catch((err) => {
                toast.error(err.message);
            });
    };

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

                    <div className="space-y-8">
                        { results.map(userResult => (
                            <div key={ userResult._id }
                                 className="flex items-start p-4 border-b border-gray-200 justify-between">
                                <div className="flex space-x-6">
                                    <Avatar username={ userResult.username } width={ 48 } height={ 48 } />
                                    <div>
                                        <h3 className="font-bold text-black">{ userResult.username }</h3>
                                        <p className="mt-1 text-sm text-gray-800 text-ellipsis overflow-hidden max-w-md h-10">{ userResult.bio }</p>
                                    </div>
                                </div>
                                <div className="h-full place-self-center">
                                    <button onClick={ () => toggleUserFollow(`${ userResult._id }`) }
                                            className={ `border-solid border-2 border-[#1c8a19] rounded-full px-3 py-1 text-sm right-0 transition-all ${ userFollowed[userResult._id] ? 'text-[#1c8a19] hover:border-black hover:text-black' : 'text-white bg-[#1a8917] hover:bg-[#0f730c]' }` }>
                                        { userFollowed[userResult._id] ? 'Following' : 'Follow' }
                                    </button>
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

export default SearchUser;