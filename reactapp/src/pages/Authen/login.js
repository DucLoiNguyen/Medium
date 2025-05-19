import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';

function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
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

        if ( name === 'password' ) {
            if ( !value ) {
                error = 'Password is required';
                valid = false;
            } else if ( value.length < 6 ) {
                error = 'Password must be at least 6 characters long';
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

    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();

        // Mark all fields as touched
        setTouched({
            email: true,
            password: true
        });

        // Validate all fields
        const emailError = validate('email', formData.email);
        const passwordError = validate('password', formData.password);

        const newErrors = {
            email: emailError,
            password: passwordError
        };

        setErrors(newErrors);

        // Check if there are any errors
        if ( emailError || passwordError ) {
            if ( emailError ) {
                toast.error(emailError);
            } else if ( passwordError ) {
                toast.error(passwordError);
            }
            return;
        }

        try {
            setIsSubmitting(true);
            const resUser = await axios.post(
                'http://localhost:3030/api/auth/login',
                {
                    email: formData.email,
                    password: formData.password
                },
                { withCredentials: true }
            );

            if ( resUser && resUser.data.user.isAdmin ) {
                navigate('/admin', { replace: true });
            } else {
                navigate('/home', { replace: true });
            }
        } catch ( error ) {
            toast.error(error.response?.data?.message || 'Login failed. Please check your credentials.');
            console.log(error);
        } finally {
            setIsSubmitting(false);
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
                            required
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
                    <span className="text-sm w-full">
                        <a href="/forgot-password" className="text-[#1a8917] hover:text-gray-900">Forgot password</a>
                    </span>
                    <button
                        type="submit"
                        className={ `text-white ${ isFormValid ? 'bg-black hover:opacity-75' : 'bg-gray-400' } focus:ring-4 focus:outline-none focus:ring-black font-medium rounded-full text-sm w-full sm:w-auto px-5 py-2.5 mt-6 text-center` }
                        disabled={ isSubmitting && !isFormValid }
                    >
                        { isSubmitting ? 'Signing In...' : 'Sign In' }
                    </button>
                    <span className="mt-4 text-center text-sm">Don't have an account yet? <a href="/register"
                                                                                             className="text-[#1a8917] hover:text-gray-900">Create here</a>
                    </span>
                </form>
            </div>
        </>
    );
}

export default Login;