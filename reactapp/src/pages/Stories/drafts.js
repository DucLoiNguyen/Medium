import { ClassNames } from "~/util";
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";

function Draft() {
  return (
    <>
      <div className="px-6 pt-6 pb-[10px]">
        <div className="flex mt-3">
          <div className="max-w-lg">
            <div>
              <a href="/#">
                <h2 className="text-base font-bold">Reading list</h2>
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
              as={Fragment}
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
                    {({ active }) => (
                      <a
                        href="/home/new-story"
                        className={ClassNames(
                          active
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-700",
                          "block px-4 py-2 text-sm",
                        )}
                      >
                        <div className="flex ml-4">
                          <p className="text-sm max-h-5">Edit</p>
                        </div>
                      </a>
                    )}
                  </Menu.Item>
                  <Menu.Item className="flex">
                    {({ active }) => (
                      <button
                        data-modal-target="popup-modal" data-modal-toggle="popup-modal"
                        className={ClassNames(
                          active
                            ? "bg-gray-100 text-gray-900"
                            : "text-[#c94a4a]",
                          "block px-4 py-2 text-sm w-full",
                        )}
                      >
                        <div className="flex ml-4">
                          <p className="text-sm max-h-5">Remove</p>
                        </div>
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
      <div id="popup-modal" tabIndex="-1"
           className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
        <div className="relative p-4 w-full max-w-md max-h-full">
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <button type="button"
                    className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                    data-modal-hide="popup-modal">
              <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                   viewBox="0 0 14 14">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
            <div className="p-4 md:p-5 text-center">
              <svg className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" aria-hidden="true"
                   xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Are you sure you want to delete
                this product?</h3>
              <button data-modal-hide="popup-modal" type="button"
                      className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center">
                Yes, I'm sure
              </button>
              <button data-modal-hide="popup-modal" type="button"
                      className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">No,
                cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Draft;
