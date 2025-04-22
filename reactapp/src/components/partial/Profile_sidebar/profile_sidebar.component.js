import clsx from 'clsx';
import profilesidebar from './profile_sidebar.module.scss';
import React, { useState, useEffect } from 'react';
import Avatar from '~/components/partial/Avatar/avatar.component';
import { useAuth } from '~/pages/Authen/authcontext';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';

function ProfileSidebar() {
    const classNames = clsx(
        profilesidebar.sidebar,
        'lg:block hidden h-screen sticky top-0'
    );

    const [data, setData] = useState(null);
    const [userFollowed, setUserFollowed] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTab, setModalTab] = useState('followers');
    const { user } = useAuth();
    const { id } = useParams();

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const responseData = await axios.get('http://localhost:3030/api/user/getbyid', {
                    params: { id: id },
                    withCredentials: true
                });
                setData(responseData.data);

                const currentUser = await axios.get('http://localhost:3030/api/user/getbyid', {
                    params: { id: user._id },
                    withCredentials: true
                });

                const initialUserFollowState = currentUser.data.following.includes(responseData.data._id);
                setUserFollowed(initialUserFollowState);

            } catch ( error ) {
                setData(null);
                console.error('Error fetching initial data:', error);
            }
        };

        fetchInitialData();
    }, [id, user]);

    const toggleUserFollow = (id) => {
        const isCurrentlyFollowed = userFollowed[id]; // Lấy trạng thái hiện tại
        const apiUrl = isCurrentlyFollowed
            ? 'http://localhost:3030/api/user/unfollow' // Nếu đang like → unfollow
            : 'http://localhost:3030/api/user/follow';  // Nếu chưa like → follow

        axios.post(apiUrl, { anotherUserId: id }, { withCredentials: true })
            .then((response) => {
                toast.success(response.data.message);
                setUserFollowed(prevStates => ({
                    ...prevStates,
                    [id]: !isCurrentlyFollowed // Chỉ update state khi request thành công
                }));
            })
            .catch((err) => {
                toast.error(err.message);
            });
    };

    function formatNumber(num) {
        if ( num >= 1_000_000 ) {
            return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
        }
        if ( num >= 1_000 ) {
            return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
        }
        return num.toString();
    }

    // Hàm mở modal với tab followers
    const openFollowersModal = () => {
        setModalTab('followers');
        setIsModalOpen(true);
    };

    // Hàm mở modal với tab following
    const openFollowingModal = () => {
        setModalTab('following');
        setIsModalOpen(true);
    };

    return (
        <>
            { data && (
                <div className={ classNames }>
                    <div className="mt-10" key={ data._id }>
                        <a rel="noopener follow" href="#">
                            <div>
                                <Avatar username={ data.username } width={ 88 } height={ 88 } avatar={ data.ava } />
                            </div>
                        </a>
                        <div className="flex mt-4">
                            <a rel="noopener follow" href="#">
                                <h2 className="mr-4 text-base font-bold">{ data.username }</h2>
                            </a>
                            {
                                user._id === data._id ? (
                                    <a className="text-[#419d3f] hover:text-black" href={ `/home/setting` }>
                                        <span className="text-[13px]">Edit profile</span>
                                    </a>
                                ) : (
                                    <></>
                                )
                            }
                        </div>
                        <div className="mt-2 flex space-x-6">
                            <button className="text-[#6b6b6b] hover:text-black" onClick={ openFollowersModal }>
                                <h2 className="text-sm">{ formatNumber(data.followers.length) } Followers</h2>
                            </button>
                            <span>.</span>
                            <button className="text-[#6b6b6b] hover:text-black" onClick={ openFollowingModal }>
                                <h2 className="text-sm">{ formatNumber(data.following.length) } Following</h2>
                            </button>
                        </div>
                        <div className="mt-3">
                            <p className="text-sm text-[#6b6b6b]">{ data.bio }</p>
                        </div>
                        {
                            user._id === data._id ? (
                                <></>
                            ) : (
                                <>
                                    <div className="flex mt-6 mb-10">
                                        <button onClick={ () => toggleUserFollow(`${ data._id }`) }
                                                className={ `border-solid border-2 border-[#1c8a19] rounded-full px-4 py-2 text-sm right-0 transition-all ${ userFollowed ? 'text-[#1c8a19] hover:border-black hover:text-black' : 'text-white bg-[#1a8917] hover:bg-[#0f730c]' }` }>
                                            { userFollowed ? 'Following' : 'Follow' }
                                        </button>
                                    </div>
                                </>
                            )
                        }
                    </div>
                </div>
            ) }

            {/* Modal hiển thị followers và following */ }
            { data && (
                <FollowersFollowingModal
                    isOpen={ isModalOpen }
                    onClose={ () => setIsModalOpen(false) }
                    userId={ data._id }
                    initialTab={ modalTab }
                />
            ) }
        </>
    );
}

const FollowersFollowingModal = ({ isOpen, onClose, userId, initialTab }) => {
    const [activeTab, setActiveTab] = useState(initialTab || 'followers');
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userFollowedState, setUserFollowedState] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const { user } = useAuth();

    useEffect(() => {
        if ( isOpen ) {
            fetchFollowData();
        }
    }, [isOpen, userId]);

    const fetchFollowData = async () => {
        setLoading(true);
        try {
            // Lấy danh sách followers
            const followersResponse = await axios.get('http://localhost:3030/api/user/getuserfollower', {
                params: { userId },
                withCredentials: true
            });

            // Lấy danh sách following
            const followingResponse = await axios.get('http://localhost:3030/api/user/getuserfollowing', {
                params: { userId },
                withCredentials: true
            });

            setFollowers(followersResponse.data.followingUsers || []);
            setFollowing(followingResponse.data.followingUsers || []);

            // Chuẩn bị trạng thái theo dõi ban đầu
            const currentUserResponse = await axios.get('http://localhost:3030/api/user/getbyid', {
                params: { id: user._id },
                withCredentials: true
            });

            const followMap = {};

            // Đánh dấu tất cả người dùng mà user hiện tại đang theo dõi
            if ( currentUserResponse.data && currentUserResponse.data.following ) {
                currentUserResponse.data.following.forEach(followedId => {
                    followMap[followedId] = true;
                });
            }

            setUserFollowedState(followMap);
            setLoading(false);
        } catch ( error ) {
            console.error('Error fetching follow data:', error);
            toast.error('Không thể tải dữ liệu người dùng');
            setLoading(false);
        }
    };

    const toggleFollow = async (followUserId) => {
        const isCurrentlyFollowed = userFollowedState[followUserId];
        const apiUrl = isCurrentlyFollowed
            ? 'http://localhost:3030/api/user/unfollow'
            : 'http://localhost:3030/api/user/follow';

        try {
            const response = await axios.post(
                apiUrl,
                { anotherUserId: followUserId },
                { withCredentials: true }
            );

            toast.success(response.data.message);

            // Cập nhật state
            setUserFollowedState(prevState => ({
                ...prevState,
                [followUserId]: !isCurrentlyFollowed
            }));

            // Nếu đang bỏ theo dõi và đang ở tab following, cập nhật lại danh sách
            if ( isCurrentlyFollowed && activeTab === 'following' ) {
                fetchFollowData();
            }
        } catch ( error ) {
            toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
        }
    };

    const filteredList = () => {
        const list = activeTab === 'followers' ? followers : following;
        if ( !searchTerm ) return list;

        return list.filter(item =>
            item.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.bio && item.bio.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setSearchTerm('');
    };

    if ( !isOpen ) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-sm w-full max-w-md max-h-[80vh] flex flex-col h-full">
                {/* Modal header with tabs */ }
                <div className="border-b">
                    <div className="flex px-4">
                        <button
                            className={ `py-4 px-2 text-sm relative ${
                                activeTab === 'followers'
                                    ? 'text-black font-semibold'
                                    : 'text-gray-700 hover:text-gray-900'
                            }` }
                            onClick={ () => handleTabChange('followers') }
                        >
                            Followers ({ followers.length })
                            { activeTab === 'followers' && (
                                <div className="absolute bottom-0 left-0 w-full h-1 bg-black"></div>
                            ) }
                        </button>
                        <button
                            className={ `py-4 px-2 text-sm relative ${
                                activeTab === 'following'
                                    ? 'text-black font-semibold'
                                    : 'text-gray-700 hover:text-gray-900'
                            }` }
                            onClick={ () => handleTabChange('following') }
                        >
                            Following ({ following.length })
                            { activeTab === 'following' && (
                                <div className="absolute bottom-0 left-0 w-full h-1 bg-black"></div>
                            ) }
                        </button>
                        <div className="flex-grow"></div>
                        <button
                            onClick={ onClose }
                            className="p-4 text-gray-500 hover:text-black"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                                 fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                 strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Search box */ }
                <div className="p-4 border-b">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                            </svg>
                        </div>
                        <input
                            type="text"
                            className="w-full py-2 pl-10 pr-4 border focus:border-current border-transparent rounded-full text-sm font-customs focus:ring-0 outline-none focus:outline-none bg-gray-50"
                            placeholder={ `Search ${ activeTab }` }
                            value={ searchTerm }
                            onChange={ (e) => setSearchTerm(e.target.value) }
                        />
                    </div>
                </div>

                {/* User list */ }
                <div className="overflow-y-auto flex-1">
                    { loading ? (
                        <div className="flex justify-center items-center h-40">
                            <div
                                className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-800"></div>
                        </div>
                    ) : (
                        <div className="">
                            { filteredList().length > 0 ? (
                                <ul>
                                    { filteredList().map(person => (
                                        <li key={ person._id } className="px-4 py-3 hover:bg-gray-50">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0">
                                                    <Avatar
                                                        username={ person.username }
                                                        width={ 40 }
                                                        height={ 40 }
                                                        avatar={ person.ava }
                                                        className="rounded-full bg-gray-200"
                                                    />
                                                </div>
                                                <div className="ml-3 flex-grow">
                                                    <a href={ `/home/profile/${ person._id }` } className="block">
                                                        <p className="text-sm font-medium text-gray-900 font-customs">{ person.username }</p>
                                                        <p className="text-xs text-gray-500 truncate font-customs">{ person.bio || '' }</p>
                                                    </a>
                                                </div>
                                                { person._id !== user._id && (
                                                    <div className="ml-2">
                                                        <button onClick={ () => toggleFollow(person._id) }
                                                                className={ `border-solid border-2 border-[#1c8a19] rounded-full px-3 py-1 text-sm right-0 transition-all ${ userFollowedState[person._id] ? 'text-[#1c8a19] hover:border-black hover:text-black' : 'text-white bg-[#1a8917] hover:bg-[#0f730c]' }` }>
                                                            { userFollowedState[person._id] ? 'Following' : 'Follow' }
                                                        </button>
                                                    </div>
                                                ) }
                                            </div>
                                        </li>
                                    )) }
                                </ul>
                            ) : (
                                <div className="text-center p-8 text-gray-500">
                                    { searchTerm
                                        ? `Không tìm thấy kết quả cho "${ searchTerm }"`
                                        : `Không có ${ activeTab === 'followers' ? 'người theo dõi' : 'người đang theo dõi' } nào` }
                                </div>
                            ) }
                        </div>
                    ) }
                </div>
            </div>
        </div>
    );
};

export default ProfileSidebar;
