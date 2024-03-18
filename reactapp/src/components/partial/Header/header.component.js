import clsx from "clsx";
import header from "./header.module.scss";
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ClassNames } from "~/util";
import ava from "~/assets/image/ava.png";

function Header() {
  const classNames = clsx(header.svg);

  return (
    <>
      <nav className="flex justify-end w-full px-6 shadow h-14">
        <div className="flex place-items-center">
          <a href="/home">
            <svg viewBox="0 0 1043.63 592.71" className={classNames}>
              <g data-name="Layer 2">
                <g data-name="Layer 1">
                  <path d="M588.67 296.36c0 163.67-131.78 296.35-294.33 296.35S0 460 0 296.36 131.78 0 294.34 0s294.33 132.69 294.33 296.36M911.56 296.36c0 154.06-65.89 279-147.17 279s-147.17-124.94-147.17-279 65.88-279 147.16-279 147.17 124.9 147.17 279M1043.63 296.36c0 138-23.17 249.94-51.76 249.94s-51.75-111.91-51.75-249.94 23.17-249.94 51.75-249.94 51.76 111.9 51.76 249.94"></path>
                </g>
              </g>
            </svg>
          </a>
          <div className="relative items-center hidden mx-4 group bg-neutral-50 rounded-l-3xl rounded-r-3xl md:flex">
            <div className="flex justify-center w-10 h-10 mx-2 border-gray rounded-l-3xl bg-neutral-50 place-items-center">
              <svg
                className="text-[#6b6b6b]"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M4.1 11.06a6.95 6.95 0 1 1 13.9 0 6.95 6.95 0 0 1-13.9 0zm6.94-8.05a8.05 8.05 0 1 0 5.13 14.26l3.75 3.75a.56.56 0 1 0 .8-.79l-3.74-3.73A8.05 8.05 0 0 0 11.04 3v.01z"
                  fill="currentColor"
                ></path>
              </svg>
            </div>
            <input
              className="w-52 h-10 border-gray p-2 rounded-r-3xl bg-neutral-50 outline-none py-2.5 pr-5 pl-0"
              placeholder="Search"
            ></input>
          </div>
        </div>
        <div className="relative flex justify-end w-full place-items-center">
          <div className="pr-8">
            <a href="/#" className="text-[#6b6b6b] hover:text-black md:hidden">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M4.1 11.06a6.95 6.95 0 1 1 13.9 0 6.95 6.95 0 0 1-13.9 0zm6.94-8.05a8.05 8.05 0 1 0 5.13 14.26l3.75 3.75a.56.56 0 1 0 .8-.79l-3.74-3.73A8.05 8.05 0 0 0 11.04 3v.01z"
                  fill="currentColor"
                ></path>
              </svg>
            </a>
          </div>
          <div className="hidden pr-8 md:block">
            <a href="/#" className="flex text-[#6b6b6b] hover:text-black">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                aria-label="Write"
              >
                <path
                  d="M14 4a.5.5 0 0 0 0-1v1zm7 6a.5.5 0 0 0-1 0h1zm-7-7H4v1h10V3zM3 4v16h1V4H3zm1 17h16v-1H4v1zm17-1V10h-1v10h1zm-1 1a1 1 0 0 0 1-1h-1v1zM3 20a1 1 0 0 0 1 1v-1H3zM4 3a1 1 0 0 0-1 1h1V3z"
                  fill="currentColor"
                ></path>
                <path
                  d="M17.5 4.5l-8.46 8.46a.25.25 0 0 0-.06.1l-.82 2.47c-.07.2.12.38.31.31l2.47-.82a.25.25 0 0 0 .1-.06L19.5 6.5m-2-2l2.32-2.32c.1-.1.26-.1.36 0l1.64 1.64c.1.1.1.26 0 .36L19.5 6.5m-2-2l2 2"
                  stroke="currentColor"
                ></path>
              </svg>
              <div className="mx-2">Write</div>
            </a>
          </div>
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
              <Menu.Items className="absolute right-0 z-10 w-56 mt-2 origin-top-right bg-white divide-y rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none divide-solid">
                <div className="px-2 py-4">
                  <Menu.Item className="flex">
                    {({ active }) => (
                      <a
                        href="/home/profile"
                        className={ClassNames(
                          active
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-700",
                          "block px-4 py-2 text-sm",
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
                          "block px-4 py-2 text-sm",
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
                          "block px-4 py-2 text-sm",
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
                  <Menu.Item className="flex md:hidden">
                    {({ active }) => (
                      <a
                        href="/#"
                        className={ClassNames(
                          active
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-700",
                          "block px-4 py-2 text-sm",
                        )}
                      >
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          aria-label="Write"
                        >
                          <path
                            d="M14 4a.5.5 0 0 0 0-1v1zm7 6a.5.5 0 0 0-1 0h1zm-7-7H4v1h10V3zM3 4v16h1V4H3zm1 17h16v-1H4v1zm17-1V10h-1v10h1zm-1 1a1 1 0 0 0 1-1h-1v1zM3 20a1 1 0 0 0 1 1v-1H3zM4 3a1 1 0 0 0-1 1h1V3z"
                            fill="currentColor"
                          ></path>
                          <path
                            d="M17.5 4.5l-8.46 8.46a.25.25 0 0 0-.06.1l-.82 2.47c-.07.2.12.38.31.31l2.47-.82a.25.25 0 0 0 .1-.06L19.5 6.5m-2-2l2.32-2.32c.1-.1.26-.1.36 0l1.64 1.64c.1.1.1.26 0 .36L19.5 6.5m-2-2l2 2"
                            stroke="currentColor"
                          ></path>
                        </svg>
                        <div className="flex ml-4">
                          <p className="text-sm max-h-5">Write</p>
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
                          "block w-full py-2 text-sm text-left",
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
                          "block w-full py-2 text-sm text-left",
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
                            "block w-full py-2 text-left text-sm",
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
    </>
  );
}

export default Header;
