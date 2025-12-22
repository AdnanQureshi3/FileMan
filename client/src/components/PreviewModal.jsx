import React from "react";

const PreviewModal = ({ file, onClose }) => {
  if (!file) return null;

  const previewUrl =
    file instanceof File ? URL.createObjectURL(file) : file.url;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="relative bg-white rounded-2xl shadow-xl w-[90%] max-w-3xl h-[80%] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white bg-red-500 hover:bg-red-600 rounded-full px-3 py-1"
        >
          ✕
        </button>

        <div className="flex-1 overflow-hidden">
          {file.type === "application/pdf" ? (
            <iframe src={previewUrl} className="w-full h-full border-0" />
          ) : file.type?.startsWith("image/") ? (
            <img src={previewUrl} className="w-full h-full object-contain" />
          ) : file.type?.startsWith("video/") ? (
            <video src={previewUrl} controls className="w-full h-full" />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-700">
              Unsupported file
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;
