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
    const [formData, setFormData] = useState({
        email: ''
    });
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isExist, setIsExist] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);
    const navigate = useNavigate();

    const validate = (name, value) => {
        let error = '';
        let valid = true;

        if ( name === 'email' ) {
            if ( !value ) {
                error = 'Email is required';
                valid = false;
            } else if ( !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value) ) {
                error = 'Invalid email address';
            }
        }

        setErrors(error);
        setIsFormValid(valid);
        return error;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Validate on change if field has been touched
        if ( touched[name] ) {
            const error = validate(name, value);
            setErrors(prev => ({
                ...prev,
                [name]: error
            }));
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;

        // Mark field as touched
        setTouched(prev => ({
            ...prev,
            [name]: true
        }));

        // Validate on blur
        const error = validate(name, value);
        setErrors(prev => ({
            ...prev,
            [name]: error
        }));
    };

    const shouldShowError = (fieldName) => {
        return touched[fieldName] && errors[fieldName];
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Mark all fields as touched
        setTouched({
            email: true
        });

        // Validate all fields
        const emailError = validate('email', formData.email);

        const newErrors = {
            email: emailError
        };

        setErrors(newErrors);

        // Check if there are any errors
        if ( emailError ) {
            toast.error(emailError);
            return;
        }

        try {
            setIsSubmitting(true);
            const res = await axios.post(
                'http://localhost:3030/api/auth/check-email',
                { email: formData.email },
                { withCredentials: true }
            );
            setIsExist(res.data.exist);

            if ( res.data.exist ) {
                toast.error(res.data.message);
            } else {
                navigate(`/register?step=2&email=${ encodeURIComponent(formData.email) }`, { replace: true });
            }
        } catch ( error ) {
            toast.error(error.response?.data?.message || 'An error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
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
                            className={ `block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 ${
                                shouldShowError('email') ? 'border-red-500' : 'border-gray-300'
                            } appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 ${
                                shouldShowError('email') ? 'focus:border-red-500' : 'focus:border-black'
                            } peer` }
                            placeholder=" "
                            required
                            value={ formData.email }
                            onChange={ handleChange }
                            onBlur={ handleBlur }
                        />
                        <label
                            htmlFor="email"
                            className={ `peer-focus:font-medium absolute text-sm ${
                                shouldShowError('email') ? 'text-red-500' : 'text-gray-500'
                            } dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:${
                                shouldShowError('email') ? 'text-red-500' : 'text-black'
                            } peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6` }
                        >
                            Email address
                        </label>
                        { shouldShowError('email') && (
                            <p className="mt-1 text-xs text-red-500">{ errors.email }</p>
                        ) }
                    </div>
                    <button
                        type="submit"
                        className={ `text-white ${ isFormValid ? 'bg-black hover:opacity-75' : 'bg-gray-400' } focus:ring-4 focus:outline-none focus:ring-black font-medium rounded-full text-sm w-full sm:w-auto px-5 py-2.5 mt-6 text-center` }
                        disabled={ isSubmitting && !isFormValid }
                    >
                        { isSubmitting ? 'Checking...' : 'Continue' }
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
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isFormValid, setIsFormValid] = useState(false);
    const navigate = useNavigate();

    const validate = (name, value) => {
        let error = '';
        let valid = true;

        if ( name === 'password' ) {
            if ( !value ) {
                error = 'Password is required';
                valid = false;
            } else if ( value.length < 6 ) {
                error = 'Password must be at least 6 characters long';
            }

            // Also validate confirmPassword if it's been touched
            if ( touched.confirmPassword && value !== formData.confirmPassword ) {
                setErrors(prev => ({
                    ...prev,
                    confirmPassword: 'Passwords do not match'
                }));
            } else if ( touched.confirmPassword && value === formData.confirmPassword ) {
                setErrors(prev => ({
                    ...prev,
                    confirmPassword: ''
                }));
            }
        }

        if ( name === 'confirmPassword' ) {
            if ( !value ) {
                error = 'Please confirm your password';
                valid = false;
            } else if ( value !== formData.password ) {
                error = 'Passwords do not match';
            }
        }

        setErrors(error);
        setIsFormValid(valid);
        return error;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Validate on change if field has been touched
        if ( touched[name] ) {
            const error = validate(name, value);
            setErrors(prev => ({
                ...prev,
                [name]: error
            }));
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;

        // Mark field as touched
        setTouched(prev => ({
            ...prev,
            [name]: true
        }));

        // Validate on blur
        const error = validate(name, value);
        setErrors(prev => ({
            ...prev,
            [name]: error
        }));
    };

    const shouldShowError = (fieldName) => {
        return touched[fieldName] && errors[fieldName];
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Mark all fields as touched
        setTouched({
            password: true,
            confirmPassword: true
        });

        // Validate all fields
        const passwordError = validate('password', formData.password);
        const confirmPasswordError = validate('confirmPassword', formData.confirmPassword);

        const newErrors = {
            password: passwordError,
            confirmPassword: confirmPasswordError
        };

        setErrors(newErrors);

        // Check if there are any errors
        if ( passwordError || confirmPasswordError ) {
            if ( passwordError ) {
                toast.error(passwordError);
            } else if ( confirmPasswordError ) {
                toast.error(confirmPasswordError);
            }
            return;
        }

        navigate(`/register?step=3&email=${ encodeURIComponent(email) }&password=${ encodeURIComponent(formData.password) }`, { replace: true });
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
                            className={ `block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 ${
                                shouldShowError('password') ? 'border-red-500' : 'border-gray-300'
                            } appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 ${
                                shouldShowError('password') ? 'focus:border-red-500' : 'focus:border-black'
                            } peer` }
                            placeholder=" "
                            value={ formData.password }
                            onChange={ handleChange }
                            onBlur={ handleBlur }
                        />
                        <label
                            htmlFor="password"
                            className={ `peer-focus:font-medium absolute text-sm ${
                                shouldShowError('password') ? 'text-red-500' : 'text-gray-500'
                            } dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:${
                                shouldShowError('password') ? 'text-red-500' : 'text-black'
                            } peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6` }
                        >
                            Password
                        </label>
                        { shouldShowError('password') && (
                            <p className="mt-1 text-xs text-red-500">{ errors.password }</p>
                        ) }
                    </div>
                    <div className="relative z-0 w-full mb-5 group">
                        <input
                            type="password"
                            name="confirmPassword"
                            id="confirmPassword"
                            className={ `block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 ${
                                shouldShowError('confirmPassword') ? 'border-red-500' : 'border-gray-300'
                            } appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 ${
                                shouldShowError('confirmPassword') ? 'focus:border-red-500' : 'focus:border-black'
                            } peer` }
                            placeholder=" "
                            value={ formData.confirmPassword }
                            onChange={ handleChange }
                            onBlur={ handleBlur }
                        />
                        <label
                            htmlFor="confirmPassword"
                            className={ `peer-focus:font-medium absolute text-sm ${
                                shouldShowError('confirmPassword') ? 'text-red-500' : 'text-gray-500'
                            } dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:${
                                shouldShowError('confirmPassword') ? 'text-red-500' : 'text-black'
                            } peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6` }
                        >
                            Confirm Password
                        </label>
                        { shouldShowError('confirmPassword') && (
                            <p className="mt-1 text-xs text-red-500">{ errors.confirmPassword }</p>
                        ) }
                    </div>
                    <div className="flex space-x-8">
                        <a href="/register"
                           className="text-white bg-black hover:opacity-75 focus:ring-4 focus:outline-none focus:ring-black font-medium rounded-full text-sm w-full sm:w-auto px-5 py-2.5 mt-6 text-center">Back</a>
                        <button
                            type="submit"
                            className={ `text-white ${ isFormValid ? 'bg-black hover:opacity-75' : 'bg-gray-400' } focus:ring-4 focus:outline-none focus:ring-black font-medium rounded-full text-sm w-full sm:w-auto px-5 py-2.5 mt-6 text-center` }
                            disabled={ !isFormValid }
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

    const [errors, setErrors] = useState({
        username: '',
        address: '',
        phone: ''
    });

    const [touched, setTouched] = useState({
        username: false,
        address: false,
        phone: false
    });

    const [isFormValid, setIsFormValid] = useState(false);
    const navigate = useNavigate();

    // Validate form when formData changes
    useEffect(() => {
        validateForm();
    }, [formData]);

    const validateForm = () => {
        const newErrors = {
            username: '',
            address: '',
            phone: ''
        };
        let valid = true;

        // Username validation
        if ( !formData.username.trim() ) {
            newErrors.username = 'Name is required';
            valid = false;
        } else if ( formData.username.trim().length < 2 ) {
            newErrors.username = 'Name must be at least 2 characters';
            valid = false;
        } else if ( formData.username.trim().length > 50 ) {
            newErrors.username = 'Name cannot exceed 50 characters';
            valid = false;
        }

        // Address validation
        if ( !formData.address.trim() ) {
            newErrors.address = 'Address is required';
            valid = false;
        } else if ( formData.address.trim().length < 5 ) {
            newErrors.address = 'Please enter a complete address';
            valid = false;
        }

        // Phone validation
        const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
        if ( !formData.phone.trim() ) {
            newErrors.phone = 'Phone number is required';
            valid = false;
        } else if ( !phoneRegex.test(formData.phone.trim()) ) {
            newErrors.phone = 'Please enter a valid phone number';
            valid = false;
        }

        setErrors(newErrors);
        setIsFormValid(valid);
        return valid;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Set all fields as touched to show all validation errors
        setTouched({
            username: true,
            address: true,
            phone: true
        });

        // Only proceed if form is valid
        if ( validateForm() ) {
            const query = new URLSearchParams({ ...formData, email, password }).toString();
            navigate(`/register?step=4&${ query }`, { replace: true });
        }
    };

    // Helper to determine if we should show error message
    const shouldShowError = (field) => {
        return touched[field] && errors[field];
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
                            className={ `block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 ${
                                shouldShowError('username') ? 'border-red-500' : 'border-gray-300'
                            } appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 ${
                                shouldShowError('username') ? 'focus:border-red-500' : 'focus:border-black'
                            } peer` }
                            placeholder=" "
                            value={ formData.username }
                            onChange={ handleChange }
                            onBlur={ handleBlur }
                        />
                        <label
                            htmlFor="username"
                            className={ `peer-focus:font-medium absolute text-sm ${
                                shouldShowError('username') ? 'text-red-500' : 'text-gray-500'
                            } dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:${
                                shouldShowError('username') ? 'text-red-500' : 'text-black'
                            } peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6` }
                        >
                            Name
                        </label>
                        { shouldShowError('username') && (
                            <p className="mt-1 text-xs text-red-500">{ errors.username }</p>
                        ) }
                    </div>
                    <div className="relative z-0 w-full mb-5 group">
                        <input
                            type="text"
                            name="address"
                            id="address"
                            className={ `block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 ${
                                shouldShowError('address') ? 'border-red-500' : 'border-gray-300'
                            } appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 ${
                                shouldShowError('address') ? 'focus:border-red-500' : 'focus:border-black'
                            } peer` }
                            placeholder=" "
                            value={ formData.address }
                            onChange={ handleChange }
                            onBlur={ handleBlur }
                        />
                        <label
                            htmlFor="address"
                            className={ `peer-focus:font-medium absolute text-sm ${
                                shouldShowError('address') ? 'text-red-500' : 'text-gray-500'
                            } dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:${
                                shouldShowError('address') ? 'text-red-500' : 'text-black'
                            } peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6` }
                        >
                            Address
                        </label>
                        { shouldShowError('address') && (
                            <p className="mt-1 text-xs text-red-500">{ errors.address }</p>
                        ) }
                    </div>
                    <div className="relative z-0 w-full mb-5 group">
                        <input
                            type="text"
                            name="phone"
                            id="phone"
                            className={ `block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 ${
                                shouldShowError('phone') ? 'border-red-500' : 'border-gray-300'
                            } appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 ${
                                shouldShowError('phone') ? 'focus:border-red-500' : 'focus:border-black'
                            } peer` }
                            placeholder=" "
                            value={ formData.phone }
                            onChange={ handleChange }
                            onBlur={ handleBlur }
                        />
                        <label
                            htmlFor="phone"
                            className={ `peer-focus:font-medium absolute text-sm ${
                                shouldShowError('phone') ? 'text-red-500' : 'text-gray-500'
                            } dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:${
                                shouldShowError('phone') ? 'text-red-500' : 'text-black'
                            } peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6` }
                        >
                            Phone Number
                        </label>
                        { shouldShowError('phone') && (
                            <p className="mt-1 text-xs text-red-500">{ errors.phone }</p>
                        ) }
                    </div>
                    <div className="flex space-x-8">
                        <a href="/register?step=2"
                           className="text-white bg-black hover:opacity-75 focus:ring-4 focus:outline-none focus:ring-black font-medium rounded-full text-sm w-full sm:w-auto px-5 py-2.5 mt-6 text-center">Back</a>
                        <button
                            type="submit"
                            className={ `text-white ${ isFormValid ? 'bg-black hover:opacity-75' : 'bg-gray-400' } focus:ring-4 focus:outline-none focus:ring-black font-medium rounded-full text-sm w-full sm:w-auto px-5 py-2.5 mt-6 text-center` }
                            disabled={ !isFormValid }
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
                            Selected { selectedTopics.length } topic
                            { selectedTopics.length < 3 && ` (${ 3 - selectedTopics.length } more needed)` }
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
                        <a href="/register?step=3"
                           className="text-white bg-black hover:opacity-75 focus:ring-4 focus:outline-none focus:ring-black font-medium rounded-full text-sm w-full sm:w-auto px-5 py-2.5 mt-6 text-center">Back</a>
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