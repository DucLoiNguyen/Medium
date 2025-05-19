import ResetPassModal from '~/pages/Setting/resetpassword';
import DeleteAccModal from '~/pages/Setting/DeleteAccModal';
import { useState } from 'react';

function Security() {
    const [openResetPass, setOpenResetPass] = useState(false);
    const [openDeleteAccount, setOpenDeleteAccount] = useState(false);

    return (
        <>
            <div className="divide-y">
                <div className="my-14">
                    <button
                        className="text-[#6b6b6b] hover:text-black my-8 text-right flex justify-between text-sm w-full"
                        onClick={ () => setOpenResetPass(true) }
                    >
                        <span className="mr-4 text-black">Reset password</span>
                        <span>→</span>
                    </button>
                </div>
                <div className="my-14">
                    <button
                        className="text-[#c94a4a] hover:text-red-700 my-8 text-right flex justify-between text-sm w-full transition-colors"
                        onClick={ () => setOpenDeleteAccount(true) }
                    >
                        <span className="mr-4">Delete account</span>
                        <span>→</span>
                    </button>
                    <p className="text-xs text-gray-500 mt-2">
                        Permanently remove your account and all associated data. This action cannot be undone.
                    </p>
                </div>
            </div>

            <ResetPassModal isOpen={ openResetPass } close={ () => setOpenResetPass(false) } />
            <DeleteAccModal isOpen={ openDeleteAccount } close={ () => setOpenDeleteAccount(false) } />
        </>
    );
}

export default Security;