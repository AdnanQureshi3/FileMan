import React from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setAuthUser } from "../Redux/Slice/auth.js"
function PayButton({ disabled , plan }) {
    const dispatch = useDispatch();

    const user = useSelector((state) => state.auth.user);
    const userId = user?._id;

    const handlePayment = async () => {
        try {
            const { data } = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/razorpay/create-order`,
                { amount: plan.price }
            );
            

            const paymentDetails = {
                plan: plan.name,
                userId: userId,
                filesizeLimit: plan.filesizeLimit,
                totalSizeLimit: plan.totalSizeLimit,
                amount: plan.price,
                days: plan.days,
            };
            console.log("Initiating payment with details:", paymentDetails);
            
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: data.amount,
                currency: "INR",
                name: "FileMan",
                description: "Premium Purchase (Test Mode)",
                order_id: data.orderId,
                handler: async function (response) {
                    try {
                        const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/razorpay/verify-payment`, {
                            ...response,
                            paymentDetails
                        });
                        console.log(res.data.user);
                        dispatch(setAuthUser(res.data.user));
                        alert("✅ Payment successful! Premium activated (Test Mode)");
                    } catch (err) {
                        console.error(err);
                        alert("Payment verification failed.");
                    }
                },

                prefill: {
                    name: user?.name || "Demo User",
                    email: user?.email || "demo@example.com",
                    contact: "9999999999",
                },
                theme: { color: "#3399cc" },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            console.error(err);
            alert("Payment failed. Check console.");
        }
    };

    return (
        <button
            disabled={disabled}
            onClick={handlePayment}
            className={`
    w-full
    px-4 py-2 
    bg-gradient-to-r from-blue-500 to-blue-700 
    text-white font-semibold 
    rounded-lg 
    shadow-md hover:shadow-lg 
    hover:from-blue-600 hover:to-blue-800 
    transition duration-300 
    focus:outline-none focus:ring-2 focus:ring-blue-400
    ${disabled ? "opacity-50 cursor-not-allowed" : ""}
  `}
        >
            Buy Premium
        </button>

    );
}

export default PayButton;
