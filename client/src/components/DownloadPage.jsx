import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { Link } from "react-router-dom";
import Header from "./Header";

const DownloadPage = () => {
  const { shortCode } = useParams();

  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [isProtected, setIsProtected] = useState(false);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const fetchFile = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/file/f/${shortCode}`);
        if (cancelled) return;
        const data = res.data;
        setFile(data);
        setIsProtected(data.isPasswordProtected);
        setIsLoading(false);

        if (data.isPasswordProtected) {
          toast.info("🔒 This file is password protected.");
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.data?.message || "❌ File not found");
          setIsLoading(false);
        }
      }
    };

    fetchFile();
    return () => {
      cancelled = true;
    };
  }, [shortCode]);

  const handleDownload = () => {
    if (!file) return;
    const link = document.createElement("a");
    link.href = file.downloadUrl;
    link.setAttribute("download", file.name);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const verifyFile = async () => {
    if (!password.trim()) {
      toast.warn("⚠️ Please enter the password");
      return;
    }
    try {
      const res = await axios.post(`http://localhost:3000/api/files/verifyFilePassword`, {
        shortCode,
        password,
      });
      if (res.data.success) {
        toast.success("✅ Access granted");
        setIsVerified(true);
      } else {
        toast.error("❌ Incorrect password");
      }
    } catch {
      toast.error("⚠️ Something went wrong, try again");
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500 text-lg font-medium">
        {error}
      </div>
    );
  }

  if (isLoading || !file) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500 text-lg">
        Fetching your file...
      </div>
    );
  }

  return (
    <div className="w-full max-w-screen-lg mx-auto p-6 flex flex-col gap-8">
      <Header />
    
      <div className="mt-20 text-center">
        <h2 className="text-2xl font-bold">📂 Secure File Download</h2>
        <p className="text-gray-600 mt-2 text-base">
          Access your shared file safely and quickly. <br />
          For unlimited storage and advanced features,{" "}
          <Link to="/signup" className="text-blue-600 font-medium cursor-pointer hover:underline">create an account</Link>.
        </p>
      </div>

      <div className="bg-[var(--bg-color)] rounded-2xl shadow-xl p-6 flex flex-col gap-6 lg:flex-row">
        <div className="w-full lg:w-2/3 flex flex-col gap-4">
          <h1 className="text-2xl font-semibold text-gray-800">{file.name}</h1>

          <div className="w-full">
            {isProtected && !isVerified ? (
              <div className="flex flex-col items-center justify-center border-2 border-dashed p-8 rounded-lg bg-gray-100 dark:bg-gray-800">
                <img src="/locked-file.svg" alt="Protected" className="w-24 h-24 mb-4" />
                <p className="text-gray-700 font-medium">🔒 This file is locked. Enter password to continue.</p>
              </div>
            ) : (
              <>
                {file.type.startsWith("image/") && (
                  <img src={file.path} alt={file.name} className="w-full rounded-lg shadow" />
                )}
                {file.type.startsWith("video/") && (
                  <video controls className="w-full rounded-lg shadow">
                    <source src={file.path} type={file.type} />
                  </video>
                )}
                {file.type.startsWith("audio/") && (
                  <audio controls className="w-full">
                    <source src={file.path} type={file.type} />
                  </audio>
                )}
                {file.type === "application/pdf" && (
                  <div className="relative">
                    {/* Blackout overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center rounded-lg">
                      <button
                        onClick={() => window.open(file.path, "_blank")}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700"
                      >
                        📄 Open PDF in Browser
                      </button>
                    </div>

                    {/* PDF iframe under blackout */}
                    <iframe
                      src={file.path}
                      title="PDF"
                      className="w-full h-[400px] rounded-lg shadow"
                    ></iframe>
                  </div>
                )}
              </>
            )}
          </div>

          <p className="text-sm text-gray-600 italic">
            Uploaded by <span className="font-medium">{file.uploadedBy}</span>
          </p>
        </div>

        <div className="w-full lg:w-1/3 flex flex-col gap-4">
          <p className="text-sm"><strong>📅 Uploaded on:</strong> {new Date(file.createdAt).toLocaleDateString()}</p>
          <p className="text-sm"><strong>📦 Size:</strong> {(file.size / 1024 / 1024).toFixed(2)} MB</p>
          <p className="text-sm"><strong>📝 Type:</strong> {file.type}</p>

          {isProtected && !isVerified && (
            <div className="flex flex-col gap-3">
              <input
                type="password"
                placeholder="🔑 Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={verifyFile}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
              >
                🔐 Unlock File
              </button>
            </div>
          )}

          {(!isProtected || isVerified) && (
            <button
              onClick={handleDownload}
              className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-medium"
            >
              ⬇️ Download File
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DownloadPage;
