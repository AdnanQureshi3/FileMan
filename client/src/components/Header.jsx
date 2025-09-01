import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useTheme } from "../Hooks/ThemeContext.jsx";

function Header({ setActiveTab }) {
  const { user } = useSelector((state) => state.auth);
  
  const { theme, toggleTheme } = useTheme();

  return (
    <>
     <header className="hidden sm:flex fixed top-0 left-0 w-full px-6 py-3 bg-white dark:bg-gray-800 shadow-md z-50 items-center justify-between text-black dark:text-white">
  <Link to="/" className="flex items-center space-x-2">
    <img src='/logo.png' alt="Logo" className="w-10 h-10 rounded-full" />
    <span className="text-2xl font-bold text-black dark:text-white">FileMan</span>
  </Link>

  <div className="flex items-center space-x-5">
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full border hover:bg-gray-100 dark:hover:bg-gray-700 text-black dark:text-white"
    >
      {theme === "light" ? "🌞" : "🌙"}
    </button>

    {user === null ? (
      <>
        <Link to="/signup" className="px-4 py-1 border rounded-full hover:bg-purple-500 hover:text-white transition text-black dark:text-white">
          Sign Up
        </Link>
        <Link to="/login" className="px-4 py-1 border rounded-full hover:bg-purple-500 hover:text-white transition text-black dark:text-white">
          Log In
        </Link>
      </>
    ) : (
      <div
        onClick={() => setActiveTab("profile")}
        className="flex items-center gap-2 pl-2 pr-4 py-1 rounded-full cursor-pointer bg-gray-100 dark:bg-gray-700 hover:bg-purple-500 hover:text-white transition text-black dark:text-white"
      >
        <img
          src={user?.profile || "/default_profile.png"}
          alt="Profile"
          className="w-8 h-8 rounded-full border border-gray-300 object-cover"
        />
        <span className="font-medium">Profile</span>
      </div>
    )}
  </div>
</header>

{/* MOBILE HEADER */}
<header className="sm:hidden fixed top-0 left-0 w-full px-4 py-3 bg-white dark:bg-gray-800 shadow-md z-50 flex flex-row justify-between text-black dark:text-white">
  <Link to="/" className="flex flex-col items-center">
    <img src='/logo.png' alt="Logo" className="w-12 h-12 rounded-full" />
    <span className="font-bold text-lg mt-1 text-black dark:text-white">FileMan</span>
  </Link>

  <div className="flex items-center space-x-2 mt-2">
    {user === null ? (
      <>
        <Link to="/signup" className="px-4 py-1 border rounded-full hover:bg-purple-500 hover:text-white transition text-black dark:text-white">
          Sign Up
        </Link>
        <Link to="/login" className="px-4 py-1 border rounded-full hover:bg-purple-500 hover:text-white transition text-black dark:text-white">
          Log In
        </Link>
      </>
    ) : (
      <div
        onClick={() => setActiveTab("profile")}
        className="flex items-center gap-2 pl-2 pr-4 py-1 rounded-full cursor-pointer bg-gray-100 dark:bg-gray-700 hover:bg-purple-500 hover:text-white transition text-black dark:text-white"
      >
        <img
          src={user?.profile || "/default_profile.png"}
          alt="Profile"
          className="w-8 h-8 rounded-full border border-gray-300 object-cover"
        />
        <span className="font-medium">Profile</span>
      </div>
    )}
  </div>
</header>

    </>
  );
}

export default Header;