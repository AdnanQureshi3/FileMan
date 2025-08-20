import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

function Header() {
  const [mode, setModeState] = useState("light");
  const [theme, setThemeState] = useState("pink");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "pink";
    const savedMode = localStorage.getItem("mode") || "light";
    setThemeState(savedTheme);
    setModeState(savedMode);
    document.body.setAttribute("data-theme", savedTheme);
    document.body.setAttribute("data-mode", savedMode);
  }, []);

  const setTheme = (newTheme) => {
    document.body.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    setThemeState(newTheme);
  };

  const toggleMode = () => {
    const newMode = mode === "light" ? "dark" : "light";
    document.body.setAttribute("data-mode", newMode);
    localStorage.setItem("mode", newMode);
    setModeState(newMode);
  };

  const colorMap = {
    pink: "bg-pink-500",
    blue: "bg-blue-500",
    green: "bg-green-500",
    purple: "bg-purple-500",
  };

  return (
    <>
      {/* DESKTOP HEADER */}
      <header className="hidden sm:flex fixed top-0 left-0 w-full px-6 py-3 bg-[var(--bg-color)] shadow-md z-50 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <img src={logo} alt="Logo" className="w-10 h-10 rounded-full" />
          <span className="text-2xl font-bold text-[var(--primary-text)]">PasteBox</span>
        </Link>

        <div className="flex items-center space-x-5">
          <button
            onClick={toggleMode}
            className="p-2 rounded-full border hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {mode === "light" ? "🌞" : "🌙"}
          </button>

          <div className="flex space-x-2">
            {Object.keys(colorMap).map((c) => (
              <button
                key={c}
                onClick={() => setTheme(c)}
                className={`w-5 h-5 rounded-full ${colorMap[c]} border-2 ${
                  theme === c ? "border-black" : "border-transparent"
                }`}
              />
            ))}
          </div>

          <Link to="/signup" className="px-4 py-1 border rounded-full hover:bg-blue-500 hover:text-white transition">
            Sign Up
          </Link>
          <Link to="/login" className="px-4 py-1 border rounded-full hover:bg-purple-500 hover:text-white transition">
            Log In
          </Link>
        </div>
      </header>

      
   {/* MOBILE HEADER */}
<header className="sm:hidden fixed top-0 left-0 w-full px-4 py-3 bg-[var(--bg-color)] shadow-md z-50 flex flex-row justify-between">
  <Link to="/" className="flex flex-col items-center">
    <img src={logo} alt="Logo" className="w-12 h-12 rounded-full" />
    <span className="font-bold text-lg text-[var(--primary-text)] mt-1">PasteBox</span>
  </Link>

  <div className="flex items-center space-x-2 mt-2">
    <Link
      to="/signup"
      className="px-3 py-1 border rounded-full hover:bg-blue-500 hover:text-white text-sm"
    >
      Sign Up
    </Link>
    <Link
      to="/login"
      className="px-3 py-1 border rounded-full hover:bg-purple-500 hover:text-white text-sm"
    >
      Log In
    </Link>
  </div>
</header>

    </>
  );
}

export default Header;
