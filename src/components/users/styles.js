// Status style functions
export const getStatusStyle = (status, source) => {
  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  };

  if (source === 'usersTable') {
    switch (status?.toLowerCase()) {
      case 'completed':
        return { 
          ...baseStyle, 
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          color: 'white',
          border: '1px solid #10b981'
        };
      case 'active':
        return { 
          ...baseStyle, 
          background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
          color: 'white',
          border: '1px solid #3b82f6'
        };
      default:
        return { 
          ...baseStyle, 
          background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
          color: 'white',
          border: '1px solid #6b7280'
        };
    }
  } else {
    switch (status?.toLowerCase()) {
      case 'approved':
        return { 
          ...baseStyle, 
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          color: 'white',
          border: '1px solid #10b981'
        };
      case 'rejected':
        return { 
          ...baseStyle, 
          background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
          color: 'white',
          border: '1px solid #ef4444'
        };
      default:
        return { 
          ...baseStyle, 
          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          color: 'white',
          border: '1px solid #f59e0b'
        };
    }
  }
};

export const getSourceBadge = (source) => {
  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '10px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginLeft: '8px'
  };

  if (source === 'usersTable') {
    return {
      ...baseStyle,
      background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
      color: 'white',
      border: '1px solid #8b5cf6'
    };
  } else {
    return {
      ...baseStyle,
      background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      color: 'white',
      border: '1px solid #f59e0b'
    };
  }
};

// Main styles object
export const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '24px',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    minHeight: '100vh'
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '60vh',
    gap: '16px'
  },
  spinner: {
    width: '48px',
    height: '48px',
    border: '4px solid #e2e8f0',
    borderTop: '4px solid #667eea',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  loadingText: {
    fontSize: '16px',
    color: '#64748b',
    fontWeight: '500'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '32px',
    gap: '24px',
    flexWrap: 'wrap'
  },
  headerContent: {
    flex: '1'
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    color: 'transparent',
    margin: '0 0 8px 0'
  },
  subtitle: {
    fontSize: '16px',
    color: '#64748b',
    margin: '0'
  },
  stats: {
    display: 'flex',
    gap: '16px'
  },
  statItem: {
    background: 'white',
    padding: '16px 20px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    textAlign: 'center',
    minWidth: '100px'
  },
  statNumber: {
    display: 'block',
    fontSize: '24px',
    fontWeight: '700',
    color: '#1e293b'
  },
  statLabel: {
    fontSize: '14px',
    color: '#64748b',
    fontWeight: '500'
  },
  errorAlert: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'linear-gradient(135deg, #fed7d7 0%, #feb2b2 100%)',
    color: '#c53030',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '24px',
    border: '1px solid #fc8181'
  },
  errorIcon: {
    flexShrink: '0'
  },
  plotsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
    gap: '24px'
  },
  plotCard: {
    background: 'white',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    border: '1px solid #f1f5f9',
    transition: 'all 0.3s ease',
    animation: 'fadeIn 0.5s ease-out',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    ':hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 8px 30px rgba(0,0,0,0.12)'
    }
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '20px'
  },
  estateInfo: {
    flex: '1'
  },
  estateName: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#1e293b',
    margin: '0 0 4px 0'
  },
  plotId: {
    fontSize: '14px',
    color: '#64748b',
    margin: '0'
  },
  plotDetails: {
    flex: '1',
    marginBottom: '20px'
  },
  detailGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
    marginBottom: '16px'
  },
  detailItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    background: '#f8fafc',
    borderRadius: '8px'
  },
  detailIcon: {
    color: '#667eea',
    flexShrink: '0'
  },
  detailLabel: {
    display: 'block',
    fontSize: '12px',
    color: '#64748b',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  detailValue: {
    display: 'block',
    fontSize: '14px',
    color: '#1e293b',
    fontWeight: '600'
  },
  paymentProgress: {
    padding: '16px',
    background: '#f8fafc',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    marginTop: '12px'
  },
  progressHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px'
  },
  progressLabel: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151'
  },
  progressPercentage: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#059669'
  },
  progressBar: {
    width: '100%',
    height: '8px',
    backgroundColor: '#e2e8f0',
    borderRadius: '10px',
    overflow: 'hidden',
    marginBottom: '8px'
  },
  progressFill: {
    height: '100%',
    borderRadius: '10px',
    transition: 'width 0.5s ease'
  },
  paymentSummary: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '12px',
    color: '#64748b',
    fontWeight: '500'
  },
  paymentStatus: {
    padding: '16px',
    background: '#f0f9ff',
    borderRadius: '8px',
    border: '1px solid #bae6fd'
  },
  paymentInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px'
  },
  paymentLabel: {
    fontSize: '14px',
    color: '#0369a1',
    fontWeight: '500'
  },
  paymentAmount: {
    fontSize: '14px',
    color: '#059669',
    fontWeight: '600'
  },
  actionButtons: {
    display: 'flex',
    gap: '12px',
    marginTop: 'auto'
  },
  primaryButton: {
    flex: '1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '12px 20px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  successButton: {
    flex: '1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '12px 20px',
    background: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'not-allowed',
    opacity: '0.8'
  },
  pendingButton: {
    flex: '1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '12px 20px',
    background: '#f59e0b',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'not-allowed',
    opacity: '0.8'
  },
  dangerButton: {
    flex: '1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '12px 20px',
    background: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'not-allowed',
    opacity: '0.8'
  },
  buttonIcon: {
    fontSize: '16px'
  },
  emptyState: {
    textAlign: 'center',
    padding: '80px 40px',
    background: 'white',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
  },
  emptyIcon: {
    color: '#cbd5e1',
    marginBottom: '16px'
  },
  emptyTitle: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#475569',
    margin: '0 0 8px 0'
  },
  emptyText: {
    fontSize: '16px',
    color: '#64748b',
    margin: '0'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px',
    backdropFilter: 'blur(4px)',
    animation: 'fadeIn 0.3s ease-out'
  },
  modalContent: {
    background: 'white',
    borderRadius: '20px',
    width: '100%',
    maxWidth: '700px',
    height: 'auto',
    maxHeight: '85vh',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
    animation: 'slideUp 0.4s ease-out'
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px',
    borderBottom: '1px solid #f1f5f9',
    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
  },
  modalTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    margin: 0
  },
  modalTitleIcon: {
    color: '#667eea',
    fontSize: '24px'
  },
  modalClose: {
    background: 'none',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
    color: '#64748b',
    padding: '8px',
    borderRadius: '8px',
    transition: 'all 0.2s ease'
  },
  modalBody: {
    padding: '20px 24px',
    flex: 1,
    overflowY: 'auto',
    minHeight: 0
  },
  paymentForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px'
  },
  paymentGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px'
  },
  infoGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  inputLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151'
  },
  disabledInput: {
    padding: '12px 16px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px',
    background: '#f8fafc',
    color: '#64748b'
  },
  input: {
    padding: '12px 16px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px',
    transition: 'all 0.2s ease'
  },
  selectInput: {
    padding: '12px 16px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px',
    background: 'white',
    transition: 'all 0.2s ease'
  },
  fileUploadArea: {
    position: 'relative',
    border: '2px dashed #cbd5e1',
    borderRadius: '8px',
    padding: '32px 16px',
    textAlign: 'center',
    transition: 'all 0.2s ease',
    cursor: 'pointer'
  },
  fileInput: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    opacity: 0,
    cursor: 'pointer'
  },
  uploadPlaceholder: {
    color: '#64748b',
    pointerEvents: 'none'
  },
  filePreview: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 16px',
    background: '#f0f9ff',
    border: '1px solid #bae6fd',
    borderRadius: '8px',
    marginTop: '8px',
    fontSize: '14px',
    color: '#0369a1'
  },
  textarea: {
    padding: '12px 16px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px',
    resize: 'vertical',
    minHeight: '80px',
    transition: 'all 0.2s ease'
  },
  confirmationBox: {
    padding: '16px',
    background: '#f0f9ff',
    borderRadius: '8px',
    border: '1px solid #bae6fd'
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '14px',
    color: '#0369a1',
    fontWeight: '500',
    cursor: 'pointer'
  },
  checkbox: {
    width: '18px',
    height: '18px',
    cursor: 'pointer'
  },
  modalActions: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
    padding: '16px 24px',
    borderTop: '1px solid #f1f5f9',
    background: '#fff',
    position: 'sticky',
    bottom: 0
  },
  cancelButton: {
    padding: '12px 24px',
    background: 'transparent',
    color: '#64748b',
    border: '1px solid #cbd5e1',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  submitButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  submitButtonDisabled: {
    background: '#cbd5e1',
    cursor: 'not-allowed',
    transform: 'none',
    boxShadow: 'none'
  }
};