import React from "react";

function ProfilePage({ user }) {
  if (!user) return <p className="text-center text-gray-500">Loading...</p>;

  // storage usage calculation
  const usedStorage = user.memoryLeft;
  const usagePercent = Math.min(
    (usedStorage / user.TotalSizeLimit) * 100,
    100
  ).toFixed(0);

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50 p-4">
      <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-xl border border-gray-200">

        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-center gap-5">
          <img
            src={user.profile || "/default_profile.png"}
            alt="Profile"
            className="w-24 h-24 rounded-full border-4 border-gray-200 shadow"
          />
          <div className="text-center sm:text-left">
            <h2 className="text-xl font-bold text-gray-900">{user.fullname}</h2>
            <p className="text-gray-600">@{user.username}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>

     
        <hr className="my-4 border-gray-200" />

        {/* Memory Usage Section */}
        <div className="mb-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Storage Usage</h3>
          <div className="w-full bg-gray-200 rounded-full h-4 relative overflow-hidden">
            <div
              className="h-4 bg-blue-500 transition-all duration-500"
              style={{ width: `${usagePercent}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-600 mt-1">
            {usedStorage} MB used of {user.TotalSizeLimit} MB ({usagePercent}%)
          </p>
        </div>

   
        <div className="grid grid-cols-2 gap-4 text-center">
          <StatCard label="File Limit" value={`${user.filesizeLimit} MB`} />
          <PremiumCard isPremium={user.isPremium} expiry={user.premiumExpiry} />
        </div>

        {/* Verification Badge */}
        <div className="mt-4 text-sm text-center sm:text-left">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              user.isVerified
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {user.isVerified ? "Verified Account" : "Not Verified"}
          </span>
        </div>

        {/* Uploaded Files */}
        {user.files?.length > 0 && (
          <div className="mt-6">
            <h3 className="text-md font-semibold text-gray-900 mb-2">
              Uploaded Files
            </h3>
            <ul className="space-y-2 max-h-48 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300">
              {user.files.map((file, idx) => (
                <li
                  key={idx}
                  className="flex justify-between items-center bg-gray-100 rounded-lg px-4 py-2 text-sm"
                >
                  <span className="truncate text-gray-800 w-3/4">{file}</span>
                  <a
                    href={file}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    View
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="bg-gray-100 rounded-xl p-3 shadow-sm">
      <p className="text-lg font-semibold text-gray-900">{value}</p>
      <p className="text-sm text-gray-600">{label}</p>
    </div>
  );
}

function PremiumCard({ isPremium, expiry }) {
  return (
    <div
      className={`rounded-xl p-3 shadow-md border text-white ${
        isPremium
          ? "bg-gradient-to-r from-yellow-400 to-yellow-500 animate-pulse"
          : "bg-gray-300 text-gray-700"
      }`}
    >
      <p className="text-lg font-semibold">
        {isPremium ? "Premium Active" : "Free Plan"}
      </p>
      {isPremium && (
        <p className="text-xs">
          Expiry: {new Date(expiry).toLocaleDateString()}
        </p>
      )}
    </div>
  );
}

export default ProfilePage;
