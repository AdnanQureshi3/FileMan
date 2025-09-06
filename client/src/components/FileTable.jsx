import React from 'react';
import { formatDistanceToNowStrict, differenceInDays } from "date-fns";
import { MdOutlineDownload, MdOutlineContentCopy,MdDelete , MdOutlineShare, MdRemoveRedEye, MdOutlineTimer, MdArrowBackIosNew, MdArrowForwardIos } from 'react-icons/md';
import {deleteFile} from "../Redux/Slice/file/fileThunk.js"
import { useDispatch } from 'react-redux';
import FileActions from './FileActions.jsx';
const FileTable = ({
  files,
  currentPage,
  setCurrentPage,
  itemsPerPage,
  setPreviewFile,
  setShareFile
}) => {
  const totalPages = Math.ceil((files?.length || 0) / itemsPerPage);
  const paginatedFiles = files?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const dispatch = useDispatch();

  const formatFileName = (filename) => {
    return filename.length > 20 ? `${filename.slice(0, 20)}...` : filename;
  };

  return (
    <div className="overflow-hidden bg-white dark:bg-gray-800 rounded-xl shadow-md transition-colors duration-300">
      <div className="overflow-x-auto">
        <table className="w-full text-left table-auto">
          {/* Table headers */}

          <thead className="bg-gray-700 font-semibold text-md text-gray-400 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-3 tracking-wider">File Name</th>
              <th className="px-4 py-3 tracking-wider hidden sm:table-cell">Size</th>
        
              <th className="px-4 py-3 tracking-wider hidden lg:table-cell">Type</th>
              <th className="px-4 py-3 tracking-wider hidden sm:table-cell">Downloads</th>
              <th className="px-4 py-3 tracking-wider">Status</th>
              <th className="px-4 py-3 tracking-wider hidden lg:table-cell">Expiry</th>
              <th className="px-4 py-3 tracking-wider hidden lg:table-cell">Uploaded</th>
              <th className="px-4 py-3 tracking-wider text-right pr-6">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {paginatedFiles?.length > 0 ? (
              paginatedFiles.map((file) => {
                const isExpired = new Date(file.expiresAt) <= new Date();
                const formattedSize = file.size > 1024 * 1024

                  ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
                  : file.size > 1024
                  ? `${(file.size / 1024).toFixed(2)} KB`
                  : `${file.size} Bytes`;

                return (
                  <tr key={file._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100 truncate max-w-[120px] sm:max-w-none">
                      {formatFileName(file.name)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 hidden sm:table-cell">{formattedSize}</td>
                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 hidden lg:table-cell">{file.type}</td>
                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 hidden sm:table-cell">{file.downloadedContent}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isExpired ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'}`}>
                        {isExpired ? 'Expired' : 'Active'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 hidden lg:table-cell">
                      {file.expiresAt ? (
                        <div className="flex items-center">
                          <MdOutlineTimer className="w-4 h-4 mr-1 text-gray-400" />
                          <span>{isExpired ? "Expired" : `${differenceInDays(new Date(file.expiresAt), new Date())} days`}</span>
                        </div>
                      ) : (
                        "No expiry"
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 hidden lg:table-cell">
                      {formatDistanceToNowStrict(new Date(file.createdAt), { addSuffix: true })}
                    </td>
                    <td className="px-4 py-3 text-sm text-right pr-6">
                      <div className="flex items-center justify-end space-x-2">
                       
                      <FileActions file={file} setPreviewFile={setPreviewFile} setShareFile={setShareFile} />
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="8" className="text-center px-4 py-8 text-gray-500 dark:text-gray-400">
                  No files found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center px-4 py-3 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-800 rounded-md hover:bg-gray-300 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <MdArrowBackIosNew className="mr-2 h-4 w-4" /> Previous
          </button>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-400">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-800 rounded-md hover:bg-gray-300 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next <MdArrowForwardIos className="ml-2 h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default FileTable;