import { Dialog } from '@headlessui/react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

const DeleteAccModal = ({ isOpen, close }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmText, setConfirmText] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    // Reset form when modal opens/closes
    useEffect(() => {
        if ( !isOpen ) {
            setEmail('');
            setPassword('');
            setConfirmText('');
            setErrors({});
            setTouched({});
        }
    }, [isOpen]);

    // Email validation
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if ( !email ) return 'Email is required';
        if ( !emailRegex.test(email) ) return 'Please enter a valid email address';
        return null;
    };

    // Password validation
    const validatePassword = (password) => {
        if ( !password ) return 'Password is required';
        if ( password.length < 6 ) return 'Password must be at least 6 characters';
        return null;
    };

    // Confirmation text validation
    const validateConfirmText = (text) => {
        const requiredText = 'DELETE MY ACCOUNT';
        if ( !text ) return `Please type "${ requiredText }" to confirm`;
        if ( text !== requiredText ) return `Please type exactly "${ requiredText }"`;
        return null;
    };

    // Validate all fields
    const validateForm = () => {
        const newErrors = {};

        const emailError = validateEmail(email);
        const passwordError = validatePassword(password);
        const confirmError = validateConfirmText(confirmText);

        if ( emailError ) newErrors.email = emailError;
        if ( passwordError ) newErrors.password = passwordError;
        if ( confirmError ) newErrors.confirmText = confirmError;

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle field blur
    const handleBlur = (field) => {
        setTouched(prev => ({ ...prev, [field]: true }));

        // Validate specific field on blur
        const newErrors = { ...errors };
        switch ( field ) {
            case 'email':
                const emailError = validateEmail(email);
                if ( emailError ) newErrors.email = emailError;
                else delete newErrors.email;
                break;
            case 'password':
                const passwordError = validatePassword(password);
                if ( passwordError ) newErrors.password = passwordError;
                else delete newErrors.password;
                break;
            case 'confirmText':
                const confirmError = validateConfirmText(confirmText);
                if ( confirmError ) newErrors.confirmText = confirmError;
                else delete newErrors.confirmText;
                break;
        }
        setErrors(newErrors);
    };

    // Check if form is valid
    const isFormValid = () => {
        return email && password && confirmText && Object.keys(errors).length === 0;
    };

    const handleDeleteAccount = async () => {
        // Final validation before submission
        if ( !validateForm() ) {
            setTouched({ email: true, password: true, confirmText: true });
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('http://localhost:3030/api/auth/delete-account', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if ( response.ok ) {
                // Success - show confirmation and redirect
                toast.success('Your account has been deleted successfully', {
                    description: 'You will be redirected to the home page',
                    duration: 3000
                });

                // Delay redirect để user có thể đọc toast
                setTimeout(() => {
                    window.location.href = '/';
                }, 2000);
            } else {
                // Handle specific server errors
                if ( response.status === 401 ) {
                    setErrors({ password: 'Invalid password' });
                } else if ( response.status === 404 ) {
                    setErrors({ email: 'Email address not found' });
                } else {
                    setErrors({ general: data.message || 'Failed to delete account' });
                }
            }
        } catch ( error ) {
            console.error('Error deleting account:', error);
            setErrors({ general: 'Network error. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if ( !loading ) {
            close();
        }
    };

    return (
        <Dialog open={ isOpen } as="div" className="relative z-10 focus:outline-none font-customs"
                onClose={ handleClose }>
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto bg-black bg-opacity-50">
                <div className="flex min-h-full items-center justify-center p-4">
                    <Dialog.Panel
                        transition={ true }
                        className="w-full max-w-md rounded-md bg-white p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0 z-50 drop-shadow-2xl"
                    >
                        <Dialog.Title as="h2"
                                      className="font-customs font-bold text-black text-center text-2xl tracking-tight mb-4">
                            Delete Account
                        </Dialog.Title>

                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-800 text-center font-medium mb-2">
                                ⚠️ This action cannot be undone
                            </p>
                            <p className="text-xs text-red-700 text-center">
                                All your data will be permanently deleted, including your subscription if you have one.
                            </p>
                        </div>

                        <form onSubmit={ (e) => {
                            e.preventDefault();
                            handleDeleteAccount();
                        } }>
                            {/* Email Field */ }
                            <div className="mb-4">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Confirm your email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={ email }
                                    onChange={ (e) => setEmail(e.target.value) }
                                    onBlur={ () => handleBlur('email') }
                                    className={ `w-full px-3 py-2 border border-transparent text-sm font-customs rounded-md outline-none focus:outline-none focus:ring-1 transition-colors ${
                                        touched.email && errors.email
                                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                            : 'border-gray-300 focus:ring-transparent focus:border-current'
                                    }` }
                                    placeholder="Enter your email"
                                    disabled={ loading }
                                />
                                { touched.email && errors.email && (
                                    <p className="mt-1 text-sm text-red-600">{ errors.email }</p>
                                ) }
                            </div>

                            {/* Password Field */ }
                            <div className="mb-4">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                    Confirm your password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    value={ password }
                                    onChange={ (e) => setPassword(e.target.value) }
                                    onBlur={ () => handleBlur('password') }
                                    className={ `w-full px-3 py-2 border border-transparent text-sm font-customs rounded-md outline-none focus:outline-none focus:ring-1 transition-colors ${
                                        touched.password && errors.password
                                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                            : 'border-gray-300 focus:ring-transparent focus:border-current'
                                    }` }
                                    placeholder="Enter your password"
                                    disabled={ loading }
                                />
                                { touched.password && errors.password && (
                                    <p className="mt-1 text-sm/6 text-red-600">{ errors.password }</p>
                                ) }
                            </div>

                            {/* Confirmation Text Field */ }
                            <div className="mb-4">
                                <label htmlFor="confirmText" className="block text-sm font-medium text-gray-700 mb-2">
                                    Type <span className="font-bold">"DELETE MY ACCOUNT"</span> to confirm
                                </label>
                                <input
                                    type="text"
                                    id="confirmText"
                                    value={ confirmText }
                                    onChange={ (e) => setConfirmText(e.target.value) }
                                    onBlur={ () => handleBlur('confirmText') }
                                    className={ `w-full px-3 py-2 border border-transparent text-sm font-customs rounded-md focus:outline-none focus:ring-1 transition-colors ${
                                        touched.confirmText && errors.confirmText
                                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                            : 'border-gray-300 focus:ring-transparent focus:border-current'
                                    }` }
                                    placeholder="DELETE MY ACCOUNT"
                                    disabled={ loading }
                                />
                                { touched.confirmText && errors.confirmText && (
                                    <p className="mt-1 text-sm text-red-600">{ errors.confirmText }</p>
                                ) }
                            </div>

                            {/* General Error */ }
                            { errors.general && (
                                <div
                                    className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm font-customs">
                                    { errors.general }
                                </div>
                            ) }

                            {/* Form Validation Summary */ }
                            { Object.keys(errors).length > 0 && (
                                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                                    <p className="text-sm text-yellow-800">
                                        Please fix the errors above before proceeding.
                                    </p>
                                </div>
                            ) }

                            <div className="flex gap-3 justify-end">
                                <button
                                    type="button"
                                    onClick={ handleClose }
                                    disabled={ loading }
                                    className="inline-flex items-center gap-2 py-1.5 px-3 mx-2 text-sm/6 font-customs border-solid border-2 border-[#6b6b6b] hover:border-black rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={ loading || !isFormValid() }
                                    className="inline-flex items-center gap-2 py-1.5 px-3 mx-2 text-sm/6 font-customs border-solid border-2 border-[#c94a4a] bg-[#c94a4a] hover:bg-[#b63636] rounded-full hover:border-[#b63636] text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    { loading ? (
                                        <>
                                            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10"
                                                        stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor"
                                                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Deleting...
                                        </>
                                    ) : (
                                        'Delete Account'
                                    ) }
                                </button>
                            </div>
                        </form>
                    </Dialog.Panel>
                </div>
            </div>
        </Dialog>
    );
};

export default DeleteAccModal;