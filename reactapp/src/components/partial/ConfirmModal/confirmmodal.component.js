import { Dialog } from '@headlessui/react';

const ComfirmModal = ({ isOpen, close, handlefunction, type }) => {
    return (
        <>
            <Dialog open={ isOpen } as="div" className="relative z-10 focus:outline-none" onClose={ close }>
                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <Dialog.Panel
                            transition={ true }
                            className="w-full max-w-xl rounded-xl bg-white p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0 z-50 drop-shadow-2xl"
                        >
                            <Dialog.Title as="h1"
                                          className="font-customs font-bold text-black text-center text-3xl tracking-tight">
                                { type === 'deletestories' ? 'Delete story' : type === 'canclesubscription' ? 'Cancle subscription' : '' }
                            </Dialog.Title>
                            <p className="mt-2 text-sm/6 text-black px-6 text-center">
                                { type === 'deletestories' ? 'Your payment has been successfully submitted. We’ve sent you an email with all of the details of your order.' : type === 'canclesubscription' ? 'Are you sure you want to cancel your Medium membership? You will lose access to exclusive content and features at the end of your current billing period.' : '' }
                            </p>
                            <div className="mt-4 text-center">
                                <button
                                    className="inline-flex items-center gap-2 py-1.5 px-3 mx-2 text-sm/6 font-customs border-solid border-2 border-[#6b6b6b] hover:border-black rounded-full"
                                    onClick={ close }
                                >
                                    { type === 'deletestories' ? 'Cancle' : type === 'canclesubscription' ? 'No, keep my subscription' : '' }
                                </button>

                                { type === 'deletestories' ? (
                                    <button
                                        className="inline-flex items-center gap-2 py-1.5 px-3 mx-2 text-sm/6 font-customs border-solid border-2 border-[#c94a4a] bg-[#c94a4a] hover:bg-[#b63636] rounded-full hover:border-[#b63636] text-white"
                                        onClick={ close }
                                    >
                                        Delete
                                    </button>
                                ) : type === 'canclesubscription' ? (
                                    <button
                                        className="inline-flex items-center gap-2 py-1.5 px-3 mx-2 text-sm/6 font-customs border-solid border-2 border-[#c94a4a] bg-[#c94a4a] hover:bg-[#b63636] rounded-full hover:border-[#b63636] text-white"
                                        onClick={ handlefunction }
                                    >
                                        Yes, cancel my subscription
                                    </button>) : '' }
                            </div>
                        </Dialog.Panel>
                    </div>
                </div>
            </Dialog>
        </>
    );
};

export default ComfirmModal;