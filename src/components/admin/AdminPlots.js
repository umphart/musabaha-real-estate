import React, { useState, useEffect } from 'react';
import { FiX, FiHome, FiMapPin, FiDollarSign, FiTag, FiEye, FiEdit, FiDownload, FiUpload, FiList } from 'react-icons/fi';
import "./plotStyle.css";
import Swal from 'sweetalert2';

const AdminPlots = () => {
  const [plots, setPlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [viewPlot, setViewPlot] = useState(null);
  const [editPlot, setEditPlot] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAllLayoutsModal, setShowAllLayoutsModal] = useState(false);
  const [layoutPlan, setLayoutPlan] = useState(null);
  const [allLayoutPlans, setAllLayoutPlans] = useState([]);
  const [uploading, setUploading] = useState(false);

  const [newPlot, setNewPlot] = useState({
    number: '',
    location: '',
    dimension: '',
    price: '',
    status: 'Available',
    owner: ''
  });

  const [newLayout, setNewLayout] = useState({
    layoutName: '',
    layoutPlan: null
  });

  useEffect(() => {
    fetchPlots();
    fetchLayoutPlan();
  }, []);

  const fetchPlots = () => {
    fetch("https://musabaha-homes.onrender.com/api/plots")
      .then(res => res.json())
      .then(data => {
        console.log("Fetched plots:", data);
        if (data.success) setPlots(data.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching plots:", err);
        setLoading(false);
      });
  };

  const fetchLayoutPlan = async () => {
    try {
      const res = await fetch("https://musabaha-homes.onrender.com/api/layout-plan");
      const data = await res.json();
      if (data.success && data.data) {
        setLayoutPlan(data.data);
      }
    } catch (error) {
      console.error("Error fetching layout plan:", error);
    }
  };

  const fetchAllLayoutPlans = async () => {
    try {
      const res = await fetch("https://musabaha-homes.onrender.com/api/layout-plan/all");
      const data = await res.json();
      if (data.success) {
        setAllLayoutPlans(data.data);
      }
    } catch (error) {
      console.error("Error fetching all layout plans:", error);
    }
  };

  const formatPrice = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleInputChange = (e) => {
    setNewPlot({ ...newPlot, [e.target.name]: e.target.value });
  };

  const handleLayoutInputChange = (e) => {
    setNewLayout({ ...newLayout, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setNewLayout({ ...newLayout, layoutPlan: e.target.files[0] });
  };

  const handleCreatePlot = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("https://musabaha-homes.onrender.com/api/plots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPlot),
      });
      const data = await res.json();
      if (data.success) {
        setPlots([...plots, data.data]);
        Swal.fire({
          icon: 'success',
          title: 'Plot Created!',
          text: `Plot ${data.data.number} was added successfully.`,
          timer: 2000,
          showConfirmButton: false
        });
        setShowCreateModal(false);
        setNewPlot({ number: '', location: '', dimension: '', price: '', status: 'Available', owner: '' });
      } else {
        Swal.fire({ icon: 'error', title: 'Error', text: data.message || 'Something went wrong!' });
      }
    } catch (error) {
      console.error("Error creating plot:", error);
      Swal.fire({ icon: 'error', title: 'Network Error', text: 'Could not connect to server. Try again later.' });
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    
    // Enhanced validation
    if (!newLayout.layoutPlan) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Please select a file to upload.' });
      return;
    }
    
    if (!newLayout.layoutName || newLayout.layoutName.trim() === '') {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Layout name is required.' });
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('layoutPlan', newLayout.layoutPlan);
      formData.append('layoutName', newLayout.layoutName);

      const res = await fetch("https://musabaha-homes.onrender.com/api/layout-plan", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Layout Plan Uploaded!',
          text: 'Layout plan has been uploaded successfully.',
          timer: 2000,
          showConfirmButton: false
        });
        setShowUploadModal(false);
        setNewLayout({ layoutName: '', layoutPlan: null });
        fetchLayoutPlan(); // Refresh the layout plan data
      } else {
        Swal.fire({ icon: 'error', title: 'Error', text: data.message || 'Upload failed.' });
      }
    } catch (error) {
      console.error("Error uploading layout plan:", error);
      Swal.fire({ icon: 'error', title: 'Network Error', text: 'Could not connect to server. Try again later.' });
    } finally {
      setUploading(false);
    }
  };

  const handleDownloadLayout = async (layoutId = null) => {
    const layoutToDownload = layoutId 
      ? allLayoutPlans.find(lp => lp.id === layoutId) 
      : layoutPlan;

    if (!layoutToDownload) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'No layout plan available for download.' });
      return;
    }

    try {
      const response = await fetch(`https://musabaha-homes.onrender.com/api/layout-plan/download/${layoutToDownload.id}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = layoutToDownload.filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to download layout plan.' });
      }
    } catch (error) {
      console.error("Error downloading layout plan:", error);
      Swal.fire({ icon: 'error', title: 'Network Error', text: 'Download failed. Try again later.' });
    }
  };

  const handleDeleteLayout = async (layoutId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "This will permanently delete the layout plan!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`https://musabaha-homes.onrender.com/api/layout-plan/${layoutId}`, {
          method: 'DELETE'
        });
        const data = await res.json();

        if (data.success) {
          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'Layout plan has been deleted.',
            timer: 2000,
            showConfirmButton: false
          });
          // If deleted layout is the current one, clear it
          if (layoutPlan && layoutPlan.id === layoutId) {
            setLayoutPlan(null);
          }
          // Refresh all layouts if in all layouts modal
          if (showAllLayoutsModal) {
            fetchAllLayoutPlans();
          } else {
            fetchLayoutPlan();
          }
        } else {
          Swal.fire({ icon: 'error', title: 'Error', text: data.message });
        }
      } catch (error) {
        console.error("Error deleting layout plan:", error);
        Swal.fire({ icon: 'error', title: 'Network Error', text: 'Delete failed. Try again later.' });
      }
    }
  };

  const openAllLayoutsModal = () => {
    fetchAllLayoutPlans();
    setShowAllLayoutsModal(true);
  };

  const filteredPlots = filter === 'all'
    ? plots
    : plots.filter(plot => plot.status.toLowerCase() === filter.toLowerCase());

  if (loading) return <div className="loading">Loading plots...</div>;

  return (
    <div className="admin-content">
      <div className="content-header">
        <h2>Plot Management</h2>
        <div className="header-actions">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Plots</option>
            <option value="available">Available</option>
            <option value="sold">Sold</option>
            <option value="reserved">Reserved</option>
          </select>
          <button 
            className="icon-btn info" 
            onClick={openAllLayoutsModal} 
            data-tooltip="View All Layout Plans"
          >
            <FiList />
          </button>
          <button 
            className="icon-btn info" 
            onClick={() => setShowUploadModal(true)} 
            data-tooltip="Upload Layout Plan"
          >
            <FiUpload />
          </button>
          <button 
            className="icon-btn primary" 
            onClick={() => setShowCreateModal(true)} 
            data-tooltip="Add Plot"
          >
            <FiHome />
          </button>
        </div>
      </div>

      {/* Current Layout Plan Section */}
      {layoutPlan && (
        <div className="layout-plan-section">
          <div className="layout-plan-card">
            <h3><FiMapPin /> Current Layout Plan: {layoutPlan.layout_name}</h3>
            <div className="layout-plan-info">
              <p><strong>File:</strong> {layoutPlan.filename}</p>
              <p><strong>Uploaded:</strong> {new Date(layoutPlan.created_at).toLocaleDateString()}</p>
              <p><strong>Size:</strong> {(layoutPlan.file_size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
            <div className="layout-plan-actions">
              <button 
                className="icon-btn success" 
                onClick={() => handleDownloadLayout()}
                data-tooltip="Download Layout Plan"
              >
                <FiDownload />
              </button>
              <a 
                href={`https://musabaha-homes.onrender.com${layoutPlan.file_url}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="icon-btn info"
                data-tooltip="View Layout Plan"
              >
                <FiEye />
              </a>
              <button 
                className="icon-btn danger" 
                onClick={() => handleDeleteLayout(layoutPlan.id)}
                data-tooltip="Delete Layout Plan"
              >
                <FiX />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="plots-grid">
        {filteredPlots.map(plot => (
          <div key={plot.id} className="plot-card">
            <div className="plot-header">
              <h3>Plot {plot.number}</h3>
              <span className={`status-badge ${plot.status.toLowerCase()}`}>
                {plot.status}
              </span>
            </div>
            <div className="plot-details">
              <p><strong>Size:</strong> {plot.dimension}</p>
              <p><strong>Price:</strong> {formatPrice(plot.price)}</p>
              <p><strong>Layout Name:</strong> {plot.location}</p>
              {plot.owner && <p><strong>Owner:</strong> {plot.owner}</p>}
            </div>
            <div className="plot-actions">
              <button className="icon-btn info" onClick={() => setViewPlot(plot)} data-tooltip="View"><FiEye /></button>
              <button className="icon-btn warning" onClick={() => setEditPlot(plot)} data-tooltip="Edit"><FiEdit /></button>
              {plot.status === 'Available' && (
                <button className="icon-btn success" data-tooltip="Sell"><FiDollarSign /></button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3><FiHome /> Add New Plot</h3>
              <button className="modal-close" onClick={() => setShowCreateModal(false)}><FiX /></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleCreatePlot}>
                {["number", "Layout Name", "dimension", "price"].map(field => (
                  <div className="form-group" key={field}>
                    <label>{field.charAt(0).toUpperCase() + field.slice(1)} *</label>
                    <input
                      type={field === "price" ? "number" : "text"}
                      name={field}
                      value={newPlot[field]}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                ))}
                <div className="form-group">
                  <label>Status *</label>
                  <select name="status" value={newPlot.status} onChange={handleInputChange} required>
                    <option value="Available">Available</option>
                    <option value="Sold">Sold</option>
                    <option value="Reserved">Reserved</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Owner</label>
                  <input
                    type="text"
                    name="owner"
                    value={newPlot.owner}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="modal-footer">
                  <button type="button" className="icon-btn secondary" onClick={() => setShowCreateModal(false)}><FiX /></button>
                  <button type="submit" className="icon-btn primary"><FiHome /></button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Upload Layout Plan Modal */}
      {showUploadModal && (
        <div className="modal-overlay" onClick={() => setShowUploadModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3><FiUpload /> Upload New Layout Plan</h3>
              <button className="modal-close" onClick={() => setShowUploadModal(false)}><FiX /></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleFileUpload}>
                <div className="form-group">
                  <label>Layout Name *</label>
                  <input
                    type="text"
                    name="layoutName"
                    value={newLayout.layoutName}
                    onChange={handleLayoutInputChange}
                    placeholder="e.g., Phase 1 Master Plan, Residential Layout"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Layout Plan File *</label>
                  <input
                    type="file"
                    name="layoutPlan"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={handleFileChange}
                    required
                  />
                  <small>Supported formats: PDF, JPG, PNG, DOC, DOCX (Max: 10MB)</small>
                </div>
                <div className="modal-footer">
                  <button type="button" className="icon-btn secondary" onClick={() => setShowUploadModal(false)}><FiX /></button>
                  <button 
                    type="submit" 
                    className="icon-btn primary" 
                    disabled={uploading}
                  >
                    {uploading ? 'Uploading...' : <FiUpload />}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* All Layout Plans Modal */}
      {showAllLayoutsModal && (
        <div className="modal-overlay" onClick={() => setShowAllLayoutsModal(false)}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3><FiList /> All Layout Plans</h3>
              <button className="modal-close" onClick={() => setShowAllLayoutsModal(false)}><FiX /></button>
            </div>
            <div className="modal-body">
              <div className="layouts-grid">
                {allLayoutPlans.map(layout => (
                  <div key={layout.id} className="layout-card">
                    <div className="layout-header">
                      <h4>{layout.layout_name}</h4>
                      {layoutPlan && layoutPlan.id === layout.id && (
                        <span className="current-badge">Current</span>
                      )}
                    </div>
                    <div className="layout-details">
                      <p><strong>File:</strong> {layout.filename}</p>
                      <p><strong>Uploaded:</strong> {new Date(layout.created_at).toLocaleDateString()}</p>
                      <p><strong>Size:</strong> {(layout.file_size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    <div className="layout-actions">
                      <button 
                        className="icon-btn success" 
                        onClick={() => handleDownloadLayout(layout.id)}
                        data-tooltip="Download"
                      >
                        <FiDownload />
                      </button>
                      <a 
                        href={`https://musabaha-homes.onrender.com${layout.file_url}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="icon-btn info"
                        data-tooltip="View"
                      >
                        <FiEye />
                      </a>
                      <button 
                        className="icon-btn danger" 
                        onClick={() => handleDeleteLayout(layout.id)}
                        data-tooltip="Delete"
                      >
                        <FiX />
                      </button>
                    </div>
                  </div>
                ))}
                {allLayoutPlans.length === 0 && (
                  <div className="no-layouts">
                    <p>No layout plans found. Upload your first layout plan!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewPlot && (
        <div className="modal-overlay" onClick={() => setViewPlot(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3><FiEye /> Plot Details</h3>
              <button className="modal-close" onClick={() => setViewPlot(null)}><FiX /></button>
            </div>
            <div className="modal-body">
              <p><strong>Number:</strong> {viewPlot.number}</p>
              <p><strong>Layout Name:</strong> {viewPlot.location}</p>
              <p><strong>Dimension:</strong> {viewPlot.dimension}</p>
              <p><strong>Price:</strong> {formatPrice(viewPlot.price)}</p>
              <p><strong>Status:</strong> {viewPlot.status}</p>
              {viewPlot.owner && <p><strong>Owner:</strong> {viewPlot.owner}</p>}
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editPlot && (
        <div className="modal-overlay" onClick={() => setEditPlot(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3><FiEdit /> Edit Plot</h3>
              <button className="modal-close" onClick={() => setEditPlot(null)}><FiX /></button>
            </div>
            <div className="modal-body">
              <form onSubmit={async (e) => {
                e.preventDefault();
                try {
                  const res = await fetch(`https://musabaha-homes.onrender.com/api/plots/${editPlot.id}`, {
                    method: 'PUT',
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(editPlot),
                  });
                  const data = await res.json();
                  if (data.success) {
                    const updated = plots.map(p => p.id === editPlot.id ? data.data : p);
                    setPlots(updated);
                    Swal.fire({
                      icon: 'success',
                      title: 'Plot Updated!',
                      text: `Plot ${data.data.number} was updated successfully.`,
                      timer: 2000,
                      showConfirmButton: false
                    });
                    setEditPlot(null);
                  } else {
                    Swal.fire({ icon: 'error', title: 'Error', text: data.message || 'Update failed.' });
                  }
                } catch (err) {
                  console.error(err);
                  Swal.fire({ icon: 'error', title: 'Network Error', text: 'Try again later.' });
                }
              }}>
                {["number", "location", "dimension", "price"].map(field => (
                  <div className="form-group" key={field}>
                    <label>{field.charAt(0).toUpperCase() + field.slice(1)} *</label>
                    <input
                      type={field === "price" ? "number" : "text"}
                      name={field}
                      value={editPlot[field]}
                      onChange={(e) => setEditPlot({ ...editPlot, [field]: e.target.value })}
                      required
                    />
                  </div>
                ))}
                <div className="form-group">
                  <label>Status *</label>
                  <select name="status" value={editPlot.status} onChange={(e) => setEditPlot({ ...editPlot, status: e.target.value })} required>
                    <option value="Available">Available</option>
                    <option value="Sold">Sold</option>
                    <option value="Reserved">Reserved</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Owner</label>
                  <input
                    type="text"
                    name="owner"
                    value={editPlot.owner}
                    onChange={(e) => setEditPlot({ ...editPlot, owner: e.target.value })}
                  />
                </div>
                <div className="modal-footer">
                  <button type="button" className="icon-btn secondary" onClick={() => setEditPlot(null)}><FiX /></button>
                  <button type="submit" className="icon-btn warning"><FiEdit /></button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPlots;