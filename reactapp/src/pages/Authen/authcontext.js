// AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import Loading_spinner from '~/components/partial/Loading_spinner/loading_spinner.component';

// Create the authentication context
const AuthContext = createContext(null);

// Provider component
export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [isMember, setMember] = useState(null);
    const [loading, setLoading] = useState(true);

    // Function to check authentication status
    const checkAuthStatus = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:3030/api/auth/check-auth', {
                withCredentials: true // Important: this sends cookies with the request
            });

            setIsAuthenticated(response.data.isAuthenticated);
            if ( response.data.user ) {
                setUser(response.data.user);

                const userData = await axios.get('http://localhost:3030/api/user/getbyemail', {
                    params: { email: response.data.user.email },
                    withCredentials: true
                });
                setMember(userData.data.isMember);
            }

        } catch ( error ) {
            console.error('Authentication check failed:', error);
            setIsAuthenticated(false);
            setUser(null);
            setMember(null);
        } finally {
            setLoading(false);
        }
    };

    // Check auth status when the component mounts
    useEffect(() => {
        checkAuthStatus();
    }, []);

    // The context value that will be provided
    const value = {
        isAuthenticated,
        user,
        loading,
        isMember,
        checkAuthStatus // Exposed to allow manual refresh
    };

    return <AuthContext.Provider value={ value }>{ children }</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if ( !context ) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// Protected route component
export const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if ( loading ) {
        return <Loading_spinner />;
    }

    if ( !isAuthenticated ) {
        return <Navigate to="/" replace />; // Assuming you have React Router
    }

    return children;
};