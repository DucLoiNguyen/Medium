import { useEffect, useState } from 'react';
import { useAuth } from '~/pages/Authen/authcontext';
import axios from 'axios';
import Avatar from '~/components/partial/Avatar/avatar.component';
import ProfileInfoModal from '~/pages/Setting/updateinfomodal';
import Loading_spinner from '~/components/partial/Loading_spinner/loading_spinner.component';

function Info() {
    const [data, setData] = useState(null);
    const [modalState, setModalState] = useState({
        open: false,
        type: null
    });
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const responseData = await axios.get('http://localhost:3030/api/user/getbyid', {
                    params: { id: user._id },
                    withCredentials: true
                });
                setData(responseData.data);
            } catch ( error ) {
                console.error('Error fetching initial data:', error);
            }
        };

        fetchInitialData();
    }, [user._id]);

    const handleSignout = async () => {
        if ( isLoading ) return <Loading_spinner />;

        setIsLoading(true);
        try {
            await axios.get('http://localhost:3030/api/auth/logout', { withCredentials: true });
        } catch ( error ) {
            console.error('Lỗi khi đăng xuất:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            { data && (
                <div className="divide-y">
                    <div className="my-14">
                        <button onClick={ () => setModalState({ open: true, type: 'other' }) }
                                className="text-[#6b6b6b] hover:text-black my-8 text-right w-full flex justify-between text-sm">
                            <span className="mr-4 text-black">Email address</span>
                            <span className="truncate max-w-[100px] md:max-w-[250px]">{ data.email }</span>
                        </button>
                        <button onClick={ () => setModalState({ open: true, type: 'other' }) }
                                className="text-[#6b6b6b] hover:text-black my-8 text-right w-full flex justify-between text-sm">
                            <span className="mr-4 text-black">User name</span>
                            <span className="truncate max-w-[100px] md:max-w-[250px]">{ data.subdomain }</span>
                        </button>
                        <button onClick={ () => setModalState({ open: true, type: 'other' }) }
                                className="text-[#6b6b6b] hover:text-black my-8 text-right w-full flex justify-between text-sm">
                            <span className="mr-4 text-black">Living at</span>
                            <span className="truncate max-w-[100px] md:max-w-[250px]">{ data.address }</span>
                        </button>
                        <button onClick={ () => setModalState({ open: true, type: 'other' }) }
                                className="text-[#6b6b6b] hover:text-black my-8 text-right w-full flex justify-between text-sm">
                            <span className="mr-4 text-black">Phone</span>
                            <span className="truncate max-w-[100px] md:max-w-[250px]">{ data.phone }</span>
                        </button>
                        <button onClick={ () => setModalState({ open: true, type: 'profile' }) }
                                className="text-[#6b6b6b] hover:text-black my-8 text-right w-full flex justify-between text-sm">
                            <span className="mr-4 text-black">Profile informations</span>
                            <span className="truncate max-w-[100px] md:max-w-[250px] flex">
                                <span>Poseidon</span>
                                <span className="ml-3">
                                  <Avatar username={ data.username } width={ 24 } height={ 24 } avatar={ data.ava } />
                                </span>
                            </span>
                        </button>
                    </div>
                    {/*<div className="my-14">*/ }
                    {/*    <button*/ }
                    {/*        className="text-[#6b6b6b] hover:text-black my-8 text-right w-full flex justify-between text-sm">*/ }
                    {/*        <span className="mr-4 text-black">Blocked users</span>*/ }
                    {/*        <span className="truncate max-w-[100px] md:max-w-[250px] flex">*/ }
                    {/*            <span className="ml-3">*/ }
                    {/*                <svg*/ }
                    {/*                    width="12"*/ }
                    {/*                    height="12"*/ }
                    {/*                    viewBox="0 0 12 12"*/ }
                    {/*                    fill="currentColor"*/ }
                    {/*                    data-settings-arrow="true"*/ }
                    {/*                >*/ }
                    {/*                  <path*/ }
                    {/*                      d="M.65 10.65a.5.5 0 0 0 .7.7l-.7-.7zM11 1h.5a.5.5 0 0 0-.5-.5V1zm-.5 7a.5.5 0 0 0 1 0h-1zM4 .5a.5.5 0 0 0 0 1v-1zM1.35 11.35l10-10-.7-.7-10 10 .7.7zM10.5 1v7h1V1h-1zM4 1.5h7v-1H4v1z"*/ }
                    {/*                      fill="curnetColor"*/ }
                    {/*                  ></path>*/ }
                    {/*                </svg>*/ }
                    {/*            </span>*/ }
                    {/*        </span>*/ }
                    {/*    </button>*/ }
                    {/*</div>*/ }
                    <form className="my-14" onSubmit={ handleSignout }>
                        <button
                            className="text-[#c94a4a] hover:text-red my-8 text-right flex justify-between text-sm w-full"
                            type="submit">
                            <span className="mr-4">Sign out</span>
                            <span>→</span>
                        </button>
                    </form>
                </div>
            ) }

            <ProfileInfoModal
                isOpen={ modalState.open }
                type={ modalState.type }
                close={ () => setModalState({ open: false, type: null }) }
            />
        </>
    );
}

export default Info;
