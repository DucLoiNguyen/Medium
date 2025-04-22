import { useState, useEffect } from 'react';
import axios from 'axios';
import { PencilIcon, TrashIcon } from '@heroicons/react/outline';
import { toast } from 'sonner';
import { LockClosedIcon } from '@heroicons/react/solid';

const YourList = () => {
    const [savedLists, setSavedLists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [newListName, setNewListName] = useState('');
    const [newListDescription, setNewListDescription] = useState('');
    const [editingList, setEditingList] = useState(null);

    useEffect(() => {
        const fetchSavedLists = async () => {
            try {
                const res = await axios.get('http://localhost:3030/api/user/lists', {
                    withCredentials: true
                });

                setSavedLists(res.data);
                setLoading(false);
            } catch ( err ) {
                setError('Unable to load saved lists');
                setLoading(false);
                console.error(err);
            }
        };

        fetchSavedLists();
    }, []);

    const handleCreateList = async (e) => {
        e.preventDefault();

        if ( !newListName.trim() ) return;

        try {
            setLoading(true);

            const res = await axios.post('http://localhost:3030/api/user/lists',
                {
                    name: newListName.trim(),
                    description: newListDescription.trim()
                },
                { withCredentials: true }
            );

            setSavedLists([...savedLists, res.data]);
            setShowCreateModal(false);
            setNewListName('');
            setNewListDescription('');
            setLoading(false);
            toast.success('List created successfully');
        } catch ( error ) {
            console.error('Error creating list:', error);
            toast.error(error.response?.data?.message || 'Unable to create new list');
            setLoading(false);
        }
    };

    const handleEditList = async (e) => {
        e.preventDefault();

        if ( !editingList || !newListName.trim() ) return;

        try {
            setLoading(true);

            const res = await axios.put(`http://localhost:3030/api/user/lists/${ editingList._id }`,
                {
                    name: newListName.trim(),
                    description: newListDescription.trim()
                },
                { withCredentials: true }
            );

            // Update state
            setSavedLists(savedLists.map(list =>
                list._id === editingList._id ? res.data : list
            ));

            setShowEditModal(false);
            setEditingList(null);
            setNewListName('');
            setNewListDescription('');
            setLoading(false);
            toast.success('List updated successfully');
        } catch ( error ) {
            console.error('Error updating list:', error);
            toast.error(error.response?.data?.message || 'Unable to update list');
            setLoading(false);
        }
    };

    const handleDeleteList = async (listId) => {
        toast.promise(
            new Promise(async (resolve, reject) => {
                try {
                    await axios.delete(`http://localhost:3030/api/user/lists/${ listId }`, {
                        withCredentials: true
                    });

                    // Update state
                    setSavedLists(savedLists.filter(list => list._id !== listId));
                    resolve();
                } catch ( error ) {
                    console.error('Error deleting list:', error);
                    reject(error.response?.data?.message || 'Unable to delete list');
                }
            }),
            {
                loading: 'Deleting list...',
                success: 'List deleted successfully',
                error: (error) => error || 'Unable to delete list'
            }
        );
    };

    const confirmDeleteList = (listId) => {
        toast('Are you sure you want to delete this list?', {
            action: {
                label: 'Delete',
                onClick: () => {
                    handleDeleteList(listId);
                }
            }
        });
    };

    const openEditModal = (list) => {
        setEditingList(list);
        setNewListName(list.name);
        setNewListDescription(list.description || '');
        setShowEditModal(true);
    };

    if ( loading ) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if ( error ) {
        return (
            <div className="text-center py-10">
                <p className="text-red-500 text-sm">{ error }</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4">
            <div className="flex justify-between mb-10">
                <p className="text-sm">
                    Start organizing your favorite stories with a new list.
                </p>
                <div className="text-right">
                    <button
                        className="py-[5px] px-5 bg-[#1a8917] rounded-full hover:bg-[#0f730c]"
                        onClick={ () => setShowCreateModal(true) }>
                        <span className="text-sm text-white">New list</span>
                    </button>
                </div>
            </div>

            { savedLists.length === 0 ? (
                <div className="bg-gray-50 p-8 rounded-lg text-center">
                    <p className="text-gray-600 mb-4 text-sm">You don't have any saved lists yet.</p>
                    <button
                        onClick={ () => setShowCreateModal(true) }
                        className="text-green-600 hover:text-green-700 font-medium"
                    >
                        Create a new list
                    </button>
                </div>
            ) : (
                <>
                    <div className="space-y-6">
                        { savedLists.map((list, index) => (
                            <div className="w-full bg-[#f9f9f9] flex" key={ index }>
                                <div className="relative w-1/2">
                                    <a href={ `/home/saved-lists/${ list._id }` }
                                       className="h-36 w-full p-6 flex items-center">
                                        <div className="space-y-2 w-full">
                                            <h2 className="text-xl font-semibold font-customs truncate w-full">{ list.name }</h2>
                                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                                                <span>{ list.posts?.length || 0 } { list.posts?.length === 1 ? 'story' : 'stories' }</span>
                                                { list.isDefault &&
                                                    <LockClosedIcon className="w-4 h-4 text-gray-400" /> }
                                            </div>
                                        </div>
                                    </a>
                                    <div className="space-x-2 absolute bottom-6 right-6">
                                        { !list.isDefault && (
                                            <>
                                                <button
                                                    onClick={ () => openEditModal(list) }
                                                    className="text-gray-500 hover:text-gray-700"
                                                >
                                                    <PencilIcon className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={ () => confirmDeleteList(list._id) }
                                                    className="text-gray-500 hover:text-red-600"
                                                >
                                                    <TrashIcon className="w-4 h-4" />
                                                </button>
                                            </>
                                        ) }
                                    </div>
                                </div>
                                <div className="w-1/2">
                                    <div className="flex w-full">
                                        {
                                            list.posts.length === 0 ? (
                                                [0, 1, 2].map((_, index) => (
                                                    <div
                                                        key={ index }
                                                        className="w-36 h-full overflow-hidden border-r-4 border-white shadow-sm"
                                                        style={ {
                                                            marginRight: index > 0 ? '-80px' : '-30px', // Creates the overlap effect
                                                            zIndex: 3 - index, // Higher z-index for images that should appear on top
                                                            position: 'relative justify-end'
                                                        } }
                                                    >
                                                        <div className="w-36 h-36 bg-[#f2f2f2]"></div>
                                                    </div>
                                                ))
                                            ) : list.posts.slice(0, 3).map((item, index) => (
                                                <div
                                                    key={ index }
                                                    className="w-36 h-full overflow-hidden border-r-4 border-white shadow-sm"
                                                    style={ {
                                                        marginRight: index > 0 ? '-80px' : '-30px', // Creates the overlap effect
                                                        zIndex: list.posts.length - index, // Higher z-index for images that should appear on top
                                                        position: 'relative justify-end'
                                                    } }
                                                >
                                                    <img
                                                        src={ item.thumbnail === '' ? '/content1.jpg' : `http://localhost:3030${ item.thumbnail }` }
                                                        alt={ `Thumbnail ${ index + 1 }` }
                                                        className="w-full h-full object-cover object-center"
                                                    />
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            </div>
                        )) }
                    </div>
                </>
            ) }

            {/* Create new list modal */ }
            { showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-sm w-full max-w-md p-6 relative">
                        {/* Close button */ }
                        <button
                            onClick={ () => {
                                setShowCreateModal(false);
                                setNewListName('');
                                setNewListDescription('');
                            } }
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                      d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <h3 className="text-2xl font-bold mb-6 font-customs">Create new list</h3>

                        <form onSubmit={ handleCreateList }>
                            {/* Name input with character count */ }
                            <div className="mb-5">
                                <input
                                    type="text"
                                    value={ newListName }
                                    onChange={ (e) => setNewListName(e.target.value.slice(0, 50)) }
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-0 outline-none focus:outline-none focus:border-current bg-gray-50 text-sm"
                                    placeholder="Name"
                                    required
                                />
                                <div className="text-right text-gray-500 text-sm mt-1">
                                    { newListName.length }/50
                                </div>
                            </div>

                            {/* Description textarea with character count */ }
                            <div className="mb-5">
                                <textarea
                                    value={ newListDescription }
                                    onChange={ (e) => setNewListDescription(e.target.value.slice(0, 280)) }
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-0 outline-none focus:outline-none focus:border-current bg-gray-50 text-sm"
                                    placeholder="Description"
                                    rows="3"
                                ></textarea>
                                <div className="text-right text-gray-500 text-sm mt-1">
                                    { newListDescription.length }/280
                                </div>
                            </div>

                            {/* Action buttons */ }
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={ () => {
                                        setShowCreateModal(false);
                                        setNewListName('');
                                        setNewListDescription('');
                                    } }
                                    className="text-sm text-gray-900 px-4 py-1 ring-2 ring-[#6b6b6b] hover:ring-offset-2 hover:ring-black rounded-full transition-all ease-in-out"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={ !newListName.trim() || loading }
                                    className="px-4 py-1 bg-[#1a8917] rounded-full text-sm text-white hover:bg-[#0f730c] ring-2 ring-[#1a8917] hover:ring-offset-2 hover:ring-[#0f730c] transition-all ease-in-out"
                                >
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            ) }

            {/* Edit list modal */ }
            { showEditModal && editingList && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-sm w-full max-w-md p-6 relative">
                        {/* Close button */ }
                        <button
                            onClick={ () => {
                                setShowEditModal(false);
                                setEditingList(null);
                                setNewListName('');
                                setNewListDescription('');
                            } }
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                      d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <h3 className="text-2xl font-bold mb-6 font-customs">Edit list</h3>

                        <form onSubmit={ handleEditList }>
                            {/* Name input with character count */ }
                            <div className="mb-5">
                                <input
                                    type="text"
                                    value={ newListName }
                                    onChange={ (e) => setNewListName(e.target.value.slice(0, 50)) }
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-0 outline-none focus:outline-none focus:border-current bg-gray-50 text-sm"
                                    placeholder="Name"
                                    required
                                />
                                <div className="text-right text-gray-500 text-sm mt-1">
                                    { newListName.length }/50
                                </div>
                            </div>

                            {/* Description textarea with character count */ }
                            <div className="mb-5">
                                <textarea
                                    value={ newListDescription }
                                    onChange={ (e) => setNewListDescription(e.target.value.slice(0, 280)) }
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-0 outline-none focus:outline-none focus:border-current bg-gray-50 text-sm"
                                    placeholder="Description"
                                    rows="3"
                                ></textarea>
                                <div className="text-right text-gray-500 text-sm mt-1">
                                    { newListDescription.length }/280
                                </div>
                            </div>

                            {/* Action buttons */ }
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={ () => {
                                        setShowEditModal(false);
                                        setEditingList(null);
                                        setNewListName('');
                                        setNewListDescription('');
                                    } }
                                    className="text-sm text-gray-900 px-4 py-1 ring-2 ring-[#6b6b6b] hover:ring-offset-2 hover:ring-black rounded-full transition-all ease-in-out"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={ !newListName.trim() || loading }
                                    className="px-4 py-1 bg-[#1a8917] rounded-full text-sm text-white hover:bg-[#0f730c] ring-2 ring-[#1a8917] hover:ring-offset-2 hover:ring-[#0f730c] transition-all ease-in-out"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            ) }
        </div>
    );
};

export default YourList;