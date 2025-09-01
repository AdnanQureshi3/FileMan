import React from "react";
import { useSelector } from "react-redux";

const WelcomeSection = ({ user }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Good morning";
    if (hour >= 12 && hour < 17) return "Good afternoon";
    if (hour >= 17 && hour < 21) return "Good evening";
    return "Good night";
  };

  const greeting = getGreeting();

  return (
    <section className="mb-6 p-6 sm:p-8 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg transition-colors duration-300">
      <div className="flex items-center space-x-6 sm:space-x-8">
        <img
          src={user?.profilePic || '/default_profile.png'}
          alt="Profile"
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-gray-300 dark:border-gray-600 object-cover"
        />
        <div className="flex-1">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
            {greeting}, {user?.fullname}!
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm sm:text-base">
            {user?.email}
          </p>
          <p className="text-gray-400 dark:text-gray-500 mt-0.5 text-xs sm:text-sm">
            @{user?.username}
          </p>
        </div>
      </div>
    </section>
  );
};

export default WelcomeSection;