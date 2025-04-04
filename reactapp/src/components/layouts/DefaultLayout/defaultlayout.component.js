import Header from '~/components/partial/Header/header.component';
import Footer from '~/components/partial/Footer/footer.component';
import Sidebar from '~/components/partial/Sidebar/sidebar.component';
import defaultlayout from './defaultlayout.module.scss';
import clsx from 'clsx';
import { Toaster } from 'sonner';

function DefaultLayout({ children }) {
    const classNames = clsx(defaultlayout.main, 'sm:w-full');
    return (
        <>
            <Header />
            <div className="container flex mx-auto divide-x justify-evenly">
                <div className={ classNames }>{ children }</div>
                <Sidebar />
            </div>
            <Footer />
            <Toaster position="top-center" />
        </>
    );
}

export default DefaultLayout;
