import React, { useState, useEffect, useCallback } from 'react'; 
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import UserProfile from './users/UserProfile';
import UserPlots from './users/UserPlots';
import UserPayments from './users/UserPayments';
import UserDocuments from './users/UserDocuments';
import SubscriptionForm from './users/SubscriptionForm';
import DashboardHome from './DashboardHome';
import Sidebar from './Sidebar';
import NotificationSystem from './NotificationSystem';
import Swal from 'sweetalert2';
import './DashboardStyles.css';

const UserDashboard = ({ user, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Sidebar states
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Use localStorage to persist notification state across page reloads
  const [approvalNotificationShown, setApprovalNotificationShown] = useState(() => {
    const stored = localStorage.getItem('approvalNotificationShown');
    return stored ? JSON.parse(stored) : false;
  });

  const [dashboardData, setDashboardData] = useState({
    plotCount: 0,
    transactionCount: 0,
    totalDeposited: 0,
    outstandingBalance: 0,
    nextPaymentDue: null,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);
  
  // Add notification state
  const [notifications, setNotifications] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  // Add missing state variables
  const [dataSource, setDataSource] = useState('userstable');
  const [subscriptionId, setSubscriptionId] = useState(null);
  const [payments, setPayments] = useState([]);

  // Update localStorage when approvalNotificationShown changes
  useEffect(() => {
    localStorage.setItem('approvalNotificationShown', JSON.stringify(approvalNotificationShown));
  }, [approvalNotificationShown]);

  // Check screen size on resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) setSidebarOpen(false);
      else setSidebarCollapsed(true);
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Use useCallback to prevent infinite re-renders
  const determineDataSource = useCallback(async () => {
    if (!user?.email) {
      setDataSource('userstable');
      return { source: 'userstable', subscriptionId: null };
    }
    
    try {
      const response = await fetch(`https://musabaha-homes.onrender.com/api/subscriptions?email=${user.email}`);
      const result = await response.json();
      console.log("Subscription data for source determination:", result);

      if (result.success && result.data) {
        const subscription = Array.isArray(result.data) ? result.data[0] : result.data;
        if (subscription) {
          const newStatus = subscription.status || 'pending';
          const source = subscription.source === 'subscriptions' ? 'subscriptions' : 'userstable';
          const newSubscriptionId = subscription.id;
          
          setSubscriptionStatus(newStatus);
          setDataSource(source);
          setSubscriptionId(newSubscriptionId);
          return { source, subscriptionId: newSubscriptionId };
        }
      }
    } catch (err) {
      console.error("Error determining data source:", err);
    }
    
    setDataSource('userstable');
    return { source: 'userstable', subscriptionId: null };
  }, [user?.email]);

  // Fixed fetchPayments function
  const fetchPayments = useCallback(async (source, currentSubscriptionId) => {
    try {
      let url;
      console.log("Fetching payments with source:", source, "subscriptionId:", currentSubscriptionId);

      const baseUrl = "https://musabaha-homes.onrender.com/api";
      
      if (source === 'subscriptions') {
        url = `${baseUrl}/user-subsequent-payments/user/${user.id}`;
      } else {
        if (!currentSubscriptionId) {
          console.log("No subscriptionId available, skipping payment fetch");
          return;
        }
        url = `${baseUrl}/user-payment-requests/user/${currentSubscriptionId}`;
      }

      console.log("✅ Fetch URL:", url);
      const res = await fetch(url);
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      console.log("✅ Returned Data:", data);

      if (data.success) {
        const paymentData = data.payments || data.requests || [];
        setPayments(paymentData);
      } else {
        console.error("API returned success: false", data);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: data.message || "Failed to fetch your payment data.",
        });
      }
    } catch (err) {
      console.error("Error fetching payments:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred while fetching payment data.",
      });
    }
  }, [user?.id]);

// Unified fetchDashboardData function that works with both data sources
const fetchDashboardData = useCallback(async (source, currentSubscriptionId) => {
  if (!user?.id) return;

  try {
    setLoading(true);
    let paymentsData = { success: false, payments: [] };
    let subsequentData = { success: false, payments: [] };
    let subscriptionData = { success: false, data: [] };

    // Fetch subscription data to get payment terms
    try {
      const subscriptionRes = await fetch(`https://musabaha-homes.onrender.com/api/subscriptions?email=${user.email}`);
      subscriptionData = await subscriptionRes.json();
      console.log('Subscription Data:', subscriptionData);
    } catch (err) {
      console.error("Error fetching subscription data:", err);
    }

    let totalDeposited = 0;
    let outstandingBalance = 0;
    let plotCount = 0;
    let nextPaymentDue = null;
    let paymentTerms = "12 Months"; // Default
    let nextPaymentAmount = 0;
    const recentActivity = [];

    // Get subscription data
    if (subscriptionData.success && subscriptionData.data?.length > 0) {
      const subscription = Array.isArray(subscriptionData.data) ? subscriptionData.data[0] : subscriptionData.data;
      console.log('Processing subscription:', subscription);
      
      // Extract data based on actual field names in your response
      plotCount = subscription.plot_taken ? parseInt(subscription.plot_taken) : 
                  subscription.plot_number ? parseInt(subscription.plot_number) : 0;
      
      outstandingBalance = parseFloat(subscription.total_balance) || 
                          parseFloat(subscription.outstanding_balance) || 0;
      
      totalDeposited = parseFloat(subscription.initial_deposit) || 0;
      
      // Calculate total deposited from initial deposit and any additional payments
      if (subscription.amount) {
        totalDeposited += parseFloat(subscription.amount) || 0;
      }

      // Get payment terms - map payment_schedule to our expected format
      const paymentSchedule = subscription.payment_schedule || "Monthly";
      switch (paymentSchedule.toLowerCase()) {
        case "3 months":
          paymentTerms = "3 Months";
          break;
        case "12 months":
          paymentTerms = "12 Months";
          break;
        case "18 months":
          paymentTerms = "18 Months";
          break;
        case "24 months":
          paymentTerms = "24 Months";
          break;
        case "30 months":
          paymentTerms = "30 Months";
          break;
        default:
          paymentTerms = "12 Months";
      }

      // Add initial payment to recent activity if exists
      if (subscription.amount && subscription.transaction_date) {
        recentActivity.push({
          id: subscription.id,
          type: 'initial_payment',
          amount: subscription.amount,
          date: subscription.transaction_date,
          description: 'Initial Plot Payment'
        });
      }
    }

    // Fetch additional payments data based on source
    if (source === 'subscriptions') {
      // Fetch from subscriptions endpoint
      try {
        const subsequentRes = await fetch(`https://musabaha-homes.onrender.com/api/user-subsequent-payments/user/${user.id}`);
        subsequentData = await subsequentRes.json();
        console.log('Subsequent Payments Data (subscriptions source):', subsequentData);
      } catch (err) {
        console.error("Error fetching subsequent payments:", err);
      }

      // Process subsequent payments
      if (subsequentData.success && subsequentData.payments) {
        subsequentData.payments.forEach(p => {
          const amount = parseFloat(p.amount_paid) || parseFloat(p.amount) || 0;
          totalDeposited += amount;
          
          // Add subsequent payments to recent activity
          recentActivity.push({
            id: p.id,
            type: 'subsequent_payment',
            amount: amount,
            date: p.created_at || p.transaction_date,
            description: 'Subsequent Payment'
          });
        });

        // Calculate next payment due date based on payment terms
        if (subsequentData.payments.length > 0) {
          const lastPayment = subsequentData.payments[0];
          const lastDateField = lastPayment.created_at || lastPayment.transaction_date;
          if (lastDateField) {
            const lastDate = new Date(lastDateField);
            if (!isNaN(lastDate.getTime())) {
              const nextDate = new Date(lastDate);
              
              // Set due date based on payment terms
              let monthsToAdd;
              switch (paymentTerms) {
                case "3 Months":
                  monthsToAdd = 1;
                  break;
                case "12 Months":
                  monthsToAdd = 1;
                  break;
                case "18 Months":
                  monthsToAdd = 1;
                  break;
                case "24 Months":
                  monthsToAdd = 1;
                  break;
                case "30 Months":
                  monthsToAdd = 1;
                  break;
                default:
                  monthsToAdd = 1;
              }
              
              nextDate.setMonth(nextDate.getMonth() + monthsToAdd);
              
              if (!isNaN(nextDate.getTime())) {
                nextPaymentDue = nextDate.toISOString().split('T')[0];
              }
            }
          }
        }
      }

    } else {
      // Fetch from userstable endpoint
      try {
        const paymentsRes = await fetch(`https://musabaha-homes.onrender.com/api/user-payments/user/${user.id}`);
        paymentsData = await paymentsRes.json();
        console.log('Payments Data (userstable source):', paymentsData);
      } catch (err) {
        console.error("Error fetching payments:", err);
      }

      // Process userstable payments
      if (paymentsData.success && paymentsData.payments?.length > 0) {
        paymentsData.payments.forEach(payment => {
          const amount = parseFloat(payment.amount) || 0;
          totalDeposited += amount;
          
          // Add payments to recent activity
          recentActivity.push({
            id: payment.id,
            type: 'payment',
            amount: amount,
            date: payment.transaction_date || payment.created_at,
            description: 'Plot Payment'
          });
        });

        // Update outstanding balance from payments data if available
        if (paymentsData.payments[0]?.outstanding_balance) {
          outstandingBalance = parseFloat(paymentsData.payments[0].outstanding_balance) || outstandingBalance;
        }
        if (paymentsData.payments[0]?.number_of_plots) {
          plotCount = parseInt(paymentsData.payments[0].number_of_plots) || plotCount;
        }
      }

      // Also fetch subsequent payments for userstable source if available
      try {
        const subsequentRes = await fetch(`https://musabaha-homes.onrender.com/api/user-subsequent-payments/user/${user.id}`);
        subsequentData = await subsequentRes.json();
        console.log('Subsequent Payments Data (userstable source):', subsequentData);

        if (subsequentData.success && subsequentData.payments) {
          subsequentData.payments.forEach(p => {
            const amount = parseFloat(p.amount_paid) || parseFloat(p.amount) || 0;
            totalDeposited += amount;
            
            // Add subsequent payments to recent activity
            recentActivity.push({
              id: p.id,
              type: 'subsequent_payment',
              amount: amount,
              date: p.created_at || p.transaction_date,
              description: 'Subsequent Payment'
            });
          });

          // Calculate next payment due date based on payment terms
          if (subsequentData.payments.length > 0) {
            const lastPayment = subsequentData.payments[0];
            const lastDateField = lastPayment.created_at || lastPayment.transaction_date;
            if (lastDateField) {
              const lastDate = new Date(lastDateField);
              if (!isNaN(lastDate.getTime())) {
                const nextDate = new Date(lastDate);
                
                let monthsToAdd;
                switch (paymentTerms) {
                  case "3 Months":
                    monthsToAdd = 1;
                    break;
                  case "12 Months":
                    monthsToAdd = 1;
                    break;
                  case "18 Months":
                    monthsToAdd = 1;
                    break;
                  case "24 Months":
                    monthsToAdd = 1;
                    break;
                  case "30 Months":
                    monthsToAdd = 1;
                    break;
                  default:
                    monthsToAdd = 1;
                }
                
                nextDate.setMonth(nextDate.getMonth() + monthsToAdd);
                
                if (!isNaN(nextDate.getTime())) {
                  nextPaymentDue = nextDate.toISOString().split('T')[0];
                }
              }
            }
          }
        }
      } catch (err) {
        console.error("Error fetching subsequent payments for userstable:", err);
      }
    }

    // If we have subscription data but no payments data, calculate next payment
    if (!nextPaymentDue && subscriptionData.success && subscriptionData.data?.length > 0) {
      const subscription = Array.isArray(subscriptionData.data) ? subscriptionData.data[0] : subscriptionData.data;
      if (subscription.date_taken || subscription.created_at) {
        const startDate = new Date(subscription.date_taken || subscription.created_at);
        if (!isNaN(startDate.getTime())) {
          const firstDueDate = new Date(startDate);
          
          let monthsToAdd;
          switch (paymentTerms) {
            case "3 Months":
              monthsToAdd = 1;
              break;
            case "12 Months":
              monthsToAdd = 1;
              break;
            case "18 Months":
              monthsToAdd = 1;
              break;
            case "24 Months":
              monthsToAdd = 1;
              break;
            case "30 Months":
              monthsToAdd = 1;
              break;
            default:
              monthsToAdd = 1;
          }
          
          firstDueDate.setMonth(firstDueDate.getMonth() + monthsToAdd);
          
          if (!isNaN(firstDueDate.getTime())) {
            nextPaymentDue = firstDueDate.toISOString().split('T')[0];
          }
        }
      }
    }

    // Calculate next payment amount based on outstanding balance and payment terms
    if (outstandingBalance > 0) {
      switch (paymentTerms) {
        case "3 Months":
          nextPaymentAmount = outstandingBalance / 3;
          break;
        case "12 Months":
          nextPaymentAmount = outstandingBalance / 12;
          break;
        case "18 Months":
          nextPaymentAmount = outstandingBalance / 18;
          break;
        case "24 Months":
          nextPaymentAmount = outstandingBalance / 24;
          break;
        case "30 Months":
          nextPaymentAmount = outstandingBalance / 30;
          break;
        default:
          nextPaymentAmount = outstandingBalance / 12;
      }
    }

    // Sort recent activity by date
    recentActivity.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      if (isNaN(dateA.getTime())) return 1;
      if (isNaN(dateB.getTime())) return -1;
      return dateB - dateA;
    });

    // Calculate transaction count based on available data
    const transactionCount = 
      (paymentsData.success && paymentsData.payments ? paymentsData.payments.length : 0) +
      (subsequentData.success && subsequentData.payments ? subsequentData.payments.length : 0) +
      (subscriptionData.success && subscriptionData.data?.length > 0 && subscriptionData.data[0].amount ? 1 : 0);

    const finalDashboardData = {
      plotCount: plotCount || 1, // Default to 1 if no plot count found
      transactionCount,
      totalDeposited,
      outstandingBalance,
      nextPaymentDue,
      paymentTerms,
      nextPaymentAmount,
      paymentFrequency: "Monthly", // Based on your data
      recentActivity: recentActivity.slice(0, 5),
      dataSource: source
    };

    setDashboardData(finalDashboardData);

    console.log('Final Dashboard Data:', finalDashboardData);

  } catch (err) {
    console.error("Error fetching dashboard data:", err);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Could not load dashboard data.",
    });
  } finally {
    setLoading(false);
  }
}, [user?.id, user?.email]);

  // Fetch subscription status and check for changes
  const fetchSubscriptionStatus = async () => {
    if (!user?.email) return;

    try {
      const response = await fetch(`https://musabaha-homes.onrender.com/api/subscriptions?email=${user.email}`);
      const result = await response.json();
      console.log('Subscription Status Data:', result);
      
      if (result.success) {
        const subscription = Array.isArray(result.data) ? result.data[0] : result.data;
        
        if (subscription) {
          const newStatus = subscription.status || 'pending';
          
          // Only show notification if:
          // 1. Status changed to approved
          // 2. We haven't shown the approval notification yet in this session
          // 3. Check if we don't already have an approval notification
          if (newStatus === 'approved' && 
              !approvalNotificationShown && 
              !notifications.some(notif => notif.title.includes('Plot Application Approved'))) {
            showStatusChangeNotification();
            setApprovalNotificationShown(true); // Mark as shown
          }
          
          setSubscriptionStatus(newStatus);
        }
      }
    } catch (err) {
      console.error("Error fetching subscription status:", err);
    }
  };

  // Simplified useEffect - only one effect to rule them all
  useEffect(() => {
    if (!user?.id) return;

    const initializeData = async () => {
      setLoading(true);
      try {
        console.log("🔄 Initializing dashboard data...");
        
        // Step 1: Determine data source
        const sourceInfo = await determineDataSource();
        console.log("📊 Source determined:", sourceInfo);
        
        // Step 2: Fetch dashboard data based on source
        await fetchDashboardData(sourceInfo.source, sourceInfo.subscriptionId);
        
        // Step 3: Fetch payments based on source
        if (sourceInfo.source === 'userstable' && !sourceInfo.subscriptionId) {
          console.log("⏳ Waiting for subscription data...");
          setPayments([]);
        } else {
          await fetchPayments(sourceInfo.source, sourceInfo.subscriptionId);
        }
      } catch (error) {
        console.error("Error initializing dashboard data:", error);
        Swal.fire({
          icon: "error",
          title: "Initialization Error",
          text: "Failed to load dashboard information.",
        });
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, [user?.id, determineDataSource, fetchDashboardData, fetchPayments]);

  // Formatting functions
  const formatCurrency = (amount) => {
    if (!amount) return "₦0";
    return `₦${Number(amount).toLocaleString()}`;
  };

  // Show notification when status changes to approved
  const showStatusChangeNotification = () => {
    // Add to notifications list
    const newNotification = {
      id: Date.now(),
      type: 'success',
      title: 'Plot Application Approved! 🎉',
      message: 'Your plot application has been approved. You can now view your plots and make payments.',
      timestamp: new Date().toLocaleTimeString(),
      isApproval: true // Mark as approval notification
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    setShowNotification(true);
    
    // Show SweetAlert notification
    Swal.fire({
      icon: 'success',
      title: 'Plot Application Approved!',
      text: 'Your plot application has been approved. You can now view your plots and make payments.',
      confirmButtonText: 'View Plots',
      showCancelButton: true,
      cancelButtonText: 'Dismiss',
      timer: 10000,
      timerProgressBar: true
    }).then((result) => {
      if (result.isConfirmed) {
        navigate('/dashboard/plots');
      }
    });

    // Refresh dashboard data
    const refreshData = async () => {
      const sourceInfo = await determineDataSource();
      await fetchDashboardData(sourceInfo.source, sourceInfo.subscriptionId);
    };
    refreshData();
  };

  // Close notification
  const closeNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
    if (notifications.length <= 1) {
      setShowNotification(false);
    }
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
    setShowNotification(false);
  };

  // Poll for subscription status changes every 30 seconds
  useEffect(() => {
    if (!user?.email) return;

    const interval = setInterval(() => {
      fetchSubscriptionStatus();
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [user, subscriptionStatus, approvalNotificationShown, notifications]);

  const handleLogout = () => {
    // Clear the notification state on logout
    localStorage.removeItem('approvalNotificationShown');
    setApprovalNotificationShown(false);
    onLogout();
    navigate('/');
  };

  const toggleSidebar = () => {
    if (isMobile) setSidebarOpen(!sidebarOpen);
    else setSidebarCollapsed(!sidebarCollapsed);
  };

  const closeSidebar = () => {
    if (isMobile) setSidebarOpen(false);
  };

  const getSidebarClass = () => {
    if (isMobile) return sidebarOpen ? 'expanded' : 'collapsed';
    return sidebarCollapsed ? 'collapsed' : 'expanded';
  };

  return (
    <div className="dashboard-container">
      {/* Notification System */}
      <NotificationSystem
        notifications={notifications}
        showNotification={showNotification}
        setShowNotification={setShowNotification}
        closeNotification={closeNotification}
        clearAllNotifications={clearAllNotifications}
      />

      {/* Mobile Toggle Button */}
      {isMobile && (
        <button className="mobile-menu-btn" onClick={toggleSidebar}>
          {sidebarOpen ? <i className="fas fa-times"></i> : <i className="fas fa-bars"></i>}
        </button>
      )}

      {isMobile && sidebarOpen && (
        <div className="sidebar-overlay" onClick={closeSidebar}></div>
      )}

      {/* Sidebar */}
      <Sidebar
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
        isMobile={isMobile}
        sidebarOpen={sidebarOpen}
        getSidebarClass={getSidebarClass}
        closeSidebar={closeSidebar}
        handleLogout={handleLogout}
        location={location}
      />

      {/* Main Content */}
      <div className={`main-content ${isMobile && sidebarOpen ? 'sidebar-open' : ''}`}>
        <Routes>
          <Route path="/" element={
            <DashboardHome 
              dashboardData={dashboardData} 
              loading={loading} 
              notifications={notifications}
              subscriptionStatus={subscriptionStatus}
              user={user}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          } />
          <Route path="/profile" element={<UserProfile user={user} />} />
          <Route path="/plots" element={<UserPlots user={user} />} />
          <Route path="/payments" element={<UserPayments user={user} payments={payments} />} />
          <Route path="/documents" element={<UserDocuments user={user} />} />
          <Route path="/subscribe" element={<SubscriptionForm />} />
        </Routes>
      </div>
    </div>
  );
};

export default UserDashboard;