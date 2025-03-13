import { ClassNames } from "~/util";
import { Fragment, useState } from "react";
import { Menu, Transition, Dialog } from "@headlessui/react";

function Draft() {
  const [isOpen, setIsOpen] = useState(false);

  function open() {
    setIsOpen(true);
  }

  function close() {
    setIsOpen(false);
  }

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
                          "block px-4 py-2 text-sm"
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
                        onClick={open}
                        className={ClassNames(
                          active
                            ? "bg-gray-100 text-gray-900"
                            : "text-[#c94a4a]",
                          "block px-4 py-2 text-sm w-full"
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
          <Dialog open={isOpen} as="div" className="relative z-10 focus:outline-none" onClose={close}>
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4">
                <Dialog.Panel
                  transition
                  className="w-full max-w-xl rounded-xl bg-white p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0 z-50 drop-shadow-2xl"
                >
                  <Dialog.Title as="h1" className="font-customs font-bold text-black text-center text-3xl tracking-tight">
                    Delete story
                  </Dialog.Title>
                  <p className="mt-2 text-sm/6 text-black px-6 text-center">
                    Your payment has been successfully submitted. We’ve sent you an email with all of the details of your
                    order.
                  </p>
                  <div className="mt-4 text-center">
                    <button
                      className="inline-flex items-center gap-2 py-1.5 px-3 mx-2 text-sm/6 font-customs border-solid border-2 border-[#6b6b6b] hover:border-black rounded-full"
                      onClick={close}
                    >
                      Cancel
                    </button>
                    <button
                      className="inline-flex items-center gap-2 py-1.5 px-3 mx-2 text-sm/6 font-customs border-solid border-2 border-[#c94a4a] bg-[#c94a4a] hover:bg-[#b63636] rounded-full hover:border-[#b63636] text-white"
                      onClick={close}
                    >
                      Delete
                    </button>
                  </div>
                </Dialog.Panel>
              </div>
            </div>
          </Dialog>
        </div>
      </div>

    </>
  );
}

export default Draft;
