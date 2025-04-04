import Header from "~/components/partial/Header/header.component";
import Footer from "~/components/partial/Footer/footer.component";
import topiclayout from "./topiclayout.module.scss";
import clsx from "clsx";
import { Toaster } from 'sonner';

function TopicLayout({ children }) {
  const classNames = clsx(topiclayout.main, "sm:w-full");
  return (
    <>
      <Header />
      <div className="container flex justify-center mx-auto divide-x">
        <div className={classNames}>{children}</div>
      </div>
      <Footer />
      <Toaster position="bottom-right" />
    </>
  );
}

export default TopicLayout;
