// utils/readingTracker.js
import axios from 'axios';

const trackReading = (articleId) => {
    let startTime = Date.now();
    let maxScrollPercentage = 0;
    let isReading = true;
    let trackingInterval;
    let lastTrackTime = Date.now();

    // Tính phần trăm cuộn trang
    const calculateScrollPercentage = () => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        return Math.round((scrollTop / documentHeight) * 100);
    };

    // Theo dõi thời gian đọc và vị trí cuộn
    const updateReadingMetrics = () => {
        if ( !isReading ) return;

        const currentScrollPercentage = calculateScrollPercentage();
        maxScrollPercentage = Math.max(maxScrollPercentage, currentScrollPercentage);

        // Gửi tracking data cứ mỗi 30 giây hoặc khi người dùng rời trang
        const now = Date.now();
        if ( now - lastTrackTime >= 30000 ) {
            sendTrackingData();
            lastTrackTime = now;
        }
    };

    // Gửi dữ liệu đến API
    const sendTrackingData = async () => {
        const readDuration = Math.round((Date.now() - startTime) / 1000);
        // Xác định nếu người dùng đã đọc hết bài viết (ví dụ: đã cuộn đến 90% bài viết)
        const isCompleted = maxScrollPercentage >= 90;

        try {
            const response = await axios.post('http://localhost:3030/api/history/track', {
                postId: articleId,
                readDuration,
                readPercentage: maxScrollPercentage,
                isCompleted
            }, { withCredentials: true });

            if ( !response ) {
                console.error('Error tracking reading activity');
            }
        } catch ( error ) {
            console.error('Failed to send tracking data:', error);
        }
    };

    // Khởi động tracking
    const startTracking = () => {
        // Gửi dữ liệu ban đầu
        sendTrackingData();

        // Theo dõi cuộn trang
        window.addEventListener('scroll', updateReadingMetrics);

        // Đặt interval để cập nhật định kỳ
        trackingInterval = setInterval(updateReadingMetrics, 5000);

        // Theo dõi khi người dùng rời trang
        window.addEventListener('beforeunload', handleBeforeUnload);

        // Theo dõi khi tab không còn active
        document.addEventListener('visibilitychange', handleVisibilityChange);
    };

    // Dừng tracking
    const stopTracking = () => {
        isReading = false;
        sendTrackingData();
        clearInterval(trackingInterval);
        window.removeEventListener('scroll', updateReadingMetrics);
        window.removeEventListener('beforeunload', handleBeforeUnload);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
    };

    // Xử lý khi người dùng rời trang
    const handleBeforeUnload = () => {
        sendTrackingData();
    };

    // Xử lý khi tab không còn active
    const handleVisibilityChange = () => {
        if ( document.hidden ) {
            isReading = false;
        } else {
            isReading = true;
            startTime = Date.now(); // Reset thời gian bắt đầu khi quay lại
        }
    };

    return {
        start: startTracking,
        stop: stopTracking
    };
};

export default trackReading;