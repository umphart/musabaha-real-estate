import React, { useEffect, useState } from "react";
import "./AdminPaymentApproval.css";
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

  if (loading) return <p>Loading payments...</p>;

  return (
    <div className="admin-payments-container">
      <h2>Admin Payment Approval</h2>

      {/* Stats Cards */}
      <div className="stats-grid">
<div className="stat-card">
  <div className="stat-icon total-deposits">
    <span className="text-2xl font-bold">₦</span>
  </div>
  <div className="stat-content">
    <h3>{formatCurrency(stats.totalDeposited)}</h3>
    <p>Total Deposited</p>
  </div>
</div>


        <div className="stat-card">
          <div className="stat-icon pending-payments">
            <Clock size={24} />
          </div>
          <div className="stat-content">
            <h3>{stats.pendingPayments}</h3>
            <p>Pending Payments</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon approved-payments">
            <TrendingUp size={24} />
          </div>
          <div className="stat-content">
            <h3>{stats.approvedPayments}</h3>
            <p>Approved Payments</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon total-users">
            <Users size={24} />
          </div>
          <div className="stat-content">
            <h3>{stats.totalUsers}</h3>
            <p>Total Users</p>
          </div>
        </div>
      </div>

      {/* Filter Control */}
      <div className="filter-controls">
        <label>
          Filter by status:
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </label>
      </div>

      {/* Table */}
      {filteredPayments.length === 0 ? (
        <p>No payments found.</p>
      ) : (
        <div className="table-responsive">
          <table className="payments-table">
            <thead>
              <tr>
                <th>#</th>
                <th>User Name</th>
                <th>Contact</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Note</th>
                <th>Date</th>
                <th>Outstanding</th>
                <th>Receipt</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((p, idx) => (
                <tr key={p.id}>
                  <td>{idx + 1}</td>
                  <td>{p.user_name || "N/A"}</td>
                  <td>{p.user_contact || "N/A"}</td>
                  <td>{formatCurrency(p.amount)}</td>
                  <td>{p.payment_method || "N/A"}</td>
                  <td>{p.note || p.notes || "-"}</td>
                  <td>{new Date(p.created_at).toLocaleDateString()}</td>
                  <td>{formatCurrency(p.outstanding_balance)}</td>
                  <td>
                    {p.receipt_file ? (
                      <a
                        href={`https://musabaha-homes.onrender.com/uploads/receipts/${p.receipt_file}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="View Receipt"
                      >
                        <FiEye />
                      </a>
                    ) : (
                      <span className="no-receipt">No Receipt</span>
                    )}
                  </td>
                  <td>
                    <span className={`status-badge ${p.status?.toLowerCase()}`}>
                      {p.status || "Pending"}
                    </span>
                  </td>
                  <td>
                    {p.status?.toLowerCase() === "pending" ? (
                      <div className="action-buttons">
                        <button
                          className="btn-approve"
                          onClick={() => handleStatusUpdate(p.id, "approved")}
                        >
                          <FiCheck />
                        </button>
                        <button
                          className="btn-reject"
                          onClick={() => handleStatusUpdate(p.id, "rejected")}
                        >
                          <FiX />
                        </button>
                      </div>
                    ) : (
                      <span className="action-complete">Processed</span>
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
