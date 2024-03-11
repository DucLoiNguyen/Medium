import clsx from "clsx";
import sidebar from "./sidebar.module.scss";

function Sidebar() {
  const classNames = clsx(
    sidebar.sidebar,
    "lg:block hidden h-full sticky top-0",
  );
  return (
    <>
      <div className={classNames}>
        <div className="mt-10">
          <div className="mb-5">
            <a href="/#">
              <h2 className="text-base font-bold">Staff Picks</h2>
            </a>
          </div>
          <div className="">
            <div className="pb-5">
              <div className="mb-2">
                <a href="/#">
                  <div className="flex">
                    <img
                      alt="Poseidon"
                      className="rounded-full"
                      src="/ava.png"
                      width="20"
                      height="20"
                      loading="lazy"
                    />
                    <div className="ml-2">
                      <h4 className="text-xs">Riikka livanainen</h4>
                    </div>
                  </div>
                </a>
              </div>
              <div>
                <a href="/#">
                  <h2 className="font-bold">
                    The secret life of the people width high self-control(it's
                    easier than you think)
                  </h2>
                </a>
              </div>
            </div>
            <div className="pb-5">
              <div className="mb-2">
                <a href="/#">
                  <div className="flex">
                    <img
                      alt="Poseidon"
                      className="rounded-full"
                      src="/ava.png"
                      width="20"
                      height="20"
                      loading="lazy"
                    />
                    <div className="ml-2">
                      <h4 className="text-xs">Riikka livanainen</h4>
                    </div>
                  </div>
                </a>
              </div>
              <div>
                <a href="/#">
                  <h2 className="font-bold">
                    The secret life of the people width high self-control(it's
                    easier than you think)
                  </h2>
                </a>
              </div>
            </div>
            <p className="text-xs">
              <a className="text-[#419d3f] hover:text-black" href="/#">
                See the full list
              </a>
            </p>
          </div>
        </div>
        <div className="mt-10">
          <div className="pb-4">
            <h2 className="text-base font-bold">Recommended topics</h2>
          </div>
          <div className="relative flex flex-wrap">
            <div className="rounded-full bg-[#f2f2f2] w-fit px-4 py-2 mb-3 mr-2">
              <a className="text-sm" href="/#">
                Programming
              </a>
            </div>
            <div className="rounded-full bg-[#f2f2f2] w-fit px-4 py-2 mb-3 mr-2">
              <a className="text-sm" href="/#">
                Data Science
              </a>
            </div>
            <div className="rounded-full bg-[#f2f2f2] w-fit px-4 py-2 mb-3 mr-2">
              <a className="text-sm" href="/#">
                Technology
              </a>
            </div>
            <div className="rounded-full bg-[#f2f2f2] w-fit px-4 py-2 mb-3 mr-2">
              <a className="text-sm" href="/#">
                Writing
              </a>
            </div>
            <div className="rounded-full bg-[#f2f2f2] w-fit px-4 py-2 mb-3 mr-2">
              <a className="text-sm" href="/#">
                Relationships
              </a>
            </div>
            <div className="rounded-full bg-[#f2f2f2] w-fit px-4 py-2 mb-3 mr-2">
              <a className="text-sm" href="/#">
                Machine Learning
              </a>
            </div>
          </div>
          <p className="pt-3 text-sm">
            <a className="text-[#419d3f] hover:text-black" href="/home/explore">
              See more topics
            </a>
          </p>
        </div>
        <div className="mt-10">
          <div className="">
            <h2 className="text-base font-bold">who to follow</h2>
          </div>
          <div className="flex pt-4 place-items-center">
            <div className="flex mr-2">
              <a href="/#">
                <div className="w-8 h-auto">
                  <img
                    alt="Poseidon"
                    className="rounded-full"
                    src="/ava.png"
                    width="32"
                    height="32"
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
                    <p className="w-40 overflow-hidden text-sm whitespace-nowrap overflow-ellipsis">
                      Author of Father Figure: How to Be a Feminist Dad...
                    </p>
                  </a>
                </div>
              </div>
            </div>
            <button className="border-solid border-2 border-[#6b6b6b] hover:border-black rounded-full px-3 py-1 text-sm">
              Follow
            </button>
          </div>
          <div className="flex pt-4 place-items-center">
            <div className="flex mr-2">
              <a href="/#">
                <div className="w-8 h-auto">
                  <img
                    alt="Poseidon"
                    className="rounded-full"
                    src="/ava.png"
                    width="32"
                    height="32"
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
                    <p className="w-40 overflow-hidden text-sm whitespace-nowrap overflow-ellipsis">
                      Author of Father Figure: How to Be a Feminist Dad
                      (www.FeministDadBook.com) Twitter: @jordosh
                    </p>
                  </a>
                </div>
              </div>
            </div>
            <button className="border-solid border-2 border-[#6b6b6b] hover:border-black rounded-full px-3 py-1 text-sm">
              Follow
            </button>
          </div>
          <div className="flex pt-4 place-items-center">
            <div className="flex mr-2">
              <a href="/#">
                <div className="w-8 h-auto">
                  <img
                    alt="Poseidon"
                    className="rounded-full"
                    src="/ava.png"
                    width="32"
                    height="32"
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
                    <p className="w-40 overflow-hidden text-sm whitespace-nowrap overflow-ellipsis">
                      Author of Father Figure: How to Be a Feminist Dad...
                    </p>
                  </a>
                </div>
              </div>
            </div>
            <button className="border-solid border-2 border-[#6b6b6b] hover:border-black rounded-full px-3 py-1 text-sm">
              Follow
            </button>
          </div>
          <p className="pt-6 text-sm">
            <a className="text-[#419d3f] hover:text-black" href="/#">
              See more suggestions
            </a>
          </p>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
