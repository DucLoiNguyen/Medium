import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import SearchPost from '~/pages/Search/searchpost';
import SearchUser from '~/pages/Search/searchuser';
import SearchTopic from '~/pages/Search/searchtopic';

function SearchResults() {
    const [activeTab, setActiveTab] = useState('1');
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const tag = searchParams.get('tag') || '';
    const author = searchParams.get('author') || '';
    const sortBy = searchParams.get('sortBy') || 'relevance';
    const page = parseInt(searchParams.get('page') || '1');

    console.log('query:', query, 'tag:', tag, 'author:', author, 'sortBy:', sortBy, 'page:', page);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    return (
        <>
            <div className="flex justify-center">
                <div className="block w-full mx-6">
                    <div className="mt-[52px] mb-7">
                        <div className="flex mb-10">
                            <h1 className="text-5xl font-bold font-customs w-full truncate "><span
                                className="text-[#6b6b6b]">Results for </span>{ query }</h1>
                        </div>
                        <div className="sticky top-0 pt-4 mt-10 bg-white border-b-2 z-10">
                            <div className="flex mx-6 place-items-center">
                                <div>
                                    <button
                                        className="text-[#6b6b6b] hover:text-black"
                                        onClick={ () => handleTabClick('1') }
                                    >
                                        <div
                                            className={ `pb-4 mr-8 ${ activeTab === '1' ? 'border-b-2 border-black text-black' : 'hover:border-b-2 hover:border-black' }` }
                                        >
                                            <p className="text-sm">Stories</p>
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
                                            <p className="text-sm">Peoples</p>
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
                                            <p className="text-sm">Topics</p>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="">
                        <div className="">
                            {/* Stories */ }
                            { activeTab === '1' &&
                                <SearchPost query={ query } tag={ tag } author={ author } sortBy={ sortBy }
                                            page={ page } /> }

                            {/* Peoples */ }
                            { activeTab === '2' &&
                                <SearchUser query={ query } sortBy={ sortBy }
                                            page={ page } /> }

                            {/* Topics */ }
                            { activeTab === '3' &&
                                <SearchTopic query={ query } sortBy={ sortBy }
                                             page={ page } /> }
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default SearchResults;