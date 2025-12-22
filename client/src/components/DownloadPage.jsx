import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { Link } from "react-router-dom";
import Header from "./Header";
import { Eye, EyeOff } from "lucide-react";

const DownloadPage = () => {
  const { shortCode } = useParams();

  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isProtected, setIsProtected] = useState(false);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const fetchFile = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/file/f/${shortCode}`
        );
        if (cancelled) return;

        const data = res.data;

        // ✅ Always set full file first (keeps UI data intact)
        setFile(data);
        setIsProtected(data.isPasswordProtected);
        setIsLoading(false);

        // ✅ If NOT password protected → fetch preview URL
        if (!data.isPasswordProtected) {
          const previewRes = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/file/preview/${data.id}`
          );

          setFile((prev) => ({
            ...prev,
            path: previewRes.data.previewUrl, // 🔥 only update path
          }));
        }

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

  const verifyFile = async () => {
    if (!password.trim()) {
      toast.warn("⚠️ Please enter the password");
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/file/verifyFilePassword`,
        { shortCode, password }
      );

      if (res.data.success) {
        toast.success("✅ Access granted");
        setIsVerified(true);

        // ✅ After verify → fetch preview URL
        const previewRes = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/file/preview/${file.id}`
        );

        setFile((prev) => ({
          ...prev,
          path: previewRes.data.previewUrl, // 🔥 only update path
        }));
      } else {
        toast.error("❌ Incorrect password");
      }
    } catch {
      toast.error("⚠️ Something went wrong, try again");
    }
  };

  const handleDownload = () => {
    if (!file) return;
    const link = document.createElement("a");
    link.href = file.downloadUrl;
    link.setAttribute("download", file.name);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
    <div className="w-full max-w-screen-lg mx-auto p-4 sm:p-6 flex flex-col gap-6 sm:gap-8">
      <Header />

      <div className="mt-10 sm:mt-20 text-center px-2">
        <h2 className="text-xl sm:text-2xl font-bold">📂 Secure File Download</h2>
        <p className="text-gray-600 mt-2 text-sm sm:text-base leading-relaxed">
          Access your shared file safely and quickly. <br className="hidden sm:block" />
          For unlimited storage and advanced features,{" "}
          <Link
            to="/signup"
            className="text-blue-600 font-medium cursor-pointer hover:underline"
          >
            create an account
          </Link>.
        </p>
      </div>

      <div className="bg-[var(--bg-color)] rounded-2xl shadow-xl p-4 sm:p-6 flex flex-col gap-6 lg:flex-row">
        {/* File preview section */}
        <div className="w-full lg:w-2/3 flex flex-col gap-4">
          <h1 className="text-lg sm:text-2xl font-semibold text-gray-800 break-words">
            {file.name}
          </h1>

          <div className="w-full">
            {isProtected && !isVerified ? (
              <div className="flex flex-col items-center justify-center border-2 border-dashed p-6 sm:p-8 rounded-lg bg-gray-100 dark:bg-gray-800 text-center">
                <img
                  src="/locked-file.svg"
                  alt="Protected"
                  className="w-20 h-20 sm:w-24 sm:h-24 mb-4"
                />
                <p className="text-gray-700 font-medium text-sm sm:text-base">
                  🔒 This file is locked. Enter password to continue.
                </p>
              </div>
            ) : (
              <>
                {file.type.startsWith("image/") && (
                  <img src={file.path} alt={file.name} className="w-full rounded-lg shadow" />
                )}
                {file.type.startsWith("video/") && (
                  <video
                    controls
                    className="w-full rounded-lg shadow max-h-[300px] sm:max-h-[400px]"
                  >
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
                    <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center rounded-lg">
                      <button
                        onClick={() => window.open(file.path, "_blank")}
                        className="bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium hover:bg-blue-700 text-sm sm:text-base"
                      >
                        📄 Open PDF in Browser
                      </button>
                    </div>
                    <iframe
                      src={file.path}
                      title="PDF"
                      className="w-full h-[250px] sm:h-[400px] rounded-lg shadow"
                    ></iframe>
                  </div>
                )}
              </>
            )}
          </div>

          <p className="text-xs sm:text-sm text-gray-600 italic">
            Uploaded by <span className="font-medium">{file.uploadedBy}</span>
          </p>
        </div>

        {/* Info + actions section */}
        <div className="w-full lg:w-1/3 flex flex-col gap-3 sm:gap-4">
          <p className="text-xs sm:text-sm">
            <strong>📅 Uploaded on:</strong>{" "}
            {new Date(file.createdAt).toLocaleDateString()}
          </p>
          <p className="text-xs sm:text-sm">
            <strong>📦 Size:</strong> {(file.size / 1024 / 1024).toFixed(2)} MB
          </p>
          <p className="text-xs sm:text-sm">
            <strong>📝 Type:</strong> {file.type}
          </p>

          {isProtected && !isVerified && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center border-2 border-gray-300 rounded-2xl px-3 py-2 shadow-sm focus-within:border-blue-500 transition-all duration-300 w-full bg-white">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="🔑 Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-gray-700 text-sm sm:text-base placeholder-gray-400"
                />
                <button
                  className="ml-2 text-xl sm:text-2xl cursor-pointer text-gray-500 hover:text-gray-700 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "👀" : "🙈"}
                </button>
              </div>

              <button
                onClick={verifyFile}
                className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-700 font-medium text-sm sm:text-base"
              >
                🔐 Unlock File
              </button>
            </div>
          )}

          {(!isProtected || isVerified) && (
            <button
              onClick={handleDownload}
              className="w-full bg-green-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-green-700 font-medium text-sm sm:text-base"
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
