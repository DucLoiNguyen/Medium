import clsx from "clsx";
import profilesidebar from "./profile_sidebar.module.scss";
import React, { useState, useEffect } from "react";
import UserApi from "~/api/UserApi"

function ProfileSidebar() {
  const classNames = clsx(
    profilesidebar.sidebar,
    "lg:block hidden h-full sticky top-0",
  );

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
        <div className={classNames}>
          {data.map((item) => (
            <div className="mt-10" key={item._id}>
              <a rel="noopener follow" href="/home/profile/#">
                <div>
                  <img
                    alt="Poseidon"
                    className="rounded-full"
                    src="/ava.png"
                    width="88"
                    height="88"
                    loading="lazy"
                  />
                </div>
              </a>
              <div className="flex mt-4">
                <a rel="noopener follow" href="/home/profile/#">
                  <h2 className="mr-4 text-base font-bold">{item.username}</h2>
                </a>
                <a className="text-[#419d3f] hover:text-black" href="/home/setting">
                  <span className="text-[13px]">Edit profile</span>
                </a>
              </div>
              <div className="mt-2">
                <a className="text-[#6b6b6b] hover:text-black" href="/home/profile/#">
                  <h2 className="mr-4 text-base">{item.followers}</h2>
                </a>
              </div>
              <div className="mt-3">
                <p className="text-sm text-[#6b6b6b]">{item.bio}</p>
              </div>
              <div className="flex mt-6 mb-10">
                <button className="px-4 py-2 bg-[#1a8917] rounded-full text-white text-sm hover:bg-[#0f730c]">Follow</button>
                <div className="ml-2">
                  <button className="px-1 py-1 bg-[#1a8917] rounded-full text-white text-sm hover:bg-[#0f730c]">
                    <svg width="38" height="38" viewBox="0 0 38 38" fill="none" stroke="white"><rect x="26.25" y="9.25" width="0.5" height="6.5" rx="0.25"></rect><rect x="29.75" y="12.25" width="0.5" height="6.5" rx="0.25" transform="rotate(90 29.75 12.25)"></rect><path d="M19.5 12.5h-7a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h13a1 1 0 0 0 1-1v-5"></path><path d="M11.5 14.5L19 20l4-3"></path></svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default ProfileSidebar;
