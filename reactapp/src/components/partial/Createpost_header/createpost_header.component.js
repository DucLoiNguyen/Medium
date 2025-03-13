import clsx from "clsx";
import createpostheader from "./createpost_header.module.scss";
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ClassNames } from "~/util";
import ava from "~/assets/image/ava.png";

function CreatepostHeader() {
  const classNames = clsx(createpostheader.svg);

  return (
    <>
      <nav className="flex justify-end w-full px-6 shadow h-14">
        <div className="flex place-items-center">
          <a href="/home">
            <svg viewBox="0 0 1043.63 592.71" className={classNames}>
              <g data-name="Layer 2">
                <g data-name="Layer 1">
                  <path
                    d="M588.67 296.36c0 163.67-131.78 296.35-294.33 296.35S0 460 0 296.36 131.78 0 294.34 0s294.33 132.69 294.33 296.36M911.56 296.36c0 154.06-65.89 279-147.17 279s-147.17-124.94-147.17-279 65.88-279 147.16-279 147.17 124.9 147.17 279M1043.63 296.36c0 138-23.17 249.94-51.76 249.94s-51.75-111.91-51.75-249.94 23.17-249.94 51.75-249.94 51.76 111.9 51.76 249.94"></path>
                </g>
              </g>
            </svg>
          </a>
        </div>
        <div className="relative flex justify-end w-full place-items-center">
          {/*<div className="pr-8">*/}
          {/*  <button data-modal-target="crud-modal" data-modal-toggle="crud-modal"*/}
          {/*          className="px-2 py-1 bg-[#1a8917] rounded-full text-white text-sm hover:bg-[#0f730c]">*/}
          {/*    <span>Publish</span></button>*/}
          {/*</div>*/}
          <div className="pr-8">
            <a
              href="/home/notifications"
              className="text-[#6b6b6b] hover:text-black"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                aria-label="Notifications"
              >
                <path
                  d="M15 18.5a3 3 0 1 1-6 0"
                  stroke="currentColor"
                  strokeLinecap="round"
                ></path>
                <path
                  d="M5.5 10.53V9a6.5 6.5 0 0 1 13 0v1.53c0 1.42.56 2.78 1.57 3.79l.03.03c.26.26.4.6.4.97v2.93c0 .14-.11.25-.25.25H3.75a.25.25 0 0 1-.25-.25v-2.93c0-.37.14-.71.4-.97l.03-.03c1-1 1.57-2.37 1.57-3.79z"
                  stroke="currentColor"
                  strokeLinejoin="round"
                ></path>
              </svg>
            </a>
          </div>
          <Menu as="div" className="relative inline-block text-left">
            <div>
              <Menu.Button className="justify-center bg-white rounded-full shadow-sm">
                <div className="w-8">
                  <img
                    alt="Poseidon"
                    className="rounded-full"
                    src={ava}
                    width="32"
                    height="32"
                    loading="lazy"
                  />
                </div>
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
                className="absolute right-0 z-10 w-56 mt-2 origin-top-right bg-white divide-y rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none divide-solid">
                <div className="px-2 py-4">
                  <Menu.Item className="flex">
                    {({ active }) => (
                      <a
                        href="/home/profile"
                        className={ClassNames(
                          active
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-700",
                          "block px-4 py-2 text-sm"
                        )}
                      >
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          aria-label="Profile"
                        >
                          <circle
                            cx="12"
                            cy="7"
                            r="4.5"
                            stroke="currentColor"
                          ></circle>
                          <path
                            d="M3.5 21.5v-4.34C3.5 15.4 7.3 14 12 14s8.5 1.41 8.5 3.16v4.34"
                            stroke="currentColor"
                            strokeLinecap="round"
                          ></path>
                        </svg>
                        <div className="flex ml-4">
                          <p className="text-sm max-h-5">Profile</p>
                        </div>
                      </a>
                    )}
                  </Menu.Item>
                  <Menu.Item className="flex">
                    {({ active }) => (
                      <a
                        href="/home/library"
                        className={ClassNames(
                          active
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-700",
                          "block px-4 py-2 text-sm"
                        )}
                      >
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          aria-label="Lists"
                        >
                          <path
                            d="M6.44 6.69h0a1.5 1.5 0 0 1 1.06-.44h9c.4 0 .78.16 1.06.44l.35-.35-.35.35c.28.28.44.66.44 1.06v14l-5.7-4.4-.3-.23-.3.23-5.7 4.4v-14c0-.4.16-.78.44-1.06z"
                            stroke="currentColor"
                          ></path>
                          <path
                            d="M12.5 2.75h-8a2 2 0 0 0-2 2v11.5"
                            stroke="currentColor"
                            strokeLinecap="round"
                          ></path>
                        </svg>
                        <div className="flex ml-4">
                          <p className="text-sm max-h-5">Library</p>
                        </div>
                      </a>
                    )}
                  </Menu.Item>
                  <Menu.Item className="flex">
                    {({ active }) => (
                      <a
                        href="/home/story"
                        className={ClassNames(
                          active
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-700",
                          "block px-4 py-2 text-sm"
                        )}
                      >
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          aria-label="Stories"
                        >
                          <path
                            d="M4.75 21.5h14.5c.14 0 .25-.11.25-.25V2.75a.25.25 0 0 0-.25-.25H4.75a.25.25 0 0 0-.25.25v18.5c0 .14.11.25.25.25z"
                            stroke="currentColor"
                          ></path>
                          <path
                            d="M8 8.5h8M8 15.5h5M8 12h8"
                            stroke="currentColor"
                            strokeLinecap="round"
                          ></path>
                        </svg>
                        <div className="flex ml-4">
                          <p className="text-sm max-h-5">Stories</p>
                        </div>
                      </a>
                    )}
                  </Menu.Item>
                </div>
                <div className="px-6 py-4">
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href="/home/refine"
                        className={ClassNames(
                          active
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-700",
                          "block w-full py-2 text-sm text-left"
                        )}
                      >
                        <div className="flex">
                          <p className="text-sm max-h-5">
                            Refine recommendations
                          </p>
                        </div>
                      </a>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href="/home/setting"
                        className={ClassNames(
                          active
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-700",
                          "block w-full py-2 text-sm text-left"
                        )}
                      >
                        <div className="flex">
                          <p className="text-sm max-h-5">Settings</p>
                        </div>
                      </a>
                    )}
                  </Menu.Item>
                </div>
                <div className="px-6 py-4">
                  <form method="POST" action="/#">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          type="submit"
                          className={ClassNames(
                            active
                              ? "bg-gray-100 text-gray-900"
                              : "text-gray-700",
                            "block w-full py-2 text-left text-sm"
                          )}
                        >
                          Sign out
                        </button>
                      )}
                    </Menu.Item>
                  </form>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </nav>
      <div id="crud-modal" tabIndex="-1" aria-hidden="true"
           className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full h-[calc(100%-1rem)] max-h-full">
        <div className="relative p-4 max-h-full">
          <div className="relative bg-white shadow ">
            <div className="flex items-center justify-between px-4 pt-4 border-b rounded-t ">
              <button type="button"
                      className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center "
                      data-modal-toggle="crud-modal">
                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                     viewBox="0 0 14 14">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            <form className="p-4 md:p-5">
              <div className="grid gap-4 mb-4 grid-cols-2">
                <div className="col-span-2">
                  <label htmlFor="name"
                         className="block mb-2 text-sm font-medium text-gray-900 ">Title</label>
                  <input type="text" name="title" id="title"
                         className="bg-gray-50 border-0 border-b-2 border-gray-300 text-gray-900 text-sm focus:outline-none focus:ring-0 focus:border-black peer block w-full p-2.5 "
                         placeholder="Write a preview title" required="" />
                </div>
                <div className="col-span-2">
                  <label htmlFor="name"
                         className="block mb-2 text-sm font-medium text-gray-900">Subtitle</label>
                  <input type="text" name="subtitle" id="subtitle"
                         className="bg-gray-50 border-0 border-b-2 border-gray-300 text-gray-900 text-sm focus:outline-none focus:ring-0 focus:border-black peer block w-full p-2.5 "
                         placeholder="Write a preview subtitle..." required="" />
                </div>
                <div className="col-span-2">
                  <label htmlFor="name"
                         className="block mb-2 text-sm font-medium text-gray-900 bg-[#fafafa]">Topic</label>
                  <input type="text" name="subtitle" id="subtitle"
                         className="bg-gray-50 border-0 border-b-2 border-gray-300 text-gray-900 text-sm focus:outline-none focus:ring-0 focus:border-black peer block w-full p-2.5 "
                         placeholder="Add a topic..." required="" />
                </div>
                <div className="col-span-2">
                  <label htmlFor="description"
                         className="block mb-2 text-sm font-medium text-gray-900">Story preview</label>
                  <div className="w-[440px] h-[200px] bg-[#fafafa]">

                  </div>
                </div>
              </div>
              <button type="submit"
                      className="px-4 py-1 bg-[#1a8917] rounded-full text-white text-base hover:bg-[#0f730c]">
                <span>Publish now</span></button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
    ;
}

export default CreatepostHeader;
