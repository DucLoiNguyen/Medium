import ResetPassModal from '~/pages/Setting/resetpassword';
import { useState } from 'react';

function Security() {
    const [open, setOpen] = useState(false);

    return (
        <>
            <div className="divide-y">
                <div className="my-14">
                    <button className="text-[#6b6b6b] hover:text-black my-8 text-right flex justify-between text-sm"
                            onClick={ () => setOpen(true) }>
                        <span className="mr-4 text-black">Reset password</span>
                    </button>
                </div>
                <div className="my-14">
                    <button className="text-[#c94a4a] hover:text-red my-8 text-right flex justify-between text-sm">
                        <span className="mr-4">Delete account</span>
                    </button>
                </div>
            </div>

            <ResetPassModal isOpen={ open } close={ () => setOpen(false) } />
        </>
    );
}

export default Security;
