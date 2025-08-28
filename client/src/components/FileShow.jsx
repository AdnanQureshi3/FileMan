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
      <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <h2 className="text-lg md:text-xl font-bold">📁 Your Uploaded Files</h2>
        <p className="text-sm text-gray-500">
          Showing {filteredFiles.length} file{filteredFiles.length !== 1 && "s"}
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

      {/* Table (scrolls horizontally on small screens) */}
      <div className="overflow-x-auto">
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
