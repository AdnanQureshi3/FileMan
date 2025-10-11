import React, { useState, useEffect } from "react"
import { Lock, Eye, EyeOff } from "lucide-react"
import { toast } from "react-toastify"
import axios from "axios"
import { useNavigate } from "react-router-dom"

function ResetPassword() {
  const [loading, setLoading] = useState(false)
  const [input, setInput] = useState({ password: "", confirmPassword: "" })
  const [otp, setOtp] = useState("")
  const [verified, setVerified] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const [canResend, setCanResend] = useState(false)
  const [show, setShow] = useState({ pass: false, confirm: false })
  const email = localStorage.getItem("resetEmail")
  const navigate = useNavigate()

  useEffect(() => {
    if (timeLeft <= 0) {
      setCanResend(true)
      return
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000)
    return () => clearTimeout(timer)
  }, [timeLeft])

  const ChangeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value })
  }

  const handleOtpSubmit = async () => {
    if (otp.length !== 6) return toast.error("Enter a valid 6-digit OTP")
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/verify-otpForPasswordreset`,
        { otp, email },
        { withCredentials: true }
      )
      if (res.data.success) {
        setVerified(true)
        toast.success("OTP verified successfully!")
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "OTP verification failed")
    }
  }

  const handleResend = async () => {
    setCanResend(false)
    setTimeLeft(60)
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/send-otpResetPassword`,
        { email },
        { withCredentials: true }
      )
      if (res.data.success) toast.success("OTP resent successfully!")
      else toast.error(res.data.message || "Failed to resend OTP")
    } catch {
      toast.error("Failed to resend OTP")
    }
  }

  const ResetPasswordHandler = async (e) => {
    e.preventDefault()
    if (!verified) return toast.error("Please verify OTP first")
    if (input.password !== input.confirmPassword)
      return toast.error("Passwords do not match")

    try {
      setLoading(true)
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/resetpassword`,
        { password: input.password, email },
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      )
      if (res.data.success) {
        toast.success("Password reset successful")
        navigate("/login")
      }
    } catch {
      toast.error("Failed to reset password")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 to-purple-100 p-4">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-8">
        <Lock className="w-14 h-14 text-purple-600 mb-4 mx-auto" />
        <h2 className="text-center text-3xl font-bold mb-3 text-purple-700">
          Reset Password
        </h2>
        <p className="text-center text-gray-600 mb-6 text-sm">
          We have sent an OTP to <span className="font-semibold">{email}</span>. <br />
<span className="text-xs text-red-500">Please check your inbox, spam, or junk folder if you don’t see the OTP.</span>
          
        </p>

        {/* OTP Section */}
        <div className="mb-6">
          <input
            type="text"
            maxLength="6"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            placeholder="Enter 6-digit OTP"
            className="border border-gray-300 w-full rounded-xl p-3 text-center tracking-widest text-2xl font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={handleOtpSubmit}
            disabled={otp.length !== 6 || verified}
            className={`w-full mt-3 py-2.5 rounded-xl font-bold transition ${
              verified
                ? "bg-green-500 text-white"
                : otp.length !== 6
                ? "bg-gray-400 cursor-not-allowed text-white"
                : "bg-purple-600 text-white hover:bg-purple-700"
            }`}
          >
            {verified ? "OTP Verified" : "Verify OTP"}
          </button>

          <div className="mt-4 text-center">
            {canResend ? (
              <button
                onClick={handleResend}
                className="text-blue-600 font-medium hover:underline"
              >
                Resend OTP
              </button>
            ) : (
              <p className="text-gray-600">
                Resend OTP in{" "}
                <span className="font-semibold">{timeLeft}s</span>
              </p>
            )}
          </div>
        </div>

        {/* Password Form */}
        <form className="space-y-5" onSubmit={ResetPasswordHandler}>
          <div className="relative">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              id="password"
              type={show.pass ? "text" : "password"}
              name="password"
              value={input.password}
              onChange={ChangeEventHandler}
              placeholder="••••••••"
              className="w-full border rounded-xl px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-purple-500 pr-10"
            />
            <span
              className="absolute right-3 top-9 cursor-pointer text-gray-500"
              onClick={() => setShow({ ...show, pass: !show.pass })}
            >
              {show.pass ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>

          <div className="relative">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              type={show.confirm ? "text" : "password"}
              name="confirmPassword"
              value={input.confirmPassword}
              onChange={ChangeEventHandler}
              placeholder="••••••••"
              className="w-full border rounded-xl px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-purple-500 pr-10"
            />
            <span
              className="absolute right-3 top-9 cursor-pointer text-gray-500"
              onClick={() => setShow({ ...show, confirm: !show.confirm })}
            >
              {show.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>

          <button
            type="submit"
            disabled={!verified || loading}
            className={`w-full py-2.5 rounded-xl font-semibold transition-colors ${
              !verified || loading
                ? "bg-gray-400 cursor-not-allowed text-white"
                : "bg-purple-600 text-white hover:bg-purple-700"
            }`}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ResetPassword
