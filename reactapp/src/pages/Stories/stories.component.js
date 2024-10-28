import React, { useState } from "react";
import Draft from "./drafts";
import { Dialog } from '@headlessui/react'

function Story() {
  const [activeTab, setActiveTab] = useState("1");
  let [isOpen, setIsOpen] = useState(false)

  function open() {
    setIsOpen(true)
  }

  function close() {
    setIsOpen(false)
  }

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <>
      <div className="flex justify-center">
        <div className="block w-full mx-6">
          <div className="mt-[52px] mb-7">
            <div className="flex justify-between mb-10">
              <h1 className="text-5xl font-bold font-customs">Your Stories</h1>
              <div className={`right-0 ml-4 ${activeTab === "1" ? "" : "hidden"}`}>
                <button className="flex px-5 py-2 bg-[#1a8917] rounded-full hover:bg-[#0f730c] place-items-center">
                  <a href="/home/new-story">
                    <p className="hidden text-base text-white md:block">Write a story</p>
                    <p className="text-base text-white md:hidden">
                      <svg width="19" height="19" fill="currentColor">
                        <path
                          d="M9 9H3v1h6v6h1v-6h6V9h-6V3H9v6z"
                          fillRule="evenodd"
                        ></path>
                      </svg>
                    </p>
                  </a>
                </button>
              </div>
            </div>
            <div className="bg-white">
              <div className="flex place-items-center">
                <div>
                  <button
                    className="text-[#6b6b6b] hover:text-black"
                    onClick={() => handleTabClick("1")}
                  >
                    <div
                      className={`pb-4 mr-8 ${activeTab === "1" ? "text-black" : "hover:text-black"}`}
                    >
                      <p className="text-sm">Drafts</p>
                    </div>
                  </button>
                </div>
                <div>
                  <button
                    className="text-[#6b6b6b] hover:text-black"
                    onClick={() => handleTabClick("2")}
                  >
                    <div
                      className={`pb-4 mr-8 ${activeTab === "2" ? "text-black" : "hover:text-black"}`}
                    >
                      <p className="text-sm">Published</p>
                    </div>
                  </button>
                </div>
                <div>
                  <button
                    className="text-[#6b6b6b] hover:text-black"
                    onClick={() => handleTabClick("3")}
                  >
                    <div
                      className={`pb-4 mr-8 ${activeTab === "3" ? "text-black" : "hover:text-black"}`}
                    >
                      <p className="text-sm">Responeses</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="">
            <div className="">
              {/* Drafts */}
              {activeTab === "1" && <Draft />}

              {/* Published */}
              {activeTab === "2" && <div>
                <button
                  onClick={open}
                  className="rounded-md bg-black/20 py-2 px-4 text-sm font-medium text-white focus:outline-none data-[hover]:bg-black/30 data-[focus]:outline-1 data-[focus]:outline-white"
                >
                  Open dialog
                </button>

                <Dialog open={isOpen} as="div" className="relative z-10 focus:outline-none" onClose={close}>
                  <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                      <dialogPanel
                        transition
                        className="w-full max-w-md rounded-xl bg-white/5 p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
                      >
                        <dialogTitle as="h3" className="text-base/7 font-medium text-white">
                          Payment successful
                        </dialogTitle>
                        <p className="mt-2 text-sm/6 text-white/50">
                          Your payment has been successfully submitted. We’ve sent you an email with all of the details
                          of your
                          order.
                        </p>
                        <div className="mt-4">
                          <button
                            className="inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[focus]:outline-1 data-[focus]:outline-white data-[open]:bg-gray-700"
                            onClick={close}
                          >
                            Got it, thanks!
                          </button>
                        </div>
                      </dialogPanel>
                    </div>
                  </div>
                </Dialog>
              </div>}

              {/* Responses */}
              {activeTab === "3" && <h1>e</h1>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Story;
