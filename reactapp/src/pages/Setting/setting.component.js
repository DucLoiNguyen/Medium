import React, { useState } from 'react';
import Info from './informations';
import Security from './security';
import Avatar from '~/components/partial/Avatar/avatar.component';
import { useAuth } from '~/pages/Authen/authcontext';

function Setting() {
    const [activeTab, setActiveTab] = useState('1');
    const { user } = useAuth();

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    return (
        <>
            <div className="flex justify-center">
                <div className="block w-full mx-6">
                    <div className="mt-[52px] mb-7">
                        <div className="flex mb-10">
                            <div className="mr-4 md:hidden">
                                <button>
                                    <Avatar username={ user.username } width={ 48 } height={ 48 } />
                                </button>
                            </div>
                            <h1 className="text-5xl font-bold font-customs">Setting</h1>
                        </div>
                        <div className="bg-white">
                            <div className="flex place-items-center">
                                <div>
                                    <button
                                        className="text-[#6b6b6b] hover:text-black"
                                        onClick={ () => handleTabClick('1') }
                                    >
                                        <div
                                            className={ `pb-4 mr-8 ${ activeTab === '1' ? 'text-black' : 'hover:text-black'
                                            }` }
                                        >
                                            <p className="text-sm">Account</p>
                                        </div>
                                    </button>
                                </div>
                                <div>
                                    <button
                                        className="text-[#6b6b6b] hover:text-black"
                                        onClick={ () => handleTabClick('2') }
                                    >
                                        <div
                                            className={ `pb-4 mr-8 ${ activeTab === '2' ? 'text-black' : 'hover:text-black'
                                            }` }
                                        >
                                            <p className="text-sm">Security</p>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="">
                        <div className="">
                            {/* Informations */ }
                            { activeTab === '1' && <Info /> }

                            {/* Security */ }
                            { activeTab === '2' && <Security /> }
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Setting;
