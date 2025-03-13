function Following() {
  return (
    <>
      <div>
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
        <div className="flex mt-3 justify-between">
          <div className="max-w-lg">
            <div>
              <a href="/#">
                <h2 className="font-bold text-2xl">
                  The secret life of the people width high self-control(it's
                  easier than you think)
                </h2>
              </a>
            </div>
            <div className="">
              <a href="/#">
                <p className="h-[48px] line-clamp-2 max-w-full text-[#6b6b6b]">
                  Improve your life and get ahead of your peers in 10 simple
                  steps — The concept of habits became extremely popular in the
                  recent years, mostly due to the personal development wave
                  brought up by the Gen Z culture. Also, due to the books that
                  appeared in the recent years, out of which, the most famous
                  and a favorite of mine, Atomic Habits. Mostly…
                </p>
              </a>
            </div>
            <div className="flex justify-between mt-3 align-middle">
              <div className="flex text-sm text-[#6b6b6b] font-customs">
                <div className="flex">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                       stroke="currentColor" className="size-4">
                    <path strokeLinecap="round" strokeLinejoin="round"
                          d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                  <span>11m ago</span>
                </div>
                <div className="flex mx-2">
                  <div className="mx-1">
                    <button>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}
                           stroke="currentColor" className="size-4">
                        <path strokeLinecap="round" strokeLinejoin="round"
                              d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z" />
                      </svg>
                    </button>
                    <span>10k</span>
                  </div>
                  <div className="mx-1">
                    <button>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                           className="size-4">
                        <path fillRule="evenodd"
                              d="M4.804 21.644A6.707 6.707 0 0 0 6 21.75a6.721 6.721 0 0 0 3.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 0 1-.814 1.686.75.75 0 0 0 .44 1.223ZM8.25 10.875a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25ZM10.875 12a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Zm4.875-1.125a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25Z"
                              clipRule="evenodd" />
                      </svg>
                    </button>
                    <span>500</span>
                  </div>
                </div>
              </div>
              <div>b</div>
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
    </>
  );
}

export default Following;
