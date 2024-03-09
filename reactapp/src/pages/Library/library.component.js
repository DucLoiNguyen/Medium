import React, { useState } from "react";
import YourList from "./yourlists";
import History from "./histories";

function Library() {
  const [activeTab, setActiveTab] = useState("1");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <>
      <div className="flex justify-center">
        <div className="block w-full mx-6">
          <div className="mt-[52px] mb-7">
            <div className="flex justify-between mb-10">
              <h1 className="text-5xl font-bold">Your Library</h1>
              <div className={`right-0 ml-4${activeTab === "1" ? "" : "hidden"}`}>
                <button className="flex px-5 py-2 bg-[#1a8917] rounded-full hover:opacity-75">
                  <p className="hidden text-base text-white md:block">New lists</p>
                  <p className="text-base text-white md:hidden">
                    <svg width="19" height="19" fill="currentColor">
                      <path
                        d="M9 9H3v1h6v6h1v-6h6V9h-6V3H9v6z"
                        fillRule="evenodd"
                      ></path>
                    </svg>
                  </p>
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
                      <p className="text-sm">Your lists</p>
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
                      <p className="text-sm">Saved lists</p>
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
                      <p className="text-sm">Reading history</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="">
            <div className="divide-y">
              {/* Your lists */}
              {activeTab === "1" && <YourList />}

              {/* Saved lists */}
              {activeTab === "2" && <h1>saved lists</h1>}

              {/* Reading history */}
              {activeTab === "3" && <History />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Library;
