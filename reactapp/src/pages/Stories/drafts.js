import { ClassNames } from '~/util';
import { Fragment, useEffect, useState, useRef, useCallback } from 'react';
import { Menu, Transition } from '@headlessui/react';
import ComfirmModal from '~/components/partial/ConfirmModal/confirmmodal.component';
import axios from 'axios';

function Draft() {
    const [isOpen, setIsOpen] = useState(false);
    const [currentItemId, setCurrentItemId] = useState(null);
    const [drafts, setDrafts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [nextCursor, setNextCursor] = useState(null);
    const observer = useRef();

    function openConfirmModal(itemId) {
        setCurrentItemId(itemId);
        setIsOpen(true);
    }

    function closeConfirmModal() {
        setIsOpen(false);
        setCurrentItemId(null);
    }

    const fetchDrafts = useCallback(async (cursor = null) => {
        try {
            setLoading(true);
            const url = 'http://localhost:3030/api/post/getmydraft';
            const params = { limit: 10 };

            if ( cursor ) {
                params.cursor = cursor;
            }

            const response = await axios.get(url, {
                params,
                withCredentials: true
            });

            const { data, pagination } = response.data;
            console.log(data);

            if ( data.length === 0 ) {
                setHasMore(false);
            } else {
                setDrafts(prev => cursor ? [...prev, ...data] : data);
                setHasMore(pagination.hasMore);
                setNextCursor(pagination.nextCursor);
            }
        } catch ( error ) {
            console.error('Error fetching draft posts:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDrafts();
    }, [fetchDrafts]);

    const handleDeleteDraft = async (itemId) => {
        try {
            await axios.delete(`http://localhost:3030/api/post/${ itemId }`, { withCredentials: true });
            setDrafts(prev => prev.filter(draft => draft._id !== itemId));
            closeConfirmModal();
        } catch ( error ) {
            console.error('Error deleting draft:', error);
        }
    };

    // Set up the intersection observer for infinite scroll
    const lastDraftElementRef = useCallback(node => {
        if ( loading || !hasMore ) return;

        if ( observer.current ) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if ( entries[0].isIntersecting && hasMore ) {
                fetchDrafts(nextCursor);
            }
        }, { threshold: 0.5 });

        if ( node ) observer.current.observe(node);
    }, [loading, hasMore, nextCursor, fetchDrafts]);

    return (
        <div className="divide-y divide-gray-200">
            { drafts.length > 0 ? (
                drafts.map((item, index) => (
                    <div
                        className="px-6 pt-6 pb-[10px]"
                        key={ item._id }
                        ref={ index === drafts.length - 1 ? lastDraftElementRef : null }
                    >
                        <div className="flex mt-3">
                            <div className="max-w-lg">
                                <div>
                                    <a href={ `/home/new-story/${ item._id }` }>
                                        <h2 className="text-base font-bold">{ item.tittle }</h2>
                                    </a>
                                </div>
                                <div className="text-sm text-gray-500 mt-1">
                                    <span>Last edited: { new Date(item.updatedAt || item.createdAt).toLocaleString() }</span>
                                    { item.commentCount > 0 && (
                                        <span
                                            className="ml-2">• { item.commentCount } comment{ item.commentCount !== 1 ? 's' : '' }</span>
                                    ) }
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <Menu as="div" className="relative inline-block text-left">
                                <div>
                                    <Menu.Button className="justify-center bg-white rounded-full shadow-sm">
                                        <span className="text-[#6b6b6b] hover:text-black">
                                            <svg width="21" height="21" viewBox="0 0 21 21" className="bz">
                                                <path
                                                    d="M4 7.33L10.03 14l.5.55.5-.55 5.96-6.6-.98-.9-5.98 6.6h1L4.98 6.45z"
                                                    fillRule="evenodd"
                                                ></path>
                                            </svg>
                                        </span>
                                    </Menu.Button>
                                </div>

                                <Transition
                                    as={ Fragment }
                                    enter="transition ease-out duration-100"
                                    enterFrom="transform opacity-0 scale-95"
                                    enterTo="transform opacity-100 scale-100"
                                    leave="transition ease-in duration-75"
                                    leaveFrom="transform opacity-100 scale-100"
                                    leaveTo="transform opacity-0 scale-95"
                                >
                                    <Menu.Items
                                        className="absolute right-0 z-10 w-32 mt-2 origin-top-right bg-white divide-y rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none divide-solid">
                                        <div className="">
                                            <Menu.Item className="flex">
                                                { ({ active }) => (
                                                    <a
                                                        href={ `/home/new-story/${ item._id }` }
                                                        className={ ClassNames(
                                                            active
                                                                ? 'bg-gray-100 text-gray-900'
                                                                : 'text-gray-700',
                                                            'block px-4 py-2 text-sm'
                                                        ) }
                                                    >
                                                        <div className="flex ml-4">
                                                            <p className="text-sm max-h-5">Edit</p>
                                                        </div>
                                                    </a>
                                                ) }
                                            </Menu.Item>
                                            <Menu.Item className="flex">
                                                { ({ active }) => (
                                                    <button
                                                        onClick={ () => openConfirmModal(item._id) }
                                                        className={ ClassNames(
                                                            active
                                                                ? 'bg-gray-100 text-gray-900'
                                                                : 'text-[#c94a4a]',
                                                            'block px-4 py-2 text-sm w-full'
                                                        ) }
                                                    >
                                                        <div className="flex ml-4">
                                                            <p className="text-sm max-h-5">Remove</p>
                                                        </div>
                                                    </button>
                                                ) }
                                            </Menu.Item>
                                        </div>
                                    </Menu.Items>
                                </Transition>
                            </Menu>
                        </div>
                    </div>
                ))
            ) : !loading && (
                <div className="px-6 py-8 text-center text-sm text-gray-500">
                    No drafts found. Start writing a new story!
                </div>
            ) }

            { loading && (
                <div className="px-6 py-4 text-center text-sm">
                    <div
                        className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-gray-900"></div>
                    <p className="mt-2 text-sm text-gray-600">Loading drafts...</p>
                </div>
            ) }

            { !hasMore && drafts.length > 0 && (
                <div className="px-6 py-4 text-center text-sm text-gray-500">
                    You've reached the end of your drafts
                </div>
            ) }

            <ComfirmModal
                isOpen={ isOpen }
                close={ closeConfirmModal }
                type={ 'deletestories' }
                onConfirm={ () => currentItemId && handleDeleteDraft(currentItemId) }
            />
        </div>
    );
}

export default Draft;