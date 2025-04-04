function Avatar({ username, width = 50, height = 50 }) {
    const ava = `https://api.dicebear.com/9.x/initials/svg?seed=${ username }`;
    return (
        <>
            <div className="">
                <img
                    alt="avatar"
                    className="rounded-full ring-2 ring-gray-200 ring-offset-2"
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