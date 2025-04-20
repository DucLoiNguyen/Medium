import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import axios from 'axios';

function Register() {
    const [searchParams] = useSearchParams();
    const step = searchParams.get('step') || '1';
    const email = searchParams.get('email');
    const password = searchParams.get('password');

    switch ( step ) {
        case '1':
            return <EmailForm />;
        case '2':
            return <PasswordForm email={ email } />;
        case '3':
            return <UserForm email={ email } password={ password } />;
        case '4':
            return <TopicForm />;
        default:
            return <EmailForm />;
    }
}

const EmailForm = () => {
    const [email, setEmail] = useState('');
    const [isExist, setIsExist] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const res = await axios.post('http://localhost:3030/api/auth/check-email', { email }, { withCredentials: true });
            setIsExist(res.data.exist);

            if ( isExist ) {
                toast.error(res.data.message);
            } else {
                navigate(`/register?step=2&email=${ encodeURIComponent(email) }`, { replace: true });
            }

        } catch ( error ) {
            toast.error(error.response.data.message);
        }
    };

    return (
        <>
            <div>
                <h2 className="text-center font-customs2 text-3xl">Join Medium.</h2>
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
                    <button
                        type="submit"
                        className="text-white bg-black hover:opacity-75 focus:ring-4 focus:outline-none focus:ring-black font-medium rounded-full text-sm w-full sm:w-auto px-5 py-2.5 mt-6 text-center"
                    >
                        Continue
                    </button>
                    <span className="mt-4 text-center text-sm">Already have an account? <a href="/sign-in"
                                                                                           className="text-[#1a8917] hover:text-gray-900">Sign in here</a>
                    </span>
                </form>
            </div>
        </>
    );
};

const PasswordForm = ({ email }) => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        if ( password !== confirmPassword ) {
            toast.error('Passwords do not match.');
            return;
        }

        navigate(`/register?step=3&email=${ encodeURIComponent(email) }&password=${ encodeURIComponent(password) }`, { replace: true });
    };

    return (
        <>
            <div>
                <h2 className="text-center font-customs2 text-3xl">Join Medium.</h2>
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
                            onChange={ (e) => setPassword(e.target.value) }
                        />
                        <label
                            htmlFor="password"
                            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-black peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                        >
                            Password
                        </label>
                    </div>
                    <div className="relative z-0 w-full mb-5 group">
                        <input
                            type="password"
                            name="confirmPassword"
                            id="confirmPassword"
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-black peer"
                            placeholder=" "
                            required
                            onChange={ (e) => setConfirmPassword(e.target.value) }
                        />
                        <label
                            htmlFor="password"
                            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-black peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                        >
                            Confirm Password
                        </label>
                    </div>
                    <div className="flex space-x-8">
                        <a href="/register"
                           className="text-white bg-black hover:opacity-75 focus:ring-4 focus:outline-none focus:ring-black font-medium rounded-full text-sm w-full sm:w-auto px-5 py-2.5 mt-6 text-center">Back</a>
                        <button
                            type="submit"
                            className="text-white bg-black hover:opacity-75 focus:ring-4 focus:outline-none focus:ring-black font-medium rounded-full text-sm w-full sm:w-auto px-5 py-2.5 mt-6 text-center"
                        >
                            Continue
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

const UserForm = ({ email, password }) => {
    const [formData, setFormData] = useState({
        username: '',
        address: '',
        phone: ''
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const query = new URLSearchParams({ ...formData, email, password }).toString();
        navigate(`/register?step=4&${ query }`, { replace: true });
    };

    return (
        <>
            <div>
                <h2 className="text-center font-customs2 text-3xl">Your information.</h2>
            </div>
            <div className="py-11 px-14">
                <form className="max-w-md mx-auto grid justify-items-center" onSubmit={ handleSubmit }>
                    <div className="relative z-0 w-full mb-5 group">
                        <input
                            type="text"
                            name="username"
                            id="username"
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-black peer"
                            placeholder=" "
                            required
                            onChange={ handleChange }
                        />
                        <label
                            htmlFor="username"
                            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-black peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                        >
                            Name
                        </label>
                    </div>
                    <div className="relative z-0 w-full mb-5 group">
                        <input
                            type="text"
                            name="address"
                            id="address"
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-black peer"
                            placeholder=" "
                            required
                            onChange={ handleChange }
                        />
                        <label
                            htmlFor="address"
                            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-black peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                        >
                            Address
                        </label>
                    </div>
                    <div className="relative z-0 w-full mb-5 group">
                        <input
                            type="text"
                            name="phone"
                            id="phone"
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-black peer"
                            placeholder=" "
                            required
                            onChange={ handleChange }
                        />
                        <label
                            htmlFor="phone"
                            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-black peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                        >
                            Phone Number
                        </label>
                    </div>
                    <div className="flex space-x-8">
                        <a href="/register?step=2"
                           className="text-white bg-black hover:opacity-75 focus:ring-4 focus:outline-none focus:ring-black font-medium rounded-full text-sm w-full sm:w-auto px-5 py-2.5 mt-6 text-center">Back</a>
                        <button
                            type="submit"
                            className="text-white bg-black hover:opacity-75 focus:ring-4 focus:outline-none focus:ring-black font-medium rounded-full text-sm w-full sm:w-auto px-5 py-2.5 mt-6 text-center"
                        >
                            Continue
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

const TopicForm = () => {
    const [searchParams] = useSearchParams();
    const email = searchParams.get('email');
    const password = searchParams.get('password');
    const username = searchParams.get('username');
    const address = searchParams.get('address');
    const phone = searchParams.get('phone');

    const data = {
        email, password, username, address, phone
    };

    const [selectedTopics, setSelectedTopics] = useState([]);
    const [topics, setTopics] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTopics = async () => {
            try {
                const response = await axios.get(`http://localhost:3030/api/topic/getalltag`, { withCredentials: true });
                setTopics(response.data);
            } catch ( err ) {
                toast.error(err.response.data.message);
            }
        };

        fetchTopics();
    }, []);

    const toggleTopic = (topicId) => {
        setSelectedTopics((prevSelected) =>
            prevSelected.includes(topicId)
                ? prevSelected.filter((id) => id !== topicId)
                : [...prevSelected, topicId]
        );
    };

    const handleContinue = async () => {
        try {
            const response = await axios.post('http://localhost:3030/api/auth/register', {
                ...data,
                tagFollowing: selectedTopics
            }, { withCredentials: true });
            toast.success(response.data.message);

            navigate('/sign-in', { replace: true });
        } catch ( err ) {
            toast.error(err.response.data.message);
        }
    };

    const scrollableContainerClass = `
    z-0 flex flex-wrap gap-3 overflow-hidden hover:overflow-y-scroll max-h-96 transition-all py-8 scrollbar-hide`;

    return (
        <>
            {/* Thêm CSS để ẩn thanh cuộn */ }
            <style jsx>{ `
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }

                .scrollbar-hide {
                    -ms-overflow-style: none; /* IE and Edge */
                    scrollbar-width: none; /* Firefox */
                }
            ` }</style>


            <div>
                <h2 className="text-center font-customs2 text-3xl">Let pick your story topics</h2>
                <p className="text-center font-customs text-sm text-[#6b6b6b]">Choose at least 3 topics so we can
                    personalize content for you.</p>
            </div>
            <div className="py-11 px-14">
                <div className="max-w-2xl mx-auto">
                    <div className="relative">
                        <div
                            className="absolute top-0 left-0 mx-auto bg-gradient-to-b from-white w-full h-10 z-10"></div>
                        <div
                            className={ scrollableContainerClass }>
                            { topics.map((topic) => (
                                <button
                                    key={ topic._id }
                                    onClick={ () => toggleTopic(topic._id) }
                                    className={ `flex flex-col items-center justify-center px-4 py-2 rounded-full transition-all ${
                                        selectedTopics.includes(topic._id)
                                            ? 'border-2 border-[#1a8917]'
                                            : 'border-2 border-gray-100 bg-gray-100 hover:bg-gray-200'
                                    }` }
                                >
                                    <span className="text-sm font-medium text-center">{ topic.tag }</span>
                                </button>
                            )) }
                        </div>
                        <div
                            className="absolute bottom-0 left-0 mx-auto bg-gradient-to-t from-white w-full h-10 z-10"></div>
                    </div>
                    <div className="mt-6 text-center">
                        <p className="text-gray-500 text-sm">
                            Đã chọn { selectedTopics.length } chủ đề
                            { selectedTopics.length < 3 && ` (còn thiếu ${ 3 - selectedTopics.length })` }
                        </p>
                        <div className="mt-2 flex items-center justify-center gap-1">
                            { [...Array(Math.min(selectedTopics.length, 3))].map((_, i) => (
                                <div key={ i } className="h-2 w-8 bg-[#1a8917] rounded-full"></div>
                            )) }
                            { [...Array(Math.max(3 - selectedTopics.length, 0))].map((_, i) => (
                                <div key={ i } className="h-2 w-8 bg-gray-300 rounded-full"></div>
                            )) }
                        </div>
                    </div>
                    <div className="flex items-center justify-between mt-6">
                        <button
                            onClick={ handleContinue }
                            disabled={ selectedTopics.length < 3 }
                            className={ `px-5 py-2.5 rounded-full font-medium text-sm ${
                                selectedTopics.length >= 3
                                    ? 'bg-black text-white hover:opacity-75'
                                    : 'bg-gray-100 text-gray-500 cursor-not-allowed'
                            }` }
                        >
                            Done
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Register;