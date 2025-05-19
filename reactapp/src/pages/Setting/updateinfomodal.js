import { Dialog } from '@headlessui/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { useAuth } from '~/pages/Authen/authcontext';
import Avatar from '~/components/partial/Avatar/avatar.component';

const ProfileInfoModal = ({ isOpen, close, type }) => {
    let title = '';
    switch ( type ) {
        case 'profile':
            title = 'Profile information';
            break;
        case 'other':
            title = 'Other information';
            break;
        default:
            title = type;
            break;
    }

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
                                { title }
                            </Dialog.Title>

                            {/*Forms*/ }
                            { type === 'profile' ? <ProfileInformationForm close={ close } /> : null }
                            { type === 'other' ? <OtherForm close={ close } /> : null }

                        </Dialog.Panel>
                    </div>
                </div>
            </Dialog>
        </>
    );
};

const ProfileInformationForm = ({ close }) => {
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [ava, setAva] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [fileError, setFileError] = useState('');
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { user } = useAuth();

    // Handle file selection
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFileError('');

        if ( !file ) return;

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
        if ( !allowedTypes.includes(file.type) ) {
            setFileError('Chỉ chấp nhận file ảnh (JPEG, JPG, PNG, GIF)');
            toast.error('Invalid file type. Please select an image file (JPEG, JPG, PNG, GIF).');
            return;
        }

        // Validate file size (max: 50MB)
        if ( file.size > 50 * 1024 * 1024 ) {
            setFileError('Kích thước file không được vượt quá 50MB');
            toast.error('File size exceeds 50MB limit.');
            return;
        }

        setSelectedFile(file);
        toast.success('Image selected successfully.');

        // Create image preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    // Clear selected image
    const handleClear = () => {
        setSelectedFile(null);
        setPreview(null);
        setFileError('');
        toast.info('Image selection cleared.');
    };

    const validateForm = () => {
        const newErrors = {};

        // Name validation
        if ( !name.trim() ) {
            newErrors.name = 'Name is required';
        } else if ( name.trim().length > 50 ) {
            newErrors.name = 'Name cannot exceed 50 characters';
        } else if ( name.trim().length < 2 ) {
            newErrors.name = 'Name must be at least 2 characters';
        }

        // Bio validation (optional field)
        if ( bio && bio.length > 160 ) {
            newErrors.bio = 'Bio cannot exceed 160 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if ( !validateForm() ) {
            Object.values(errors).forEach(error => toast.error(error));
            return;
        }

        setIsSubmitting(true);

        try {
            toast.loading('Updating your profile...');
            let imagePath = ava || '/ava.png';

            // Upload image if a new file is selected
            if ( selectedFile ) {
                const fileImage = new FormData();
                fileImage.append('image', selectedFile);

                try {
                    const response = await axios.post('http://localhost:3030/api/upload', fileImage, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    });
                    imagePath = response.data.filePath;
                } catch ( uploadErr ) {
                    toast.dismiss();
                    toast.error('Failed to upload image. Please try again.');
                    console.error('Image upload error:', uploadErr);
                    setIsSubmitting(false);
                    return;
                }
            }

            // Send profile update request with bio included to trigger profile update path
            const response = await axios.patch('http://localhost:3030/api/user/updateuser', {
                username: name,
                bio,
                ava: imagePath
            }, { withCredentials: true });

            toast.dismiss();

            if ( response.data.success ) {
                toast.success(response.data.message || 'Profile updated successfully!');
                close();
            } else {
                toast.error(response.data.message || 'Failed to update profile.');
            }
        } catch ( err ) {
            toast.dismiss();

            // Handle specific error responses from backend
            if ( err.response && err.response.data ) {
                toast.error(err.response.data.message || 'Failed to update profile.');

                // Update form errors if specific fields have issues
                if ( err.response.data.message.includes('Username already exists') ) {
                    setErrors(prev => ({ ...prev, name: 'Username already exists' }));
                }
            } else {
                toast.error('Failed to update profile. Please try again.');
            }

            console.error('Profile update error:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Clear error when field is edited
    const handleNameChange = (e) => {
        setName(e.target.value);
        if ( errors.name ) {
            setErrors(prev => ({ ...prev, name: null }));
        }
    };

    // Clear error when field is edited
    const handleBioChange = (e) => {
        setBio(e.target.value);
        if ( errors.bio ) {
            setErrors(prev => ({ ...prev, bio: null }));
        }
    };

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                toast.loading('Loading your profile information...');
                const responseData = await axios.get('http://localhost:3030/api/user/getbyid', {
                    params: { id: user._id },
                    withCredentials: true
                });
                setName(responseData.data.username);
                setBio(responseData.data.bio);
                setAva(responseData.data.ava);
                toast.dismiss();
            } catch ( error ) {
                toast.dismiss();
                toast.error('Failed to load profile data.');
                console.error('Error fetching initial data:', error);
            }
        };

        fetchInitialData();
    }, [user]);

    return (
        <form onSubmit={ handleSubmit }>
            {/* Photo section */ }
            <div className="mb-6">
                <h3 className="text-sm font-normal mb-2">Photo</h3>
                <div className="flex space-x-4">
                    { preview ? (
                        <div className="rounded-full w-[60px] h-[60px]">
                            <img
                                src={ preview }
                                alt="Preview"
                                className="mx-auto rounded-full w-full h-full"
                                width={ 60 }
                                height={ 60 }
                            />
                        </div>
                    ) : (
                        <div className="w-[60px] h-[60px]">
                            <Avatar username={ name } avatar={ ava } width={ 60 } height={ 60 } />
                        </div>
                    ) }
                    <div className="max-w-full">
                        <div className="flex gap-3 mb-1">
                            <label
                                htmlFor="ava"
                                className="text-green-600 text-sm font-medium hover:underline cursor-pointer">
                                <span>Update</span>
                                <input
                                    id="ava"
                                    name="ava"
                                    type="file"
                                    className="sr-only"
                                    onChange={ handleFileChange }
                                />
                            </label>
                            { (selectedFile) && (
                                <button
                                    type="button"
                                    onClick={ handleClear }
                                    className="text-red-500 text-sm font-medium hover:underline">Remove
                                </button>
                            ) }
                        </div>
                        <p className="text-xs text-gray-600">
                            Recommended: Square JPG, PNG, or GIF, at least 1,000 pixels per side.
                        </p>
                        { fileError && (
                            <p className="mt-1 text-sm/6 text-red-600">{ fileError }</p>
                        ) }
                    </div>
                </div>
            </div>

            {/* Name Field */ }
            <div className="mb-6">
                <label className="block text-sm mb-2">
                    Name<span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    value={ name }
                    onChange={ handleNameChange }
                    className={ `w-full p-2 border focus:border-current border-transparent rounded-md text-sm font-customs focus:ring-0 outline-none focus:outline-none bg-gray-50 ${ errors.name ? 'border-red-500' : '' }` }
                    placeholder="Your name"
                />
                { errors.name && (
                    <p className="mt-1 text-sm text-red-600">{ errors.name }</p>
                ) }
                <div className="flex justify-end mt-1">
                    <span className="text-sm text-gray-500">{ name.length }/50</span>
                </div>
            </div>

            {/* Short bio Field */ }
            <div className="mb-6">
                <label className="block text-sm mb-2">
                    Short bio
                </label>
                <textarea
                    value={ bio }
                    onChange={ handleBioChange }
                    className={ `w-full p-2 border border-transparent rounded-md h-24 resize-none text-sm font-custom focus:ring-0 outline-none focus:outline-none focus:border-current bg-gray-50 ${ errors.bio ? 'border-red-500' : '' }` }
                    placeholder="Tell us about yourself"
                />
                { errors.bio && (
                    <p className="mt-1 text-sm text-red-600">{ errors.bio }</p>
                ) }
                <div className="flex justify-end mt-1">
                    <span className="text-sm text-gray-500">{ bio.length }/160</span>
                </div>
            </div>

            {/* About Page Section */ }
            <div className="mb-8 p-4 rounded-sm">
                <div className="flex justify-between items-start">
                    <span className="text-sm">About Page</span>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                    Personalize with images and more to paint more of a vivid portrait of yourself than
                    your 'Short bio'.
                </p>
            </div>

            {/* Action Buttons */ }
            <div className="mt-6 flex items-center justify-end gap-x-6">
                <button
                    type="button"
                    onClick={ close }
                    className="text-sm text-gray-900 px-4 py-1 ring-2 ring-[#6b6b6b] hover:ring-offset-2 hover:ring-black rounded-full transition-all ease-in-out"
                    disabled={ isSubmitting }
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-4 py-1 bg-[#1a8917] rounded-full text-sm text-white hover:bg-[#0f730c] ring-2 ring-[#1a8917] hover:ring-offset-2 hover:ring-[#0f730c] transition-all ease-in-out disabled:opacity-70 disabled:cursor-not-allowed"
                    disabled={ isSubmitting }
                >
                    { isSubmitting ? 'Saving...' : 'Save' }
                </button>
            </div>
        </form>
    );
};

const OtherForm = ({ close }) => {
    const [email, setEmail] = useState('');
    const [subdomain, setSubdomain] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                toast.loading('Loading your information...');
                const responseData = await axios.get('http://localhost:3030/api/user/getbyid', {
                    params: { id: user._id },
                    withCredentials: true
                });
                setEmail(responseData.data.email);
                setSubdomain(responseData.data.subdomain);
                setAddress(responseData.data.address);
                setPhone(responseData.data.phone);
                toast.dismiss();
            } catch ( error ) {
                toast.dismiss();
                toast.error('Failed to load user data.');
                console.error('Error fetching initial data:', error);
            }
        };

        fetchInitialData();
    }, [user]);

    const validateForm = () => {
        const newErrors = {};

        // Email validation
        if ( !email.trim() ) {
            newErrors.email = 'Email is required';
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if ( !emailRegex.test(email) ) {
                newErrors.email = 'Please enter a valid email address';
            }
        }

        // Subdomain validation (if provided)
        if ( subdomain.trim() ) {
            // Only allow alphanumeric characters and hyphens, must start with a letter
            const subdomainRegex = /^[a-zA-Z][a-zA-Z0-9-]*$/;
            if ( !subdomainRegex.test(subdomain) ) {
                newErrors.subdomain = 'Subdomain must start with a letter and contain only letters, numbers, and hyphens';
            } else if ( subdomain.length < 3 ) {
                newErrors.subdomain = 'Subdomain must be at least 3 characters';
            } else if ( subdomain.length > 30 ) {
                newErrors.subdomain = 'Subdomain cannot exceed 30 characters';
            }
        }

        // Phone validation (if provided)
        if ( phone && phone.trim() ) {
            // Basic phone format check
            const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,9}$/;
            if ( !phoneRegex.test(phone) ) {
                newErrors.phone = 'Please enter a valid phone number';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if ( !validateForm() ) {
            Object.values(errors).forEach(error => toast.error(error));
            return;
        }

        setIsSubmitting(true);
        toast.loading('Updating your information...');

        try {
            // Send other information update request without bio
            const response = await axios.patch('http://localhost:3030/api/user/updateuser', {
                email,
                subdomain,
                address,
                phone
            }, { withCredentials: true });

            toast.dismiss();

            if ( response.data.success ) {
                toast.success(response.data.message || 'Information updated successfully!');
                close();
            } else {
                toast.error(response.data.message || 'Failed to update information.');
            }
        } catch ( err ) {
            toast.dismiss();

            // Handle specific error responses from backend like duplicate email or subdomain
            if ( err.response && err.response.data ) {
                toast.error(err.response.data.message || 'Failed to update information.');

                // Update form errors if specific fields have issues
                if ( err.response.data.message.includes('Email already exists') ) {
                    setErrors(prev => ({ ...prev, email: 'Email already exists' }));
                }
                if ( err.response.data.message.includes('Subdomain already exists') ) {
                    setErrors(prev => ({ ...prev, subdomain: 'Subdomain already exists' }));
                }
            } else {
                toast.error('Failed to update information. Please try again.');
            }

            console.error('Update error:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Clear error when field is edited
    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        if ( errors.email ) {
            setErrors(prev => ({ ...prev, email: null }));
        }
    };

    // Clear error when field is edited
    const handleSubdomainChange = (e) => {
        setSubdomain(e.target.value);
        if ( errors.subdomain ) {
            setErrors(prev => ({ ...prev, subdomain: null }));
        }
    };

    // Clear error when field is edited
    const handlePhoneChange = (e) => {
        setPhone(e.target.value);
        if ( errors.phone ) {
            setErrors(prev => ({ ...prev, phone: null }));
        }
    };

    return (
        <form onSubmit={ handleSubmit }>
            {/* Email Field */ }
            <div className="mb-6">
                <label className="block text-sm mb-2">
                    Email<span className="text-red-500">*</span>
                </label>
                <input
                    type="email"
                    value={ email }
                    onChange={ handleEmailChange }
                    className={ `w-full p-2 border focus:border-current border-transparent rounded-md text-sm font-customs focus:ring-0 outline-none focus:outline-none bg-gray-50 ${ errors.email ? 'border-red-500' : '' }` }
                    placeholder="Your email address"
                    required
                />
                { errors.email && (
                    <p className="mt-1 text-sm text-red-600">{ errors.email }</p>
                ) }
                <div className="mt-1">
                    <span className="text-xs text-gray-500">You can sign into Medium with this email address.</span>
                </div>
            </div>

            {/* Username or subdomain Field */ }
            <div className="mb-6">
                <label className="block text-sm mb-2">
                    User name and subdomain
                </label>
                <input
                    type="text"
                    value={ subdomain }
                    onChange={ handleSubdomainChange }
                    className={ `w-full p-2 border focus:border-current border-transparent rounded-md text-sm font-customs focus:ring-0 outline-none focus:outline-none bg-gray-50 ${ errors.subdomain ? 'border-red-500' : '' }` }
                    placeholder="Your username"
                />
                { errors.subdomain && (
                    <p className="mt-1 text-sm text-red-600">{ errors.subdomain }</p>
                ) }
                <div className="mt-1">
                    <span className="text-xs text-gray-500">This will be used for your profile URL.</span>
                </div>
            </div>

            {/* Live at Field */ }
            <div className="mb-6">
                <label className="block text-sm mb-2">
                    Address
                </label>
                <input
                    type="text"
                    value={ address }
                    onChange={ (e) => setAddress(e.target.value) }
                    className="w-full p-2 border focus:border-current border-transparent rounded-md text-sm font-customs focus:ring-0 outline-none focus:outline-none bg-gray-50"
                    placeholder="Your address"
                />
                <div className="mt-1">
                    <span className="text-xs text-gray-500">Your location information.</span>
                </div>
            </div>

            {/* Phone Field */ }
            <div className="mb-6">
                <label className="block text-sm mb-2">
                    Phone number
                </label>
                <input
                    type="tel"
                    value={ phone }
                    onChange={ handlePhoneChange }
                    className={ `w-full p-2 border focus:border-current border-transparent rounded-md text-sm font-customs focus:ring-0 outline-none focus:outline-none bg-gray-50 ${ errors.phone ? 'border-red-500' : '' }` }
                    placeholder="Your phone number"
                />
                { errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{ errors.phone }</p>
                ) }
                <div className="mt-1">
                    <span className="text-xs text-gray-500">For account recovery and notifications.</span>
                </div>
            </div>

            {/* Action Buttons */ }
            <div className="mt-6 flex items-center justify-end gap-x-6">
                <button
                    type="button"
                    onClick={ close }
                    className="text-sm text-gray-900 px-4 py-1 ring-2 ring-[#6b6b6b] hover:ring-offset-2 hover:ring-black rounded-full transition-all ease-in-out"
                    disabled={ isSubmitting }
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-4 py-1 bg-[#1a8917] rounded-full text-sm text-white hover:bg-[#0f730c] ring-2 ring-[#1a8917] hover:ring-offset-2 hover:ring-[#0f730c] transition-all ease-in-out disabled:opacity-70 disabled:cursor-not-allowed"
                    disabled={ isSubmitting }
                >
                    { isSubmitting ? 'Saving...' : 'Save' }
                </button>
            </div>
        </form>
    );
};

export default ProfileInfoModal;