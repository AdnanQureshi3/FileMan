import React, { useEffect, useState } from "react";

const PreviewModal = ({ file, onClose }) => {
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    if (!file) return;

    const url = file instanceof File ? URL.createObjectURL(file) : file.url;
    setPreviewUrl(url);

    return () => {
      if (file instanceof File) URL.revokeObjectURL(url);
    };
  }, [file]);

  if (!file) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="relative bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        
        {/* Header with Filename */}
        <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <span className="text-sm font-medium truncate pr-8">{file.name}</span>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 transition-colors text-xl font-bold"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 bg-black flex items-center justify-center overflow-hidden">
          {file.type === "application/pdf" ? (
            <iframe src={previewUrl} className="w-full h-[75vh] border-0" />
          ) : file.type?.startsWith("image/") ? (
            <img src={previewUrl} alt="Preview" className="max-w-full max-h-[75vh] object-contain" />
          ) : file.type?.startsWith("video/") ? (
            <video 
              src={previewUrl} 
              controls 
              autoPlay
              controlsList="nodownload" // Disables the triple-dot download button
              className="w-full max-h-[75vh] bg-black"
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            <div className="text-white p-20"></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;