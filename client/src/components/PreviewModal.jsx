import React, { useEffect, useState } from "react";
const PreviewModal = ({ file, onClose }) => {
  if (!file) return null;

  // ✅ Use URL.createObjectURL only if it’s a real File object
  const previewUrl =
    file instanceof File
      ? URL.createObjectURL(file)
      : file.url || file.path || ""; // fallback for API/DB stored files

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
            <iframe src={previewUrl} title="PDF Preview" className="w-full h-full border-0" />
          ) : file.type?.startsWith("image/") ? (
            <img src={previewUrl} alt={file.name} className="w-full h-full object-contain" />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-700">
              <p>{file.name || "Unsupported file"}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default PreviewModal;