import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserFiles } from "../Redux/Slice/file/fileThunk.js";
import FileFilter from "./FileFilter.jsx";
import FileTable from "./FileTable.jsx";
import PreviewModal from "./PreviewModal.jsx";
import ShareModal from "./ShareModal.jsx";

const FileShow = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { files } = useSelector((state) => state.file);

  const [previewFile, setPreviewFile] = useState(null);
  const [shareFile, setShareFile] = useState(null);
  // const [deleteFile]

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (user && user.id) {
      dispatch(getUserFiles(user.id));
    }
  }, [user, dispatch]);

  const getFilteredFiles = () => {
    return (
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
      }) || []
    );
  };

  const filteredFiles = getFilteredFiles();

  return (
    <div className="w-full flex flex-col mt-6 bg-gray-50 dark:bg-gray-900 p-6 rounded-lg shadow-md">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between border-b border-gray-200 dark:border-gray-700 pb-4">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100">
          📁 Your Uploaded Files
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          <span className="font-semibold text-gray-900 dark:text-gray-200">
            {filteredFiles.length}
          </span>{" "}
          file{filteredFiles.length !== 1 && "s"} found
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6">
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

      {/* File Table */}
      <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow-inner">
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

export default FileShow;