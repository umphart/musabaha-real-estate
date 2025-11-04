import React from "react";
import { FiSearch, FiDownload } from "react-icons/fi";
import { headerActionsStyles, searchBoxStyles, searchIconStyles, searchInputStyles, filterSelectStyles, primaryButtonStyles } from "../styles/componentStyles";

const HeaderActions = ({ 
  activeTab, 
  searchQuery, 
  setSearchQuery, 
  filter, 
  setFilter 
}) => {
  return (
    <div style={headerActionsStyles}>
      <div style={searchBoxStyles}>
        <FiSearch style={searchIconStyles} />
        <input
          type="text"
          placeholder={activeTab === "summary" ? "Search by name or plot..." : "Search payment requests..."}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={searchInputStyles}
        />
      </div>
      
      {activeTab === "summary" && (
        <select 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
          style={filterSelectStyles}
        >
          <option value="all">All Status</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
      )}

      <button style={primaryButtonStyles}>
        <FiDownload /> Export All
      </button>
    </div>
  );
};

export default HeaderActions;