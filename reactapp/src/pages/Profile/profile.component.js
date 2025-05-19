import React, { useState, useEffect } from 'react';
import Post from './posts';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Avatar from '~/components/partial/Avatar/avatar.component';
import About from '~/pages/Profile/about';

function Profile() {
    const [activeTab, setActiveTab] = useState('1');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams();

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    useEffect(() => {
        const fetchUserData = async () => {
            // Validate ID before making request
            if ( !id ) {
                setError('User ID is required');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                const response = await axios.get('http://localhost:3030/api/user/getbyid', {
                    params: { id },
                    withCredentials: true
                });

                // Handle successful response
                if ( response.data ) {
                    setData(response.data);
                } else {
                    setError('No user data received');
                }
            } catch ( err ) {
                console.error('Error fetching user data:', err);

                // Handle different error types based on backend response
                if ( err.response?.status === 400 ) {
                    setError(err.response.data?.error || 'Invalid user ID format');
                } else if ( err.response?.status === 404 ) {
                    setError('User not found');
                } else if ( err.response?.status >= 500 ) {
                    setError('Server error. Please try again later.');
                } else {
                    setError('Failed to load user profile');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [id]);

    // Loading state
    if ( loading ) {
        return (
            <div className="flex justify-center items-center min-h-64">
                <div className="text-lg">Loading profile...</div>
            </div>
        );
    }

    // Error state
    if ( error ) {
        // Check if it's a "User not found" error specifically
        if ( error === 'User not found' || error.includes('not found') ) {
            return (
                <div className="min-h-screen bg-white font-customs2">
                    <div className="max-w-2xl mx-auto px-6 pt-20">
                        <div className="text-center">
                            {/* Large illustrative number */ }
                            <div className="text-8xl font-light text-gray-300 mb-8">404</div>

                            {/* Main message */ }
                            <h1 className="text-4xl font-normal text-gray-900 mb-4">
                                User not found
                            </h1>

                            {/* Subtitle */ }
                            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                                The profile you're looking for doesn't exist or may have been removed.
                            </p>

                            {/* Action buttons */ }
                            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                <button
                                    onClick={ () => window.history.back() }
                                    className="px-6 py-3 bg-gray-900 text-white rounded-full hover:opacity-75 transition-colors duration-200 font-medium"
                                >
                                    Go back
                                </button>
                                <button
                                    onClick={ () => window.location.href = '/home' }
                                    className="px-6 py-3 text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium"
                                >
                                    Go to homepage
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        // For other errors (400, 500, etc.)
        return (
            <div className="min-h-screen bg-white">
                <div className="max-w-2xl mx-auto px-6 pt-20 font-customs2">
                    <div className="text-center">
                        <div className="text-6xl font-light text-gray-300 mb-8">⚠</div>

                        <h1 className="text-3xl font-normal text-gray-900 mb-4">
                            Something went wrong
                        </h1>

                        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                            { error }
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <button
                                onClick={ () => window.location.reload() }
                                className="px-6 py-3 bg-gray-900 text-white rounded-full hover:opacity-75 transition-colors duration-200 font-medium"
                            >
                                Try again
                            </button>
                            <button
                                onClick={ () => window.history.back() }
                                className="px-6 py-3 text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium"
                            >
                                Go back
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // No data state (shouldn't happen if backend is working correctly)
    if ( !data ) {
        return (
            <div className="flex justify-center items-center min-h-64">
                <div className="text-lg">No profile data available</div>
            </div>
        );
    }

    return (
        <div className="flex justify-center">
            <div className="block w-full mx-6">
                <div className="mt-12 mb-7">
                    <div className="flex mb-10">
                        <div className="mr-4 md:hidden">
                            <button>
                                <Avatar
                                    username={ data.username }
                                    width={ 48 }
                                    height={ 48 }
                                    avatar={ data.ava }
                                />
                            </button>
                        </div>
                        <h1 className="text-5xl font-bold font-customs">
                            { data.username }
                        </h1>
                    </div>

                    <div className="bg-white">
                        <div className="flex place-items-center">
                            <div>
                                <button
                                    className="text-gray-600 hover:text-black"
                                    onClick={ () => handleTabClick('1') }
                                >
                                    <div className={ `pb-4 mr-8 ${
                                        activeTab === '1'
                                            ? 'text-black border-b-2 border-black'
                                            : 'hover:text-black'
                                    }` }>
                                        <p className="text-sm">Posts</p>
                                    </div>
                                </button>
                            </div>
                            <div>
                                <button
                                    className="text-gray-600 hover:text-black"
                                    onClick={ () => handleTabClick('2') }
                                >
                                    <div className={ `pb-4 mr-8 ${
                                        activeTab === '2'
                                            ? 'text-black border-b-2 border-black'
                                            : 'hover:text-black'
                                    }` }>
                                        <p className="text-sm">About</p>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="profile-content">
                    {/* Posts Tab */ }
                    { activeTab === '1' && <Post id={ id } /> }

                    {/* About Tab */ }
                    { activeTab === '2' && <About bio={ data.bio } /> }
                </div>
            </div>
        </div>
    );
}

export default Profile;