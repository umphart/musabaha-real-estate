import React, { useState } from 'react';
import {FiChevronDown, FiChevronUp, FiEye, FiDownload,
  FiAlertCircle, FiDatabase,FiCheckCircle,
  FiMapPin, FiMap,FiX,FiCircle } from "react-icons/fi";

const PlotInformation = ({
  formData,
  errors,
  fieldMaxLengths,
  handleChange,
  plots,
  selectedLayout,
  handlePlotSelection,
  setShowLayoutModal,
  setShowTermsModal,
  handleViewPdf,
  handleDownloadLayout
}) => {
  const [visiblePlotsCount, setVisiblePlotsCount] = useState(5);
  const initialVisiblePlots = 5;

  return (
    <div className="form-section">
      <h4>Plot Information & Agreement</h4>

      {/* Layout Plan Selection Section */}
      <div className="layout-plan-section">
        <div className="form-group">
          <label>Estate Layout Plan *</label>
          <div className="layout-plan-selector">
            {selectedLayout ? (
              <div className="selected-layout">
                <div className="layout-info">
                  <strong>{selectedLayout.layout_name}</strong>
                  <span>File: {selectedLayout.filename}</span>
                  <span>Size: {(selectedLayout.file_size / 1024 / 1024).toFixed(2)} MB</span>
                  <span>Uploaded: {new Date(selectedLayout.created_at).toLocaleDateString()}</span>
                </div>
                <div className="layout-actions">
                  <button 
                    type="button" 
                    className="btn-view-layout"
                    onClick={() => handleViewPdf(`https://musabaha-homes.onrender.com${selectedLayout.file_url}`)}
                  >
                    <FiEye className="icon" /> View
                  </button>
                  <button 
                    type="button" 
                    className="btn-download-layout"
                    onClick={() => handleDownloadLayout(selectedLayout)}
                  >
                    <FiDownload className="icon" /> Download
                  </button>
                  <button 
                    type="button" 
                    className="btn-change-layout"
                    onClick={() => setShowLayoutModal(true)}
                  >
                    Change Layout
                  </button>
                </div>
              </div>
            ) : (
              <div className="no-layout">
                <p>No layout plan selected</p>
                <button 
                  type="button" 
                  className="btn-select-layout"
                  onClick={() => setShowLayoutModal(true)}
                >
                  Select Layout Plan
                </button>
              </div>  
            )}
          </div>
          <small>Select an estate layout plan to view available plots</small>
        </div>
      </div>

{/* Plot Selection */}
<div className="form-group">
  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600', marginBottom: '8px', color: '#2c3e50', fontSize: '14px' }}>
    <FiMapPin style={{ fontSize: '14px' }} /> Select Plot(s) *
  </label>

  <div style={{ margin: '12px 0' }}>
    {plots.length === 0 ? (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        gap: '6px', 
        padding: '16px', 
        textAlign: 'center', 
        color: '#666', 
        background: '#f8f9fa', 
        borderRadius: '6px',
        border: '1px dashed #dee2e6',
        fontSize: '13px'
      }}>
        <FiDatabase style={{ animation: 'spin 1s linear infinite' }} />
        Loading plots...
      </div>
    ) : (
      <>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', 
          gap: '8px', 
          marginBottom: '12px' 
        }}>
          {plots.slice(0, visiblePlotsCount).map((plot) => {
            const isSelected = formData.selectedPlots.some((p) => p.id === plot.id);
            const statusColor = plot.status.toLowerCase() === 'available' ? '#28a745' : 
                              plot.status.toLowerCase() === 'sold' ? '#dc3545' : '#ffc107';

            return (
              <div
                key={plot.id}
                style={{ 
                  border: `2px solid ${isSelected ? '#28a745' : '#e1e5e9'}`,
                  borderRadius: '8px',
                  padding: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  background: isSelected ? '#f8fff9' : 'white',
                  borderLeft: `3px solid ${statusColor}`,
                  opacity: plot.status.toLowerCase() === 'sold' ? 0.6 : 1,
                  minHeight: '60px'
                }}
                onClick={() => plot.status.toLowerCase() === 'available' && handlePlotSelection(plot)}
                title={`Plot ${plot.number} - ${plot.location} - ₦${parseFloat(plot.price).toLocaleString()}`}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                  <span style={{ fontWeight: '700', fontSize: '12px', color: '#2c3e50' }}>
                    #{plot.number}
                  </span>
                  {isSelected ? (
                    <FiCheckCircle style={{ fontSize: '14px', color: '#28a745' }} />
                  ) : (
                    <FiCircle style={{ fontSize: '12px', color: '#ccc' }} />
                  )}
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <div style={{ fontSize: '10px', color: '#555', fontWeight: '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {plot.location}
                  </div>
                  <div style={{ fontSize: '11px', fontWeight: '600', color: '#28a745' }}>
                    ₦{parseFloat(plot.price).toLocaleString()}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {plots.length > initialVisiblePlots && (
          <div style={{ textAlign: 'center', margin: '12px 0' }}>
            <button
              type="button"
              style={{ 
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '6px 12px',
                background: '#f8f9fa',
                border: '1px solid #e1e5e9',
                borderRadius: '6px',
                color: '#495057',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontWeight: '500',
                fontSize: '12px'
              }}
              onClick={() => {
                if (visiblePlotsCount >= plots.length) {
                  setVisiblePlotsCount(initialVisiblePlots);
                } else {
                  setVisiblePlotsCount(plots.length);
                }
              }}
            >
              {visiblePlotsCount >= plots.length ? (
                <>
                  <FiChevronUp style={{ fontSize: '12px' }} />
                  Show Less
                </>
              ) : (
                <>
                  <FiChevronDown style={{ fontSize: '12px' }} />
                  Show More ({plots.length - visiblePlotsCount})
                </>
              )}
            </button>
          </div>
        )}
      </>
    )}
  </div>

  {/* Compact Selected Plots Summary */}
  {formData.selectedPlots.length > 0 && (
    <div style={{ 
      background: '#f0f8ff',
      border: '1px solid #d1e7ff',
      borderRadius: '8px',
      padding: '12px',
      marginTop: '12px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <FiCheckCircle style={{ fontSize: '14px', color: '#28a745' }} />
          <span style={{ fontSize: '13px', fontWeight: '600', color: '#2c3e50' }}>
            Selected: {formData.selectedPlots.length} plot{formData.selectedPlots.length > 1 ? 's' : ''}
          </span>
        </div>
        <div style={{ fontSize: '13px', fontWeight: '600', color: '#28a745' }}>
          ₦{formData.selectedPlots
            .reduce((sum, p) => sum + parseFloat(p.price), 0)
            .toLocaleString()}
        </div>
      </div>
      
      <div style={{ 
        display: 'flex',
        flexWrap: 'wrap',
        gap: '6px',
        alignItems: 'center'
      }}>
        {formData.selectedPlots.map((plot) => (
          <div key={plot.id} style={{ 
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: 'white',
            border: '1px solid #28a745',
            borderRadius: '16px',
            padding: '4px 8px',
            fontSize: '11px',
            fontWeight: '500'
          }}>
            <span style={{ color: '#2c3e50' }}>#{plot.number}</span>
            <span style={{ color: '#28a745', fontSize: '10px' }}>
              ₦{parseFloat(plot.price).toLocaleString()}
            </span>
            <button
              type="button"
              style={{
                background: 'none',
                border: 'none',
                color: '#dc3545',
                cursor: 'pointer',
                padding: '2px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px'
              }}
              onClick={() => handlePlotSelection(plot)}
            >
              <FiX size={10} />
            </button>
          </div>
        ))}
      </div>

      {formData.layoutName && (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '6px', 
          marginTop: '8px',
          padding: '6px',
          background: 'white',
          borderRadius: '4px',
          fontSize: '12px'
        }}>
          <FiMap style={{ fontSize: '12px', color: '#666' }} />
          <span style={{ color: '#555' }}>{formData.layoutName}</span>
        </div>
      )}
    </div>
  )}

  {errors.selectedPlots && (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '6px', 
      color: '#dc3545', 
      fontSize: '12px',
      marginTop: '6px',
      padding: '6px 8px',
      background: '#f8d7da',
      border: '1px solid #f5c6cb',
      borderRadius: '4px'
    }}>
      <FiAlertCircle style={{ fontSize: '12px' }} />
      {errors.selectedPlots}
    </div>
  )}
</div>

{/* Compact Plot Details */}
<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '12px' }}>
  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
    <label style={{ fontSize: '12px', fontWeight: '600', color: '#555' }}>
      Number of Plots
    </label>
    <div style={{ 
      padding: '8px',
      background: '#f8f9fa',
      border: '1px solid #e1e5e9',
      borderRadius: '4px',
      fontSize: '13px',
      fontWeight: '600',
      color: '#2c3e50',
      textAlign: 'center'
    }}>
      {formData.selectedPlots.length}
    </div>
  </div>

  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
    <label style={{ fontSize: '12px', fontWeight: '600', color: '#555' }}>
      Layout Name *
    </label>
    <input
      type="text"
      name="layoutName"
      value={formData.layoutName}
      onChange={handleChange}
      required
      style={{
        width: '100%',
        padding: '8px',
        border: `1px solid ${errors.layoutName ? '#dc3545' : '#e1e5e9'}`,
        borderRadius: '4px',
        fontSize: '13px',
        transition: 'border-color 0.2s ease',
        height: '36px'
      }}
      placeholder="Auto-filled from plots"
    />
    {errors.layoutName && (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '4px', 
        color: '#dc3545', 
        fontSize: '11px',
        marginTop: '4px'
      }}>
        <FiAlertCircle style={{ fontSize: '11px' }} />
        {errors.layoutName}
      </div>
    )}
  </div>
</div>

{/* Quick Financial Summary - Only show when plots selected */}
{formData.selectedPlots.length > 0 && (
  <div style={{ 
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '8px',
    marginTop: '12px',
    padding: '10px',
    background: '#f8fff9',
    border: '1px solid #28a745',
    borderRadius: '6px'
  }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '11px', color: '#666', marginBottom: '2px' }}>Total Price</div>
      <div style={{ fontSize: '14px', fontWeight: '700', color: '#155724' }}>
        ₦{formData.selectedPlots
          .reduce((sum, p) => sum + parseFloat(p.price), 0)
          .toLocaleString()}
      </div>
    </div>
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '11px', color: '#666', marginBottom: '2px' }}>Plots</div>
      <div style={{ fontSize: '14px', fontWeight: '700', color: '#155724' }}>
        {formData.selectedPlots.length}
      </div>
    </div>
  </div>
)}

      <div className="form-row">
        <div className="form-group">
          <label>Proposed Use *</label>
          <select
            name="proposedUse"
            value={formData.proposedUse}
            onChange={handleChange}
            required
          >
            <option value="">Select Use</option>
            <option value="Residential">Residential</option>
            <option value="Commercial">Commercial</option>
            <option value="Industrial">Industrial</option>
            <option value="Agricultural">Agricultural</option>
          </select>
          {errors.proposedUse && <span className="error-text">{errors.proposedUse}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Plot Size *</label>
          <input
            type="text"
            name="plotSize"
            value={formData.plotSize}
            onChange={handleChange}
            required
            placeholder="Plot size will auto-fill when plots are selected"
          />
          {errors.plotSize && <span className="error-text">{errors.plotSize}</span>}
        </div>

        <div className="form-group">
          <label>Payment Terms *</label>
          <select
            name="paymentTerms"
            value={formData.paymentTerms}
            onChange={handleChange}
            required
          >
            <option value="">Select Payment Terms</option>
            <option value="3 Months">3 Months</option>
            <option value="12 Months">12 Months</option>
            <option value="18 Months">18 Months</option>
            <option value="24 Months">24 Months</option>
            <option value="30 Months">30 Months</option>
          </select>
          {errors.paymentTerms && <span className="error-text">{errors.paymentTerms}</span>}
        </div>
      </div>

      <div className="form-group">
        <label>Total Price (₦)</label>
        <input
          type="text"
          value={formData.selectedPlots
            .reduce((sum, plot) => sum + parseFloat(plot.price || 0), 0)
            .toLocaleString() || '0'}
          readOnly
          className="total-price-display"
        />
      </div>

      {/* Agreement Section */}
      <div className="agreement-section">
        <div className="terms-preview">
          <p>By submitting this form, you agree to our Terms and Conditions</p>
          <button type="button" className="view-terms-btn" onClick={() => setShowTermsModal(true)}>
            View Terms and Conditions
          </button>
        </div>
        
        <div className="form-group checkbox-label">
          <input 
            type="checkbox" 
            name="agreedToTerms" 
            checked={formData.agreedToTerms} 
            onChange={handleChange} 
            required 
          />
          <label>I agree to the terms and conditions</label>
          {errors.agreedToTerms && <span className="error-text">{errors.agreedToTerms}</span>}
        </div>
        
        <div className="form-group">
          <label>Signature *</label>
          <input 
            type="text" 
            name="signatureText" 
            value={formData.signatureText} 
            onChange={handleChange} 
            placeholder="Type your full name as signature" 
            maxLength={fieldMaxLengths.signatureText}
            required 
          />
          {errors.signatureText && <span className="error-text">{errors.signatureText}</span>}
        </div>
        
        <div className="form-group">
          <label>Upload Signature (Optional)</label>
          <input type="file" name="signatureFile" onChange={handleChange} accept="image/*" />
          <small>Upload an image of your signature if preferred</small>
        </div>
      </div>
    </div>
  );
};

export default PlotInformation;