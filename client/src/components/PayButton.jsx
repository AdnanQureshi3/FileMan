import React, { useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setAuthUser } from "../Redux/Slice/auth.js"
import OtpVerification from "./VerifyPage";


function PayButton({ plan }){
    const dispatch = useDispatch();
    const [showVerify, setShowVerify] = useState(false);
    const [Open , setOpen] = useState(false);

    const user = useSelector((state) => state.auth.user);
    const disabled = user === null || user.plan === plan.name || user.plan === "Premium Pro"; 
    const userId = user?.id;

    const handlePayment = async () => {
        if (user.isVerified === false) {
            setShowVerify(true);
            return;
        }
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
        <>
            <button
                disabled={disabled}
                onClick={handlePayment}
                className={`
                    w-full px-4 py-2 
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
              <OtpVerification open={Open} setOpen={setOpen} need={"Verification"} />

            {showVerify && (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    <div
      className="absolute inset-0 bg-black/50"
      onClick={() => setShowVerify(false)}
    />
    <div className="relative w-full max-w-sm rounded-xl bg-white p-6 shadow-lg">
      {/* Close Button */}
      <button
        onClick={() => setShowVerify(false)}
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition"
      >
        ✕
      </button>

      <h2 className="text-lg font-semibold text-gray-800 text-center">
        Please Verify Your Email
      </h2>
      <p className="mt-2 text-sm text-gray-600 text-center">
        You must verify your account before purchasing Premium.
      </p>
      <div
        onClick={() => {
          setShowVerify(false);
          setOpen(true);
        }}
        className="mt-6 px-4 py-2 rounded-lg text-sm font-medium text-center 
                   bg-green-600 text-white hover:bg-green-700 active:scale-95 
                   shadow-sm hover:shadow-md transition-all duration-200"
      >
        Verify
      </div>
    </div>
  </div>
)}

        </>
    );
}

export default PayButton;
