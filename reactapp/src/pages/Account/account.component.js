import React, { useState, useEffect, useRef } from "react";
import { getPosts } from "~/api/api";

function Account() {
  const [data, setData] = useState(null);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);
  const itemposition = 200;

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const responseData = await getPosts("/post/getpost");
        setData(responseData);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    fetchInitialData();
  }, []);

  const scrollRef = useRef();

  const scroll = (s) => {
    scrollRef.current.scrollBy({
      left: s,
    });
  };

  return (
    <>
      <div className="container px-4 mx-auto">
        <h1 className="mt-8 text-3xl font-bold">Content Goes Here</h1>
        <div className="flex">
          <button onClick={() => scroll(-itemposition)} className="md:hidden">
            left
          </button>
          <div
            ref={scrollRef}
            className="overflow-x-auto max-w-[300px] flex md:max-w-full snap-x scroll-smooth truncate"
          >
            <span className="mr-4 bg-gray-200 min-w-32">Item 1</span>
            <span className="mr-4 bg-gray-200 min-w-32">Item 2</span>
            <span className="mr-4 bg-gray-200 min-w-32">Item 3</span>
            <span className="mr-4 bg-gray-200 min-w-32">Item 4</span>
            <span className="mr-4 bg-gray-200 min-w-32">Item 5</span>
            <span className="mr-4 bg-gray-200 min-w-32">Item 6</span>
            <span className="mr-4 bg-gray-200 min-w-32">Item 6</span>
            <span className="mr-4 bg-gray-200 min-w-32">Item 6</span>
          </div>
          <button onClick={() => scroll(itemposition)} className="md:hidden">
            right
          </button>
        </div>
      </div>
      <div>
        {/* Hiển thị dữ liệu từ API */}
        {data && (
          <ul>
            {data.map((item) => (
              <div key={item._id}>
                <div>
                  <a href="/#">
                    <div className="flex place-items-center">
                      <img
                        alt="Poseidon"
                        className="rounded-full"
                        src="./ava.png"
                        width="24"
                        height="24"
                        loading="lazy"
                      />
                      <div className="ml-2">
                        <h4 className="text-sm">Riikka livanainen</h4>
                      </div>
                    </div>
                  </a>
                </div>
                <div className="flex justify-between mt-3">
                  <div className="max-w-lg">
                    <div>
                      <a href="/#">
                        <h2 className="font-bold">{item.header}</h2>
                      </a>
                    </div>
                    <div className="">
                      <a href="/#">
                        <p className="h-[78px] line-clamp-3 max-w-96">
                          {item.content}
                        </p>
                      </a>
                    </div>
                  </div>
                  <div className="hidden ml-14 md:block min-w-[112px] right-0">
                    <img
                      alt="Poseidon"
                      src="./conetnt1.jpg"
                      width="112"
                      height="112"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

export default Account;
