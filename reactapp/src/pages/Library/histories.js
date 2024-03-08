function History() {
  return (
    <>
      <div className="flex justify-between mb-10">
        <p className="text-sm">You can clear your reading history for a fresh start.</p>
        <div className="text-right">
          <button className="py-[5px] px-5 bg-[#c94a4a] rounded-full"><span className="text-sm text-white">Clear history</span></button>
        </div>
      </div>
      <div className="py-10">
        <div>
          <a href="/#">
            <div className="flex place-items-center">
              <img alt="Poseidon" className="rounded-full" src="/ava.png" width="24" height="24" loading="lazy" />
              <div className="ml-2"><h4 className="text-sm">Riikka livanainen</h4></div>
            </div>
          </a>
        </div>
        <div className="flex mt-3">
          <div className="max-w-lg">
            <div>
              <a href="/#">
                <h2 className="font-bold">
                  The secret life of the people width high self-control(it's easier than you think)
                </h2>
              </a>
            </div>
            <div className="">
              <a href="/#">
                <p className="h-[78px] line-clamp-3 max-w-96">
                  Improve your life and get ahead of your peers in 10 simple steps —  The concept of habits became extremely popular in the recent years, mostly due to the personal development wave brought up by the Gen Z culture. Also, due to the books that appeared in the recent years, out of which, the most famous and a favorite of mine, Atomic Habits. Mostly…
                </p>
              </a>
            </div>
          </div>
          <div className="hidden ml-14 md:block min-w-[112px]">
            <img alt="Poseidon" src="/conetnt1.jpg" width="112" height="112" loading="lazy" />
          </div>
        </div>
      </div>
    </>
  );
}

export default History;