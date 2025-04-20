import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import axios from 'axios';
import Avatar from '~/components/partial/Avatar/avatar.component';
import { useAuth } from '~/pages/Authen/authcontext';

function Follow() {
    const [userFollowing, setUserFollowing] = useState(null);
    const [topicFollowing, setTopicFollowing] = useState(null);
    const [userFollowed, setUserFollowed] = useState({});
    const [topicFollowed, setTopicFollowed] = useState({});
    const { user } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const responseUserFollowing = await axios.get('http://localhost:3030/api/user/getuserfollowing', {
                    params: { userId: user._id },
                    withCredentials: true
                });
                setUserFollowing(responseUserFollowing.data);

                const responseTopicFollowing = await axios.get('http://localhost:3030/api/user/gettopicfollowing', {
                    params: { userId: user._id },
                    withCredentials: true
                });
                setTopicFollowing(responseTopicFollowing.data);

                const currentUser = await axios.get('http://localhost:3030/api/user/getbyid', {
                    params: { id: user._id },
                    withCredentials: true
                });

                const initialUserFollowState = responseUserFollowing.data.followingUsers.reduce((acc, item) => {
                    acc[item._id] = currentUser.data.following.includes(item._id);
                    return acc;
                }, {});
                setUserFollowed(initialUserFollowState);

                let topictagfollowing = [...currentUser.data.topicFollowing, ...currentUser.data.tagFollowing];
                const initialTopicFollowState = responseTopicFollowing.data.reduce((acc, item) => {
                    acc[item._id] = topictagfollowing.includes(item._id);
                    return acc;
                }, {});
                setTopicFollowed(initialTopicFollowState);

            } catch ( err ) {
                setUserFollowing(null);
                setTopicFollowing(null);
                setUserFollowed({});
                setTopicFollowed({});
                toast.error(err.message);
            }
        };

        fetchData();
    }, [user]);

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

    const toggleTopicFollow = (id) => {
        const isCurrentlyFollowed = topicFollowed[id]; // Lấy trạng thái hiện tại
        const apiUrl = isCurrentlyFollowed
            ? 'http://localhost:3030/api/tag/unfollow' // Nếu đang like → unfollow
            : 'http://localhost:3030/api/tag/follow';  // Nếu chưa like → follow

        axios.post(apiUrl, { topicId: id, tagId: id }, { withCredentials: true })
            .then((response) => {
                toast.success(response.data.message);
                setTopicFollowed(prevStates => ({
                    ...prevStates,
                    [id]: !isCurrentlyFollowed // Chỉ update state khi request thành công
                }));
            })
            .catch((err) => {
                toast.error(err.message);
            });
    };

    return (
        <>
            <div className="divide-y divide-solid">
                <div className="mb-12">
                    <h2 className="font-bold text-base">{ userFollowing?.followingCount } Writer</h2>
                    <div className="mt-4 mb-6 w-full">
                        { userFollowing && userFollowing.followingUsers.map((item) => (
                            <div className="flex pt-4 place-items-center">
                                <div className="flex w-full">
                                    <a href="/#">
                                        <div className="w-12 h-auto">
                                            <Avatar avatar={ item.ava } username={ item.username } height={ 48 }
                                                    width={ 48 } />
                                        </div>
                                    </a>
                                    <div className="ml-4 mr-2">
                                        <div>
                                            <a href="/#">
                                                <h2 className="text-base font-bold">{ item.username }</h2>
                                            </a>
                                        </div>
                                        <div>
                                            <a href="/#">
                                                <p className="w-96 overflow-hidden text-sm whitespace-nowrap overflow-ellipsis">
                                                    { item.bio }
                                                </p>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={ () => toggleUserFollow(`${ item._id }`) }
                                        className={ `border-solid border-2 border-[#1c8a19] rounded-full px-3 py-1 text-sm right-0 transition-all ${ userFollowed[item._id] ? 'text-[#1c8a19] hover:border-black hover:text-black' : 'text-white bg-[#1a8917] hover:bg-[#0f730c]' }` }>
                                    { userFollowed[item._id] ? 'Following' : 'Follow' }
                                </button>
                            </div>
                        )) }
                    </div>
                </div>
                <div className="mb-12">
                    <h2 className="font-bold text-base">{ topicFollowing?.length } Topic</h2>
                    <div className="mt-4 mb-6 w-full">
                        { topicFollowing && topicFollowing.map((item) => (
                            <div className="flex pt-4 place-items-center">
                                <div className="flex w-full">
                                    <a href="/#">
                                        <div
                                            className="w-12 h-12 rounded-full bg-[#f2f2f2] flex justify-center place-items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none"
                                                 viewBox="0 0 16 16" className="jw">
                                                <path fill="currentColor" fillRule="evenodd"
                                                      d="M3 14V2h10v12zM2.75 1a.75.75 0 0 0-.75.75v12.5c0 .414.336.75.75.75h10.5a.75.75 0 0 0 .75-.75V1.75a.75.75 0 0 0-.75-.75zM5 10.5a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1zM4.5 9a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5m1.25-2.5h4.5a.25.25 0 0 0 .25-.25v-1.5a.25.25 0 0 0-.25-.25h-4.5a.25.25 0 0 0-.25.25v1.5c0 .138.112.25.25.25"
                                                      clipRule="evenodd"></path>
                                            </svg>
                                        </div>
                                    </a>
                                    <div className="ml-4 mr-2">
                                        <div>
                                            <a href={ `/home/tag/${ item.tag }` }>
                                                <h2 className="text-base font-bold">{ item.tag }</h2>
                                            </a>
                                        </div>
                                        <div>
                                            <a href={ `/home/tag/${ item.tag }` }>
                                                <p className="w-96 overflow-hidden text-sm whitespace-nowrap overflow-ellipsis divide-x divide-dotted">
                                                    <span
                                                        className="text-[#6b6b6b] mx-2">{ item.followers } Followers</span>
                                                </p>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={ () => toggleTopicFollow(`${ item._id }`) }
                                        className={ `border-solid border-2 border-[#1c8a19] rounded-full px-3 py-1 text-sm right-0 transition-all ${ topicFollowed[item._id] ? 'text-[#1c8a19] hover:border-black hover:text-black' : 'text-white bg-[#1a8917] hover:bg-[#0f730c]' }` }>
                                    { topicFollowed[item._id] ? 'Following' : 'Follow' }
                                </button>
                            </div>
                        )) }
                    </div>
                </div>
            </div>
        </>
    );
}

export default Follow;
