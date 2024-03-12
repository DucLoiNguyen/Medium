function Follow() {
  return (
    <>
      <div className="divide-y divide-solid">
        <div className="mb-10 pt-8">
          <h2 className="font-bold text-base">Writer</h2>
          <div class="mt-4 mb-6 w-full">
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
              <button className="border-solid border-2 border-[#1c8a19] hover:border-black hover:text-black rounded-full px-3 py-1 text-sm right-0 text-[#1c8a19]">
                Following
              </button>
            </div>
          </div>
        </div>
        <div className="mb-10 pt-8">
          <h2 className="font-bold text-base">Publication</h2>
          <div class="mt-4 mb-6 w-full">
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
              <button className="border-solid border-2 border-[#1c8a19] hover:border-black hover:text-black rounded-full px-3 py-1 text-sm right-0 text-[#1c8a19]">
                Following
              </button>
            </div>
          </div>
        </div>
        <div className="mb-10 pt-8">
          <h2 className="font-bold text-base">Topic</h2>
          <div class="mt-4 mb-6 w-full">
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
                      <p className="w-96 overflow-hidden text-sm whitespace-nowrap overflow-ellipsis divide-x divide-dotted">
                        <span className="text-[#6b6b6b] mx-2">56K Stories</span>
                        <span className="text-[#6b6b6b] mx-2">23K Writers</span>
                      </p>
                    </a>
                  </div>
                </div>
              </div>
              <button className="border-solid border-2 border-[#1c8a19] hover:border-black hover:text-black rounded-full px-3 py-1 text-sm right-0 text-[#1c8a19]">
                Following
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Follow;
