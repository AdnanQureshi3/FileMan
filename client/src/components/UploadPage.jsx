import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uploadFile } from '../Redux/Slice/file/fileThunk.js'
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { MdCloudUpload, MdInfoOutline, MdDeleteForever } from "react-icons/md";
import {  uploadFiles } from "../Hooks/usePresignedurls.js";
import axios from "axios";

const FileUploader = ({ setActiveTab }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const loading = false;
  const { user } = useSelector((state) => state.auth);

  const [files, setFiles] = useState([]);
  const [enablePassword, setEnablePassword] = useState(false);
  const [password, setPassword] = useState("");
  const [enableExpiry, setEnableExpiry] = useState(false);
  const [expiryDate, setExpiryDate] = useState("");
  const [disable, setDisable] = useState(false);
  const limit = user?.filesizeLimit || 10;
  const memoryLeft = user?.memoryLeft || 25;
  let countFileGreaterThanLimit = 0;

  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

  const handleFiles = (fileList) => {
    let tempUsedMemory = files.reduce((acc, f) => acc + f.size, 0);
    let newFiles = [];

    Array.from(fileList).forEach((file) => {
      if (file.size > limit * 1024 * 1024) {
        setDisable(true);
        countFileGreaterThanLimit++;
        toast.error(`${file.name} exceeds file size limit of ${limit}MB`);
      } else if (tempUsedMemory + file.size > memoryLeft * 1024 * 1024) {
        setDisable(true);
        toast.error(`${file.name} exceeds your remaining memory of ${memoryLeft}MB`);
      } else {
        newFiles.push(file);
        tempUsedMemory += file.size;
      }
    });

    if (newFiles.length > 0) {
      setFiles((prev) => [...prev, ...newFiles]);
      toast.success("File(s) added!");
    }
  };

  const handleFileInputChange = (e) => {
    handleFiles(e.target.files);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove("dragover");
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add("dragover");
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove("dragover");
  };

  const removeFile = (index) => {
    const removedFile = files[index];
    setFiles((prev) => prev.filter((_, i) => i !== index));
    if (removedFile.size > limit * 1024 * 1024) {
      countFileGreaterThanLimit--;
    }

    const totalUsedMemory = files
      .filter((_, i) => i !== index)
      .reduce((acc, f) => acc + f.size, 0);
    if (totalUsedMemory <= memoryLeft * 1024 * 1024 && countFileGreaterThanLimit === 0) {
      setDisable(false);
    }
    toast.info("File removed");
  };

  const totalSize = files.reduce((acc, file) => acc + file.size, 0);

const handleUpload = async () => {
  console.log("Starting upload for files:", files);
    if (files.length === 0) {
      toast.error("Please upload at least one file.");
      return;
    }

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    formData.append("userId", user.id ? user.id : user.id);
    formData.append("hasExpiry", enableExpiry);

    if (enableExpiry && expiryDate) {
      const hours = Math.ceil(
        (new Date(expiryDate) - new Date()) / (1000 * 60 * 60)
      );
      formData.append("expiresAt", hours);
    }

    formData.append("isPassword", enablePassword);
    if (enablePassword && password) {
      formData.append("password", password);
    }

    try {
      const results = await uploadFiles(files);


    const successful = results
      .filter(r => r.status === "success")
      .map(r => ({
        key: r.key,
        name: r.file.name,
        type: r.contentType,
        size: r.file.size,
      }));
      if (successful.length > 0) {
        console.log("Confirming uploads for files:", successful);
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/file/confirm`, { files: successful },{ withCredentials: true });
        console.log("Server response after confirming uploads:", res.data);
    }

   
    const failed = results.length - successful.length;

    if (failed > 0) {
      toast.warn(
        `${successful.length} uploaded, ${failed} failed. Retry failed files.`
      );
    } else {
      toast.success("All files uploaded successfully!");
    }

      setFiles([]);
      // window.location.reload();
    } catch (err) {
      toast.error(err?.error || "Upload failed");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
      <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-6 md:p-10 rounded-xl shadow-lg transition-colors duration-300">

        {/* Header */}
        <div className="header text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-blue-900 dark:from-blue-400 dark:to-blue-700 text-transparent bg-clip-text">File Upload</h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">Drag & drop files or click to browse</p>
        </div>

        {/* Dropbox */}
        <div
          className={`dropbox relative flex flex-col items-center justify-center p-12 sm:p-20 text-center border-2 border-dashed rounded-3xl cursor-pointer transition-all duration-300 ease-in-out group
          ${disable
              ? 'border-red-500 bg-red-50 dark:border-red-700 dark:bg-red-900'
              : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-800'
            }`}
          onClick={handleBrowseClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <MdCloudUpload className="text-5xl text-blue-600 dark:text-blue-400 mb-4 transition-transform duration-300 group-hover:scale-110" />
          <div className="text-xl font-semibold">Drop files here</div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Supported formats: JPG, PNG, PDF, MP4, MOV, AVI, MKV (Max {limit}MB)
          </div>
          {disable && (
            <div className="flex justify-between items-center bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-200 px-4 py-2 rounded-md mt-4 text-sm font-medium w-full">
              <p className="flex items-center gap-2"><MdInfoOutline /> File size or memory limit exceeded</p>
              <button
                className="bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white px-3 py-1 rounded-md text-xs font-semibold transition transform hover:scale-105"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveTab("plans");
                }}
              >
                Upgrade to Premium
              </button>
            </div>
          )}
          <button
            className="browse-btn mt-6 px-6 py-2 rounded-full font-semibold text-white transition-all duration-300 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={(e) => {
              e.stopPropagation();
              handleBrowseClick();
            }}
            // disabled={disable}
          >
            Browse Files
          </button>
          <input
            type="file"
            ref={fileInputRef}
            multiple
            accept=".jpg,.jpeg,.webp,.png,.mp4,.avi,.mov,.mkv,.mk3d,.mks,.mka,.pdf"
            onChange={handleFileInputChange}
            className="hidden"
          />
        </div>

        {/* Extra Options */}
        <div className="extra-options mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-xl shadow-sm bg-gray-100 dark:bg-gray-700">
          <div className="flex flex-col">
            <label className="switch-label flex items-center justify-between mb-2 font-medium">
              <span className="label-text text-gray-700 dark:text-gray-300">Set Password</span>
              <label className="switch relative inline-block w-14 h-8">
                <input
                  type="checkbox"
                  checked={enablePassword}
                  onChange={(e) => setEnablePassword(e.target.checked)}
                  className="opacity-0 w-0 h-0 peer"
                />
                <span className="slider absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-gray-300 rounded-full transition-all duration-300 peer-checked:bg-blue-600 before:absolute before:content-[''] before:h-6 before:w-6 before:left-1 before:bottom-1 before:bg-white before:rounded-full before:transition-all before:duration-300 peer-checked:before:translate-x-6"></span>
              </label>
            </label>
            {enablePassword && (
              <input
                type="password"
                className="password-input mt-2 w-full p-3 rounded-md border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            )}
          </div>

          <div className="flex flex-col">
            <label className="switch-label flex items-center justify-between mb-2 font-medium">
              <span className="label-text text-gray-700 dark:text-gray-300">Set Expiry Date</span>
              <label className="switch relative inline-block w-14 h-8">
                <input
                  type="checkbox"
                  checked={enableExpiry}
                  onChange={(e) => setEnableExpiry(e.target.checked)}
                  className="opacity-0 w-0 h-0 peer"
                />
                <span className="slider absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-gray-300 rounded-full transition-all duration-300 peer-checked:bg-blue-600 before:absolute before:content-[''] before:h-6 before:w-6 before:left-1 before:bottom-1 before:bg-white before:rounded-full before:transition-all before:duration-300 peer-checked:before:translate-x-6"></span>
              </label>
            </label>
            {enableExpiry && (
              <input
                type="datetime-local"
                className="expiry-input mt-2 w-full p-3 rounded-md border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
              />
            )}
          </div>
        </div>

        {/* Upload Stats and Previews */}
        {files.length > 0 && (
          <div className="upload-stats mt-6 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
            <div className="stats-header p-4 bg-gray-100 dark:bg-gray-700">
              <h2 className="stats-title text-lg font-semibold">Upload Summary</h2>
            </div>
            <div className="stats-info bg-gray-50 dark:bg-gray-900 p-4">
              <div className="flex justify-between items-center text-sm font-medium">
                <span className="text-gray-600 dark:text-gray-400">Total Files:</span>
                <span className="text-gray-900 dark:text-white font-bold">{files.length}</span>
              </div>
              <div className="flex justify-between items-center text-sm font-medium mt-1">
                <span className="text-gray-600 dark:text-gray-400">Total Size:</span>
                <span className="text-gray-900 dark:text-white font-bold">
                  {totalSize > 1024 * 1024
                    ? `${(totalSize / (1024 * 1024)).toFixed(2)} MB`
                    : `${(totalSize / 1024).toFixed(2)} KB`}
                </span>
              </div>
              <div className="progress-bar w-full bg-gray-200 dark:bg-gray-700 h-2.5 mt-4 rounded-full overflow-hidden">
                <div
                  className={`progress-fill h-full rounded-full transition-all duration-300 ${disable ? 'bg-red-500' : 'bg-blue-500'
                    }`}
                  style={{
                    width: `${Math.min((totalSize / (limit * 1024 * 1024)) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* File Previews */}
        {files.length === 0 ? (
          <div className="empty-state mt-8 text-center text-gray-400 dark:text-gray-600 font-medium">No files uploaded yet</div>
        ) : (
          <div className="file-previews mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {files.map((file, index) => (
              <div className="file-preview flex items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-700 shadow-sm transition-transform duration-200 hover:scale-105" key={index}>
                <div className="preview-img-container flex-shrink-0 w-16 h-16 rounded-md overflow-hidden flex items-center justify-center bg-gray-200 dark:bg-gray-600">
                  {file.type.startsWith("image") ? (
                    <img src={URL.createObjectURL(file)} alt={file.name} className="preview-img object-cover w-full h-full" />
                  ) : file.type.startsWith("video") ? (
                    <video src={URL.createObjectURL(file)} className="preview-video object-cover w-full h-full" muted />
                  ) : (
                    <div className="file-icon text-4xl">📄</div>
                  )}
                </div>
                <div className="file-info flex-1 ml-4 overflow-hidden">
                  <div className="file-name text-sm font-medium truncate" title={file.name}>{file.name}</div>
                  <div className="file-size text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {file.size > 1024 * 1024 ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` : `${(file.size / 1024).toFixed(2)} KB`}
                  </div>
                </div>
                <div className="file-actions flex-shrink-0 ml-2">
                  <button
                    className="remove-btn text-gray-400 hover:text-red-500 transition-colors duration-200"
                    onClick={() => removeFile(index)}
                  >
                    <MdDeleteForever className="text-2xl" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Upload Action */}
        <div className="upload-action flex justify-end items-center gap-4 mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            className="upload-btn bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleUpload}
            disabled={loading || files.length === 0 || disable}
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileUploader;