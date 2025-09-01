import React from "react";
import {
  FaWhatsapp,
  FaTelegramPlane,
  FaInstagram,
  FaEnvelope,
  FaDownload,
  FaTwitter,
  FaFacebookF,
  FaLink,
} from "react-icons/fa";
import { toast } from "react-toastify";

const ShareModal = ({ file, onClose }) => {
  const handleShare = (shortUrl) => {
    const frontendBaseUrl = window.location.origin;
    const fullUrl = `${frontendBaseUrl}${shortUrl}`;
    return {
      whatsapp: `https://wa.me/?text=${encodeURIComponent("Download file: " + fullUrl)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(fullUrl)}&text=Check this out!`,
      email: `mailto:?subject=Shared File&body=${encodeURIComponent("Here's your file: " + fullUrl)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(fullUrl)}&text=Download file:`,
      instagram: `https://www.instagram.com/share/url?url=${encodeURIComponent(fullUrl)}`,
      copy: fullUrl,
      qr: `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(fullUrl)}&size=150x150`,
    };
  };

  const downloadQRCode = async (shortUrl) => {
    const qrUrl = handleShare(shortUrl).qr;
    try {
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = "qr-code.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
      toast.success("QR code downloaded successfully!");
    } catch (error) {
      console.error("QR code download failed:", error);
      toast.error("Failed to download QR code. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 h-100vh flex items-center justify-center bg-black/50 dark:bg-black/70 backdrop-blur-sm z-50 p-4 transition-opacity duration-300">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm md:max-w-md p-6 relative transition-transform duration-300 transform scale-95 opacity-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400 transition"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
            Share <span className="text-blue-600 dark:text-blue-400 break-all font-extrabold">"{file?.name}"</span>
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Share this file with your friends and colleagues</p>
        </div>

        {/* Social Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <a
            href={handleShare(file.shortUrl).whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center p-2 rounded-xl bg-green-500 text-white hover:bg-green-600 transition transform hover:scale-105"
          >
            <FaWhatsapp size={20} />
            <span className="text-xs mt-1">WhatsApp</span>
          </a>
          <a
            href={handleShare(file.shortUrl).twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center p-2 rounded-xl bg-sky-500 text-white hover:bg-sky-600 transition transform hover:scale-105"
          >
            <FaTwitter size={20} />
            <span className="text-xs mt-1">Twitter</span>
          </a>
          <a
            href={handleShare(file.shortUrl).facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center p-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition transform hover:scale-105"
          >
            <FaFacebookF size={20} />
            <span className="text-xs mt-1">Facebook</span>
          </a>
          <a
            href={handleShare(file.shortUrl).telegram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center p-2 rounded-xl bg-sky-400 text-white hover:bg-sky-500 transition transform hover:scale-105"
          >
            <FaTelegramPlane size={20} />
            <span className="text-xs mt-1">Telegram</span>
          </a>
          <a
            href={handleShare(file.shortUrl).email}
            className="flex flex-col items-center justify-center p-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition transform hover:scale-105"
          >
            <FaEnvelope size={20} />
            <span className="text-xs mt-1">Email</span>
          </a>
          <button
            onClick={() => {
              navigator.clipboard.writeText(handleShare(file.shortUrl).copy);
              toast.success("Link copied to clipboard!");
            }}
            className="flex flex-col items-center justify-center p-2 rounded-xl bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition transform hover:scale-105"
          >
            <FaLink size={20} />
            <span className="text-xs mt-1">Copy Link</span>
          </button>
        </div>

        {/* QR Code */}
        <div className="mt-2 text-center">
          <p className="text-base font-medium text-gray-700 dark:text-gray-300 mb-4">
            Or Share via QR Code
          </p>
          <img
            src={handleShare(file.shortUrl).qr}
            alt="QR Code"
            className="mx-auto border-4 border-gray-200 dark:border-gray-700 p-2 rounded-lg shadow-sm w-48 h-48 sm:w-56 sm:h-56 transition-colors duration-200"
          />

          <button
            onClick={() => downloadQRCode(file.shortUrl)}
            className="mt-3 inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 font-semibold transition transform hover:scale-105"
          >
            <FaDownload /> Download QR
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;