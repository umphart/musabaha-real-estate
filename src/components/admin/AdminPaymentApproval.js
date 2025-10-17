import React, { useEffect, useState } from "react";
import { FiEye, FiCheck, FiX } from "react-icons/fi";
import { BadgeNaira, TrendingUp, Users, Clock } from "lucide-react";
import Swal from "sweetalert2";

const AdminPaymentApproval = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [stats, setStats] = useState({
    totalDeposited: 0,
    pendingPayments: 0,
    approvedPayments: 0,
    totalUsers: 0,
  });

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
    color: "#555"
  };

  // Stats grid styles
  const statsGridStyles = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "20px",
    marginBottom: "30px"
  };

  const statCardStyles = {
    background: "white",
    borderRadius: "10px",
    padding: "20px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    display: "flex",
    alignItems: "center",
    transition: "transform 0.3s ease, box-shadow 0.3s ease"
  };

  const statIconStyles = {
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginRight: "15px",
    color: "white"
  };

  const statIconVariants = {
    totalDeposits: {
      ...statIconStyles,
      backgroundColor: "#10b981"
    },
    pendingPayments: {
      ...statIconStyles,
      backgroundColor: "#f59e0b"
    },
    approvedPayments: {
      ...statIconStyles,
      backgroundColor: "#3b82f6"
    },
    totalUsers: {
      ...statIconStyles,
      backgroundColor: "#8b5cf6"
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

  // Filter controls styles
  const filterControlsStyles = {
    marginBottom: "20px",
    display: "flex",
    alignItems: "center",
    gap: "10px"
  };

  const filterLabelStyles = {
    fontWeight: "500",
    color: "#374151"
  };

  const filterSelectStyles = {
    padding: "8px 12px",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    backgroundColor: "white",
    fontSize: "14px",
    transition: "border-color 0.3s ease"
  };

  // Table styles
  const tableResponsiveStyles = {
    overflowX: "auto",
    background: "white",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
  };

  const tableStyles = {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "1000px"
  };

  // COLORED TABLE HEADER STYLES
  const thStyles = {
    padding: "16px 15px",
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
    padding: "14px 15px",
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
    minWidth: "80px"
  };

  const statusBadgeStyles = {
    pending: {
      ...statusBadgeBase,
      backgroundColor: "#fffbeb",
      color: "#f59e0b"
    },
    approved: {
      ...statusBadgeBase,
      backgroundColor: "#ecfdf5",
      color: "#10b981"
    },
    rejected: {
      ...statusBadgeBase,
      backgroundColor: "#fef2f2",
      color: "#ef4444"
    }
  };

  // Action buttons styles
  const actionButtonsStyles = {
    display: "flex",
    gap: "8px",
    justifyContent: "center",
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
    color: "#28a745",
    backgroundColor: "rgba(40, 167, 69, 0.1)",
    border: "1px solid rgba(40, 167, 69, 0.2)"
  };

  const rejectButtonStyles = {
    ...actionButtonBase,
    color: "#dc3545",
    backgroundColor: "rgba(220, 53, 69, 0.1)",
    border: "1px solid rgba(220, 53, 69, 0.2)"
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

  const noReceiptStyles = {
    fontSize: "0.9em",
    color: "#9ca3af",
    fontStyle: "italic"
  };

  const actionCompleteStyles = {
    fontSize: "0.9em",
    color: "#6c757d",
    fontStyle: "italic"
  };

  // Title styles
  const titleStyles = {
    color: "#2c3e50",
    fontSize: "28px",
    fontWeight: "600",
    marginBottom: "24px",
    borderBottom: "2px solid #3498db",
    paddingBottom: "8px"
  };

  useEffect(() => {
    fetchAllPayments();
  }, []);

  // Fetch all payments
  const fetchAllPayments = async () => {
    try {
      const res = await fetch(
        "https://musabaha-homes.onrender.com/api/user-subsequent-payments"
      );
      const data = await res.json();

      if (data.success && Array.isArray(data.payments)) {
        setPayments(data.payments);
        calculateStats(data.payments);
        checkForNewPendingPayments(data.payments);
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

  // Only show notification if there are new pending payments
  const checkForNewPendingPayments = (paymentsList) => {
    const pendingCount = paymentsList.filter(
      (p) => p.status && p.status.toLowerCase() === "pending"
    ).length;

    if (pendingCount > 0) {
      Swal.fire({
        title: "New Subsequent Payment Received!",
        text: "A user has made a new subsequent payment. Check the payments list for details.",
        icon: "info",
        toast: true,
        position: "top-end",
        timer: 5000,
        showConfirmButton: false,
      });
    }
  };

  // Calculate statistics
  const calculateStats = (paymentsData) => {
    let totalDeposited = 0;
    let pendingPayments = 0;
    let approvedPayments = 0;
    const uniqueUsers = new Set();

    paymentsData.forEach((payment) => {
      const status = payment.status ? payment.status.toLowerCase() : "";

      if (status === "approved") {
        totalDeposited += Number(payment.amount) || 0;
        approvedPayments++;
      } else if (status === "pending") {
        pendingPayments++;
      }

      if (payment.user_id) {
        uniqueUsers.add(payment.user_id);
      } else if (payment.user_contact) {
        uniqueUsers.add(payment.user_contact);
      }
    });

    setStats({
      totalDeposited,
      pendingPayments,
      approvedPayments,
      totalUsers: uniqueUsers.size,
    });
  };

  // Format amount in Naira
  const formatCurrency = (value) => {
    if (!value || isNaN(value)) return "₦0";
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
    }).format(Number(value));
  };

  // Handle status update (approve/reject)
  const handleStatusUpdate = async (paymentId, newStatus) => {
    const result = await Swal.fire({
      title: `Are you sure?`,
      text: `Do you want to mark this payment as "${newStatus}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: `Yes, ${newStatus}!`,
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(
        `https://musabaha-homes.onrender.com/api/user-subsequent-payments/${paymentId}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const data = await res.json();
      if (data.success) {
        setPayments((prev) =>
          prev.map((p) =>
            p.id === paymentId ? { ...p, status: newStatus } : p
          )
        );

        Swal.fire({
          icon: "success",
          title: "Updated!",
          text: `Payment marked as ${newStatus}.`,
          showConfirmButton: false,
          timer: 2000,
        });

        fetchAllPayments();
      } else {
        Swal.fire("Error", "Failed to update payment status", "error");
      }
    } catch (err) {
      console.error("Error updating payment status:", err);
      Swal.fire("Error", "Something went wrong!", "error");
    }
  };

  const filteredPayments =
    filterStatus === "all"
      ? payments
      : payments.filter(
          (p) =>
            p.status &&
            p.status.toLowerCase() === filterStatus.toLowerCase()
        );

  if (loading) return <div style={containerStyles}><p style={loadingStyles}>Loading payments...</p></div>;

  return (
    <div style={containerStyles}>
      <h2 style={titleStyles}>Admin Payment Approval</h2>

      {/* Stats Cards */}
      <div style={statsGridStyles}>
        <div style={statCardStyles}>
          <div style={statIconVariants.totalDeposits}>
            <span style={{fontSize: "20px", fontWeight: "bold"}}>₦</span>
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
            <p style={statLabelStyles}>Total Users</p>
          </div>
        </div>
      </div>

      {/* Filter Control */}
      <div style={filterControlsStyles}>
        <label style={filterLabelStyles}>
          Filter by status:
        </label>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={filterSelectStyles}
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Table */}
      {filteredPayments.length === 0 ? (
        <p style={{textAlign: "center", padding: "40px", color: "#6b7280"}}>No payments found.</p>
      ) : (
        <div style={tableResponsiveStyles}>
          <table style={tableStyles}>
            <thead>
              <tr>
                <th style={thStyles}>#</th>
                <th style={thStyles}>User Name</th>
                <th style={thStyles}>Contact</th>
                <th style={thStyles}>Amount</th>
                <th style={thStyles}>Method</th>
                <th style={thStyles}>Note</th>
                <th style={thStyles}>Date</th>
                <th style={thStyles}>Outstanding</th>
                <th style={thStyles}>Receipt</th>
                <th style={thStyles}>Status</th>
                <th style={thStyles}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((p, idx) => (
                <tr key={p.id} style={trStyles}>
                  <td style={tdStyles}>{idx + 1}</td>
                  <td style={tdStyles}>{p.user_name || "N/A"}</td>
                  <td style={tdStyles}>{p.user_contact || "N/A"}</td>
                  <td style={tdStyles}>{formatCurrency(p.amount)}</td>
                  <td style={tdStyles}>{p.payment_method || "N/A"}</td>
                  <td style={tdStyles}>{p.note || p.notes || "-"}</td>
                  <td style={tdStyles}>{new Date(p.created_at).toLocaleDateString()}</td>
                  <td style={tdStyles}>{formatCurrency(p.outstanding_balance)}</td>
                  <td style={tdStyles}>
                    {p.receipt_file ? (
                      <a
                        href={`https://musabaha-homes.onrender.com/uploads/receipts/${p.receipt_file}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="View Receipt"
                        style={receiptLinkStyles}
                      >
                        <FiEye />
                      </a>
                    ) : (
                      <span style={noReceiptStyles}>No Receipt</span>
                    )}
                  </td>
                  <td style={tdStyles}>
                    <span style={statusBadgeStyles[p.status?.toLowerCase()] || statusBadgeStyles.pending}>
                      {p.status || "Pending"}
                    </span>
                  </td>
                  <td style={tdStyles}>
                    {p.status?.toLowerCase() === "pending" ? (
                      <div style={actionButtonsStyles}>
                        <button
                          style={approveButtonStyles}
                          onClick={() => handleStatusUpdate(p.id, "approved")}
                          title="Approve Payment"
                        >
                          <FiCheck />
                        </button>
                        <button
                          style={rejectButtonStyles}
                          onClick={() => handleStatusUpdate(p.id, "rejected")}
                          title="Reject Payment"
                        >
                          <FiX />
                        </button>
                      </div>
                    ) : (
                      <span style={actionCompleteStyles}>Processed</span>
                    )}
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

export default AdminPaymentApproval;