import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

function ResetForgotPassword() {
    const [formData, setFormData] = useState({
        newPassword: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isValid, setIsValid] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isFormValid, setIsFormValid] = useState(false);
    const sessionId = new URLSearchParams(window.location.search).get('sessionId');

    useEffect(() => {
        const validateSession = async () => {
            try {
                setIsLoading(true);
                const res = await axios.get('http://localhost:3030/api/auth/validate-reset-session', {
                    params: { sessionId },
                    withCredentials: true
                });
                setIsValid(res.data.valid);
            } catch ( err ) {
                toast.error(err.response?.data?.message || err.message);
                setIsValid(false);
            } finally {
                setIsLoading(false);
            }
        };

        validateSession();
    }, [sessionId]);

    const validate = (name, value) => {
        let error = '';
        let valid = true;

        if ( name === 'newPassword' ) {
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
            } else if ( value !== formData.newPassword ) {
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
            newPassword: true,
            confirmPassword: true
        });

        // Validate all fields
        const passwordError = validate('newPassword', formData.newPassword);
        const confirmPasswordError = validate('confirmPassword', formData.confirmPassword);

        const newErrors = {
            newPassword: passwordError,
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

        try {
            setIsSubmitting(true);
            const response = await axios.post('http://localhost:3030/api/auth/reset-pass', {
                newPassword: formData.newPassword,
                sessionId
            }, { withCredentials: true });

            toast.success(response.data?.message || 'Password reset successfully!');

            // Redirect to login page after successful reset
            setTimeout(() => {
                window.location.href = '/sign-in';
            }, 2000);

        } catch ( err ) {
            toast.error(err.response?.data?.message || err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if ( isLoading ) {
        return (
            <div className="w-full h-screen flex justify-center items-center">
                <p className="text-center text-2xl font-customs2">Validating your reset session...</p>
            </div>
        );
    }

    if ( !isValid ) {
        return (
            <div className="w-full h-screen flex justify-center items-center">
                <p className="text-center text-2xl font-customs2">Your password reset session is no longer valid or may
                    have expired.</p>
            </div>
        );
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
                            name="newPassword"
                            id="newPassword"
                            className={ `block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 ${
                                shouldShowError('newPassword') ? 'border-red-500' : 'border-gray-300'
                            } appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 ${
                                shouldShowError('newPassword') ? 'focus:border-red-500' : 'focus:border-black'
                            } peer` }
                            placeholder=" "
                            required
                            value={ formData.newPassword }
                            onChange={ handleChange }
                            onBlur={ handleBlur }
                        />
                        <label
                            htmlFor="newPassword"
                            className={ `peer-focus:font-medium absolute text-sm ${
                                shouldShowError('newPassword') ? 'text-red-500' : 'text-gray-500'
                            } dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:${
                                shouldShowError('newPassword') ? 'text-red-500' : 'text-black'
                            } peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6` }
                        >
                            New Password
                        </label>
                        { shouldShowError('newPassword') && (
                            <p className="mt-1 text-xs text-red-500">{ errors.newPassword }</p>
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
                            required
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
                    <button
                        type="submit"
                        className={ `text-white ${ isFormValid ? 'bg-black hover:opacity-75' : 'bg-gray-400' } focus:ring-4 focus:outline-none focus:ring-black font-medium rounded-full text-sm w-full sm:w-auto px-5 py-2.5 mt-6 text-center` }
                        disabled={ isSubmitting && !isFormValid }
                    >
                        { isSubmitting ? 'Resetting...' : 'Reset Password' }
                    </button>
                </form>
            </div>
        </>
    );
}

export default ResetForgotPassword;