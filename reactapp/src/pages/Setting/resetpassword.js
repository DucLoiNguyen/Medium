import { Dialog } from '@headlessui/react';
import { useEffect, useState } from 'react';
import { useAuth } from '~/pages/Authen/authcontext';
import axios from 'axios';

const ResetPassModal = ({ isOpen, close }) => {
    return (
        <>
            <Dialog open={ isOpen } as="div" className="relative z-10 focus:outline-none font-customs"
                    onClose={ close }>
                <div className="fixed inset-0 bg-black/30 backdrop-blur-xs z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <Dialog.Panel
                            className="w-[540px] bg-white p-8 z-50 relative shadow-2xl"
                        >
                            {/* Title */ }
                            <Dialog.Title className="text-center text-xl font-bold mb-6">
                                Reset your password
                            </Dialog.Title>

                            {/*Forms*/ }
                            <CurrentPassForm close={ close } />

                        </Dialog.Panel>
                    </div>
                </div>
            </Dialog>
        </>
    );
};

const CurrentPassForm = ({ close }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [email, setEmail] = useState('');
    const [checkPassword, setCheckPassword] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const responseData = await axios.get('http://localhost:3030/api/user/getbyid', {
                    params: { id: user._id },
                    withCredentials: true
                });
                setEmail(responseData.data.email);
            } catch ( error ) {
                console.error('Error fetching initial data:', error);
            }
        };

        fetchInitialData();
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3030/api/auth/check-pass', {
                email, password: currentPassword
            }, { withCredentials: true });
            setCheckPassword(response.data.exist);
        } catch ( err ) {
            console.log(err);
        }
    };

    if ( checkPassword ) {
        return (
            <NewPasswordForm close={ close } />
        );
    }

    return (<>
        <form onSubmit={ handleSubmit }>
            {/* Current password Field */ }
            <div className="mb-6">
                <label className="block text-sm mb-2">
                    Current password<span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    value={ currentPassword }
                    onChange={ (e) => setCurrentPassword(e.target.value) }
                    className="w-full p-2 border focus:border-current border-transparent rounded-md text-sm font-customs focus:ring-0 outline-none focus:outline-none bg-gray-50"
                    placeholder="Your current password"
                />
            </div>

            {/* Action Buttons */ }
            <div className="mt-6 flex items-center justify-end gap-x-6">
                <button
                    type="button"
                    onClick={ close }
                    className="text-sm text-gray-900 px-4 py-1 ring-2 ring-[#6b6b6b] hover:ring-offset-2 hover:ring-black rounded-full transition-all ease-in-out"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-4 py-1 bg-[#1a8917] rounded-full text-sm text-white hover:bg-[#0f730c] ring-2 ring-[#1a8917] hover:ring-offset-2 hover:ring-[#0f730c] transition-all ease-in-out"
                >
                    submit
                </button>
            </div>
        </form>
    </>);
};

const NewPasswordForm = ({ close }) => {
    const [email, setEmail] = useState('');
    const [newPass, setNewPass] = useState('');
    const [newPassConfirm, setNewPassConfirm] = useState('');
    const { user } = useAuth();

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const responseData = await axios.get('http://localhost:3030/api/user/getbyid', {
                    params: { id: user._id },
                    withCredentials: true
                });
                setEmail(responseData.data.email);
            } catch ( error ) {
                console.error('Error fetching initial data:', error);
            }
        };

        fetchInitialData();
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.patch('http://localhost:3030/api/auth/change-password', {
                email, password: newPass
            }, { withCredentials: true });

            close();
        } catch ( err ) {
            console.log(err);
        }
    };

    return (<>
        <form onSubmit={ handleSubmit }>
            {/* New Password Field */ }
            <div className="mb-6">
                <label className="block text-sm mb-2">
                    New password<span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    value={ newPass }
                    onChange={ (e) => setNewPass(e.target.value) }
                    className="w-full p-2 border focus:border-current border-transparent rounded-md text-sm font-customs focus:ring-0 outline-none focus:outline-none bg-gray-50"
                    placeholder="Your new password"
                />
            </div>

            {/* New Password Field */ }
            <div className="mb-6">
                <label className="block text-sm mb-2">
                    Confirm new password<span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    value={ newPassConfirm }
                    onChange={ (e) => setNewPassConfirm(e.target.value) }
                    className="w-full p-2 border focus:border-current border-transparent rounded-md text-sm font-customs focus:ring-0 outline-none focus:outline-none bg-gray-50"
                    placeholder="Confirm your new password"
                />
            </div>

            {/* Action Buttons */ }
            <div className="mt-6 flex items-center justify-end gap-x-6">
                <button
                    type="button"
                    onClick={ close }
                    className="text-sm text-gray-900 px-4 py-1 ring-2 ring-[#6b6b6b] hover:ring-offset-2 hover:ring-black rounded-full transition-all ease-in-out"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-4 py-1 bg-[#1a8917] rounded-full text-sm text-white hover:bg-[#0f730c] ring-2 ring-[#1a8917] hover:ring-offset-2 hover:ring-[#0f730c] transition-all ease-in-out"
                >
                    Save
                </button>
            </div>
        </form>
    </>);
};

export default ResetPassModal;