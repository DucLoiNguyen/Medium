import React, { useState, useEffect } from "react";
import Post from "./posts";
import UserApi from "~/api/UserApi"

function Profile() {
  const [activeTab, setActiveTab] = useState("1");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const responseData = await UserApi.getAllUsers();
        setData(responseData);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    fetchInitialData();
  }, []);
  return (
    <>
      {data && (
        <div className="flex justify-center">
          {data.map((item) => (
            <div className="block w-full mx-6" key={item._id}>
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
                  <h1 className="text-5xl font-bold font-customs">{item.username}</h1>
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
                          <p className="text-sm">Posts</p>
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
                          <p className="text-sm">About</p>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="">
                <div className="">
                  {/* Posts */}
                  {activeTab === "1" && <Post />}

                  {/* About */}
                  {activeTab === "2" && <h1>About</h1>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default Profile;
