import React from "react";
import { useSelector } from "react-redux";
import WelcomeSection from "./WelcomeSection";

const StatsGrid = () => {
  const user = useSelector((state) => state.auth.user);

  const cards = [
    {
      title: "Total Uploads",
      value: user?.totalUploads ?? 0,
      icon: "📦",
    },
    {
      title: "Total Downloads",
      value: user?.totalDownloads ?? 0,
      icon: "📥",
    },
    {
      title: "Videos",
      value: user?.videoCount ?? 0,
      icon: "📹",
    },
    {
      title: "Images",
      value: user?.imageCount ?? 0,
      icon: "🖼️",
    },
    {
      title: "Documents",
      value: user?.documentCount ?? 0,
      icon: "📄",
    },
    {
      title: "Last Login",
      value: user?.lastLogin ? new Date(user.lastLogin).toLocaleString() : "N/A",
      icon: "🚀",
    },
  ].filter((card) => card.value !== undefined);

  return (
    <div className="mt-6 px-4 sm:px-0">
      <WelcomeSection user={user} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card, index) => (
          <div
            key={index}
            className="p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-between space-x-4"
          >
            {/* Icon and Title */}
            <div className="flex items-center space-x-3">
              <span className="text-xl sm:text-2xl">{card.icon}</span>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 truncate">
                {card.title}
              </p>
            </div>

            {/* Value */}
            <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-50">
              {card.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsGrid;