import { Dialog } from '@headlessui/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
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
    const [error, setError] = useState('');
    const { user } = useAuth();

    // Xử lý khi chọn file
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setError('');

        if ( !file ) return;

        // Kiểm tra loại file
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
        if ( !allowedTypes.includes(file.type) ) {
            setError('Chỉ chấp nhận file ảnh (JPEG, JPG, PNG, GIF)');
            return;
        }

        // Kiểm tra kích thước file (max: 50MB)
        if ( file.size > 50 * 1024 * 1024 ) {
            setError('Kích thước file không được vượt quá 50MB');
            return;
        }

        setSelectedFile(file);

        // Tạo preview cho ảnh
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    // Xóa ảnh đã chọn
    const handleClear = () => {
        setSelectedFile(null);
        setPreview(null);
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let imagePath = '/ava.png';
        // Upload image if a new file is selected
        if ( selectedFile ) {
            const fileImage = new FormData();
            fileImage.append('image', selectedFile);
            const response = await axios.post('http://localhost:3030/api/upload', fileImage, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            imagePath = response.data.filePath;
        }

        try {
            await axios.patch('http://localhost:3030/api/user/updateuser', {
                username: name, bio, ava: imagePath
            }, { withCredentials: true });
        } catch ( err ) {
            console.log(err);
        }
    };

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const responseData = await axios.get('http://localhost:3030/api/user/getbyid', {
                    params: { id: user._id },
                    withCredentials: true
                });
                setName(responseData.data.username);
                setBio(responseData.data.bio);
                setAva(responseData.data.ava);
            } catch ( error ) {
                console.error('Error fetching initial data:', error);
            }
        };

        fetchInitialData();
    }, [user]);
    return (<>
        <form onSubmit={ handleSubmit }>
            {/* Photo section */ }
            <div className="mb-6">
                <h3 className="text-sm font-normal mb-2">Photo</h3>
                <div className="flex space-x-4">
                    { preview ? (
                        <div
                            className="rounded-full w-[60px] h-[60px]">
                            <img
                                src={ preview }
                                alt="Preview"
                                className="mx-auto rounded-full"
                                width={ 60 }
                                height={ 60 }
                            />
                        </div>
                    ) : (
                        <Avatar username={ name } avatar={ ava } width={ 60 }
                                height={ 60 } />
                    ) }
                    <div className="max-w-full">
                        <div className="flex gap-3 mb-1">
                            <label
                                htmlFor="ava"
                                className="text-green-600 text-sm font-medium hover:underline">
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
                                <button onClick={ handleClear }
                                        className="text-red-500 text-sm font-medium hover:underline">Remove
                                </button>
                            ) }
                        </div>
                        <p className="text-xs text-gray-600">
                            Recommended: Square JPG, PNG, or GIF, at least 1,000 pixels per side.
                        </p>
                        { error && (
                            <p className="mt-1 text-sm/6 text-red-600">{ error }</p>
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
                    onChange={ (e) => setName(e.target.value) }
                    className="w-full p-2 border focus:border-current border-transparent rounded-md text-sm font-customs focus:ring-0 outline-none focus:outline-none bg-gray-50"
                    placeholder="Your name"
                />
                <div className="flex justify-end mt-1">
                    <span className="text-sm text-gray-500">0/50</span>
                </div>
            </div>

            {/* Short bio Field */ }
            <div className="mb-6">
                <label className="block text-sm mb-2">
                    Short bio
                </label>
                <textarea
                    value={ bio }
                    onChange={ (e) => setBio(e.target.value) }
                    className="w-full p-2 border border-transparent rounded-md h-24 resize-none text-sm font-custom focus:ring-0 outline-none focus:outline-none focus:border-current bg-gray-50"
                    placeholder=""
                />
                <div className="flex justify-end mt-1">
                    <span className="text-sm text-gray-500">0/160</span>
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

const OtherForm = ({ close }) => {
    const [email, setEmail] = useState('');
    const [subdomain, setUsername] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const { user } = useAuth();

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const responseData = await axios.get('http://localhost:3030/api/user/getbyid', {
                    params: { id: user._id },
                    withCredentials: true
                });
                setEmail(responseData.data.email);
                setUsername(responseData.data.subdomain);
                setAddress(responseData.data.address);
                setPhone(responseData.data.phone);
            } catch ( error ) {
                console.error('Error fetching initial data:', error);
            }
        };

        fetchInitialData();
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.patch('http://localhost:3030/api/user/updateuser', {
                email, subdomain, address, phone
            }, { withCredentials: true });
        } catch ( err ) {
            console.log(err);
        }
    };

    return (<>
        <form onSubmit={ handleSubmit }>
            {/* Email Field */ }
            <div className="mb-6">
                <label className="block text-sm mb-2">
                    Email<span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    value={ email }
                    onChange={ (e) => setEmail(e.target.value) }
                    className="w-full p-2 border focus:border-current border-transparent rounded-md text-sm font-customs focus:ring-0 outline-none focus:outline-none bg-gray-50"
                    placeholder="Your name"
                />
                <div className="mt-1">
                    <span className="text-xs text-gray-500">You can sign into Medium with this email address.</span>
                </div>
            </div>

            {/* Username or subdomain Field */ }
            <div className="mb-6">
                <label className="block text-sm mb-2">
                    User name and subdomain<span className="text-red-500"></span>
                </label>
                <input
                    type="text"
                    value={ subdomain }
                    onChange={ (e) => setUsername(e.target.value) }
                    className="w-full p-2 border focus:border-current border-transparent rounded-md text-sm font-customs focus:ring-0 outline-none focus:outline-none bg-gray-50"
                    placeholder="Your name"
                />
                <div className="mt-1">
                    <span className="text-xs text-gray-500">You can sign into Medium with this email address.</span>
                </div>
            </div>

            {/* Live at Field */ }
            <div className="mb-6">
                <label className="block text-sm mb-2">
                    Address<span className="text-red-500"></span>
                </label>
                <input
                    type="text"
                    value={ address }
                    onChange={ (e) => setAddress(e.target.value) }
                    className="w-full p-2 border focus:border-current border-transparent rounded-md text-sm font-customs focus:ring-0 outline-none focus:outline-none bg-gray-50"
                    placeholder="Your name"
                />
                <div className="mt-1">
                    <span className="text-xs text-gray-500">You can sign into Medium with this email address.</span>
                </div>
            </div>

            {/* Phone Field */ }
            <div className="mb-6">
                <label className="block text-sm mb-2">
                    Phone number<span className="text-red-500"></span>
                </label>
                <input
                    type="text"
                    value={ phone }
                    onChange={ (e) => setPhone(e.target.value) }
                    className="w-full p-2 border focus:border-current border-transparent rounded-md text-sm font-customs focus:ring-0 outline-none focus:outline-none bg-gray-50"
                    placeholder="Your name"
                />
                <div className="mt-1">
                    <span className="text-xs text-gray-500">You can sign into Medium with this email address.</span>
                </div>
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


export default ProfileInfoModal;