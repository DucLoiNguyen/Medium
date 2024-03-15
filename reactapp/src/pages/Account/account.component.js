import React, { useState, useEffect, useRef } from "react";

function Account() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const itemposition = 200;

  const fetchData = async () => {
    fetch("http://localhost:3030/api/")
      .then((res) => res.json())
      .then((d) => {
        setData(d);
        console.log(d);
      })
      .catch((error) => setError(error))
      .finally(() => setLoading(false))
  };

  useEffect(() => {
    fetchData();
  }, []);

  const scrollRef = useRef();

  const scroll = (s) => {
    scrollRef.current.scrollBy({
      left: s
    });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  return (
    <>
      <div className="container px-4 mx-auto">
        <h1 className="mt-8 text-3xl font-bold">Content Goes Here</h1>
        <div className="flex">
          <button onClick={() => scroll(-itemposition)} className="md:hidden">left</button>
          <div ref={scrollRef} className="overflow-x-auto max-w-[300px] flex md:max-w-full snap-x scroll-smooth truncate">
            <span className="mr-4 bg-gray-200 min-w-32">Item 1</span>
            <span className="mr-4 bg-gray-200 min-w-32">Item 2</span>
            <span className="mr-4 bg-gray-200 min-w-32">Item 3</span>
            <span className="mr-4 bg-gray-200 min-w-32">Item 4</span>
            <span className="mr-4 bg-gray-200 min-w-32">Item 5</span>
            <span className="mr-4 bg-gray-200 min-w-32">Item 6</span>
            <span className="mr-4 bg-gray-200 min-w-32">Item 6</span>
            <span className="mr-4 bg-gray-200 min-w-32">Item 6</span>
          </div>
          <button onClick={() => scroll(itemposition)} className="md:hidden">right</button>
        </div>
      </div>
      <div>{data.hello}</div>
    </>
  );
}

export default Account;
