import React, { useState, useRef, useEffect } from "react";
import { MdMoreVert, MdDelete, MdRemoveRedEye, MdOutlineShare } from "react-icons/md";
import { useDispatch } from "react-redux";
import { deleteFile } from "../Redux/Slice/file/fileThunk";

export default function FileActions({ file, setPreviewFile, setShareFile }) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState("bottom"); // bottom or top
  const buttonRef = useRef();
  const dropdownRef = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOpen = () => {
    const rect = buttonRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const dropdownHeight = 140; // approx height of dropdown
    if (spaceBelow < dropdownHeight) {
      setPosition("top");
    } else {
      setPosition("bottom");
    }
    setOpen(true);
  };

  const handleDelete = () => {
    dispatch(deleteFile(file._id));
    setOpen(false);
  };

  const handlePreview = () => {
    setPreviewFile(file);
    setOpen(false);
  };

  const handleShare = () => {
    setShareFile(file);
    setOpen(false);
  };

  return (
    <div className="relative inline-block">
      <button
        ref={buttonRef}
        onClick={() => (open ? setOpen(false) : handleOpen())}
        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none"
        title="More actions"
      >
        <MdMoreVert className="w-5 h-5 text-gray-600 dark:text-gray-300" />
      </button>

      {open && (
        <div
          ref={dropdownRef}
          className={`absolute right-0 w-44 bg-white dark:bg-gray-800 shadow-lg rounded-lg z-[999] ${
            position === "bottom" ? "mt-2" : "mb-2 bottom-full"
          }`}
        >
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 w-full px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg"
          >
            <MdDelete /> Delete
          </button>
          <button
            onClick={handlePreview}
            className="flex items-center gap-2 w-full px-3 py-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg"
          >
            <MdRemoveRedEye /> Preview
          </button>
          <button
            onClick={handleShare}
            className="flex items-center gap-2 w-full px-3 py-2 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900 rounded-lg"
          >
            <MdOutlineShare /> Share
          </button>
        </div>
      )}
    </div>
  );
}
