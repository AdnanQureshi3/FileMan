import React, { useState } from "react";
import { MdOutlineExpandMore, MdOutlineSearch, MdOutlineCancel } from 'react-icons/md';

const Dropdown = ({ label, value, onChange, options }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative w-full md:w-44 z-40">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
      >
        <span>{value ? options.find((opt) => opt.value === value)?.label : label}</span>
        <MdOutlineExpandMore className={`w-5 h-5 ml-2 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute mt-1 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-50">
          {options.map((opt) => (
            <div
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer transition-colors duration-200"
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
    <div className="flex flex-col md:flex-row gap-4 w-full md:items-center p-4 bg-gray-100  dark:bg-gray-700 rounded-xl shadow-inner transition-colors duration-300">
      {/* Search Input */}

      <div className="relative  flex-1 min-w-[200px] md:max-w-xs">
        <span className="absolute  left-4 top-1/2 -translate-y-1/2 text-gray-400">
          <MdOutlineSearch className="w-5 h-5" />
        </span>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-11 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
          placeholder="Search by file name"
        />
      </div>

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
          className="px-4 py-2 flex items-center gap-1 rounded-lg text-sm font-medium bg-red-100 text-red-600 dark:bg-red-800 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-700 transition-colors duration-200"
        >
          <MdOutlineCancel className="w-4 h-4" />
          Reset
        </button>
      )}
    </div>
  );
};

export default FileFilter;