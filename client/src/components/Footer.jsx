import React from "react";
import { Link } from "react-router-dom";

function Footer({setActiveTab}) {
  const [mode, setMode] = React.useState("light");
  const toggleMode = () => setMode(mode === "light" ? "dark" : "light");

  const socialIcons = [
    { href: "https://www.linkedin.com/in/prince-kumar-788673253/", src: "https://cdn-icons-png.flaticon.com/512/174/174857.png", alt: "LinkedIn" },
    { href: "https://github.com/princeInScripts", src: "https://cdn-icons-png.flaticon.com/512/733/733553.png", alt: "GitHub" },
    { href: "https://instagram.com/scriptxprince", src: "https://cdn-icons-png.flaticon.com/512/2111/2111463.png", alt: "Instagram" },
    { href: "mailto:pk8917912@example.com", src: "https://cdn-icons-png.flaticon.com/512/732/732200.png", alt: "Email" },
  ];
  const ActiveTabHandler =(tab) => {
    setActiveTab(tab);
  }

  return (
    <>
      {/* Desktop / Tablet Footer */}
      <footer className="hidden sm:flex w-full py-6 px-4 backdrop-blur-lg bg-white/40 dark:bg-black/30 text-[var(--text-color)] shadow-inner flex-col md:flex-row items-center justify-between">
        {/* Left: Credit */}
        <p className="text-sm font-medium text-center md:text-left">
          Crafted with ❤️ by <span className="font-semibold">Adnan Qureshi</span>
        </p>

        {/* Right: Socials */}
        <div className="flex items-center gap-5 mt-4 md:mt-0">
          {socialIcons.map((icon, i) => (
            <a
              key={i}
              href={icon.href}
              target="_blank"
              rel="noopener noreferrer"
              className="relative w-8 h-8 rounded-full flex items-center justify-center overflow-hidden group hover:scale-110 transition-transform"
            >
              <img
                src={icon.src}
                alt={icon.alt}
                className="w-6 h-6 grayscale group-hover:grayscale-0 transition duration-300"
              />
              <span className="absolute inset-0 rounded-full bg-[var(--primary-text)] opacity-0 group-hover:opacity-10 transition-opacity"></span>
            </a>
          ))}
        </div>
      </footer>

      {/* Mobile Bottom Nav */}
      <div className="sm:hidden fixed bottom-0 left-0 w-full bg-[var(--bg-color)] text-[var(--text-color)] shadow-t z-50 flex justify-around items-center py-2">
        <div onClick={() => ActiveTabHandler("home")} className="flex flex-col items-center cursor-pointer">
          🏠 <span className="text-xs">Home</span>
        </div>
        <div onClick={() => ActiveTabHandler("files")} className="flex flex-col items-center">
          📂 <span className="text-xs">My Files</span>
        </div>
        <div
          onClick={() => ActiveTabHandler("upload")}
          className="relative -top-5 w-12 h-12 flex items-center cursor-pointer justify-center bg-blue-500 text-white rounded-full shadow-lg"
        >
          ＋
        </div>
        <div  onClick={() => ActiveTabHandler("plans")} className="flex flex-col cursor-pointer items-center">
          💎 <span className="text-xs">Plans</span>
        </div>
        <button onClick={toggleMode} className="flex flex-col items-center">
          {mode === "light" ? "🌞" : "🌙"} <span className="text-xs">Mode</span>
        </button>
      </div>
    </>
  );
}

export default Footer;
