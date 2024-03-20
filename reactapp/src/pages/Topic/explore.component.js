import React, { useState, useEffect } from "react";
import TopicApi from "~/api/TopicApi";

function Explore() {
  const [menuActive, setMenuActive] = useState(false);
  const [data, setData] = useState(null);

  const toggleMenu = () => {
    setMenuActive(!menuActive);
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const responseData = await TopicApi.getAllTopics();
        setData(responseData);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    fetchInitialData();
  }, []);

  return (
    <>
      <div className="mt-20">
        <h2 className="flex justify-center w-full text-5xl font-semibold text-center place-items-start">
          <span className="mr-2">
            <svg viewBox="0 0 24 24" fill="none" height="30" width="30">
              <circle cx="12" cy="12" r="10.5" stroke="currentColor"></circle>
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M16.08 6.17l-.14.99-.99 6.63-.03.25-.22.12-5.9 3.2-.88.47.14-1 .99-6.63.03-.24.22-.12 5.9-3.2.88-.47zm-6.16 4.98L9.2 16l4.3-2.34-3.58-2.51zm4.16 1.7l-3.59-2.52L14.8 8l-.72 4.84z"
                fill="currentColor"
              ></path>
            </svg>
          </span>
          <span className=" font-customs">Explore topics</span>
        </h2>
        <div className="flex justify-center my-6">
          <div className="relative flex items-center justify-center mx-4 group bg-neutral-50 rounded-l-3xl rounded-r-3xl md:w-6/12 w-80">
            <div className="flex justify-center w-16 h-16 mx-2 border-gray rounded-l-3xl bg-neutral-50 place-items-center">
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
              className="w-full h-16 border-gray p-2 rounded-r-3xl bg-neutral-50 outline-none py-2.5 pr-5 pl-0"
              placeholder="Search all topics"
            ></input>
          </div>
        </div>
      </div>
      <div className="mt-16 mb-20">
        <div className="mx-11">
          <div className="hidden grid-cols-1 gap-4 p-4 md:grid-cols-3 lg:grid">

            {data && (
              <>
                {data.map((item) => (
                  <div className="md:pl-16 md:pt-[0px] pt-10" key={item._id}>
                    <a href={`/home/explore/${item.tag}`}>
                      <h2 className="text-2xl font-semibold hover:underline font-customs">{item.topicname}</h2>
                    </a>
                    <div className="pt-8 pl-6">
                      {item.topicchilds.map((itemchild) => (
                        <div className="mb-4" key={itemchild._id}>
                          <a href={`/home/explore/${itemchild.tag}`}>
                            <p className="text-base text-[#6b6b6b] hover:text-black hover:underline">
                              {itemchild.topicchildName}
                            </p>
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
          <div>
            {data && (
              <>
                {data.map((item) => (
                  <div className="mb-8 bg-white rounded-lg shadow-md lg:hidden" key={item._id}>
                    <div className="container flex items-center justify-between px-6 mx-auto">
                      <a href={`/home/explore/${item.tag}`} className="text-xl font-semibold text-[#6b6b6b] font-customs">
                        {item.topicname}
                      </a>
                      <button
                        id="menu-button"
                        className="inline-flex items-center p-2 text-gray-400 rounded-md hover:text-gray-600"
                        onClick={toggleMenu}
                      >
                        <svg
                          width="24px"
                          height="24px"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M6 9l6 6 6-6"></path>
                        </svg>
                      </button>
                    </div>
                    <div className={menuActive ? "block" : "hidden"}>
                      <div className="pt-4 pl-4" >
                        <a href={`/home/explore/${item.tag}`}>
                          <h2 className="text-2xl font-semibold hover:underline font-customs">{item.topicname}</h2>
                        </a>
                        <div className="py-4 pl-6">
                          {item.topicchilds.map((itemchild) => (
                            <div className="mt-4" key={itemchild._id}>
                              <a href={`/home/explore/${itemchild.tag}`}>
                                <p className="text-base text-[#6b6b6b] hover:text-black hover:underline">
                                  {itemchild.topicchildName}
                                </p>
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Explore;
