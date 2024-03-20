import React, { useState, useEffect } from "react";
import PostApi from "~/api/PostApi";

function Post() {
  const [data, setData] = useState(null);
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const responseData = await PostApi.getPostsByAuthor();
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
        <div>
          {data.map((item) => (
            <div className="mb-10" key={item._id}>
              <div className="flex mt-3">
                <div className="max-w-lg">
                  <div>
                    <a href="/#">
                      <h2 className="font-bold">
                        {item.header}
                      </h2>
                    </a>
                  </div>
                  <div className="">
                    <a href="/#">
                      <p className="h-[75px] line-clamp-3 max-w-96 font-customs2">
                        {item.content}
                      </p>
                    </a>
                  </div>
                </div>
                <div className="hidden ml-14 md:block min-w-[112px]">
                  <img
                    alt="Poseidon"
                    src="/conetnt1.jpg"
                    width="112"
                    height="112"
                    loading="lazy"
                  />
                </div>
              </div></div>
          ))}
        </div>
      )}
    </>
  );
}

export default Post;
