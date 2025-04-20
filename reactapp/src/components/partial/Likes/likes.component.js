import { useState } from 'react';
import axios from 'axios';

function Likes({ children, postId, initialLikes }) {
    const [likes, setLikes] = useState(initialLikes);

    const handleLikes = async () => {
        try {
            const response = await axios.put(`http://localhost:3030/api/post/like/${ postId }`, {}, { withCredentials: true });
            if ( response.status === 200 ) {
                setLikes(likes + 1);
            }
        } catch ( err ) {
            console.error(err);
        }
    };

    return children(postId, likes, handleLikes);
}

export default Likes;