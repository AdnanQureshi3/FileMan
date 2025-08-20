import React from "react"
import { useSelector } from "react-redux"
import { motion } from "framer-motion"
import { User, Mail, FileText, UploadCloud, Download, Calendar, Clock } from "lucide-react"

function Home() {
  const user = useSelector((state) => state.auth.user);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen text-lg font-semibold text-gray-800 dark:text-gray-200">
        No user data available
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 md:p-6 transition-colors duration-200">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-r from-green-400 to-blue-500 dark:from-green-500 dark:to-blue-600 text-white rounded-xl shadow-lg p-4 md:p-6 flex flex-col md:flex-row items-center justify-between"
      >
        <div className="flex items-center gap-4 mb-4 md:mb-0">
          <img
            src={user.profile || "https://via.placeholder.com/80"}
            alt="profile"
            className="w-14 h-14 md:w-16 md:h-16 rounded-full border-2 border-white"
          />
          <div>
            <h2 className="text-xl md:text-2xl font-bold">Welcome back, {user.fullname} ✨</h2>
            <p className="text-xs md:text-sm">{user.email}</p>
            <p className="text-xs md:text-sm text-gray-200">@{user.username}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 bg-white/20 p-2 rounded-lg">
          <Clock size={18} />
          <span className="text-sm">
            Last login: {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}
          </span>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mt-6">
        {[
          { icon: UploadCloud, label: "Total Uploads", value: user.total_upload, color: "text-green-500" },
          { icon: Download, label: "Total Downloads", value: user.total_download, color: "text-blue-500" },
          { icon: FileText, label: "Documents", value: user.documentCount, color: "text-purple-500" },
          { icon: User, label: "Profile", value: user.profile ? "Set" : "Default", color: "text-orange-500" },
          { icon: Calendar, label: "Joined", value: new Date(user.createdAt).toLocaleDateString(), color: "text-gray-600 dark:text-gray-400" },
          { icon: Clock, label: "Last Login", value: user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never', color: "text-indigo-500" }
        ].map((stat, index) => (
          <motion.div 
            key={index}
            whileHover={{ scale: 1.03 }}
            className="bg-white dark:bg-gray-800 p-4 md:p-5 rounded-lg shadow flex items-center gap-3 transition-colors duration-200"
          >
            <stat.icon className={`w-5 h-5 md:w-6 md:h-6 ${stat.color}`} />
            <div>
              <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
              <p className="text-lg md:text-xl font-bold text-gray-800 dark:text-gray-200">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default Home;