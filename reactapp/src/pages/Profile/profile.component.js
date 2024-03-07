import React, { useState } from 'react';
import Info from './informations';
import Security from './security';

function Profile() {
  const [activeTab, setActiveTab] = useState('1');

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <>
      <div className="flex justify-center">
        <div className="block w-full mx-6">
          <div className="mt-[52px] mb-7">
            <div className="mb-10">
              <h1 className="text-5xl text-bold">Profile</h1>
            </div>
            <div className="bg-white">
              <div className="flex place-items-center">
                <div>
                  <button className="text-[#6b6b6b] hover:text-black" onClick={() => handleTabClick('1')}>
                    <div className={`pb-4 mr-8 ${activeTab === "1" ? "text-black" : "hover:text-black"}`}>
                      <p className="text-sm">My informations</p>
                    </div>
                  </button>
                </div>
                <div>
                  <button className="text-[#6b6b6b] hover:text-black" onClick={() => handleTabClick('2')}>
                    <div className={`pb-4 mr-8 ${activeTab === "2" ? "text-black" : "hover:text-black"}`}>
                      <p className="text-sm">Security</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12">
            <div className="mx-6">
              {/* For you */}
              {activeTab === '1' && <Info />}

              {/* Following */}
              {activeTab === '2' && <Security />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;