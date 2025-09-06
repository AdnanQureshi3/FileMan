import React from "react";

import OtpVerification from "./VerifyPage";

function ProfilePage({ user }) {
  const [open, setOpen] = React.useState(false);
  if (!user) return <p className="text-center text-gray-500 dark:text-gray-300">Loading...</p>;

  const memory = user?.UsedStorage;
  const usedStorage = memory > 1 ? memory.toFixed(1) : memory.toFixed(2);
  const percent = Math.min((usedStorage / user.TotalSizeLimit) * 100, 100);
  const usagePercent = percent > 1? percent.toFixed(1) : percent.toFixed(2);

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-4">
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-6 w-full max-w-xl border border-gray-200 dark:border-gray-700">

        <div className="flex flex-col sm:flex-row items-center gap-5">
          <img
            src={user.profile || "/default_profile.png"}
            alt="Profile"
            className="w-24 h-24 rounded-full border-4 border-gray-200 dark:border-gray-600 shadow"
          />
          <div className="text-center sm:text-left">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{user.fullname}</h2>
            <p className="text-gray-600 dark:text-gray-300">@{user.username}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
          </div>
        </div>

        <hr className="my-4 border-gray-200 dark:border-gray-700" />

        <div className="mb-5">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Storage Usage</h3>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 relative overflow-hidden">
            <div
              className="h-4 bg-blue-500 dark:bg-blue-400 transition-all duration-500"
              style={{ width: `${usagePercent}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
            {usedStorage} MB used of {user.TotalSizeLimit} MB ({usagePercent}%)
          </p>
        </div>
        <OtpVerification open={open} setOpen={setOpen} need={"Verification"} />

        <div className="grid grid-cols-2 gap-4 text-center">
          <StatCard label="File Limit" value={`${user.filesizeLimit} MB`} />
          <PremiumCard isPremium={user.isPremium} expiry={user.premiumExpiry} />
        </div>

       <div className="mt-4 text-sm text-center sm:text-left">
  {user.isVerified ? (
    <span className="px-4 py-1.5 rounded-full text-sm font-medium 
      bg-green-100 dark:bg-green-700 text-green-700 dark:text-green-100">
      Verified
    </span>
  ) : (
   <button
  onClick={() => setOpen(true)}
  className="px-4 py-2 rounded-lg text-sm font-medium  bg-green-600 text-white 
             hover:bg-green-700 active:scale-95 shadow-sm hover:shadow-md transition-all duration-200"
>
  Verify
</button>

  )}
</div>
        {user.files?.length > 0 && (
          <div className="mt-6">
            <h3 className="text-md font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Uploaded Files
            </h3>
            <ul className="space-y-2 max-h-48 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
              {user.files.map((file, idx) => (
                <li
                  key={idx}
                  className="flex justify-between items-center bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-2 text-sm"
                >
                  <span className="truncate text-gray-800 dark:text-gray-100 w-3/4">{file}</span>
                  <a
                    href={file}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
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
    <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-3 shadow-sm">
      <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{value}</p>
      <p className="text-sm text-gray-600 dark:text-gray-300">{label}</p>
    </div>
  );
}

function PremiumCard({ isPremium, expiry }) {
  return (
    <div
      className={`rounded-xl p-3 shadow-md border text-white ${
        isPremium
          ? "bg-gradient-to-r from-yellow-400 to-yellow-500 animate-pulse"
          : "bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200"
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
