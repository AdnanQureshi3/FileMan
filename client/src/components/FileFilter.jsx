import React from 'react';

const FileFilter = ({
  searchTerm,
  setSearchTerm,
  filterType,
  setFilterType,
  filterStatus,
  setFilterStatus,
  files
}) => {
  return (
    <div className="flex flex-col lg:flex-row gap-4 w-full lg:items-center mb-4">
      <div className="relative flex-1">
        <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-text)]"
          placeholder="Search by file name"
          aria-label="Search"
        />
      </div>

      <select
        className="px-3 py-2 border rounded-lg"
        value={filterType}
        onChange={(e) => setFilterType(e.target.value)}
      >
        <option value="">All Types</option>
        {[...new Set(files?.map((f) => f.type))].map((type) => (
          <option key={type} value={type}>{type}</option>
        ))}
      </select>

      <select
        className="px-3 py-2 border rounded-lg"
        value={filterStatus}
        onChange={(e) => setFilterStatus(e.target.value)}
      >
        <option value="">All Status</option>
        <option value="active">Active</option>
        <option value="expired">Expired</option>
      </select>

      {(filterType || filterStatus || searchTerm) && (
        <button
          onClick={() => {
            setSearchTerm("");
            setFilterType("");
            setFilterStatus("");
          }}
          className="px-3 py-2 bg-red-100 text-red-500 rounded hover:bg-red-200"
        >
          Reset
        </button>
      )}
    </div>
  );
};

export default FileFilter;