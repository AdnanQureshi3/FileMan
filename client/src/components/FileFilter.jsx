import React, { useState } from "react";

const Dropdown = ({ label, value, onChange, options }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative w-full md:w-44">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full px-3 py-2 border rounded-lg text-left bg-white"
      >
        {value ? options.find((opt) => opt.value === value)?.label : label}
      </button>

      {open && (
        <div className="absolute mt-1 w-full bg-white border rounded-lg shadow-lg z-50">
          {options.map((opt) => (
            <div
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

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
    <div className="flex flex-col md:flex-row gap-3 w-full md:items-center mb-4 flex-wrap">
      {/* Search Input */}
      <div className="relative flex-1 min-w-[200px]">
        <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-text)]"
          placeholder="Search by file name"
        />
      </div>

      {/* File Type Dropdown */}
      <Dropdown
        label="All Types"
        value={filterType}
        onChange={setFilterType}
        options={[
          { value: "", label: "All Types" },
          ...[...new Set(files?.map((f) => f.type))].map((t) => ({
            value: t,
            label: t,
          })),
        ]}
      />

      {/* Status Dropdown */}
      <Dropdown
        label="All Status"
        value={filterStatus}
        onChange={setFilterStatus}
        options={[
          { value: "", label: "All Status" },
          { value: "active", label: "Active" },
          { value: "expired", label: "Expired" },
        ]}
      />

      {/* Reset Button */}
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
