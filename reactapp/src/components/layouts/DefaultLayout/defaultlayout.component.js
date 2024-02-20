import Header from "~/components/partial/Header/header.component";
import Footer from "~/components/partial/Footer/footer.component";
import Sidebar from "~/components/partial/Sidebar/sidebar.component";
import defaultlayout from "./defaultlayout.module.scss";
import clsx from "clsx";

function DefaultLayout({ children }) {
    const classNames = clsx(defaultlayout.main, 'xl:w-full');
    return (
        <div>
            <Header />
            <div className="container mx-auto flex justify-evenly divide-x">
                <div className={classNames}>
                    {children}
                </div>
                <Sidebar />
            </div>
            <Footer/>
        </div>
    );
}

export default DefaultLayout;