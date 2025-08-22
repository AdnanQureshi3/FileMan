import React from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setAuthUser } from "../Redux/Slice/auth.js"
function PayButton({ plan }) {
    const dispatch = useDispatch();

    const user = useSelector((state) => state.auth.user);
    const userId = user?._id;

    const handlePayment = async () => {
        try {
            const { data } = await axios.post(
                "http://localhost:3000/api/razorpay/create-order",
                { amount: plan.price }
            );

            const paymentDetails = {
                plan: plan.name,
                filesizeLimit: plan.filesizeLimit,
                totalSizeLimit: plan.totalSizeLimit,
                amount: plan.price,
                days: plan.days,
                user: userId,
            };

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: data.amount,
                currency: "INR",
                name: "FileMan",
                description: "Premium Purchase (Test Mode)",
                order_id: data.orderId,
                handler: async function (response) {
                    try {
                        const res = await axios.post("http://localhost:3000/api/razorpay/verify-payment", {
                            ...response,
                            paymentDetails
                        });
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
            onClick={handlePayment}
            className="
    w-full
    px-4 py-2 
    bg-gradient-to-r from-blue-500 to-blue-700 
    text-white font-semibold 
    rounded-lg 
    shadow-md hover:shadow-lg 
    hover:from-blue-600 hover:to-blue-800 
    transition duration-300 
    focus:outline-none focus:ring-2 focus:ring-blue-400
  "
        >
            Buy Premium
        </button>

    );
}

export default PayButton;
