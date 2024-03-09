import Header from "~/components/partial/Header/header.component";
import Footer from "~/components/partial/Footer/footer.component";
// import ProfileSidebar from "~/components/partial/Profile_sidebar/profile_sidebar.component";
import settinglayout from "./settinglayout.module.scss";
import clsx from "clsx";

function SettingLayout({ children }) {
  const classNames = clsx(settinglayout.main, "sm:w-full");
  return (
    <div>
      <Header />
      <div className="container flex mx-auto divide-x justify-evenly">
        <div className={classNames}>{children}</div>
        {/* <ProfileSidebar /> */}
      </div>
      <Footer />
    </div>
  );
}

export default SettingLayout;
