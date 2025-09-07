import React, { useState } from "react"
import axios from "axios"

function FeedbackBox() {
  const [feedback, setFeedback] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!feedback.trim()) {
      setMessage("⚠️ Please write some feedback before submitting.")
      return
    }
    setLoading(true)
    setMessage("")
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/send-feedback`,
        { feedback },
        { withCredentials: true }
      )
      setMessage("✅ Feedback sent successfully!")
      setFeedback("")
    } catch (err) {
      setMessage("❌ Failed to send feedback. Try again later.")
    }
    setLoading(false)
  }

  return (
    <div className="flex items-center justify-center rounded-2xl mt-4 min-h-[75vh] max-h-[90vh] p-4 bg-gray-900 dark:bg-gray-800 transition-colors duration-300">
      <div className="w-full max-w-sm bg-gray-800 dark:bg-gray-700 rounded-2xl shadow-lg p-6 space-y-4">
        <h2 className="text-lg font-bold text-white text-center">
          Send Feedback
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Write your feedback here..."
            className="w-full h-32 p-3 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none bg-gray-700 text-white"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-indigo-600 text-white font-semibold rounded-xl shadow-md hover:bg-indigo-700 active:scale-95 transition disabled:opacity-50"
          >
            {loading ? "Sending..." : "Submit Feedback"}
          </button>
        </form>

        {message && (
          <p
            className={`text-center text-sm ${
              message.startsWith("✅")
                ? "text-green-400"
                : "text-red-400"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  )
}

export default FeedbackBox
