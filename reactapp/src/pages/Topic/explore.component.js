function Explore() {
  return (
    <>
      <div className="mt-20">
        <h2 className="w-full text-5xl font-bold text-center">Explore topics</h2>
        <div className="my-6">
          <div className="relative flex items-center justify-center mx-4 group bg-neutral-50 rounded-l-3xl rounded-r-3xl">
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
              className="w-6/12 h-16 border-gray p-2 rounded-r-3xl bg-neutral-50 outline-none py-2.5 pr-5 pl-0"
              placeholder="Search all topics"
            ></input>
          </div>
        </div>
      </div>
      <div className="mt-16 mb-20">
        <div className="mx-11">
          <div className="grid grid-col-3">
            <div>
              <h2 className="font-bold">life</h2>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Explore;