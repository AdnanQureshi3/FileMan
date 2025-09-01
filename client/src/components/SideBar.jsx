import React from "react";
import { MdHome, MdFileUpload, MdAccountCircle, MdCardGiftcard, MdExitToApp } from "react-icons/md";

const Sidebar = ({ sidebarOpen, setSidebarOpen, setActiveTab, activeTab }) => {
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setSidebarOpen(false);
  };

  const tabs = [
    { name: "Home", icon: <MdHome />, id: "home" },
    { name: "Upload Files", icon: <MdFileUpload />, id: "upload" },
    { name: "Profile", icon: <MdAccountCircle />, id: "profile" },
    { name: "Plans", icon: <MdCardGiftcard />, id: "plans" },
    { name: "Logout", icon: <MdExitToApp />, id: "logout" },
  ];

  return (
    <>
      {/* Overlay for small screens */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden" 
          onClick={() => setSidebarOpen(false)} 
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-200 ease-in-out w-64 z-40 md:relative md:translate-x-0
        bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 shadow-xl py-20`}
      >
        <div className="flex flex-col mt-4 h-full">
          <nav className="flex-1 px-4 py-6 space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left w-full font-medium transition-colors duration-200
                  ${
                    activeTab === tab.id
                      ? "bg-blue-600 text-white shadow-md"
                      : "hover:bg-blue-100 dark:hover:bg-blue-700 hover:text-blue-800 dark:hover:text-white"
                  }`}
              >
                <span className="text-xl">{tab.icon}</span>
                <span className="text-sm uppercase tracking-wide">{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;