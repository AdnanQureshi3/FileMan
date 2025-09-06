import React, { useState, useEffect } from "react"
import { toast } from "react-toastify"
import axios from "axios"
import { X } from "lucide-react"
import { useDispatch } from "react-redux"
import { setAuthUser } from "../Redux/Slice/auth.js"
import { useNavigate } from "react-router-dom"

export default function OtpVerification({ open, setOpen  ,need}) {
  const [otp, setOtp] = useState("")
  const [timeLeft, setTimeLeft] = useState(0);
  const [canResend, setCanResend] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  
  useEffect(() => {
    if (!open) return
    resetState()
  }, [open])


  useEffect(() => {
    if (!open || timeLeft <= 0) {
      setCanResend(true)
      return
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000)
    return () => clearTimeout(timer)
  }, [timeLeft, open])

  const resetState = () => {
    setOtp("")
    setTimeLeft(60)
    setCanResend(false)
  }

  const handleSubmit = async () => {
    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP.")
      return
    }
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/verify-otp/`,
        { otp },
        { withCredentials: true }
      )
      if (res.data.success) {
        toast.success("Account verified successfully!")
        if(need === "Reset") navigate('/resetPassword')
        setOpen(false)
        dispatch(setAuthUser(res.data.user))
      }
    } catch (error) {
  const msg = error.response?.data?.message || "OTP verification failed"
  toast.error(msg)
}

  }

  const handleResend = async () => {
    setCanResend(false);
    setTimeLeft(60);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/send-otp`,
        {need},
        { withCredentials: true }
      )
      if (res.data.success) {
        toast.success("OTP sent again!")
       
      } else {
        toast.error(res.data.message || "Failed to send OTP.")
        setCanResend(true);
        setTimeLeft(0);
      }
    } catch (error) {

      console.error(error.response?.data || error.message)
      toast.error("Failed to resend OTP.")
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="relative bg-gradient-to-br from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 w-full max-w-md rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700 animate-fadeIn">
        {/* Close */}
        <button
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

      
        <h1 className="text-3xl font-extrabold mb-6 text-center bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          OTP Verification
        <p>for {need}</p>
        </h1>

       
        <input
          type="text"
          maxLength="6"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
          className="border border-gray-300 dark:border-gray-700 p-4 w-full rounded-xl text-center tracking-widest text-2xl font-semibold 
          focus:outline-none focus:ring-4 focus:ring-blue-400/50 dark:bg-gray-800 dark:text-white transition shadow-inner"
          placeholder="Enter 6-digit OTP"
        />

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={otp.length !== 6}
          className={`w-full mt-6 py-3 rounded-xl font-bold text-lg transition-all duration-300 ${
            otp.length !== 6
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-md hover:shadow-lg"
          }`}
        >
          Verify OTP
        </button>

        {/* Resend Section */}
        <div className="mt-6 text-center">
          {canResend ? (
            <button
              onClick={handleResend}
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              Resend OTP
            </button>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">
              Resend OTP in{" "}
              <span className="inline-block px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-gray-800 dark:text-gray-200 font-semibold">
                {timeLeft}s
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
