import React, { useState } from 'react';

function Notification() {
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
              <h1 className="text-5xl text-bold">Notifications</h1>
            </div>
            <div className="bg-white">
              <div className="flex place-items-center">
                <div>
                  <button className="text-[#6b6b6b] hover:text-black" onClick={() => handleTabClick('1')}>
                    <div className={`pb-4 mr-8 ${activeTab === "1" ? "text-black" : "hover:text-black"}`}>
                      <p className="text-sm">All</p>
                    </div>
                  </button>
                </div>
                <div>
                  <button className="text-[#6b6b6b] hover:text-black" onClick={() => handleTabClick('2')}>
                    <div className={`pb-4 mr-8 ${activeTab === "2" ? "text-black" : "hover:text-black"}`}>
                      <p className="text-sm">Response</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12">
            <div className="mx-6">
              {/* All */}
              {activeTab === '1' && <h1>Hello</h1>}

              {/* Responese */}
              {activeTab === '2' && <h1>Bye</h1>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Notification;