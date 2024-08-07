function YourList() {
  return (
    <>
      <div className="px-6 pt-6 pb-[10px]">
        <div>
          <a href="/#">
            <div className="flex place-items-center">
              <img
                alt="Poseidon"
                className="rounded-full"
                src="/ava.png"
                width="24"
                height="24"
                loading="lazy"
              />
              <div className="ml-2">
                <h4 className="text-sm">Poseidon</h4>
              </div>
            </div>
          </a>
        </div>
        <div className="flex mt-3">
          <div className="max-w-lg">
            <div>
              <a href="/#">
                <h2 className="font-bold text-[20px]">Reading list</h2>
              </a>
            </div>
          </div>
        </div>
        <div className="text-right">
          <button className="text-[#c94a4a] hover:text-black">
            <span className="text-sm">Remove list</span>
          </button>
        </div>
      </div>
    </>
  );
}

export default YourList;
