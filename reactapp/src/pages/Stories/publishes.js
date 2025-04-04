import { ClassNames } from '~/util';
import { Fragment, useEffect, useState } from 'react';
import { Menu, Transition, Dialog } from '@headlessui/react';
import ComfirmModal from '~/components/partial/ConfirmModal/confirmmodal.component';
import axios from 'axios';

function Publish() {
    const [isOpen, setIsOpen] = useState(false);
    const [data, setData] = useState(null);

    function open() {
        setIsOpen(true);
    }

    function close() {
        setIsOpen(false);
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:3030/api/post/getallpublish', { withCredentials: true });
                console.log(response.data);
                setData(response.data); // Đặt response.data thay vì toàn bộ response
            } catch ( error ) {
                console.error('Error fetching draft posts:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <>
            { data && data.map((item) => (
                <div className="px-6 pt-6 pb-[10px]" key={ item._id }>
                    <div className="flex mt-3">
                        <div className="max-w-lg">
                            <div>
                                <a href="/#">
                                    <h2 className="text-base font-bold">{ item.tittle }</h2>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <Menu as="div" className="relative inline-block text-left">
                            <div>
                                <Menu.Button className="justify-center bg-white rounded-full shadow-sm">
                <span className="text-[#6b6b6b] hover:text-black">
                  <svg width="21" height="21" viewBox="0 0 21 21" className="bz">
                    <path
                        d="M4 7.33L10.03 14l.5.55.5-.55 5.96-6.6-.98-.9-5.98 6.6h1L4.98 6.45z"
                        fillRule="evenodd"
                    ></path>
                  </svg>
                </span>
                                </Menu.Button>
                            </div>

                            <Transition
                                as={ Fragment }
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                            >
                                <Menu.Items
                                    className="absolute right-0 z-10 w-32 mt-2 origin-top-right bg-white divide-y rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none divide-solid">
                                    <div className="">
                                        <Menu.Item className="flex">
                                            { ({ active }) => (
                                                <a
                                                    href={ `/home/new-story/${ item._id }` }
                                                    className={ ClassNames(
                                                        active
                                                            ? 'bg-gray-100 text-gray-900'
                                                            : 'text-gray-700',
                                                        'block px-4 py-2 text-sm'
                                                    ) }
                                                >
                                                    <div className="flex ml-4">
                                                        <p className="text-sm max-h-5">Edit</p>
                                                    </div>
                                                </a>
                                            ) }
                                        </Menu.Item>
                                        <Menu.Item className="flex">
                                            { ({ active }) => (
                                                <button
                                                    onClick={ open }
                                                    className={ ClassNames(
                                                        active
                                                            ? 'bg-gray-100 text-gray-900'
                                                            : 'text-[#c94a4a]',
                                                        'block px-4 py-2 text-sm w-full'
                                                    ) }
                                                >
                                                    <div className="flex ml-4">
                                                        <p className="text-sm max-h-5">Remove</p>
                                                    </div>
                                                </button>
                                            ) }
                                        </Menu.Item>
                                    </div>
                                </Menu.Items>
                            </Transition>
                        </Menu>
                        <div>
                            <ComfirmModal isOpen={ isOpen } close={ close } type={ 'deletestories' } />
                        </div>
                    </div>
                </div>
            )) }
        </>
    );
}

export default Publish;
