function Suggestion() {
  return (
    <>
      <div className="divide-y divide-solid">
        <div className="mb-12">
          <h2 className="font-bold text-base">Who to follow</h2>
          <div class="mt-6 mb-12 w-full">
            <div className="flex pt-4 place-items-center">
              <div className="flex w-full">
                <a href="/#">
                  <div className="w-12 h-auto">
                    <img
                      alt="Poseidon"
                      className="rounded-full"
                      src="/ava.png"
                      width="48"
                      height="48"
                      loading="lazy"
                    />
                  </div>
                </a>
                <div className="ml-4 mr-2">
                  <div>
                    <a href="/#">
                      <h2 className="text-base font-bold">Jordan Shapiro</h2>
                    </a>
                  </div>
                  <div>
                    <a href="/#">
                      <p className="w-96 overflow-hidden text-sm whitespace-nowrap overflow-ellipsis">
                        Author of Father Figure: How to Be a Feminist Dad...
                      </p>
                    </a>
                  </div>
                </div>
              </div>
              <button className="border-solid border-2 border-[#1c8a19] bg-[#1a8917] hover:opacity-75 rounded-full px-3 py-[5px] text-sm right-0 text-white">
                Follow
              </button>
            </div>
          </div>
          <div className="px-6">
            <a className="text-[#419d3f] hover:text-black" href="/#">
              <span className="text-sm">See more suggestions</span>
            </a>
          </div>
        </div>
        <div className="mb-12">
          <h2 className="font-bold text-base">Topics to follow</h2>
          <div class="mt-6 mb-12 w-full">
            <div className="flex pt-4 place-items-center">
              <div className="flex w-full">
                <a href="/#">
                  <div className="w-12 h-auto">
                    <img
                      alt="Poseidon"
                      className="rounded-full"
                      src="/ava.png"
                      width="48"
                      height="48"
                      loading="lazy"
                    />
                  </div>
                </a>
                <div className="ml-4 mr-2">
                  <div>
                    <a href="/#">
                      <h2 className="text-base font-bold">Jordan Shapiro</h2>
                    </a>
                  </div>
                  <div>
                    <a href="/#">
                      <p className="w-96 overflow-hidden text-sm whitespace-nowrap overflow-ellipsis">
                        Author of Father Figure: How to Be a Feminist Dad...
                      </p>
                    </a>
                  </div>
                </div>
              </div>
              <button className="border-solid border-2 border-[#1c8a19] bg-[#1a8917] hover:opacity-75 rounded-full px-3 py-[5px] text-sm right-0 text-white">
                Follow
              </button>
            </div>
          </div>
          <div className="px-6">
            <a className="text-[#419d3f] hover:text-black" href="/home/explore">
              <span className="text-sm">See more suggestions</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

export default Suggestion;
