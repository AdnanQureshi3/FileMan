import React from "react"
import { useSelector } from "react-redux"
import { FileText, Download, UploadCloud } from "lucide-react"

function FilesPage() {
  const user = useSelector((state) => state.auth.user)

  return (
    <div className="w-full px-4 py-6">
      <h1 className="text-xl font-bold mb-4">Your Files</h1>

      {(!user?.files || user?.files.length === 0) && (
        <div className="text-center text-gray-500">
          <UploadCloud className="mx-auto h-12 w-12 mb-2" />
          <p>No files uploaded yet</p>
        </div>
      )}

 
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {user?.files?.map((file, idx) => (
          <div
            key={idx}
            className="p-4 bg-white shadow rounded-lg flex flex-col justify-between"
          >
            <div className="flex items-center gap-2 mb-3">
              <FileText className="h-5 w-5 text-blue-600" />
              <p className="font-medium truncate">{file?.name || "Unnamed file"}</p>
            </div>
            <div className="text-sm text-gray-500">
              <p>Size: {file?.size || "N/A"}</p>
              <p>Type: {file?.type || "N/A"}</p>
              <p>Uploaded: {file?.uploadedAt || "N/A"}</p>
            </div>
            <div className="mt-3">
              <button className="flex items-center gap-2 text-blue-600 hover:underline text-sm">
                <Download className="h-4 w-4" />
                Download
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FilesPage
