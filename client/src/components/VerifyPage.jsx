import React, { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import axios from "axios";

export default function OtpVerification() {
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const handleSubmit = async () => {
    try {
      if (otp.length < 6) {
        toast.error("Please enter a valid 6-digit OTP.");
        return;
      }
      console.log("Verifying OTP..." , import.meta.env.VITE_API_URL);
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/user/verify-otp/`, { otp },
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success("OTP Verified!");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error.response.data);
      toast.error("OTP verification failed. Please try again.");
    }
  };

  const handleResend = () => {
    setTimeLeft(60);
    setCanResend(false);
    toast.success("OTP resent!");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96 text-center">
        <h1 className="text-2xl font-bold mb-4">Verify OTP</h1>
        <input
          type="text"
          maxLength="6"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
          className="border p-3 w-full rounded-lg text-center tracking-widest text-xl"
          placeholder="Enter 6-digit OTP"
        />
        <button
          onClick={handleSubmit}
          disabled={otp.length < 6}
          className={`w-full mt-4 p-3 rounded-lg text-white font-semibold ${
            otp.length < 6 ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          Submit OTP
        </button>

        <div className="mt-4">
          {canResend ? (
            <button
              onClick={handleResend}
              className="text-blue-500 hover:underline"
            >
              Resend OTP
            </button>
          ) : (
            <p className="text-gray-600">
              Resend OTP in <span className="font-semibold">{timeLeft}s</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
