import React from "react";

function Footer() {
  return (
    <footer className="w-full py-8 px-6 bg-gray-900 text-white shadow-lg flex flex-col md:flex-row items-center justify-between">
      {/* Left: Credit */}
      <p className="text-sm font-medium text-center md:text-left">
        Built with 💻 by <span className="font-bold">Adnan Qureshi</span>
      </p>

      {/* Right: Socials */}
      <div className="flex items-center gap-4 mt-4 md:mt-0">
        {[
          { href: "https://www.linkedin.com/in/prince-kumar-788673253/", src: "https://cdn-icons-png.flaticon.com/512/174/174857.png", alt: "LinkedIn" },
          { href: "https://github.com/princeInScripts", src: "https://cdn-icons-png.flaticon.com/512/733/733553.png", alt: "GitHub" },
          { href: "https://instagram.com/scriptxprince", src: "https://cdn-icons-png.flaticon.com/512/2111/2111463.png", alt: "Instagram" },
          { href: "mailto:pk8917912@example.com", src: "https://cdn-icons-png.flaticon.com/512/732/732200.png", alt: "Email" },
        ].map((icon, i) => (
          <a
            key={i}
            href={icon.href}
            target="_blank"
            rel="noopener noreferrer"
            className="relative w-10 h-10 flex items-center justify-center rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
          >
            <img
              src={icon.src}
              alt={icon.alt}
              className="w-5 h-5"
            />
          </a>
        ))}
      </div>
    </footer>
  );
}

export default Footer;
