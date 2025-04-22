function Avatar({ username, avatar, width = 50, height = 50 }) {
    const ava = avatar ? `http://localhost:3030${ avatar }` : `https://api.dicebear.com/9.x/initials/svg?seed=${ username }`;
    return (
        <>
            <div style={ { width: `${ width }px`, height: `${ height }px` } }
                 className="rounded-full ring-2 ring-gray-200 ring-offset-2 overflow-hidden">
                <img
                    alt="avatar"
                    className="object-cover w-full h-full"
                    src={ ava }
                    width={ width }
                    height={ height }
                    loading="lazy"
                />
            </div>
        </>
    );
}

export default Avatar;