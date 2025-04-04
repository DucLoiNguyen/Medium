import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import axios from 'axios';
import { useAuth } from '~/pages/Authen/authcontext';
import { toast } from 'sonner';
import Avatar from '~/components/partial/Avatar/avatar.component';
import visa from '~/assets/image/visa-svgrepo-com.svg';
import mastercard from '~/assets/image/mastercard-svgrepo-com.svg';
import jcb from '~/assets/image/jcb-svgrepo-com.svg';
import discover from '~/assets/image/discover-svgrepo-com.svg';
import diners from '~/assets/image/diners-svgrepo-com.svg';
import ConfirmmodalComponent from '~/components/partial/ConfirmModal/confirmmodal.component';

const stripePromise = loadStripe('pk_test_51R2PhKPH7d6YNyhM26Cylqalx0rpsG88AUbhq7hrZX4E2fjdtKP3XMx3YPqTab0JOdiaL2Q92nnQN83q8haUTQND00pWh0m4wO');

const Subscription = () => {
    const [isMember, setIsMember] = useState(false);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    function open() {
        setIsOpen(true);
    }

    function close() {
        setIsOpen(false);
    }

    useEffect(() => {
        axios.get(`http://localhost:3030/api/user/getbyemail`, { params: { email: user.email }, withCredentials: true })
            .then(({ data }) => {
                setIsMember(data.isMember);
            })
            .catch((err) => console.error(err));
    }, [user]);

    const handleCancelSubscription = async () => {
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:3030/cancel-subscription', { email: user.email }, { withCredentials: true });
            console.log(response);
            setIsMember(false);
            toast.success('Bạn đã hủy đăng ký thành công!');
        } catch ( error ) {
            toast.error('Không thể hủy đăng ký!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto px-4 py-8">

            { isMember ? (<>
                <h1 className="text-3xl font-customs2 text-center mb-8">Your current plan</h1>

                <div className="border border-gray-200 rounded-lg p-6 mb-6 font-customs">
                    <div className="flex items-center mb-6">
                        <div className="relative mr-3">
                            <Avatar username={ user.username } width={ 40 } height={ 40 } />
                            <div className="absolute -top-1 -right-1">
                            <span className="text-yellow-400 text-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20"
                                     height="20" fill="none" viewBox="0 0 40 40"
                                     role="presentation" aria-hidden="true"
                                     focusable="false" className="cz gh gi gj gk"><mask
                                    id="path-1-outside-1_5853_41067" width="38" height="38" x="1" y="1" fill="#000"
                                    maskUnits="userSpaceOnUse"><path fill="#fff" d="M1 1h38v38H1z"></path><path
                                    d="m24.7 25.435-3.552 9.767a1.224 1.224 0 0 1-2.296 0L15.3 25.435a1.24 1.24 0 0 0-.735-.735L4.8 21.148a1.225 1.225 0 0 1 0-2.296l9.766-3.552a1.24 1.24 0 0 0 .735-.735L18.852 4.8a1.224 1.224 0 0 1 2.296 0l3.552 9.766a1.24 1.24 0 0 0 .735.735l9.767 3.552a1.224 1.224 0 0 1 0 2.296L25.435 24.7a1.24 1.24 0 0 0-.735.735"></path></mask><path
                                    fill="#FFC017"
                                    d="m24.7 25.435-3.552 9.767a1.224 1.224 0 0 1-2.296 0L15.3 25.435a1.24 1.24 0 0 0-.735-.735L4.8 21.148a1.225 1.225 0 0 1 0-2.296l9.766-3.552a1.24 1.24 0 0 0 .735-.735L18.852 4.8a1.224 1.224 0 0 1 2.296 0l3.552 9.766a1.24 1.24 0 0 0 .735.735l9.767 3.552a1.224 1.224 0 0 1 0 2.296L25.435 24.7a1.24 1.24 0 0 0-.735.735"></path><path
                                    fill="#fff"
                                    d="m21.148 35.202 2.813 1.043.007-.018zm-2.296 0-2.82 1.025.007.018zM15.3 25.435l2.82-1.026-.005-.012zm-.735-.735 1.038-2.815-.012-.005zM4.8 21.148l-1.044 2.813.018.007zm0-2.296-1.026-2.82-.018.007zm9.766-3.552 1.026 2.82.012-.005zm.735-.735 2.815 1.038.005-.012zM18.852 4.8l-2.813-1.044-.007.018zM20 4v3zm1.148.799 2.82-1.026-.007-.018zm3.552 9.766-2.82 1.026.005.012zm.735.735-1.038 2.815.012.005zm9.767 3.552 1.043-2.813-.018-.007zm0 2.296 1.025 2.82.018-.007zM25.435 24.7l-1.026-2.82-.012.005zm-3.555-.29-3.551 9.766 5.639 2.05 3.551-9.766zm-3.544 9.747c.126-.34.353-.632.65-.84l3.426 4.927a4.22 4.22 0 0 0 1.549-1.999zm.65-.84A1.78 1.78 0 0 1 20 33v6c.862 0 1.704-.264 2.412-.756zM20 33c.362 0 .716.11 1.014.318l-3.426 4.926c.708.492 1.55.756 2.412.756zm1.014.318c.297.207.524.5.65.84l-5.625 2.087c.3.809.84 1.506 1.549 1.999zm.657.858L18.12 24.41l-5.64 2.05 3.552 9.768zm-3.556-9.779a4.2 4.2 0 0 0-.98-1.532l-4.243 4.243a1.8 1.8 0 0 1-.407-.636zm-.98-1.532a4.2 4.2 0 0 0-1.532-.98l-2.075 5.63a1.8 1.8 0 0 1-.636-.407zm-1.544-.985L5.824 18.33l-2.05 5.639 9.766 3.551zm-9.749-3.544c.34.126.633.353.84.65l-4.926 3.426a4.22 4.22 0 0 0 1.999 1.549zm.84.65C6.89 19.284 7 19.638 7 20H1c0 .862.264 1.704.756 2.412zM7 20c0 .362-.11.716-.318 1.014l-4.926-3.426A4.22 4.22 0 0 0 1 20zm-.318 1.014c-.207.297-.5.524-.84.65L3.755 16.04c-.809.3-1.506.84-1.999 1.549zm-.858.657 9.767-3.551-2.05-5.64-9.768 3.552zm9.779-3.556a4.2 4.2 0 0 0 1.532-.98l-4.243-4.243c.18-.18.397-.319.636-.407zm1.532-.98c.434-.434.768-.957.98-1.532l-5.63-2.075a1.8 1.8 0 0 1 .407-.636zm.985-1.544 3.551-9.767-5.639-2.05-3.551 9.766zm3.544-9.749c-.126.34-.353.633-.65.84l-3.426-4.926a4.22 4.22 0 0 0-1.549 1.999zm-.65.84A1.78 1.78 0 0 1 20 7V1c-.862 0-1.704.264-2.412.756zM20 7c-.362 0-.716-.11-1.014-.318l3.426-4.926A4.22 4.22 0 0 0 20 1zm-1.014-.318a1.78 1.78 0 0 1-.65-.84l5.625-2.087a4.22 4.22 0 0 0-1.549-1.999zm-.657-.858 3.551 9.767 5.64-2.05-3.552-9.768zm3.556 9.779c.212.575.546 1.098.98 1.532l4.243-4.243c.18.18.319.397.407.636zm.98 1.532c.434.434.957.768 1.532.98l2.075-5.63c.239.088.456.227.636.407zm1.544.985 9.767 3.551 2.05-5.639-9.766-3.551zm9.749 3.544a1.78 1.78 0 0 1-.84-.65l4.926-3.426a4.22 4.22 0 0 0-1.999-1.549zm-.84-.65A1.78 1.78 0 0 1 33 20h6c0-.862-.264-1.704-.756-2.412zM33 20c0-.362.11-.716.318-1.014l4.926 3.426c.492-.708.756-1.55.756-2.412zm.318-1.014c.207-.297.5-.524.84-.65l2.087 5.625c.809-.3 1.506-.84 1.999-1.549zm.858-.657L24.41 21.88l2.05 5.64 9.768-3.552zm-9.779 3.556a4.2 4.2 0 0 0-1.532.98l4.243 4.243a1.8 1.8 0 0 1-.636.407zm-1.532.98a4.2 4.2 0 0 0-.98 1.532l5.63 2.075a1.8 1.8 0 0 1-.407.636z"
                                    mask="url(#path-1-outside-1_5853_41067)"></path></svg>
                            </span>
                            </div>
                        </div>
                        <div className="flex-1">
                            <h2 className="text-base font-bold">Medium Member (monthly)</h2>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                        <div className="text-sm">
                            <p className="text-gray-600 mb-4">
                                You will lose access to all member privileges when your membership expires on March 15,
                                2026.
                            </p>
                            <p className="text-gray-600 mb-4">
                                You will not be charged $50 for the next billing cycle.
                            </p>
                        </div>

                        <div className="space-y-6 pt-8">
                            <button
                                className="ring-2 ring-[#6b6b6b] hover:ring-offset-2 hover:ring-black rounded-full py-1 px-4 transition-all ease-in-out w-full font-customs font-semibold">
                                Keep my subscription
                            </button>
                            <button
                                className={ `ring-2 ring-[#6b6b6b] hover:ring-offset-2 hover:ring-black rounded-full py-1 px-4 transition-all ease-in-out w-full font-customs font-semibold bg-black text-white ${ loading && 'opacity-50 cursor-not-allowed' }` }
                                onClick={ open }>
                                Cancel subscription
                            </button>
                        </div>
                    </div>
                </div>
            </>) : (<>
                <h1 className="text-3xl font-customs2 text-center mb-8">Payment</h1>

                <div className="border border-gray-200 rounded-lg p-6 mb-6 font-customs">
                    <div className="flex items-center mb-6">
                        <div className="relative mr-3">
                            <Avatar username={ user.username } width={ 40 } height={ 40 } />
                            <div className="absolute -top-1 -right-1">
                            <span className="text-yellow-400 text-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20"
                                     height="20" fill="none" viewBox="0 0 40 40"
                                     role="presentation" aria-hidden="true"
                                     focusable="false" className="cz gh gi gj gk"><mask
                                    id="path-1-outside-1_5853_41067" width="38" height="38" x="1" y="1" fill="#000"
                                    maskUnits="userSpaceOnUse"><path fill="#fff" d="M1 1h38v38H1z"></path><path
                                    d="m24.7 25.435-3.552 9.767a1.224 1.224 0 0 1-2.296 0L15.3 25.435a1.24 1.24 0 0 0-.735-.735L4.8 21.148a1.225 1.225 0 0 1 0-2.296l9.766-3.552a1.24 1.24 0 0 0 .735-.735L18.852 4.8a1.224 1.224 0 0 1 2.296 0l3.552 9.766a1.24 1.24 0 0 0 .735.735l9.767 3.552a1.224 1.224 0 0 1 0 2.296L25.435 24.7a1.24 1.24 0 0 0-.735.735"></path></mask><path
                                    fill="#FFC017"
                                    d="m24.7 25.435-3.552 9.767a1.224 1.224 0 0 1-2.296 0L15.3 25.435a1.24 1.24 0 0 0-.735-.735L4.8 21.148a1.225 1.225 0 0 1 0-2.296l9.766-3.552a1.24 1.24 0 0 0 .735-.735L18.852 4.8a1.224 1.224 0 0 1 2.296 0l3.552 9.766a1.24 1.24 0 0 0 .735.735l9.767 3.552a1.224 1.224 0 0 1 0 2.296L25.435 24.7a1.24 1.24 0 0 0-.735.735"></path><path
                                    fill="#fff"
                                    d="m21.148 35.202 2.813 1.043.007-.018zm-2.296 0-2.82 1.025.007.018zM15.3 25.435l2.82-1.026-.005-.012zm-.735-.735 1.038-2.815-.012-.005zM4.8 21.148l-1.044 2.813.018.007zm0-2.296-1.026-2.82-.018.007zm9.766-3.552 1.026 2.82.012-.005zm.735-.735 2.815 1.038.005-.012zM18.852 4.8l-2.813-1.044-.007.018zM20 4v3zm1.148.799 2.82-1.026-.007-.018zm3.552 9.766-2.82 1.026.005.012zm.735.735-1.038 2.815.012.005zm9.767 3.552 1.043-2.813-.018-.007zm0 2.296 1.025 2.82.018-.007zM25.435 24.7l-1.026-2.82-.012.005zm-3.555-.29-3.551 9.766 5.639 2.05 3.551-9.766zm-3.544 9.747c.126-.34.353-.632.65-.84l3.426 4.927a4.22 4.22 0 0 0 1.549-1.999zm.65-.84A1.78 1.78 0 0 1 20 33v6c.862 0 1.704-.264 2.412-.756zM20 33c.362 0 .716.11 1.014.318l-3.426 4.926c.708.492 1.55.756 2.412.756zm1.014.318c.297.207.524.5.65.84l-5.625 2.087c.3.809.84 1.506 1.549 1.999zm.657.858L18.12 24.41l-5.64 2.05 3.552 9.768zm-3.556-9.779a4.2 4.2 0 0 0-.98-1.532l-4.243 4.243a1.8 1.8 0 0 1-.407-.636zm-.98-1.532a4.2 4.2 0 0 0-1.532-.98l-2.075 5.63a1.8 1.8 0 0 1-.636-.407zm-1.544-.985L5.824 18.33l-2.05 5.639 9.766 3.551zm-9.749-3.544c.34.126.633.353.84.65l-4.926 3.426a4.22 4.22 0 0 0 1.999 1.549zm.84.65C6.89 19.284 7 19.638 7 20H1c0 .862.264 1.704.756 2.412zM7 20c0 .362-.11.716-.318 1.014l-4.926-3.426A4.22 4.22 0 0 0 1 20zm-.318 1.014c-.207.297-.5.524-.84.65L3.755 16.04c-.809.3-1.506.84-1.999 1.549zm-.858.657 9.767-3.551-2.05-5.64-9.768 3.552zm9.779-3.556a4.2 4.2 0 0 0 1.532-.98l-4.243-4.243c.18-.18.397-.319.636-.407zm1.532-.98c.434-.434.768-.957.98-1.532l-5.63-2.075a1.8 1.8 0 0 1 .407-.636zm.985-1.544 3.551-9.767-5.639-2.05-3.551 9.766zm3.544-9.749c-.126.34-.353.633-.65.84l-3.426-4.926a4.22 4.22 0 0 0-1.549 1.999zm-.65.84A1.78 1.78 0 0 1 20 7V1c-.862 0-1.704.264-2.412.756zM20 7c-.362 0-.716-.11-1.014-.318l3.426-4.926A4.22 4.22 0 0 0 20 1zm-1.014-.318a1.78 1.78 0 0 1-.65-.84l5.625-2.087a4.22 4.22 0 0 0-1.549-1.999zm-.657-.858 3.551 9.767 5.64-2.05-3.552-9.768zm3.556 9.779c.212.575.546 1.098.98 1.532l4.243-4.243c.18.18.319.397.407.636zm.98 1.532c.434.434.957.768 1.532.98l2.075-5.63c.239.088.456.227.636.407zm1.544.985 9.767 3.551 2.05-5.639-9.766-3.551zm9.749 3.544a1.78 1.78 0 0 1-.84-.65l4.926-3.426a4.22 4.22 0 0 0-1.999-1.549zm-.84-.65A1.78 1.78 0 0 1 33 20h6c0-.862-.264-1.704-.756-2.412zM33 20c0-.362.11-.716.318-1.014l4.926 3.426c.492-.708.756-1.55.756-2.412zm.318-1.014c.207-.297.5-.524.84-.65l2.087 5.625c.809-.3 1.506-.84 1.999-1.549zm.858-.657L24.41 21.88l2.05 5.64 9.768-3.552zm-9.779 3.556a4.2 4.2 0 0 0-1.532.98l4.243 4.243a1.8 1.8 0 0 1-.636.407zm-1.532.98a4.2 4.2 0 0 0-.98 1.532l5.63 2.075a1.8 1.8 0 0 1-.407.636z"
                                    mask="url(#path-1-outside-1_5853_41067)"></path></svg>
                            </span>
                            </div>
                        </div>
                        <div className="flex-1">
                            <h2 className="text-base font-bold">Medium Member (monthly)</h2>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
                        <span className="text-gray-600 text-sm">Billed Today</span>
                        <span className="font-bold">100.000 VND</span>
                    </div>
                </div>

                <Elements stripe={ stripePromise }>
                    <div className="max-w-lg mx-auto p-6 bg-white rounded-2xl border font-customs">
                        <div className="flex justify-between">
                            <h2 className="text-base font-bold text-gray-800 mb-4">Credit/Debit Card</h2>
                            <p className="text-gray-600 text-center text-sm">Email: <span
                                className="">{ user.email }</span>
                            </p>
                        </div>

                        <div className="flex justify-end gap-2 mb-4">
                            <img src={ visa } alt="VISA" className="h-6" />
                            <img src={ mastercard } alt="MasterCard" className="h-6" />
                            <img src={ jcb } alt="JCB" className="h-6" />
                            <img src={ discover } alt="Discover" className="h-6" />
                            <img src={ diners } alt="Diners" className="h-6" />
                        </div>

                        <div className="mt-6">
                            <SubscriptionForm />
                        </div>
                    </div>
                </Elements>
            </>) }

            <ConfirmmodalComponent isOpen={ isOpen } close={ close } type={ 'canclesubscription' }
                                   handlefunction={ handleCancelSubscription } />

        </div>
    );
};

const SubscriptionForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    const handleSubscribe = async () => {
        setLoading(true);
        const cardElement = elements.getElement(CardElement);

        try {
            const { paymentMethod } = await stripe.createPaymentMethod({ type: 'card', card: cardElement });

            const response = await axios.post('http://localhost:3030/create-subscription', {
                    email: user.email,
                    paymentMethodId: paymentMethod.id
                },
                {
                    withCredentials: true
                });

            toast.success(response.data.message);
            window.location.reload();
        } catch ( err ) {
            toast.error(err.response.data.error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-6">
            <div className="border rounded-xl p-3 mb-4 bg-gray-50">
                <CardElement className="p-2" />
            </div>
            <button
                onClick={ handleSubscribe }
                disabled={ loading }
                className={ `ring-2 ring-[#6b6b6b] hover:ring-offset-2 hover:ring-black rounded-full py-2 px-4 transition-all ease-in-out w-full font-customs font-semibold bg-black text-white ${ loading && 'opacity-50 cursor-not-allowed' }` }
            >
                { loading ? 'Đang xử lý...' : 'Pay' }
            </button>
        </div>
    );
};

export default Subscription;
