import Header from "~/components/partial/Header/header.component";
import Footer from "~/components/partial/Footer/footer.component";
// import ProfileSidebar from "~/components/partial/Profile_sidebar/profile_sidebar.component";
import settinglayout from "./settinglayout.module.scss";
import clsx from "clsx";
import { Toaster } from 'sonner';

function SettingLayout({ children }) {
  const classNames = clsx(settinglayout.main, "sm:w-full");
  return (
    <>
      <Header />
      <div className="container flex justify-center mx-auto divide-x">
        <div className={classNames}>{children}</div>
        {/* <ProfileSidebar /> */}
      </div>
      <Footer />
      <Toaster position="bottom-right" />
    </>
  );
}

export default SettingLayout;
