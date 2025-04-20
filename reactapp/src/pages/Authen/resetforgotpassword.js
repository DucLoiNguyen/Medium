import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

function ResetForgotPassword() {
    const [newPassword, setnewPassword] = useState('');
    const [isValid, setIsValid] = useState(null);
    const sessionId = new URLSearchParams(window.location.search).get('sessionId');

    useEffect(async () => {
        try {
            const res = await axios.get('http://localhost:3030/api/auth/validate-reset-session', {
                params: { sessionId },
                withCredentials: true
            });
            setIsValid(res.data.valid);

        } catch ( err ) {
            toast.error(err.message);
        }
    }, [sessionId]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            await axios.post('http://localhost:3030/api/auth/reset-pass', {
                newPassword,
                sessionId
            }, { withCredentials: true });
        } catch ( err ) {
            toast.error(err.message);
        }
    };

    if ( !isValid ) {
        return (<>
            <div className="w-full h-screen relative">
                <p className="absolute inset-0 text-center text-2xl font-customs2">Your password reset session is no
                    longer valid or may have expired.</p>
            </div>
        </>);
    }

    return (
        <>
            <div>
                <h2 className="text-center font-customs2 text-3xl">Reset your password</h2>
                <p className="text-center font-customs text-sm text-[#6b6b6b]">Enter your new password</p>
            </div>
            <div className="py-11 px-14">
                <form className="max-w-md mx-auto grid justify-items-center" onSubmit={ handleSubmit }>
                    <div className="relative z-0 w-full mb-5 group">
                        <input
                            type="password"
                            name="password"
                            id="password"
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-black peer"
                            placeholder=" "
                            required
                            onChange={ (e) => setnewPassword(e.target.value) }
                        />
                        <label
                            htmlFor="password"
                            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-black peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                        >
                            Password
                        </label>
                    </div>
                    <button
                        type="submit"
                        className="text-white bg-black hover:opacity-75 focus:ring-4 focus:outline-none focus:ring-black font-medium rounded-full text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                    >
                        Reset
                    </button>
                </form>
            </div>
        </>
    );
}

export default ResetForgotPassword;