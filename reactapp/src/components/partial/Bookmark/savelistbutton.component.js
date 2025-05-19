import { useState, useEffect, useRef } from 'react';
import { LockClosedIcon } from '@heroicons/react/solid';
import axios from 'axios';

const SaveListButton = ({ postId }) => {
    const [savedLists, setSavedLists] = useState([]);
    const [containingLists, setContainingLists] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [newListName, setNewListName] = useState('');
    const [isCreatingNewList, setIsCreatingNewList] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        // Handle clicking outside dropdown
        const handleClickOutside = (event) => {
            if ( dropdownRef.current && !dropdownRef.current.contains(event.target) ) {
                setShowDropdown(false);
                setIsCreatingNewList(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        // Check if post is saved in any lists
        const checkSavedStatus = async () => {
            try {
                const res = await axios.get(`http://localhost:3030/api/user/check/${ postId }`, {
                    withCredentials: true
                });

                setContainingLists(res.data.lists || []);
            } catch ( error ) {
                console.error('Error checking saved status:', error);
            }
        };

        checkSavedStatus();
    }, [postId]);

    // Retrieve user's saved lists when clicking the save button
    const fetchSavedLists = async () => {
        try {
            setIsLoading(true);

            const res = await axios.get('http://localhost:3030/api/user/lists', {
                withCredentials: true
            });

            setSavedLists(res.data);
            setIsLoading(false);
        } catch ( error ) {
            console.error('Error fetching saved lists:', error);
            setIsLoading(false);
        }
    };

    const handleDropdownToggle = () => {
        if ( !showDropdown ) {
            // Only call API when opening dropdown
            fetchSavedLists();
        }
        setShowDropdown(!showDropdown);
        setIsCreatingNewList(false);
    };

    const handleToggleSaveToList = async (listId) => {
        try {
            setIsLoading(true);

            // Check if post is already in this list
            const isInList = containingLists.some(list => list._id === listId);

            if ( isInList ) {
                // Remove post from the list
                await axios.delete(`http://localhost:3030/api/user/lists/${ listId }/posts/${ postId }`, {
                    withCredentials: true
                });

                // Update UI
                setContainingLists(containingLists.filter(list => list._id !== listId));
            } else {
                // Add post to the list
                await axios.post(`http://localhost:3030/api/user/lists/${ listId }/posts/${ postId }`, {}, {
                    withCredentials: true
                });

                // Find the list that was just added
                const addedList = savedLists.find(list => list._id === listId);

                // Update UI
                setContainingLists([...containingLists, {
                    _id: addedList._id,
                    name: addedList.name,
                    isDefault: addedList.isDefault
                }]);
            }

            setIsLoading(false);
        } catch ( error ) {
            console.error('Error toggling save status:', error);
            setIsLoading(false);
        }
    };

    const showCreateNewListForm = () => {
        setIsCreatingNewList(true);
    };

    const handleCreateNewList = async (e) => {
        e.preventDefault();

        if ( !newListName.trim() ) return;

        try {
            setIsLoading(true);

            // Create new list
            const res = await axios.post('http://localhost:3030/api/user/lists',
                { name: newListName.trim() },
                { withCredentials: true }
            );

            // Add new list to state
            setSavedLists([...savedLists, res.data]);

            // Automatically add post to the new list
            await axios.post(`http://localhost:3030/api/user/lists/${ res.data._id }/posts/${ postId }`, {}, {
                withCredentials: true
            });

            // Update UI
            setContainingLists([...containingLists, {
                _id: res.data._id,
                name: res.data.name,
                isDefault: res.data.isDefault
            }]);

            // Reset
            setNewListName('');
            setIsCreatingNewList(false);
            setIsLoading(false);
        } catch ( error ) {
            console.error('Error creating new list:', error);
            alert(error.response?.data?.message || 'Unable to create new list');
            setIsLoading(false);
        }
    };

    const isSaved = containingLists.length > 0;

    return (
        <div className="relative w-fitX" ref={ dropdownRef }>
            <button
                onClick={ handleDropdownToggle }
                disabled={ isLoading }
                className="flex items-center text-gray-500 hover:text-gray-900 transition-colors"
            >
                { isSaved ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                        <path fillRule="evenodd"
                              d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z"
                              clipRule="evenodd" />
                    </svg>
                ) : (
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
                ) }
            </button>

            { showDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                    {/* Saved lists */ }
                    <div className="max-h-60 overflow-y-auto py-2">
                        { savedLists.map(list => {
                            const isInList = containingLists.some(item => item._id === list._id);

                            return (
                                <div
                                    key={ list._id }
                                    className="px-4 py-2 hover:bg-gray-50 flex items-center justify-between cursor-pointer"
                                    onClick={ () => handleToggleSaveToList(list._id) }
                                >
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={ isInList }
                                            className="h-4 w-4 text-[#419d3f]"
                                            readOnly
                                        />
                                        <span className="ml-3 text-sm font-medium font-customs">
                                            { list.name }
                                        </span>
                                    </div>
                                    { list.isDefault && (
                                        <LockClosedIcon className="w-4 h-4 text-gray-400" />
                                    ) }
                                </div>
                            );
                        }) }
                    </div>

                    {/* Create new list section */ }
                    <div className="border-t border-gray-200 mt-1">
                        { isCreatingNewList ? (
                            <form onSubmit={ handleCreateNewList } className="p-3">
                                <input
                                    type="text"
                                    placeholder="List name"
                                    className="w-full text-sm border rounded px-2 py-2 mb-2 outline-none focus:outline-none ring-0 focus:ring-0"
                                    value={ newListName }
                                    onChange={ (e) => setNewListName(e.target.value) }
                                    autoFocus
                                />
                                <button
                                    type="submit"
                                    disabled={ isLoading || !newListName.trim() }
                                    className="w-full text-sm bg-green-600 text-white rounded py-1 disabled:bg-gray-300"
                                >
                                    Create
                                </button>
                            </form>
                        ) : (
                            <div
                                className="px-4 py-3 text-[#419d3f] hover:text-black cursor-pointer text-sm font-medium font-customs"
                                onClick={ showCreateNewListForm }
                            >
                                Create new list
                            </div>
                        ) }
                    </div>
                </div>
            ) }
        </div>
    );
};

export default SaveListButton;