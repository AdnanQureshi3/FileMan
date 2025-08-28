import React from "react";
import {
  FaWhatsapp,
  FaTelegramPlane,
  FaInstagram,
  FaEnvelope,
  FaDownload,
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
    } catch (error) {
      console.error("QR code download failed:", error);
      alert("Failed to download QR code. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg w-full max-w-md p-6 relative transition">
        {/* Title */}
        <h3 className="text-lg font-semibold text-center text-gray-800 dark:text-gray-100">
          Share <span className="text-blue-600 dark:text-blue-400">"{file?.name}"</span>
        </h3>

        {/* Social Buttons */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <a
            href={handleShare(file.shortUrl).whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center p-3 rounded-xl bg-green-500 text-white hover:bg-green-600 transition"
          >
            <FaWhatsapp size={22} />
          </a>
          <a
            href={handleShare(file.shortUrl).facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center p-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            f
          </a>
          <a
            href={handleShare(file.shortUrl).twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center p-3 rounded-xl bg-sky-500 text-white hover:bg-sky-600 transition"
          >
            X
          </a>
          <a
            href={handleShare(file.shortUrl).email}
            className="flex items-center justify-center p-3 rounded-xl bg-red-500 text-white hover:bg-red-600 transition"
          >
            <FaEnvelope size={20} />
          </a>
          <a
            href="#"
            className="flex items-center justify-center p-3 rounded-xl bg-sky-400 text-white hover:bg-sky-500 transition"
          >
            <FaTelegramPlane size={20} />
          </a>
          <a
            href="#"
            className="flex items-center justify-center p-3 rounded-xl bg-pink-500 text-white hover:bg-pink-600 transition"
          >
            <FaInstagram size={20} />
          </a>
        </div>

        {/* QR Code */}
        <div className="mt-8 text-center">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Scan QR Code:
          </p>
          <img
            src={handleShare(file.shortUrl).qr}
            alt="QR Code"
            className="mx-auto border p-2 rounded-lg shadow-sm w-40 aspect-square"
          />

          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
            <button
              onClick={() => downloadQRCode(file.shortUrl)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              <FaDownload /> Download QR
            </button>

            <button
              onClick={() => {
                navigator.clipboard.writeText(handleShare(file.shortUrl).copy);
                toast.success("Link copied to clipboard!");
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition"
            >
              Copy Link
            </button>
          </div>
        </div>

        {/* Close Button */}
        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-900 dark:bg-gray-200 dark:text-gray-900 dark:hover:bg-gray-300 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
