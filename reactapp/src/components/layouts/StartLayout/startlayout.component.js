import Header2 from "~/components/partial/Header2/header2.component";
import Footer from "~/components/partial/Footer/footer.component";
// import Sidebar from "~/components/partial/Sidebar/sidebar.component";
import Banner from "~/components/partial/Banner/banner.component"

function Startlayout({ children }) {
    return (
        <div>
            <Header2 />
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