import StartHeader from "~/components/partial/Start_header/start_header.component";
import Footer from "~/components/partial/Footer/footer.component";
// import Sidebar from "~/components/partial/Sidebar/sidebar.component";
import Banner from "~/components/partial/Banner/banner.component"

function Startlayout({ children }) {
    return (
        <div>
            <StartHeader />
            <Banner />
            <div className="container flex justify-center mx-auto">
                <div className="">
                    {children}
                </div>
                {/* <Sidebar /> */}
            </div>
            <Footer />
        </div>
    );
}

export default Startlayout;