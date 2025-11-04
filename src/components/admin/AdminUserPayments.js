import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { TrendingUp, Users, Clock } from "lucide-react";
import { FiCheck, FiEye, FiX } from "react-icons/fi";
import { TbCurrencyNaira } from "react-icons/tb";

const AdminUserPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalDeposited: 0,
    pendingPayments: 0,
    approvedPayments: 0,
    totalUsers: 0,
  });

  // Container styles
  const containerStyles = {
    padding: "0px",
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
    border: "4px solid #f3f3f3",
    borderTop: "4px solid #3498db",
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    animation: "spin 1s linear infinite"
  };

  // Header styles
  const headerStyles = {
    marginBottom: "24px"
  };

  const titleStyles = {
    color: "#2c3e50",
    fontSize: "28px",
    fontWeight: "600",
    margin: "0 0 20px 0",
    borderBottom: "2px solid #3498db",
    paddingBottom: "8px"
  };

  // Stats grid styles
  const statsGridStyles = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "15px",
    marginBottom: "30px"
  };

  const statCardStyles = {
    display: "flex",
    alignItems: "center",
    background: "#fff",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.3s ease, box-shadow 0.3s ease"
  };

  const statIconBase = {
    background: "#eef2ff",
    padding: "12px",
    borderRadius: "50%",
    marginRight: "15px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "50px",
    height: "50px"
  };

  const statIconVariants = {
    totalDeposits: {
      ...statIconBase,
      backgroundColor: "#10b981",
      color: "white"
    },
    pendingPayments: {
      ...statIconBase,
      backgroundColor: "#f59e0b",
      color: "white"
    },
    approvedPayments: {
      ...statIconBase,
      backgroundColor: "#3b82f6",
      color: "white"
    },
    totalUsers: {
      ...statIconBase,
      backgroundColor: "#8b5cf6",
      color: "white"
    }
  };

  const statContentStyles = {
    flex: "1"
  };

  const statValueStyles = {
    margin: "0",
    fontSize: "24px",
    fontWeight: "bold",
    color: "#1f2937"
  };

  const statLabelStyles = {
    margin: "5px 0 0",
    color: "#6b7280",
    fontSize: "14px"
  };

  // Table styles
  const contentTableStyles = {
    overflowX: "auto",
    background: "white",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
  };

  const tableStyles = {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "1200px"
  };

  // COLORED TABLE HEADER STYLES
  const thStyles = {
    padding: "16px 12px",
    textAlign: "left",
    background: "linear-gradient(135deg, #2c3e50, #34495e)",
    color: "white",
    fontWeight: "600",
    fontSize: "14px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    border: "none"
  };

  const tdStyles = {
    padding: "14px 12px",
    textAlign: "left",
    borderBottom: "1px solid #e5e7eb",
    color: "#4b5563",
    fontSize: "14px"
  };

  const trStyles = {
    transition: "background-color 0.2s ease"
  };

  // Status badge styles
  const statusBadgeBase = {
    padding: "6px 12px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "500",
    display: "inline-block",
    textAlign: "center",
    minWidth: "80px",
    textTransform: "capitalize"
  };

  const statusBadgeStyles = {
    approved: {
      ...statusBadgeBase,
      backgroundColor: "#dcfce7",
      color: "#166534"
    },
    pending: {
      ...statusBadgeBase,
      backgroundColor: "#fef9c3",
      color: "#92400e"
    },
    rejected: {
      ...statusBadgeBase,
      backgroundColor: "#fee2e2",
      color: "#991b1b"
    }
  };

  // Action buttons styles
  const tableActionsStyles = {
    display: "flex",
    gap: "8px",
    alignItems: "center"
  };

  const actionButtonBase = {
    padding: "8px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "16px",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "36px",
    height: "36px"
  };

  const approveButtonStyles = {
    ...actionButtonBase,
    color: "#16a34a",
    backgroundColor: "rgba(22, 163, 74, 0.1)",
    border: "1px solid rgba(22, 163, 74, 0.2)"
  };

  const rejectButtonStyles = {
    ...actionButtonBase,
    color: "#dc2626",
    backgroundColor: "rgba(220, 38, 38, 0.1)",
    border: "1px solid rgba(220, 38, 38, 0.2)"
  };

  const processedTextStyles = {
    color: "#6b7280",
    fontSize: "0.9rem",
    fontStyle: "italic"
  };

  // Receipt link styles
  const receiptLinkStyles = {
    color: "#007bff",
    textDecoration: "none",
    fontSize: "18px",
    padding: "8px",
    borderRadius: "6px",
    transition: "all 0.3s ease",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 123, 255, 0.1)",
    border: "1px solid rgba(0, 123, 255, 0.2)",
    width: "36px",
    height: "36px"
  };

  // Alert styles
  const alertErrorStyles = {
    background: "#fee2e2",
    border: "1px solid #fecaca",
    color: "#991b1b",
    padding: "16px",
    borderRadius: "8px",
    textAlign: "center",
    margin: "20px 0"
  };

  useEffect(() => {
    fetchPayments();
    setupWebSocket();
  }, []);

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

  const fetchPayments = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/user-payments");
      const result = await response.json();

      if (result.success && Array.isArray(result.payments)) {
        setPayments(result.payments);
        calculateStats(result.payments);
      } else {
        setPayments([]);
      }
    } catch (err) {
      console.error("Error fetching payments:", err);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  const setupWebSocket = () => {
    console.log("Setting up WebSocket simulation...");
    setTimeout(() => simulateNewPaymentNotification(), 5000);
  };

  const simulateNewPaymentNotification = () => {
    const hasPending = payments.some(
      (payment) => payment.status && payment.status.toLowerCase() === "pending"
    );

    if (hasPending) {
      Swal.fire({
        title: "New Payment Received!",
        text: "A user has made a new payment. Check the payments list for details.",
        icon: "info",
        confirmButtonText: "View Payments",
        toast: true,
        position: "top-end",
        timer: 5000,
        showConfirmButton: true,
      });

      fetchPayments();
    }
  };

  const calculateStats = (paymentsData) => {
    let totalDeposited = 0;
    let pendingPayments = 0;
    let approvedPayments = 0;
    const uniqueUsers = new Set();

    paymentsData.forEach((payment) => {
      if (payment.status === "approved") {
        totalDeposited += Number(payment.amount) || 0;
        approvedPayments++;
      } else if (payment.status === "pending") {
        pendingPayments++;
      }

      if (payment.user_id) uniqueUsers.add(payment.user_id);
      else if (payment.contact) uniqueUsers.add(payment.contact);
    });

    setStats({
      totalDeposited,
      pendingPayments,
      approvedPayments,
      totalUsers: uniqueUsers.size,
    });
  };

  const formatCurrency = (value) => {
    if (!value || isNaN(value)) return "₦0";
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
    }).format(Number(value));
  };

  const handlePaymentAction = async (paymentId, action) => {
    try {
      const statusMap = {
        approve: "approved",
        reject: "rejected",
        pending: "pending",
      };
      const backendStatus = statusMap[action] || action;

      const response = await fetch(
        `http://localhost:5000/api/user-payments/${paymentId}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: backendStatus }),
        }
      );

      const result = await response.json();

      if (result.success) {
        Swal.fire("Success!", `Payment ${action}d successfully!`, "success");
        fetchPayments();
      } else {
        Swal.fire("Error!", result.error || `Failed to ${action} payment`, "error");
      }
    } catch (err) {
      console.error(`Error updating payment (${action}):`, err);
      Swal.fire("Error!", `Error trying to ${action} payment.`, "error");
    }
  };

  if (loading) {
    return (
      <div style={containerStyles}>
        <div style={loadingStyles}>
          <div style={spinnerStyles}></div>
          <p>Loading payments...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyles}>
      <div style={headerStyles}>
        <h2 style={titleStyles}>Client Payments</h2>
      </div>

      {/* Statistics Cards */}
      <div style={statsGridStyles}>
        <div style={statCardStyles}>
          <div style={statIconVariants.totalDeposits}>
            <TbCurrencyNaira size={24} />
          </div>
          <div style={statContentStyles}>
            <h3 style={statValueStyles}>{formatCurrency(stats.totalDeposited)}</h3>
            <p style={statLabelStyles}>Total Deposited</p>
          </div>
        </div>

        <div style={statCardStyles}>
          <div style={statIconVariants.pendingPayments}>
            <Clock size={24} />
          </div>
          <div style={statContentStyles}>
            <h3 style={statValueStyles}>{stats.pendingPayments}</h3>
            <p style={statLabelStyles}>Pending Payments</p>
          </div>
        </div>

        <div style={statCardStyles}>
          <div style={statIconVariants.approvedPayments}>
            <TrendingUp size={24} />
          </div>
          <div style={statContentStyles}>
            <h3 style={statValueStyles}>{stats.approvedPayments}</h3>
            <p style={statLabelStyles}>Approved Payments</p>
          </div>
        </div>

        <div style={statCardStyles}>
          <div style={statIconVariants.totalUsers}>
            <Users size={24} />
          </div>
          <div style={statContentStyles}>
            <h3 style={statValueStyles}>{stats.totalUsers}</h3>
            <p style={statLabelStyles}>Total Clients</p>
          </div>
        </div>
      </div>

      {payments.length === 0 ? (
        <div style={alertErrorStyles}>No payments found.</div>
      ) : (
        <div style={contentTableStyles}>
          <table style={tableStyles}>
            <thead>
              <tr>
                <th style={thStyles}>Name</th>
                <th style={thStyles}>Contact</th>
                <th style={thStyles}>Plots</th>
                <th style={thStyles}>Plot Size</th>
                <th style={thStyles}>Amount Paid</th>
                <th style={thStyles}>Total Price</th>
                <th style={thStyles}>Outstanding</th>
                <th style={thStyles}>Method</th>
                <th style={thStyles}>Date</th>
                <th style={thStyles}>Status</th>
                <th style={thStyles}>Receipt</th>
                <th style={thStyles}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id} style={trStyles}>
                  <td style={tdStyles}>{p.name}</td>
                  <td style={tdStyles}>{p.contact}</td>
                  <td style={tdStyles}>{p.number_of_plots}</td>
                  <td style={tdStyles}>{p.plot_size}</td>
                  <td style={tdStyles}>{formatCurrency(p.amount)}</td>
                  <td style={tdStyles}>{formatCurrency(p.total_price)}</td>
                  <td style={tdStyles}>{formatCurrency(p.outstanding_balance)}</td>
                  <td style={tdStyles}>{p.payment_method}</td>
                  <td style={tdStyles}>{new Date(p.transaction_date).toLocaleDateString()}</td>
                  <td style={tdStyles}>
                    <span style={statusBadgeStyles[p.status.toLowerCase()] || statusBadgeStyles.pending}>
                      {p.status.charAt(0).toUpperCase() + p.status.slice(1).toLowerCase()}
                    </span>
                  </td>
                  <td style={tdStyles}>
                    {p.receipt_file ? (
                      <a
                        href={`http://localhost:5000/uploads/receipts/${p.receipt_file}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="View Receipt"
                        style={receiptLinkStyles}
                      >
                        <FiEye size={18} />
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td style={tdStyles}>
                    <div style={tableActionsStyles}>
                      {p.status.toLowerCase() === "pending" ? (
                        <>
                          <button
                            style={approveButtonStyles}
                            onClick={() => handlePaymentAction(p.id, "approve")}
                            title="Approve"
                          >
                            <FiCheck size={16} />
                          </button>
                          <button
                            style={rejectButtonStyles}
                            onClick={() => handlePaymentAction(p.id, "reject")}
                            title="Reject"
                          >
                            <FiX size={16} />
                          </button>
                        </>
                      ) : (
                        <span style={processedTextStyles}>Processed.</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminUserPayments;