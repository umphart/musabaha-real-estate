import React from 'react';
import { FiFileText, FiInfo, FiEye, FiDownload } from "react-icons/fi";

const LayoutModal = ({
  showLayoutModal,
  handleCloseLayoutModal,
  allLayoutPlans,
  selectedLayout,
  handleLayoutSelect,
  handleViewPdf,
  handleDownloadLayout
}) => {
  if (!showLayoutModal) return null;

  return (
    <div className="modal-overlay" onClick={handleCloseLayoutModal}>
      <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3><FiFileText /> Select Estate Layout Plan</h3>
          <button className="modal-close" onClick={handleCloseLayoutModal}>×</button>
        </div>
        <div className="modal-body">
          <div className="layouts-grid">
            {allLayoutPlans.map(layout => (
              <div key={layout.id} className="layout-card">
                <div className="layout-header">
                  <h4>{layout.layout_name}</h4>
                  {selectedLayout && selectedLayout.id === layout.id && (
                    <span className="current-badge">Selected</span>
                  )}
                </div>
                <div className="layout-details">
                  <p><strong>File:</strong> {layout.filename}</p>
                  <p><strong>Uploaded:</strong> {new Date(layout.created_at).toLocaleDateString()}</p>
                  <p><strong>Size:</strong> {(layout.file_size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <div className="layout-actions">
                  <button 
                    className="btn-select"
                    onClick={() => handleLayoutSelect(layout)}
                  >
                    Select
                  </button>
                  <button 
                    type="button" 
                    className="btn-view-layout"
                    onClick={() => handleViewPdf(`https://musabaha-homes.onrender.com${layout.file_url}`)}
                  >
                    <FiEye className="icon" /> View
                  </button>
                  <button 
                    className="btn-download"
                    onClick={() => handleDownloadLayout(layout)}
                  >
                    <FiDownload /> Download
                  </button>
                </div>
              </div>
            ))}
            {allLayoutPlans.length === 0 && (
              <div className="no-layouts">
                <FiInfo className="icon" />
                <p>No layout plans available.</p>
                <p>Please contact the administrator for estate layout plans.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LayoutModal;