import React, { useState } from 'react';
import Following from './following';
import Foryou from './foryou';
import RecommendationFeed from '~/pages/Home/recommendation';

function Home() {
    const [activeTab, setActiveTab] = useState('1');

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    return (
        <>
            <div className="sticky top-0 pt-4 mt-10 bg-white border-b-2 z-10">
                <div className="flex mx-6 place-items-center">
                    {/*<div className="pb-4 mr-6">*/ }
                    {/*  <a*/ }
                    {/*    className="rounded-full text-[#6b6b6b] hover:text-black"*/ }
                    {/*    href="/"*/ }
                    {/*  >*/ }
                    {/*    <p>*/ }
                    {/*      <svg width="19" height="19" fill="currentColor">*/ }
                    {/*        <path*/ }
                    {/*          d="M9 9H3v1h6v6h1v-6h6V9h-6V3H9v6z"*/ }
                    {/*          fillRule="evenodd"*/ }
                    {/*        ></path>*/ }
                    {/*      </svg>*/ }
                    {/*    </p>*/ }
                    {/*  </a>*/ }
                    {/*</div>*/ }
                    <div>
                        <button
                            className="text-[#6b6b6b] hover:text-black"
                            onClick={ () => handleTabClick('1') }
                        >
                            <div
                                className={ `pb-4 mr-8 ${ activeTab === '1' ? 'border-b-2 border-black text-black' : 'hover:border-b-2 hover:border-black' }` }
                            >
                                <p className="text-sm">Today</p>
                            </div>
                        </button>
                    </div>
                    <div>
                        <button
                            className="text-[#6b6b6b] hover:text-black"
                            onClick={ () => handleTabClick('2') }
                        >
                            <div
                                className={ `pb-4 mr-8 ${ activeTab === '2' ? 'border-b-2 border-black text-black' : 'hover:border-b-2 hover:border-black' }` }
                            >
                                <p className="text-sm">Following</p>
                            </div>
                        </button>
                    </div>
                    <div>
                        <button
                            className="text-[#6b6b6b] hover:text-black"
                            onClick={ () => handleTabClick('3') }
                        >
                            <div
                                className={ `pb-4 mr-8 ${ activeTab === '3' ? 'border-b-2 border-black text-black' : 'hover:border-b-2 hover:border-black' }` }
                            >
                                <p className="text-sm">For you</p>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
            <div className="mt-12">
                <div className="mx-6 z-5">
                    {/* For you */ }
                    { activeTab === '1' && <Foryou /> }

                    {/* Following */ }
                    { activeTab === '2' && <Following /> }

                    { activeTab === '3' && <RecommendationFeed /> }
                </div>
            </div>
        </>
    );
}

export default Home;
