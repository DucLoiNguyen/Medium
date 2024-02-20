function Home() {
    return (
        <>
            <div className="sticky top-0 mt-10 border-b-2 bg-white pt-4">
                <div className="mx-6 flex place-items-center">
                    <div className="mr-6 pb-4">
                        <a className="rounded-full text-[#6b6b6b] hover:text-black" href="/#">
                            <p>
                                <svg width="19" height="19" fill="currentColor"><path d="M9 9H3v1h6v6h1v-6h6V9h-6V3H9v6z" fillRule="evenodd"></path></svg>
                            </p>
                        </a>
                    </div>
                    <div className="mr-8 border-b-2 border-black pb-4">
                        <a className="text-[#6b6b6b] hover:text-black" href="/#">
                            <p>For you</p>
                        </a>
                    </div>
                    <div className="mr-12 border-b-2 border-black pb-4">
                        <a className="text-[#6b6b6b] hover:text-black" href="/#">
                            <p>Following</p>
                        </a>
                    </div>
                </div>
            </div>
            <div className="mt-12">
                <div className="mx-6">
                    <div>
                        <a href="/#">
                            <div className="flex place-items-center">
                                <img alt="Poseidon" className="rounded-full" src="./ava.png" width="24" height="24" loading="lazy" />
                                <div className="ml-2"><h4 className="text-sm">Riikka livanainen</h4></div>
                            </div>
                        </a>
                    </div>
                    <div className="mt-3 flex">
                        <div>
                            <div>
                                <a href="/#">
                                    <h2 className="font-bold">
                                        The secret life of the people width high self-control(it's easier than you think)
                                    </h2>
                                </a>
                            </div>
                            <div>
                                <a href="/#">
                                    <p className="overflow-hidden whitespace-nowrap overflow-ellipsis w-96 h-20">
                                        Improve your life and get ahead of your peers in 10 simple steps —  The concept of habits became extremely popular in the recent years, mostly due to the personal development wave brought up by the Gen Z culture. Also, due to the books that appeared in the recent years, out of which, the most famous and a favorite of mine, Atomic Habits. Mostly…
                                    </p>
                                </a>
                            </div>
                        </div>
                        <div className="ml-14">
                            <img alt="Poseidon" src="./conetnt1.jpg" width="112" height="112" loading="lazy" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Home;