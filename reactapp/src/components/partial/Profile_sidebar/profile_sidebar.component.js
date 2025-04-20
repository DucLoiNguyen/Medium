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
    }, [id]);

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

    return (
        <>
            { data && (
                <div className={ classNames }>
                    <div className="mt-10" key={ data._id }>
                        <a rel="noopener follow" href="#">
                            <div>
                                <Avatar username={ data.username } width={ 88 } height={ 88 } />
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
                            <a className="text-[#6b6b6b] hover:text-black" href="#">
                                <h2 className="text-sm">{ formatNumber(data.followers.length) } Followers</h2>
                            </a>
                            <span>.</span>
                            <a className="text-[#6b6b6b] hover:text-black" href="#">
                                <h2 className="text-sm">{ formatNumber(data.following.length) } Following</h2>
                            </a>
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
        </>
    );
}

export default ProfileSidebar;
