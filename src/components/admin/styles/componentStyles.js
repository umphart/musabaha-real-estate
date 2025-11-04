// Tabs styles
export const tabsContainerStyles = {
  display: "flex",
  background: "white",
  borderRadius: "8px",
  padding: "4px",
  marginBottom: "20px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
};

export const tabStyles = {
  flex: 1,
  padding: "12px 16px",
  textAlign: "center",
  cursor: "pointer",
  borderRadius: "6px",
  fontWeight: "500",
  transition: "all 0.3s ease",
  border: "none",
  background: "transparent",
  color: "#666"
};

export const activeTabStyles = {
  background: "linear-gradient(135deg, #3498db, #2980b9)",
  color: "white",
  boxShadow: "0 2px 6px rgba(52, 152, 219, 0.3)"
};

// Stats cards styles
export const statsContainerStyles = {
  display: "flex",
  gap: "16px",
  marginBottom: "20px",
  flexWrap: "wrap"
};

export const statCardStyles = {
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  minWidth: "180px",
  flex: "1",
  color: "white",
  transition: "transform 0.3s ease"
};

export const pendingStatCardStyles = {
  ...statCardStyles,
  background: "linear-gradient(135deg, #f39c12, #e67e22)"
};

export const statTitleStyles = {
  margin: "0 0 8px 0",
  fontSize: "14px",
  color: "rgba(255,255,255,0.9)",
  fontWeight: "500"
};

export const statAmountStyles = {
  margin: "0",
  fontSize: "24px",
  fontWeight: "700",
  color: "white"
};

export const statSubtitleStyles = {
  fontSize: "12px",
  opacity: "0.8",
  marginTop: "4px",
  display: "block"
};

// Header actions styles
export const headerActionsStyles = {
  display: "flex",
  gap: "12px",
  alignItems: "center",
  marginTop: "10px"
};

export const searchBoxStyles = {
  position: "relative",
  flex: "1"
};

export const searchIconStyles = {
  position: "absolute",
  left: "12px",
  top: "50%",
  transform: "translateY(-50%)",
  color: "#666"
};

export const searchInputStyles = {
  padding: "10px 16px 10px 40px",
  border: "1px solid #ddd",
  borderRadius: "6px",
  fontSize: "14px",
  width: "100%",
  backgroundColor: "white",
  transition: "border-color 0.3s ease"
};

export const filterSelectStyles = {
  padding: "10px 12px",
  fontSize: "14px",
  borderRadius: "6px",
  border: "1px solid #ddd",
  minWidth: "180px",
  backgroundColor: "white",
  transition: "border-color 0.3s ease"
};

// Button styles
export const buttonStyles = {
  padding: "10px 20px",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "500",
  transition: "all 0.3s ease",
  fontSize: "14px",
  display: "flex",
  alignItems: "center",
  gap: "6px"
};

export const primaryButtonStyles = {
  ...buttonStyles,
  background: "linear-gradient(135deg, #3498db, #2980b9)",
  color: "white"
};

export const secondaryButtonStyles = {
  ...buttonStyles,
  background: "#6c757d",
  color: "white"
};

export const successButtonStyles = {
  ...buttonStyles,
  background: "linear-gradient(135deg, #27ae60, #219a52)",
  color: "white"
};

export const dangerButtonStyles = {
  ...buttonStyles,
  background: "linear-gradient(135deg, #e74c3c, #c0392b)",
  color: "white"
};

// Table styles
export const contentTableStyles = {
  background: "white",
  borderRadius: "12px",
  overflow: "hidden",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  border: "1px solid #eaeaea"
};

export const tableHeaderStyles = {
  padding: "16px 20px",
  background: "#f8f9fa",
  borderBottom: "1px solid #dee2e6"
};

export const tableTitleStyles = {
  fontWeight: "600",
  color: "#2c3e50"
};

export const tableStyles = {
  width: "100%",
  borderCollapse: "collapse",
  minWidth: "700px"
};

export const thStyles = {
  padding: "16px 20px",
  textAlign: "left",
  background: "linear-gradient(135deg, #2c3e50, #34495e)",
  color: "white",
  fontWeight: "600",
  fontSize: "14px",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  border: "none",
  position: "relative"
};

export const tdStyles = {
  padding: "14px 20px",
  textAlign: "left",
  borderBottom: "1px solid #f0f0f0",
  color: "#555",
  fontSize: "14px"
};

export const trStyles = {
  transition: "background-color 0.2s ease"
};

// Modal styles
export const modalOverlayStyles = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
  padding: "20px"
};

export const modalContentStyles = {
  background: "white",
  borderRadius: "12px",
  padding: "24px",
  maxWidth: "500px",
  width: "100%",
  maxHeight: "90vh",
  overflow: "auto",
  boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
};

export const modalHeaderStyles = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "20px",
  paddingBottom: "16px",
  borderBottom: "1px solid #eee"
};

export const modalTitleStyles = {
  fontSize: "20px",
  fontWeight: "600",
  color: "#2c3e50",
  margin: 0
};

export const closeButtonStyles = {
  background: "none",
  border: "none",
  fontSize: "20px",
  cursor: "pointer",
  color: "#666",
  padding: "4px"
};

export const modalSectionStyles = {
  marginBottom: "20px"
};

export const modalLabelStyles = {
  display: "block",
  marginBottom: "6px",
  fontWeight: "500",
  color: "#333"
};

export const modalValueStyles = {
  padding: "10px",
  background: "#f8f9fa",
  borderRadius: "6px",
  border: "1px solid #e9ecef",
  marginBottom: "12px"
};

export const modalActionsStyles = {
  display: "flex",
  gap: "12px",
  justifyContent: "flex-end",
  marginTop: "24px"
};