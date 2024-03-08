import Header from "~/components/partial/Header/header.component";
import Footer from "~/components/partial/Footer/footer.component";
import ProfileSidebar from "~/components/partial/Profile_sidebar/profile_sidebar.component";
import profileLayout from "./profilelayout.module.scss";
import clsx from "clsx";

function ProfileLayout({ children }) {
  const classNames = clsx(profileLayout.main, "sm:w-full");
  return (
    <div>
      <Header />
      <div className="container flex mx-auto divide-x justify-evenly">
        <div className={classNames}>{children}</div>
        <ProfileSidebar />
      </div>
      <Footer />
    </div>
  );
}

export default ProfileLayout;
