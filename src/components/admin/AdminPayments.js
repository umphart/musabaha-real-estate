import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FiUser, FiPrinter, FiDownload, FiX, FiCheck, FiInfo, FiSearch, FiRefreshCw } from "react-icons/fi";
import { getAuthToken } from "../../utils/auth";
import { API_BASE_URL } from "../../config";

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Container styles
  const containerStyles = {
    padding: "20px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    maxWidth: "1200px",
    margin: "0 auto",
    backgroundColor: "#f5f6fa"
  };

  // Loading styles
  const loadingStyles = {
    textAlign: "center",
    padding: "40px",
    fontSize: "18px",
    color: "#555",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "16px"
  };

  const spinnerStyles = {
    border: "3px solid #f3f3f3",
    borderTop: "3px solid #3498db",
    borderRadius: "50%",
    width: "30px",
    height: "30px",
    animation: "spin 1s linear infinite"
  };

  // Header styles
  const headerStyles = {
    marginBottom: "24px"
  };

  const headerTitleSectionStyles = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px"
  };

  const titleStyles = {
    margin: "0 0 20px 0",
    color: "#2c3e50",
    fontSize: "28px",
    fontWeight: "600"
  };

  // Stats cards styles
  const statsContainerStyles = {
    display: "flex",
    gap: "16px",
    marginBottom: "20px",
    flexWrap: "wrap"
  };

  const statCardStyles = {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    minWidth: "180px",
    flex: "1",
    color: "white",
    transition: "transform 0.3s ease"
  };

  const statTitleStyles = {
    margin: "0 0 8px 0",
    fontSize: "14px",
    color: "rgba(255,255,255,0.9)",
    fontWeight: "500"
  };

  const statAmountStyles = {
    margin: "0",
    fontSize: "24px",
    fontWeight: "700",
    color: "white"
  };

  const statSubtitleStyles = {
    fontSize: "12px",
    opacity: "0.8",
    marginTop: "4px",
    display: "block"
  };

  // Actions section styles
  const headerActionsStyles = {
    display: "flex",
    gap: "12px",
    alignItems: "center",
    marginTop: "10px"
  };

  const searchBoxStyles = {
    position: "relative",
    flex: "1"
  };

  const searchIconStyles = {
    position: "absolute",
    left: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#666"
  };

  const searchInputStyles = {
    padding: "10px 16px 10px 40px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    fontSize: "14px",
    width: "100%",
    backgroundColor: "white",
    transition: "border-color 0.3s ease"
  };

  const filterSelectStyles = {
    padding: "10px 12px",
    fontSize: "14px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    minWidth: "180px",
    backgroundColor: "white",
    transition: "border-color 0.3s ease"
  };

  // Button styles
  const buttonStyles = {
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

  const primaryButtonStyles = {
    ...buttonStyles,
    background: "linear-gradient(135deg, #3498db, #2980b9)",
    color: "white"
  };

  const secondaryButtonStyles = {
    ...buttonStyles,
    background: "#6c757d",
    color: "white"
  };

  // Table styles
  const contentTableStyles = {
    background: "white",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    border: "1px solid #eaeaea"
  };

  const tableHeaderStyles = {
    padding: "16px 20px",
    background: "#f8f9fa",
    borderBottom: "1px solid #dee2e6"
  };

  const tableTitleStyles = {
    fontWeight: "600",
    color: "#2c3e50"
  };

  const tableStyles = {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "700px"
  };

  const thStyles = {
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

  const tdStyles = {
    padding: "14px 20px",
    textAlign: "left",
    borderBottom: "1px solid #f0f0f0",
    color: "#555",
    fontSize: "14px"
  };

  const trStyles = {
    transition: "background-color 0.2s ease"
  };

  // Specific cell styles
  const serialNumberStyles = {
    fontWeight: "600",
    color: "#6c757d"
  };

  const userNameStyles = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontWeight: "500"
  };

  const userIconStyles = {
    color: "#3498db"
  };

  const plotNumberStyles = {
    fontFamily: "'Courier New', monospace",
    background: "#f8f9fa",
    padding: "4px 8px",
    borderRadius: "4px",
    fontWeight: "600"
  };

  const paymentCountStyles = {
    fontWeight: "600",
    textAlign: "center"
  };

  const amountStyles = {
    fontWeight: "600",
    textAlign: "center",
    color: "#27ae60"
  };

  const lastPaymentStyles = {
    fontSize: "12px",
    color: "#666"
  };

  // Action buttons styles
  const actionButtonsStyles = {
    display: "flex",
    gap: "8px"
  };

  const actionButtonStyles = {
    padding: "6px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s ease"
  };

  const downloadButtonStyles = {
    ...actionButtonStyles,
    background: "rgba(40, 167, 69, 0.1)",
    color: "#28a745"
  };

  const printButtonStyles = {
    ...actionButtonStyles,
    background: "rgba(0, 123, 255, 0.1)",
    color: "#007bff"
  };

  const viewButtonStyles = {
    ...actionButtonStyles,
    background: "rgba(108, 117, 125, 0.1)",
    color: "#6c757d"
  };

  // Empty state styles
  const emptyStateStyles = {
    textAlign: "center",
    padding: "40px",
    color: "#6c757d"
  };

  const emptyIconStyles = {
    fontSize: "48px",
    marginBottom: "16px",
    opacity: "0.5"
  };

  // Helper to parse amount safely
  const parseAmount = (amount) => {
    const parsed = parseFloat(amount);
    return isNaN(parsed) ? 0 : parsed;
  };

  const formatCurrency = (amount) => {
    const safe = parseAmount(amount);
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(safe);
  };

  const fetchUsersWithPayments = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/admin/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      if (data.success) {
        const usersData = data.data || data;
        setUsers(usersData);
        // Extract all payments
        const allPayments = [];
        usersData.forEach(user => {
          if (user.payments && user.payments.length > 0) {
            user.payments.forEach(payment => {
              allPayments.push({
                ...payment,
                amount: parseAmount(payment.amount),
                userId: user.id,
                userName: user.name || `${user.first_name} ${user.last_name}` || `User ${user.id}`,
                userPlot: user.plot_taken || "12345679",
              });
            });
          }
        });
        setPayments(allPayments);
      } else {
        console.error("Error:", data.message || "Fetch error");
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersWithPayments();
  }, []);

  // Build summary of payments per user
  const getUserPaymentSummary = () => {
    const userMap = {};
    payments.forEach(payment => {
      if (!userMap[payment.userId]) {
        userMap[payment.userId] = {
          id: payment.userId,
          userName: payment.userName,
          userPlot: payment.userPlot,
          totalPayments: 0,
          totalAmount: 0,
          payments: [],
          lastPaymentDate: null,
        };
      }
      userMap[payment.userId].totalPayments += 1;
      userMap[payment.userId].totalAmount += payment.amount;
      userMap[payment.userId].payments.push(payment);
      
      // Track latest payment date
      const paymentDate = new Date(payment.date);
      if (!userMap[payment.userId].lastPaymentDate || paymentDate > userMap[payment.userId].lastPaymentDate) {
        userMap[payment.userId].lastPaymentDate = paymentDate;
      }
    });

    let userList = Object.values(userMap);
    
    // Apply status filter
    if (filter !== "all") {
      userList = userList.filter(user =>
        user.payments.some(p => p.status && p.status.toLowerCase() === filter.toLowerCase())
      );
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      userList = userList.filter(user =>
        user.userName.toLowerCase().includes(query) ||
        user.userPlot.toLowerCase().includes(query)
      );
    }

    // Sort by latest payment date
    return userList.sort((a, b) => new Date(b.lastPaymentDate) - new Date(a.lastPaymentDate));
  };

  const userPaymentSummary = getUserPaymentSummary();
  const totalRevenue = payments
    .filter(p => p.status && p.status.toLowerCase() === "completed")
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingPaymentsCount = payments.filter(
    p => p.status && p.status.toLowerCase() === "pending"
  ).length;

  const completedPaymentsCount = payments.filter(
    p => p.status && p.status.toLowerCase() === "completed"
  ).length;

  const downloadAllUserPayments = (user) => {
    const userPayments = payments.filter(p => p.userId === user.id);
    if (userPayments.length === 0) {
      alert("No payments found for this user");
      return;
    }
    
    const wb = XLSX.utils.book_new();
    const excelData = userPayments.map((payment, idx) => {
      const date = new Date(payment.date);
      return {
        "#": idx + 1,
        "Payment ID": payment.id,
        Date: date.toLocaleDateString("en-NG"),
        Amount: payment.amount,
        Status: payment.status || "",
        "Recorded By": payment.admin || "",
      };
    });
    
    const ws = XLSX.utils.json_to_sheet(excelData);
    XLSX.utils.book_append_sheet(wb, ws, "Payments");
    XLSX.writeFile(wb, `${user.userName.replace(/\s+/g, "_")}_payments.xlsx`);
  };

  const generateReceipt = async (user, paymentsForUser) => {
    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    
    // Header
    doc.setFontSize(20);
    doc.setTextColor(44, 62, 80);
    doc.text("PAYMENT STATEMENT", 105, 20, { align: "center" });
    
    // Company Info
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("Estate Management System", 105, 30, { align: "center" });
    
    // User Info
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`User: ${user.userName}`, 20, 45);
    doc.text(`Plot: ${user.userPlot}`, 20, 52);
    doc.text(`Statement Date: ${new Date().toLocaleDateString('en-NG')}`, 20, 59);
    
    // Summary
    const totalAmount = paymentsForUser.reduce((sum, p) => sum + p.amount, 0);
    doc.text(`Total Amount: ${formatCurrency(totalAmount)}`, 150, 45);
    doc.text(`Total Payments: ${paymentsForUser.length}`, 150, 52);

    autoTable(doc, {
      head: [["#", "Payment ID", "Date", "Amount", "Status", "Recorded By"]],
      body: paymentsForUser.map((p, idx) => [
        idx + 1,
        p.id,
        new Date(p.date).toLocaleDateString("en-NG"),
        formatCurrency(p.amount),
        p.status || "",
        p.admin || "12345679",
      ]),
      startY: 65,
      theme: "grid",
      headStyles: {
        fillColor: [44, 62, 80],
        textColor: 255,
        fontStyle: 'bold'
      },
      styles: {
        fontSize: 9,
        cellPadding: 3,
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      }
    });

    doc.save(`receipt_${user.userName.replace(/\s+/g, "_")}.pdf`);
  };

  const handleRefresh = () => {
    fetchUsersWithPayments();
  };

  // Add CSS animation for spinner
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  if (loading) {
    return (
      <div style={containerStyles}>
        <div style={loadingStyles}>
          <div style={spinnerStyles}></div>
          Loading payments...
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyles}>
      <div style={headerStyles}>
        <div style={headerTitleSectionStyles}>
          <h2 style={titleStyles}>Payment Management</h2>
          <button 
            style={secondaryButtonStyles}
            onClick={handleRefresh}
          >
            <FiRefreshCw /> Refresh
          </button>
        </div>
        
        <div style={statsContainerStyles}>
          <div style={statCardStyles}>
            <h3 style={statTitleStyles}>Total Revenue</h3>
            <p style={statAmountStyles}>{formatCurrency(totalRevenue)}</p>
            <span style={statSubtitleStyles}>{completedPaymentsCount} completed payments</span>
          </div>
          <div style={statCardStyles}>
            <h3 style={statTitleStyles}>Total Payments</h3>
            <p style={statAmountStyles}>{payments.length}</p>
            <span style={statSubtitleStyles}>Across all users</span>
          </div>
          <div style={statCardStyles}>
            <h3 style={statTitleStyles}>Pending Payments</h3>
            <p style={statAmountStyles}>{pendingPaymentsCount}</p>
            <span style={statSubtitleStyles}>Awaiting confirmation</span>
          </div>
        </div>

        <div style={headerActionsStyles}>
          <div style={searchBoxStyles}>
            <FiSearch style={searchIconStyles} />
            <input
              type="text"
              placeholder="Search by name or plot..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={searchInputStyles}
            />
          </div>
          
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

          <button style={primaryButtonStyles}>
            <FiDownload /> Export All
          </button>
        </div>
      </div>

      <div style={contentTableStyles}>
        <div style={tableHeaderStyles}>
          <span style={tableTitleStyles}>
            User Payment Summary ({userPaymentSummary.length} users)
          </span>
        </div>
        
        <table style={tableStyles}>
          <thead>
            <tr>
              <th style={thStyles}>S.No</th>
              <th style={thStyles}>User Name</th>
              <th style={thStyles}>Plot</th>
              <th style={thStyles}>Total Payments</th>
              <th style={thStyles}>Total Amount</th>
              <th style={thStyles}>Last Payment</th>
              <th style={thStyles}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {userPaymentSummary.length > 0 ? (
              userPaymentSummary.map((user, index) => (
                <tr key={user.id} style={trStyles}>
                  <td style={{...tdStyles, ...serialNumberStyles}}>{index + 1}</td>
                  <td style={{...tdStyles, ...userNameStyles}}>
                    <FiUser style={userIconStyles} />
                    {user.userName}
                  </td>
                  <td style={{...tdStyles, ...plotNumberStyles}}>{user.userPlot}</td>
                  <td style={{...tdStyles, ...paymentCountStyles}}>{user.totalPayments}</td>
                  <td style={{...tdStyles, ...amountStyles}}>{formatCurrency(user.totalAmount)}</td>
                  <td style={{...tdStyles, ...lastPaymentStyles}}>
                    {user.lastPaymentDate ? 
                      new Date(user.lastPaymentDate).toLocaleDateString('en-NG') : 
                      '12345679'
                    }
                  </td>
                  <td style={tdStyles}>
                    <div style={actionButtonsStyles}>
                      <button 
                        style={downloadButtonStyles}
                        onClick={() => downloadAllUserPayments(user)}
                        title="Download Excel"
                      >
                        <FiDownload />
                      </button>
                      <button 
                        style={printButtonStyles}
                        onClick={() => generateReceipt(user, user.payments)}
                        title="Generate PDF"
                      >
                        <FiPrinter />
                      </button>
                      <button 
                        style={viewButtonStyles}
                        onClick={() => {/* Add view details function */}}
                        title="View Details"
                      >
                        <FiInfo />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{...tdStyles, ...emptyStateStyles}}>
                  <FiInfo style={emptyIconStyles} />
                  <p>No users with payments found.</p>
                  {(searchQuery || filter !== "all") && (
                    <button 
                      style={secondaryButtonStyles}
                      onClick={() => {
                        setSearchQuery("");
                        setFilter("all");
                      }}
                    >
                      Clear filters
                    </button>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPayments;