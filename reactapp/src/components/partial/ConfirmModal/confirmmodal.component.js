import { Dialog } from '@headlessui/react';

const ComfirmModal = ({ isOpen, close, handlefunction, type }) => {
    const getTitle = () => {
        switch ( type ) {
            case 'deletestories':
                return 'Delete story';
            case 'canclesubscription':
                return 'Cancel subscription';
            case 'deleteaccount':
                return 'Delete account';
            default:
                return '';
        }
    };

    const getDescription = () => {
        switch ( type ) {
            case 'deletestories':
                return 'Are you sure you want to delete this story? This action cannot be undone.';
            case 'canclesubscription':
                return 'Are you sure you want to cancel your Medium membership? You will lose access to exclusive content and features at the end of your current billing period.';
            case 'deleteaccount':
                return 'Are you sure you want to permanently delete your account? This action cannot be undone. All your data, including stories, followers, and subscription will be permanently removed.';
            default:
                return '';
        }
    };

    const getCancelButtonText = () => {
        switch ( type ) {
            case 'deletestories':
                return 'Cancel';
            case 'canclesubscription':
                return 'No, keep my subscription';
            case 'deleteaccount':
                return 'No, keep my account';
            default:
                return 'Cancel';
        }
    };

    const getConfirmButtonText = () => {
        switch ( type ) {
            case 'deletestories':
                return 'Delete';
            case 'canclesubscription':
                return 'Yes, cancel my subscription';
            case 'deleteaccount':
                return 'Yes, delete my account';
            default:
                return 'Confirm';
        }
    };

    return (
        <>
            <Dialog open={ isOpen } as="div" className="relative z-10 focus:outline-none" onClose={ close }>
                <div className="fixed inset-0 z-10 w-screen overflow-y-auto bg-black bg-opacity-50">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <Dialog.Panel
                            transition={ true }
                            className="w-full max-w-xl rounded-md bg-white p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0 z-50 drop-shadow-2xl"
                        >
                            <Dialog.Title as="h1"
                                          className="font-customs font-bold text-black text-center text-3xl tracking-tight">
                                { getTitle() }
                            </Dialog.Title>
                            <p className="mt-4 text-sm/6 text-gray-600 px-6 text-center">
                                { getDescription() }
                            </p>

                            { type === 'deleteaccount' && (
                                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-sm text-red-800 text-center font-medium">
                                        ⚠️ This will permanently delete:
                                    </p>
                                    <ul className="mt-2 text-xs text-red-700 list-disc list-inside text-center">
                                        <li>All your stories and drafts</li>
                                        <li>Your followers and following</li>
                                        <li>Your subscription (if any)</li>
                                        <li>All account data</li>
                                    </ul>
                                </div>
                            ) }

                            <div className="mt-6 text-center">
                                <button
                                    className="inline-flex items-center gap-2 py-1.5 px-3 mx-2 text-sm/6 font-customs border-solid border-2 border-[#6b6b6b] hover:border-black rounded-full"
                                    onClick={ close }
                                >
                                    { getCancelButtonText() }
                                </button>

                                <button
                                    className="inline-flex items-center gap-2 py-1.5 px-3 mx-2 text-sm/6 font-customs border-solid border-2 border-[#c94a4a] bg-[#c94a4a] hover:bg-[#b63636] rounded-full hover:border-[#b63636] text-white"
                                    onClick={ handlefunction }
                                >
                                    { getConfirmButtonText() }
                                </button>
                            </div>
                        </Dialog.Panel>
                    </div>
                </div>
            </Dialog>
        </>
    );
};

export default ComfirmModal;