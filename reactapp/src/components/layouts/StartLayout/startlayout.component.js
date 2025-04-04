import StartHeader from '~/components/partial/Start_header/start_header.component';
import Footer from '~/components/partial/Footer/footer.component';

function Startlayout({ children }) {
    return (
        <div className="bg-[#f7f4ed]">
            <StartHeader />
            <div className="relative flex h-screen">
                <div className="">{ children }</div>
            </div>
            <Footer />
        </div>
    );
}

export default Startlayout;
