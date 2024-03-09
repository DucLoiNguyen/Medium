function Info() {
  return (
    <>
      <div className="divide-y">
        <div className="my-14">
          <button className="text-[#6b6b6b] hover:text-black my-8 text-right w-full flex justify-between text-sm">
            <span className="mr-4 text-black">Email address</span>
            <span className="truncate max-w-[100px] md:max-w-[250px]">
              poseidon160302@gmail.com
            </span>
          </button>
          <button className="text-[#6b6b6b] hover:text-black my-8 text-right w-full flex justify-between text-sm">
            <span className="mr-4 text-black">User name</span>
            <span className="truncate max-w-[100px] md:max-w-[250px]">
              @poseidon160302
            </span>
          </button>
          <button className="text-[#6b6b6b] hover:text-black my-8 text-right w-full flex justify-between text-sm">
            <span className="mr-4 text-black">Living at</span>
            <span className="truncate max-w-[100px] md:max-w-[250px]">
              Hanoi
            </span>
          </button>
          <button className="text-[#6b6b6b] hover:text-black my-8 text-right w-full flex justify-between text-sm">
            <span className="mr-4 text-black">Phone</span>
            <span className="truncate max-w-[100px] md:max-w-[250px]">
              0963417801
            </span>
          </button>
          <button className="text-[#6b6b6b] hover:text-black my-8 text-right w-full flex justify-between text-sm">
            <span className="mr-4 text-black">Profile informations</span>
            <span className="truncate max-w-[100px] md:max-w-[250px] flex">
              <span>Poseidon</span>
              <span className="ml-3">
                <img
                  alt="Poseidon"
                  className="rounded-full"
                  src="/ava.png"
                  width="24"
                  height="24"
                  loading="lazy"
                />
              </span>
            </span>
          </button>
        </div>
        <div className="my-14">
          <button className="text-[#6b6b6b] hover:text-black my-8 text-right w-full flex justify-between text-sm">
            <span className="mr-4 text-black">Blocked users</span>
            <span className="truncate max-w-[100px] md:max-w-[250px] flex">
              <span className="ml-3">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="currentColor"
                  data-settings-arrow="true"
                >
                  <path
                    d="M.65 10.65a.5.5 0 0 0 .7.7l-.7-.7zM11 1h.5a.5.5 0 0 0-.5-.5V1zm-.5 7a.5.5 0 0 0 1 0h-1zM4 .5a.5.5 0 0 0 0 1v-1zM1.35 11.35l10-10-.7-.7-10 10 .7.7zM10.5 1v7h1V1h-1zM4 1.5h7v-1H4v1z"
                    fill="curnetColor"
                  ></path>
                </svg>
              </span>
            </span>
          </button>
        </div>
        <div className="my-14">
          <button className="text-[#c94a4a] hover:text-red my-8 text-right flex justify-between text-sm">
            <span className="mr-4">Sign out</span>
          </button>
        </div>
      </div>
    </>
  );
}

export default Info;
