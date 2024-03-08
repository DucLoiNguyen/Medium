function Start() {
  return (
    <>
      <div className="mt-12 border-black border-b-1">
        <div className="pt-10 pb-4 mx-6">
          <div className="flex mb-4 place-items-center">
            <svg width="28" height="29" viewBox="0 0 28 29" fill="none">
              <path fill="#fff" d="M0 .8h28v28H0z"></path>
              <g opacity="0.8" clipPath="url(#trending_svg__clip0)">
                <path fill="#fff" d="M4 4.8h20v20H4z"></path>
                <circle cx="14" cy="14.79" r="9.5" stroke="#000"></circle>
                <path
                  d="M5.46 18.36l4.47-4.48M9.97 13.87l3.67 3.66M13.67 17.53l5.1-5.09M16.62 11.6h3M19.62 11.6v3"
                  stroke="#000"
                  strokeLinecap="round"
                ></path>
              </g>
              <defs>
                <clipPath id="trending_svg__clip0">
                  <path
                    fill="#fff"
                    transform="translate(4 4.8)"
                    d="M0 0h20v20H0z"
                  ></path>
                </clipPath>
              </defs>
            </svg>
            <h2>Trend on Medium</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <div className="p-4 bg-gray-100">
              <div className="">
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
                <div className="flex mt-3">
                  <div className="max-w-lg">
                    <div>
                      <a href="/#">
                        <h2 className="font-bold">
                          The secret life of the people width high
                          self-control(it's easier than you think)
                        </h2>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 bg-gray-100">Item 3</div>
            <div className="p-4 bg-gray-100">Item 4</div>
            <div className="p-4 bg-gray-100">Item 5</div>
            <div className="p-4 bg-gray-100">Item 6</div>
            <div className="p-4 bg-gray-100">Item 7</div>
          </div>
        </div>
      </div>
      <div className="flex justify-center mt-12">
        <div className="py-4">
          <div className="mx-6 mt-8">
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
            <div className="flex mt-3">
              <div className="max-w-5xl">
                <div>
                  <a href="/#">
                    <h2 className="font-bold">
                      The secret life of the people width high self-control(it's
                      easier than you think)
                    </h2>
                  </a>
                </div>
                <div className="">
                  <a href="/#">
                    <p className="h-[78px] line-clamp-3">
                      Improve your life and get ahead of your peers in 10 simple
                      steps — The concept of habits became extremely popular in
                      the recent years, mostly due to the personal development
                      wave brought up by the Gen Z culture. Also, due to the
                      books that appeared in the recent years, out of which, the
                      most famous and a favorite of mine, Atomic Habits. Mostly…
                    </p>
                  </a>
                </div>
              </div>
              <div className="hidden ml-14 md:block min-w-[200px]">
                <img
                  alt="Everything I Know About Creating Buzz, I Learned From Taylor Swift"
                  src="./content2.jpg"
                  width="200"
                  height="134"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Start;
