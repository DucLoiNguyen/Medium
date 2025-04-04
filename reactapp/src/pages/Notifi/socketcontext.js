import React, { createContext, useState, useContext, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { useAuth } from '~/pages/Authen/authcontext';
import { toast } from 'sonner';

// Tạo context
const SocketContext = createContext();

// Provider component
export const SocketProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [socket, setSocket] = useState(null);
    const { user } = useAuth();

    useEffect(() => {

        if ( !user ) return;

        // Tạo kết nối socket
        const newSocket = io('http://localhost:3030', {
            withCredentials: true
        });
        setSocket(newSocket);

        // Xác thực socket
        newSocket.emit('authenticate', user._id);

        // Fetch notifications ban đầu
        const fetchNotifications = async () => {
            try {
                const response = await axios.get('http://localhost:3030/api/notification/notifications', {
                    withCredentials: true
                });
                setNotifications(response.data);
            } catch ( error ) {
                console.error('Failed to fetch notifications', error);
            }
        };
        fetchNotifications();

        // Lắng nghe thông báo mới
        newSocket.on('newNotification', (notification) => {
            // Thêm thông báo mới vào danh sách
            setNotifications(prev => [notification, ...prev]);

            // Hiển thị toast
            toast.message(notification.message);
        });

        // Cleanup khi component unmount
        return () => {
            newSocket.disconnect();
        };
    }, [user]);

    // Hàm đánh dấu thông báo đã đọc
    const markNotificationAsRead = async (notificationId) => {
        try {
            await axios.patch(`http://localhost:3030/api/notification/notifications/read/${ notificationId }`,
                {},
                { withCredentials: true }
            );

            // Cập nhật trạng thái local
            setNotifications(prev =>
                prev.map(notification =>
                    notification._id === notificationId
                        ? { ...notification, isRead: true }
                        : notification
                )
            );
        } catch ( error ) {
            console.error('Failed to mark notification as read', error);
        }
    };

    return (
        <SocketContext.Provider value={ {
            notifications,
            socket,
            markNotificationAsRead
        } }>
            { children }
        </SocketContext.Provider>
    );
};

// Hook để sử dụng context
export const useSocketNotifications = () => {
    return useContext(SocketContext);
};