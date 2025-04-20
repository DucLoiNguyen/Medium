import React, { useState, useEffect } from 'react';
import Post from './posts';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Avatar from '~/components/partial/Avatar/avatar.component';
import About from '~/pages/Profile/about';

function Profile() {
    const [activeTab, setActiveTab] = useState('1');
    const { id } = useParams();

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const responseData = await axios.get('http://localhost:3030/api/user/getbyid', {
                    params: { id: id },
                    withCredentials: true
                });
                setData(responseData.data);
            } catch ( error ) {
                console.error('Error fetching initial data:', error);
            }
        };

        fetchInitialData();
    }, [id]);
    return (
        <>
            { data && (
                <div className="flex justify-center">

                    <div className="block w-full mx-6" key={ data._id }>
                        <div className="mt-[52px] mb-7">
                            <div className="flex mb-10">
                                <div className="mr-4 md:hidden">
                                    <button>
                                        <Avatar username={ data.username } width={ 48 } height={ 48 } />
                                    </button>
                                </div>
                                <h1 className="text-5xl font-bold font-customs">{ data.username }</h1>
                            </div>
                            <div className="bg-white">
                                <div className="flex place-items-center">
                                    <div>
                                        <button
                                            className="text-[#6b6b6b] hover:text-black"
                                            onClick={ () => handleTabClick('1') }
                                        >
                                            <div
                                                className={ `pb-4 mr-8 ${ activeTab === '1' ? 'text-black' : 'hover:text-black' }` }
                                            >
                                                <p className="text-sm">Posts</p>
                                            </div>
                                        </button>
                                    </div>
                                    <div>
                                        <button
                                            className="text-[#6b6b6b] hover:text-black"
                                            onClick={ () => handleTabClick('2') }
                                        >
                                            <div
                                                className={ `pb-4 mr-8 ${ activeTab === '2' ? 'text-black' : 'hover:text-black' }` }
                                            >
                                                <p className="text-sm">About</p>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="">
                            <div className="">
                                {/* Posts */ }
                                { activeTab === '1' && <Post id={ id } /> }

                                {/* About */ }
                                { activeTab === '2' && <About bio={ data.bio } /> }
                            </div>
                        </div>
                    </div>
                </div>
            ) }
        </>
    );
}

export default Profile;
