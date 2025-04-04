import clsx from 'clsx';
import sidebar from './sidebar.module.scss';
import { useEffect, useState } from 'react';
import Avatar from '~/components/partial/Avatar/avatar.component';
import axios from 'axios';
import { toast } from 'sonner';
import { useAuth } from '~/pages/Authen/authcontext';

function Sidebar() {
    const classNames = clsx(
        sidebar.sidebar,
        'lg:block hidden h-full sticky top-0'
    );

    const [data, setData] = useState(null);
    const [follow, setFollow] = useState({});
    const { user } = useAuth();

    const toggleLike = (id) => {
        const isCurrentlyFollowed = follow[id]; // Lấy trạng thái hiện tại
        const apiUrl = isCurrentlyFollowed
            ? 'http://localhost:3030/api/user/unfollow' // Nếu đang like → unfollow
            : 'http://localhost:3030/api/user/follow';  // Nếu chưa like → follow

        axios.post(apiUrl, { anotherUserId: id }, { withCredentials: true })
            .then((response) => {
                toast.success(response.data.message);
                setFollow(prevStates => ({
                    ...prevStates,
                    [id]: !isCurrentlyFollowed // Chỉ update state khi request thành công
                }));
            })
            .catch((err) => {
                toast.error(err.message);
            });
    };

    useEffect(() => {
        const fetchInitialData = async (user) => {
            try {
                const currentUser = await axios.get('http://localhost:3030/api/user/getbyemail', {
                    params: { email: user.email },
                    withCredentials: true
                });

                const responseData = await axios.get(`http://localhost:3030/api/user/getalluser`, { withCredentials: true });
                setData(responseData.data);

                const initialFollowState = responseData.data.reduce((acc, item) => {
                    acc[item._id] = currentUser.data.following.includes(item._id);
                    return acc;
                }, {});
                setFollow(initialFollowState);

            } catch ( error ) {
                console.error('Error fetching initial data:', error);
            }
        };

        fetchInitialData(user);
    }, [user]);

    // useEffect(() => {
    //   const fetchInitialData = async () => {
    //     try {
    //       const responseData = await UserApi.getAllUsers();
    //       setData(responseData);
    //       // Khởi tạo trạng thái like ban đầu
    //       const initialLikeState = responseData.reduce((acc, user) => {
    //         acc[user._id] = false; // Mặc định chưa like
    //         return acc;
    //       }, {});
    //       setLike(initialLikeState);
    //     } catch (error) {
    //       console.error("Error fetching initial data:", error);
    //     } finally {
    //       // setLoading(false); // Kết thúc loading dù thành công hay thất bại
    //     }
    //   };
    //
    //   fetchInitialData();
    // }, []);

    return (
        <>
            <div className={ classNames }>
                <div className="mt-10">
                    <div className="mb-5">
                        <a href="/#">
                            <h2 className="text-base font-bold">Staff Picks</h2>
                        </a>
                    </div>
                    <div className="">
                        <div className="pb-5">
                            <div className="mb-2">
                                <a href="/#">
                                    <div className="flex">
                                        <img
                                            alt="Poseidon"
                                            className="rounded-full"
                                            src="/ava.png"
                                            width="20"
                                            height="20"
                                            loading="lazy"
                                        />
                                        <div className="ml-2">
                                            <h4 className="text-xs">Riikka livanainen</h4>
                                        </div>
                                    </div>
                                </a>
                            </div>
                            <div>
                                <a href="/#">
                                    <h2 className="font-bold">
                                        The secret life of the people width high self-control(it's
                                        easier than you think)
                                    </h2>
                                </a>
                            </div>
                        </div>
                        <div className="pb-5">
                            <div className="mb-2">
                                <a href="/#">
                                    <div className="flex">
                                        <img
                                            alt="Poseidon"
                                            className="rounded-full"
                                            src="/ava.png"
                                            width="20"
                                            height="20"
                                            loading="lazy"
                                        />
                                        <div className="ml-2">
                                            <h4 className="text-xs">Riikka livanainen</h4>
                                        </div>
                                    </div>
                                </a>
                            </div>
                            <div>
                                <a href="/#">
                                    <h2 className="font-bold">
                                        The secret life of the people width high self-control(it's
                                        easier than you think)
                                    </h2>
                                </a>
                            </div>
                        </div>
                        <p className="text-sm">
                            <a className="text-[#419d3f] hover:text-black" href="/#">
                                See the full list
                            </a>
                        </p>
                    </div>
                </div>
                <div className="mt-10">
                    <div className="pb-4">
                        <h2 className="text-base font-bold">Recommended topics</h2>
                    </div>
                    <div className="relative flex flex-wrap">
                        <div
                            className="rounded-full w-fit px-4 py-2 mb-3 mr-2 hover:shadow-2xl transition-shadow hover:ring-2 hover:ring-gray-300 hover:ring-offset-2">
                            <a className="text-sm" href="/#">
                                Programming
                            </a>
                        </div>
                        <div
                            className="rounded-full w-fit px-4 py-2 mb-3 mr-2 hover:shadow-2xl transition-shadow hover:ring-2 hover:ring-gray-300 hover:ring-offset-2">
                            <a className="text-sm" href="/#">
                                Data Science
                            </a>
                        </div>
                        <div
                            className="rounded-full w-fit px-4 py-2 mb-3 mr-2 hover:shadow-2xl transition-shadow hover:ring-2 hover:ring-gray-300 hover:ring-offset-2">
                            <a className="text-sm" href="/#">
                                Technology
                            </a>
                        </div>
                        <div
                            className="rounded-full w-fit px-4 py-2 mb-3 mr-2 hover:shadow-2xl transition-shadow hover:ring-2 hover:ring-gray-300 hover:ring-offset-2">
                            <a className="text-sm" href="/#">
                                Writing
                            </a>
                        </div>
                        <div
                            className="rounded-full w-fit px-4 py-2 mb-3 mr-2 hover:shadow-2xl transition-shadow hover:ring-2 hover:ring-gray-300 hover:ring-offset-2">
                            <a className="text-sm" href="/#">
                                Relationships
                            </a>
                        </div>
                        <div
                            className="rounded-full w-fit px-4 py-2 mb-3 mr-2 hover:shadow-2xl transition-shadow hover:ring-2 hover:ring-gray-300 hover:ring-offset-2">
                            <a className="text-sm" href="/#">
                                Machine Learning
                            </a>
                        </div>
                    </div>
                    <p className="pt-3 text-sm">
                        <a className="text-[#419d3f] hover:text-black" href="/home/explore">
                            See more topics
                        </a>
                    </p>
                </div>
                <div className="mt-10">
                    <div className="">
                        <h2 className="text-base font-bold">who to follow</h2>
                    </div>
                    { data && (
                        <>
                            {
                                data
                                    .map((item, index) => (
                                        <div className="flex pt-4 place-items-center" key={ index }>
                                            <div className="flex mr-2">
                                                <a href="/#">
                                                    <div className="w-8 h-auto">
                                                        <Avatar username={ item.username } width={ 32 } height={ 32 } />
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
                                                            <p
                                                                className="w-40 overflow-hidden whitespace-nowrap overflow-ellipsis text-xs text-[#6b6b6b]">
                                                                { item.bio }
                                                            </p>
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={ () => toggleLike(`${ item._id }`) }
                                                className={ `ring-2 ring-[#6b6b6b] hover:ring-offset-2 hover:ring-black rounded-full px-3 py-1 text-sm transition-all ease-in-out ${ follow[item._id] ? 'bg-black text-white' : '' }` }>
                                                { follow[item._id] ? 'Following' : 'Follow' }
                                            </button>
                                        </div>
                                    )) }
                        </>
                    ) }
                    <p className="pt-6 text-sm">
                        <a className="text-[#419d3f] hover:text-black" href="/home/refine/suggestion">
                            See more suggestions
                        </a>
                    </p>
                </div>
            </div>
        </>
    );
}

export default Sidebar;
