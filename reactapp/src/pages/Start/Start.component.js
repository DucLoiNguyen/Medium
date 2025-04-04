import banner from '~/assets/image/4_SdjkdS98aKH76I8eD0_qjw.webp';

function Start() {
    return (
        <>
            {/* Main Content */ }
            <main className="max-w-7xl mx-auto px-6 md:px-16">
                <div className="md:flex items-center justify-center absolute right-0 top-4 hidden">
                    <div className="w-full h-full">
                        <div className="w-full">
                            <img alt="Brand image" className=""
                                 src={ banner }
                                 width="460"
                                 height="600" loading="eager" />
                        </div>
                    </div>
                </div>

                <div className="w-full mx-auto px-6 md:px-16 py-20">
                    <div className="flex flex-col justify-center font-customs">
                        <h1 className="text-6xl md:text-8xl text-gray-900 leading-tight mb-6 font-customs2 max-w-xl">
                            Human stories <span className="font-serif">&</span> ideas
                        </h1>
                        <p className="text-xl text-gray-700 mb-8">
                            A place to read, write, and deepen your understanding
                        </p>
                        <div>
                            <a href="/start-reading"
                               className="inline-block bg-gray-900 text-white px-10 py-3 rounded-full text-base font-medium hover:opacity-75">
                                Start reading
                            </a>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}

export default Start;
