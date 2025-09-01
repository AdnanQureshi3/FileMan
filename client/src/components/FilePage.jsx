import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserFiles } from "../Redux/Slice/file/fileThunk.js";
import FileFilter from "./FileFilter.jsx";
import FileTable from "./FileTable.jsx";
import PreviewModal from "./PreviewModal.jsx";
import ShareModal from "./ShareModal.jsx";

const FilePage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { files } = useSelector((state) => state.file);

  const [previewFile, setPreviewFile] = useState(null);
  const [shareFile, setShareFile] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (user && user._id) {
      dispatch(getUserFiles(user._id));
    }
  }, [user, dispatch]);

  // Filter client-side
  const filteredFiles =
    files?.filter((file) => {
      const nameMatch = file.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const typeMatch = filterType ? file.type === filterType : true;

      const statusMatch = filterStatus
        ? filterStatus === "expired"
          ? new Date(file.expiresAt) <= new Date()
          : new Date(file.expiresAt) > new Date()
        : true;

      return nameMatch && typeMatch && statusMatch;
    }) || [];

  return (
    <div className="w-full flex flex-col mt-6">
  {/* Header */}
  <div className="mb-4 flex flex-col gap-2">
    <h2 className="text-lg font-bold">📁 Your Files</h2>
    <p className="text-sm text-gray-500">
      {filteredFiles.length} file{filteredFiles.length !== 1 && "s"}
    </p>
  </div>

  {/* Filters */}
  <div className="mb-4">
    <FileFilter
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      filterType={filterType}
      setFilterType={setFilterType}
      filterStatus={filterStatus}
      setFilterStatus={setFilterStatus}
      files={files}
    />
  </div>

  {/* 📱 Mobile / Tablet View → Cards */}
  <div className="grid gap-4 md:hidden">
    {filteredFiles.map((file) => {
      const isExpired = new Date(file.expiresAt) <= new Date();
      return (
        <div
          key={file._id}
          className="bg-white rounded-2xl shadow p-4 flex flex-col gap-3 border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-800 truncate max-w-[200px]">
              {file.name}
            </h3>
            <span
              className={`text-xs px-2 py-1 rounded-full ${
                isExpired
                  ? "bg-red-100 text-red-600"
                  : "bg-green-100 text-green-600"
              }`}
            >
              {isExpired ? "Expired" : "Active"}
            </span>
          </div>

          <p className="text-sm text-gray-500">
            Type: {file.type.split("/")[0]} •{" "}
            {(file.size / 1024 / 1024).toFixed(2)} MB
          </p>

          <p className="text-xs text-gray-400">
            Expires: {new Date(file.expiresAt).toLocaleDateString()}
          </p>

          <div className="flex gap-3">
            <button
              onClick={() => setPreviewFile(file)}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm"
            >
              Preview
            </button>
            <button
              onClick={() => setShareFile(file)}
              className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg text-sm"
            >
              Share
            </button>
          </div>
        </div>
      );
    })}
  </div>

  {/* 💻 Desktop view (keep your table) */}
  <div className="hidden md:block overflow-x-auto">
    <FileTable
      files={filteredFiles}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      itemsPerPage={itemsPerPage}
      setPreviewFile={setPreviewFile}
      setShareFile={setShareFile}
    />
  </div>

  {/* Modals */}
  {previewFile && (
    <PreviewModal file={previewFile} onClose={() => setPreviewFile(null)} />
  )}
  {shareFile && (
    <ShareModal file={shareFile} onClose={() => setShareFile(null)} />
  )}
</div>

  );
};

export default FilePage;
