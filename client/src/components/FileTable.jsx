import React from 'react';
import { formatDistanceToNowStrict, differenceInDays } from "date-fns";

const FileTable = ({
  files,
  currentPage,
  setCurrentPage,
  itemsPerPage,
  setPreviewFile,
  setShareFile
}) => {
  const sortFileName = (filename) => {
    return filename.length > 20 ? `${filename.slice(0, 20)}...` : filename;
  };

  const totalPages = Math.ceil((files?.length || 0) / itemsPerPage);
  const paginatedFiles = files?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      <div className="-my-2 overflow-x-auto">
        <div className="inline-block min-w-full py-2 align-middle">
          <div className="overflow-hidden border border-[var(--border-color)] rounded-md shadow-md">
            <table className="min-w-full divide-y divide-[var(--border-color)] text-[var(--text-color)]">
              {/* Table headers */}
              <thead className="bg-[var(--primary-text)] text-[var(--text-on-primary)] hidden md:table-header-group">
                <tr>
                  {[
                    "File Name",
                    "Size",
                    "Type",
                    "Download",
                    "Status",
                    "Actions",
                    "Expiry At",
                    "Uploaded At",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              
              {/* Table body */}
              <tbody className="bg-[var(--bg-color)] divide-y divide-[var(--border-color)]">
                {paginatedFiles?.map((file) => {
                  const formattedSize =
                    file.size > 1024 * 1024
                      ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
                      : file.size > 1024
                      ? `${(file.size / 1024).toFixed(2)} KB`
                      : `${file.size} Bytes`;

                  const isExpired =
                    differenceInDays(new Date(file.expiresAt), new Date()) <= 0;

                  return (
                    <>
                      {/* Desktop Row */}
                      <tr
                        key={file._id}
                        className="hover:bg-[var(--hover-bg-color)] hidden md:table-row"
                      >
                        <td className="px-6 py-4 text-sm">{sortFileName(file.name)}</td>
                        <td className="px-6 py-4 text-sm text-gray-400">{formattedSize}</td>
                        <td className="px-6 py-4 text-sm text-gray-400">{file.type}</td>
                        <td className="px-6 py-4 text-sm text-gray-400">{file.downloadedContent}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`font-medium ${file.status === "active" ? "text-green-500" : "text-red-500"}`}>
                            {file.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm space-x-3">
                          <button
                            onClick={() => setPreviewFile(file)}
                            className="text-blue-400 hover:text-blue-300 underline"
                          >
                            Preview
                          </button>
                          <button
                            onClick={() => setShareFile(file)}
                            className="text-purple-400 hover:text-purple-300 underline"
                          >
                            Share
                          </button>
                        </td>
                        <td className="px-6 py-4 text-sm text-red-500">
                          {isExpired ? "Expired" : `Expires in ${differenceInDays(new Date(file.expiresAt), new Date())} days`}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-400">
                          Uploaded {formatDistanceToNowStrict(new Date(file.createdAt), { addSuffix: true })}
                        </td>
                      </tr>

                      {/* Mobile Card */}
                      <tr key={`mobile-${file._id}`} className="block md:hidden border-b border-gray-200">
                        <td className="block px-4 py-4">
                          {/* Mobile content remains the same */}
                        </td>
                      </tr>
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-4 px-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded text-white bg-[var(--primary-text)] hover:opacity-90 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-950 dark:text-gray-900">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded text-white bg-[var(--primary-text)] hover:opacity-90 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default FileTable;