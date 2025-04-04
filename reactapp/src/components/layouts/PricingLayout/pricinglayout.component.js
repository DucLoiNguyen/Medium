import { Toaster } from 'sonner';

function Pricinglayout({ children }) {
    return (
        <>
            { children }
            <Toaster position="top-center" />
        </>
    );
}

export default Pricinglayout;