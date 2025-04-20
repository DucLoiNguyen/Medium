import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // Khởi tạo hook useNavigate

    // Xử lý khi gửi form
    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            await axios.post('http://localhost:3030/api/auth/login', {
                email: email,
                password: password
            }, { withCredentials: true });
            navigate('/home', { replace: true });
        } catch ( error ) {
            toast.error(error.response.data.message);
            console.log(error);
        }
    };

    return (
        <>
            <div>
                <h2 className="text-center font-customs2 text-3xl">Welcome back.</h2>
            </div>
            <div className="py-11 px-14">
                <form className="max-w-md mx-auto grid justify-items-center" onSubmit={ handleSubmit }>
                    <div className="relative z-0 w-full mb-5 group">
                        <input
                            type="email"
                            name="email"
                            id="email"
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-black peer"
                            placeholder=" "
                            required
                            onChange={ (e) => setEmail(e.target.value) }
                        />
                        <label
                            htmlFor="email"
                            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-black peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                        >
                            Email address
                        </label>
                    </div>
                    <div className="relative z-0 w-full mb-5 group">
                        <input
                            type="password"
                            name="password"
                            id="password"
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-black peer"
                            placeholder=" "
                            required
                            onChange={ (e) => setPassword(e.target.value) }
                        />
                        <label
                            htmlFor="password"
                            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-black peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                        >
                            Password
                        </label>
                    </div>
                    <span className="text-sm w-full">
                        <a href="/forgot-password" className="text-[#1a8917] hover:text-gray-900">Forgot password</a>
                    </span>
                    <button
                        type="submit"
                        className="text-white bg-black hover:opacity-75 focus:ring-4 focus:outline-none focus:ring-black font-medium rounded-full text-sm w-full sm:w-auto px-5 py-2.5 mt-6 text-center"
                    >
                        Sign In
                    </button>
                    <span className="mt-4 text-center text-sm">Don't hav account yet? <a href="/register"
                                                                                         className="text-[#1a8917] hover:text-gray-900">Create here</a>
                    </span>
                </form>
            </div>
        </>
    );
}

export default Login;
