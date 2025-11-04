import React, { useState, useEffect } from "react";
import { FiRefreshCw } from "react-icons/fi";
import { getAuthToken } from "../../utils/auth";
import { API_BASE_URL } from "../../config";

// Import components
import PaymentTabs from "./components/PaymentTabs";
import StatsCards from "./components/StatsCards";
import HeaderActions from "./components/HeaderActions";
import PaymentSummaryTable from "./components/PaymentSummaryTable";
import PendingRequestsTable from "./components/PendingRequestsTable";
import ReviewModal from "./components/ReviewModal";

// Import styles
import { 
  containerStyles, 
  headerStyles, 
  headerTitleSectionStyles, 
  titleStyles,
  loadingStyles,
  spinnerStyles
} from "./styles/adminPaymentsStyles";

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("summary");
  const [pendingRequests, setPendingRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    paymentsCount: 0,
    pendingRequestsCount: 0,
    completedPaymentsCount: 0
  });

  // Helper functions
  const parseAmount = (amount) => {
    if (typeof amount === 'string') {
      // Remove currency symbols and commas
      const cleaned = amount.replace(/[₦,]/g, '');
      const parsed = parseFloat(cleaned);
      return isNaN(parsed) ? 0 : parsed;
    }
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

  // Fetch dashboard statistics
// In your fetchDashboardStats function, update it like this:
const fetchDashboardStats = async () => {
  try {
    const token = getAuthToken();
    console.log("📊 Fetching dashboard stats from:", `${API_BASE_URL}/admin/dashboard/stats`);
    
    const response = await fetch(`${API_BASE_URL}/admin/dashboard/stats`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("📊 Response status:", response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log("📊 Raw Dashboard Stats Data:", data);
      console.log("📊 totalRevenue value:", data.totalRevenue);
      console.log("📊 All keys in data:", Object.keys(data));
      
      // Try different possible property names
      const possibleRevenueKeys = [
        'totalRevenue', 
        'total_revenue', 
        'totalRevenue', 
        'revenue',
        'totalAmount',
        'total_amount'
      ];
      
      let foundRevenue = 0;
      for (const key of possibleRevenueKeys) {
        if (data[key] !== undefined) {
          console.log(`📊 Found revenue in key '${key}':`, data[key]);
          foundRevenue = data[key];
          break;
        }
      }
      
      setStats({
        totalRevenue: foundRevenue,
        paymentsCount: data.paymentsCount || data.total_payments || data.payments_count || 0,
        pendingRequestsCount: data.pendingRequestsCount || data.pending_requests || data.pending_requests_count || 0,
        completedPaymentsCount: data.completedPaymentsCount || data.completed_payments || data.completed_payments_count || 0
      });
    } else {
      console.error("❌ Failed to fetch dashboard stats, status:", response.status);
      const errorText = await response.text();
      console.error("❌ Error response:", errorText);
      calculateStatsFromLocalData();
    }
  } catch (error) {
    console.error("❌ Error fetching dashboard stats:", error);
    calculateStatsFromLocalData();
  }
};

 // Calculate stats from local data as fallback
const calculateStatsFromLocalData = () => {
  console.log("🔄 Calculating stats from local data...");
  console.log("💳 Total payments:", payments.length);
  console.log("⏳ Pending requests:", pendingRequests.length);
  
  const completedPayments = payments.filter(p => {
    const status = p.status ? p.status.toLowerCase() : '';
    return status === "completed" || status === "approved" || status === "success";
  });
  
  const pendingPayments = payments.filter(p => {
    const status = p.status ? p.status.toLowerCase() : '';
    return status === "pending";
  });

  const totalRevenue = completedPayments.reduce((sum, p) => {
    const amount = parseAmount(p.amount);
    console.log(`💰 Payment amount: ${p.amount} -> parsed: ${amount}`);
    return sum + amount;
  }, 0);

  console.log("💰 Calculated Total Revenue:", totalRevenue);
  console.log("✅ Completed Payments:", completedPayments.length);
  console.log("⏳ Pending Payments:", pendingPayments.length);

  const newStats = {
    totalRevenue: totalRevenue,
    paymentsCount: payments.length,
    pendingRequestsCount: pendingRequests.length + pendingPayments.length,
    completedPaymentsCount: completedPayments.length
  };

  console.log("📊 Final Stats to set:", newStats);
  setStats(newStats);
};

  // Fetch payment requests
  const fetchPaymentRequests = async () => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/subsequent-payments/payment-requests`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("🔄 Fetched Payment Requests:", data);
        
        // Handle different response structures
        const requests = data.requests || data.data || data || [];
        setPendingRequests(requests);
        
        // Update stats with pending requests count
        setStats(prev => ({
          ...prev,
          pendingRequestsCount: requests.length
        }));
      } else {
        console.error("Failed to fetch payment requests");
      }
    } catch (error) {
      console.error("Error fetching payment requests:", error);
    }
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
      console.log("👥 Users Data:", data);
      
      if (data.success || Array.isArray(data) || data.data) {
        const usersData = data.data || data;
        setUsers(Array.isArray(usersData) ? usersData : []);
        
        // Extract all payments from users
        const allPayments = [];
        const usersArray = Array.isArray(usersData) ? usersData : [];
        
        usersArray.forEach(user => {
          if (user.payments && user.payments.length > 0) {
            user.payments.forEach(payment => {
              allPayments.push({
                ...payment,
                amount: parseAmount(payment.amount),
                userId: user.id,
                userName: user.name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || `User ${user.id}`,
                userPlot: user.plot_taken || 'N/A',
              });
            });
          }
        });
        
        setPayments(allPayments);
        console.log("💳 Extracted Payments:", allPayments);
      } else {
        console.error("Error in response format:", data.message || "Fetch error");
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      await Promise.all([
        fetchUsersWithPayments(),
        fetchPaymentRequests(),
        fetchDashboardStats()
      ]);
      setLoading(false);
    };
    
    loadAllData();
  }, []);

  // Update stats when payments or pending requests change
  useEffect(() => {
    if (payments.length > 0 || pendingRequests.length > 0) {
      calculateStatsFromLocalData();
    }
  }, [payments, pendingRequests]);

  // Handle payment request action
  const handlePaymentAction = async (requestId, action) => {
    try {
      setActionLoading(true);
      const token = getAuthToken();
      
      const response = await fetch(`${API_BASE_URL}/subsequent-payments/payment-requests/${requestId}/${action}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log(`🔄 ${action} request sent to: ${API_BASE_URL}/subsequent-payments/payment-requests/${requestId}/${action}`);
      console.log('Response status:', response.status);

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Success response:', result);
        alert(`Payment ${action}ed successfully!`);
        
        // Refresh all data
        await Promise.all([
          fetchPaymentRequests(),
          fetchUsersWithPayments(),
          fetchDashboardStats()
        ]);
        
        setShowModal(false);
        setSelectedRequest(null);
      } else {
        const errorText = await response.text();
        console.error('❌ Error response:', errorText);
        throw new Error(`Failed to ${action} payment: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error(`Error ${action}ing payment:`, error);
      alert(`Error ${action}ing payment: ${error.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRefresh = () => {
    setLoading(true);
    Promise.all([
      fetchUsersWithPayments(),
      fetchPaymentRequests(),
      fetchDashboardStats()
    ]).finally(() => setLoading(false));
  };

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
      const paymentDate = new Date(payment.date || payment.created_at || payment.transaction_date);
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
        (user.userPlot && user.userPlot.toLowerCase().includes(query))
      );
    }

    // Sort by latest payment date
    return userList.sort((a, b) => {
      const dateA = a.lastPaymentDate ? new Date(a.lastPaymentDate) : new Date(0);
      const dateB = b.lastPaymentDate ? new Date(b.lastPaymentDate) : new Date(0);
      return dateB - dateA;
    });
  };

  const userPaymentSummary = getUserPaymentSummary();

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
            style={{
              padding: "10px 20px",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "500",
              transition: "all 0.3s ease",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background: "#6c757d",
              color: "white"
            }}
            onClick={handleRefresh}
            disabled={loading}
          >
            <FiRefreshCw /> Refresh
          </button>
        </div>
        
        <PaymentTabs 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          pendingRequestsCount={stats.pendingRequestsCount}
        />
        
        <StatsCards 
          totalRevenue={stats.totalRevenue}
          paymentsCount={stats.paymentsCount}
          pendingRequestsCount={stats.pendingRequestsCount}
          completedPaymentsCount={stats.completedPaymentsCount}
          formatCurrency={formatCurrency}
        />

        <HeaderActions 
          activeTab={activeTab}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filter={filter}
          setFilter={setFilter}
        />
      </div>

      {/* Payment Summary Tab */}
      {activeTab === "summary" && (
        <PaymentSummaryTable 
          userPaymentSummary={userPaymentSummary}
          formatCurrency={formatCurrency}
          payments={payments}
        />
      )}

      {/* Pending Requests Tab */}
      {activeTab === "pending" && (
        <PendingRequestsTable 
          pendingRequests={pendingRequests}
          formatCurrency={formatCurrency}
          setSelectedRequest={setSelectedRequest}
          setShowModal={setShowModal}
          setPendingRequests={setPendingRequests}
          handlePaymentAction={handlePaymentAction}
          actionLoading={actionLoading}
        />
      )}

      {/* Review Modal */}
      {showModal && selectedRequest && (
        <ReviewModal 
          selectedRequest={selectedRequest}
          setShowModal={setShowModal}
          setSelectedRequest={setSelectedRequest}
          handlePaymentAction={handlePaymentAction}
          actionLoading={actionLoading}
          formatCurrency={formatCurrency}
          formatDate={(dateString) => new Date(dateString).toLocaleDateString('en-NG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        />
      )}
    </div>
  );
};

export default AdminPayments;