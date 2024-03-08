import clsx from "clsx";
import profilesidebar from "./profile_sidebar.module.scss";

function ProfileSidebar() {
  const classNames = clsx(
    profilesidebar.sidebar,
    "lg:block hidden h-full sticky top-0",
  );
  return (
    <>
      <div className={classNames}>
        <div className="mt-10">
          <a rel="noopener follow" href="/home/profile/#">
            <div>
              <img
                alt="Poseidon"
                className="rounded-full"
                src="/ava.png"
                width="88"
                height="88"
                loading="lazy"
              />
            </div>
          </a>
          <div className="mt-4">
            <a rel="noopener follow" href="/home/profile/#">
              <h2 className="text-base text-bold">Poseidon</h2>
            </a>
          </div>
          <div className="mt-6 mb-[46px]">
            <a className="text-[#419d3f] hover:text-black" href="/home/setting">
              <span className="mr-4 text-[13px]">Edit profile</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProfileSidebar;
