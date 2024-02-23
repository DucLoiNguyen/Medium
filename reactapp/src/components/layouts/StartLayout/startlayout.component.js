import Header2 from "~/components/partial/Header2/header2.component";
import Footer from "~/components/partial/Footer/footer.component";
import Sidebar from "~/components/partial/Sidebar/sidebar.component";
import startlayout from "./startlayout.module.scss";
import clsx from "clsx";

function Startlayout({ children }) {
    const classNames = clsx(startlayout.main, 'xl:w-full');
    return (
        <div>
            <Header2 />
            <div className="container flex mx-auto divide-x justify-evenly">
                <div className={classNames}>
                    {children}
                </div>
                <Sidebar />
            </div>
            <Footer />
        </div>
    );
}

export default Startlayout;