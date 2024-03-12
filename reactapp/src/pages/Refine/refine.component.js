import React, { useState, useEffect } from "react";
import Follow from "./follow";
import Suggestion from "./suggestions";
import { useParams } from "react-router-dom";

function Refine() {
  const [activeTab, setActiveTab] = useState("following");
  const params = useParams();

  useEffect(() => {
    setActiveTab(params.id ? params.id : "following");
  }, [params]);

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
                  <img
                    alt="Poseidon"
                    className="rounded-full"
                    src="/ava.png"
                    width="48"
                    height="48"
                    loading="lazy"
                  />
                </button>
              </div>
              <h1 className="text-5xl font-bold">Refine recommendations</h1>
            </div>
            <div className="bg-white">
              <div className="flex place-items-center">
                <div>
                  <button
                    className="text-[#6b6b6b] hover:text-black"
                    onClick={() => handleTabClick("following")}
                  >
                    <div
                      className={`pb-4 mr-8 ${
                        activeTab === "following"
                          ? "text-black"
                          : "hover:text-black"
                      }`}
                    >
                      <p className="text-sm">Following</p>
                    </div>
                  </button>
                </div>
                <div>
                  <button
                    className="text-[#6b6b6b] hover:text-black"
                    onClick={() => handleTabClick("suggestion")}
                  >
                    <div
                      className={`pb-4 mr-8 ${
                        activeTab === "suggestion"
                          ? "text-black"
                          : "hover:text-black"
                      }`}
                    >
                      <p className="text-sm">Suggestions</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="">
            <div className="">
              {/* Following */}
              {activeTab === "following" && <Follow />}

              {/* Suggestions */}
              {activeTab === "suggestion" && <Suggestion />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Refine;
