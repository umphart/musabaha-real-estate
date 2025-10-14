import React, { useState, useEffect } from 'react'; 
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import UserProfile from './users/UserProfile';
import UserPlots from './users/UserPlots';
import UserPayments from './users/UserPayments';
import UserDocuments from './users/UserDocuments';
import SubscriptionForm from './users/SubscriptionForm';
import Swal from 'sweetalert2';

const UserDashboard = ({ user, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Sidebar states
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Use localStorage to persist notification state across page reloads
  const [approvalNotificationShown, setApprovalNotificationShown] = useState(() => {
    // Initialize from localStorage or default to false
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

  const menuItems = [
    { path: '/dashboard', name: 'Dashboard', icon: 'fas fa-tachometer-alt' },
    { path: '/dashboard/profile', name: 'Profile', icon: 'fas fa-user' },
    { path: '/dashboard/plots', name: 'My Plots', icon: 'fas fa-map-marked' },
    { path: '/dashboard/payments', name: 'Payments', icon: 'fas fa-credit-card' },
    { path: '/dashboard/documents', name: 'Subsequent Payments', icon: 'fas fa-file' },
    { path: '/dashboard/subscribe', name: 'Apply for Plot', icon: 'fas fa-file-signature' },
  ];

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
const fetchDashboardData = async () => {
  if (!user?.id) return;

  try {
    setLoading(true);
    const paymentsRes = await fetch(`musabaha-homes.onrender.com/api/user-payments/user/${user.id}`);
    const paymentsData = await paymentsRes.json();

    const subsequentRes = await fetch(`musabaha-homes.onrender.com/api/user-subsequent-payments/user/${user.id}`);
    const subsequentData = await subsequentRes.json();

    // Fetch subscription data to get payment terms
    const subscriptionRes = await fetch(`musabaha-homes.onrender.com/api/subscriptions?email=${user.email}`);
    const subscriptionData = await subscriptionRes.json();

    let totalDeposited = 0;
    let outstandingBalance = 0;
    let plotCount = 0;
    let nextPaymentDue = null;
    let paymentTerms = "12 Months"; // Default
    let nextPaymentAmount = 0;
    const recentActivity = [];

    // Get payment terms from subscription
    if (subscriptionData.success && subscriptionData.data?.length > 0) {
      const subscription = Array.isArray(subscriptionData.data) ? subscriptionData.data[0] : subscriptionData.data;
      paymentTerms = subscription.payment_terms || "12 Months";
    }

    if (paymentsData.success && paymentsData.payments?.length > 0) {
      const payment = paymentsData.payments[0];
      totalDeposited += parseFloat(payment.amount) || 0;
      outstandingBalance = parseFloat(payment.outstanding_balance) || 0;
      plotCount = parseInt(payment.number_of_plots) || 0;
      
      // Add initial payment to recent activity
      recentActivity.push({
        id: payment.id,
        type: 'initial_payment',
        amount: payment.amount,
        date: payment.transaction_date,
        description: 'Initial Plot Payment'
      });
    }

    if (subsequentData.success && subsequentData.payments) {
      subsequentData.payments.forEach(p => {
        totalDeposited += parseFloat(p.amount_paid) || 0;
        
        // Add subsequent payments to recent activity
        recentActivity.push({
          id: p.id,
          type: 'subsequent_payment',
          amount: p.amount_paid || p.amount,
          date: p.created_at,
          description: 'Subsequent Payment'
        });
      });

      // Calculate next payment due date based on payment terms
      if (subsequentData.payments.length > 0) {
        const lastPayment = subsequentData.payments[0];
        const lastDateField = lastPayment.created_at;
        if (lastDateField) {
          const lastDate = new Date(lastDateField);
          if (!isNaN(lastDate.getTime())) {
            const nextDate = new Date(lastDate);
            
            // Set due date based on payment terms - different intervals for different plans
            let monthsToAdd;
            switch (paymentTerms) {
              case "3 Months":
                monthsToAdd = 1; // Monthly payments
                break;
              case "12 Months":
                monthsToAdd = 1; // Monthly payments
                break;
              case "18 Months":
                monthsToAdd = 1; // Monthly payments
                break;
              case "24 Months":
                monthsToAdd = 1; // Monthly payments
                break;
              case "30 Months":
                monthsToAdd = 1; // Monthly payments
                break;
              default:
                monthsToAdd = 1; // Default to monthly
            }
            
            nextDate.setMonth(nextDate.getMonth() + monthsToAdd);
            
            if (!isNaN(nextDate.getTime())) {
              nextPaymentDue = nextDate.toISOString().split('T')[0];
            }
          }
        }
      }
    }

    // If no subsequent payments but there's an initial payment, calculate first due date
    if ((!subsequentData.payments || subsequentData.payments.length === 0) && paymentsData.success && paymentsData.payments?.length > 0) {
      const initialPayment = paymentsData.payments[0];
      if (initialPayment.transaction_date) {
        const initialDate = new Date(initialPayment.transaction_date);
        if (!isNaN(initialDate.getTime())) {
          const firstDueDate = new Date(initialDate);
          
          // Set first due date based on payment plan interval
          let monthsToAdd;
          switch (paymentTerms) {
            case "3 Months":
              monthsToAdd = 1; // First payment due after 1 month
              break;
            case "12 Months":
              monthsToAdd = 1; // First payment due after 1 month
              break;
            case "18 Months":
              monthsToAdd = 1; // First payment due after 1 month
              break;
            case "24 Months":
              monthsToAdd = 1; // First payment due after 1 month
              break;
            case "30 Months":
              monthsToAdd = 1; // First payment due after 1 month
              break;
            default:
              monthsToAdd = 1; // Default to 1 month
          }
          
          firstDueDate.setMonth(firstDueDate.getMonth() + monthsToAdd);
          
          if (!isNaN(firstDueDate.getTime())) {
            nextPaymentDue = firstDueDate.toISOString().split('T')[0];
          }
        }
      }
    }

    // Calculate next payment amount based on payment plan
    const totalPrice = paymentsData.success && paymentsData.payments?.length > 0 
      ? parseFloat(paymentsData.payments[0].total_price) 
      : 6000000; // Fallback price

    const initialDeposit = 500000; // Standard initial deposit
    const remainingBalance = totalPrice - initialDeposit - totalDeposited + initialDeposit;

    // Calculate payment frequency and amount based on plan
    let paymentFrequency = "";
    switch (paymentTerms) {
      case "3 Months":
        nextPaymentAmount = remainingBalance / 3;
        paymentFrequency = "Monthly";
        break;
      case "12 Months":
        nextPaymentAmount = remainingBalance / 12;
        paymentFrequency = "Monthly";
        break;
      case "18 Months":
        nextPaymentAmount = remainingBalance / 18;
        paymentFrequency = "Monthly";
        break;
      case "24 Months":
        nextPaymentAmount = remainingBalance / 24;
        paymentFrequency = "Monthly";
        break;
      case "30 Months":
        nextPaymentAmount = remainingBalance / 30;
        paymentFrequency = "Monthly";
        break;
      default:
        nextPaymentAmount = remainingBalance / 12;
        paymentFrequency = "Monthly";
    }

    // Sort recent activity by date
    recentActivity.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      if (isNaN(dateA.getTime())) return 1;
      if (isNaN(dateB.getTime())) return -1;
      return dateB - dateA;
    });

    setDashboardData({
      plotCount,
      transactionCount:
        (paymentsData.success && paymentsData.payments ? paymentsData.payments.length : 0) +
        (subsequentData.success && subsequentData.payments ? subsequentData.payments.length : 0),
      totalDeposited,
      outstandingBalance,
      nextPaymentDue,
      paymentTerms,
      nextPaymentAmount,
      paymentFrequency, // Add payment frequency
      recentActivity: recentActivity.slice(0, 5)
    });
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
};

  // Fetch subscription status and check for changes
  const fetchSubscriptionStatus = async () => {
    if (!user?.email) return;

    try {
      const response = await fetch(`musabaha-homes.onrender.com/api/subscriptions?email=${user.email}`);
      const result = await response.json();
      console.log("Subscription data:", result);

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
    fetchDashboardData();
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

  // Initial data fetch
  useEffect(() => {
    fetchDashboardData();
    if (user?.email) {
      fetchSubscriptionStatus();
    }
  }, [user]);

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
      {/* Notification Bell */}
      <div className="notification-container">
        <button 
          className="notification-bell"
          onClick={() => setShowNotification(!showNotification)}
        >
          <i className="fas fa-bell"></i>
          {notifications.length > 0 && (
            <span className="notification-badge">{notifications.length}</span>
          )}
        </button>

        {/* Notification Dropdown */}
        {showNotification && (
          <div className="notification-dropdown">
            <div className="notification-header">
              <h4>Notifications</h4>
              <button onClick={() => setShowNotification(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="notification-list">
              {notifications.length === 0 ? (
                <div className="notification-empty">
                  <i className="fas fa-bell-slash"></i>
                  <p>No notifications</p>
                </div>
              ) : (
                notifications.map(notification => (
                  <div key={notification.id} className={`notification-item ${notification.type}`}>
                    <div className="notification-icon">
                      <i className={`fas fa-${notification.type === 'success' ? 'check-circle' : 'info-circle'}`}></i>
                    </div>
                    <div className="notification-content">
                      <h5>{notification.title}</h5>
                      <p>{notification.message}</p>
                      <span className="notification-time">{notification.timestamp}</span>
                    </div>
                    <button 
                      className="notification-close"
                      onClick={() => closeNotification(notification.id)}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                ))
              )}
            </div>
            {notifications.length > 0 && (
              <div className="notification-footer">
                <button onClick={clearAllNotifications}>
                  Clear All
                </button>
              </div>
            )}
          </div>
        )}
      </div>

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
      <div
        className={`sidebar ${getSidebarClass()}`}
        onMouseEnter={() => !isMobile && setSidebarCollapsed(false)}
        onMouseLeave={() => !isMobile && setSidebarCollapsed(true)}
      >
        <div className="sidebar-header">
          <h3>{!sidebarCollapsed || isMobile ? 'User Dashboard' : '👤'}</h3>
        </div>

        <ul className="sidebar-menu">
          {menuItems.map(item => {
            const active = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={active ? 'active' : ''}
                  title={sidebarCollapsed && !isMobile ? item.name : ''}
                  onClick={closeSidebar}
                >
                  <i className={item.icon}></i>
                  {(!sidebarCollapsed || isMobile) && <span>{item.name}</span>}
                </Link>
              </li>
            );
          })}

          <li>
            <button onClick={handleLogout} className="logout-btn" aria-label="Logout">
              <i className="fas fa-sign-out-alt"></i>
              {(!sidebarCollapsed || isMobile) && <span>Logout</span>}
            </button>
          </li>
        </ul>
      </div>

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
          <Route path="/payments" element={<UserPayments user={user} />} />
          <Route path="/documents" element={<UserDocuments user={user} />} />
          <Route path="/subscribe" element={<SubscriptionForm />} />
        </Routes>
      </div>

      {/* Add CSS Styles */}
      <style jsx>{`
        /* Notification Styles */
        .notification-container {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 1000;
        }

        .notification-bell {
          position: relative;
          background: #2c3e50;
          color: white;
          border: none;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          cursor: pointer;
          box-shadow: 0 2px 10px rgba(0,0,0,0.2);
          transition: all 0.3s ease;
        }
  
  /* Professional Dashboard Styles */
  .dashboard-container {
    display: flex;
    min-height: 100vh;
    background: #f8fafc;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }

  /* Notification System */
  .notification-container {
    position: fixed;
    top: 24px;
    right: 24px;
    z-index: 1000;
  }

  .notification-bell {
    position: relative;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 12px;
    width: 56px;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    cursor: pointer;
    box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .notification-bell:hover {
    transform: translateY(-2px) scale(1.05);
    box-shadow: 0 8px 30px rgba(102, 126, 234, 0.4);
  }

  .notification-badge {
    position: absolute;
    top: -6px;
    right: -6px;
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    color: white;
    border-radius: 12px;
    width: 24px;
    height: 24px;
    font-size: 11px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    border: 2px solid white;
    box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
  }

  .notification-dropdown {
    position: absolute;
    top: 70px;
    right: 0;
    width: 380px;
    background: white;
    border-radius: 16px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
    overflow: hidden;
    border: 1px solid #f1f5f9;
    backdrop-filter: blur(20px);
  }

  .notification-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 24px;
    border-bottom: 1px solid #f1f5f9;
    background: #f8fafc;
  }

  .notification-header h4 {
    margin: 0;
    color: #1e293b;
    font-size: 16px;
    font-weight: 700;
  }

  .notification-count {
    background: #667eea;
    color: white;
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
  }

  .notification-list {
    max-height: 400px;
    overflow-y: auto;
  }

  .notification-item {
    display: flex;
    align-items: flex-start;
    padding: 16px 24px;
    border-bottom: 1px solid #f1f5f9;
    transition: all 0.2s ease;
    cursor: pointer;
  }

  .notification-item:hover {
    background: #f8fafc;
  }

  .notification-item:last-child {
    border-bottom: none;
  }

  .notification-icon {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 16px;
    flex-shrink: 0;
  }

  .notification-icon.success {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
  }

  .notification-icon.warning {
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
    color: white;
  }

  .notification-icon.info {
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    color: white;
  }

  .notification-content {
    flex: 1;
  }

  .notification-title {
    display: block;
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 4px;
    font-size: 14px;
  }

  .notification-description {
    color: #64748b;
    font-size: 13px;
    line-height: 1.4;
    margin-bottom: 6px;
  }

  .notification-time {
    font-size: 11px;
    color: #94a3b8;
    font-weight: 500;
  }

  .notification-empty {
    text-align: center;
    padding: 48px 24px;
    color: #94a3b8;
  }

  .notification-empty i {
    font-size: 48px;
    margin-bottom: 16px;
    opacity: 0.5;
  }

  /* Dashboard Header */
  .dashboard-header {
    margin-bottom: 32px;
  }

  .dashboard-title {
    font-size: 32px;
    font-weight: 700;
    color: #1e293b;
    margin: 0 0 8px 0;
    background: linear-gradient(135deg, #1e293b 0%, #475569 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .dashboard-subtitle {
    color: #64748b;
    font-size: 16px;
    margin: 0;
    font-weight: 500;
  }

  /* Stats Overview */
  .stats-overview {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 24px;
    margin-bottom: 32px;
  }

  .stat-card {
    background: white;
    padding: 24px;
    border-radius: 16px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    border: 1px solid #f1f5f9;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
  }

  .stat-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }

  .stat-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  }

  .stat-card.primary::before {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }

  .stat-card.success::before {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  }

  .stat-card.warning::before {
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  }

  .stat-card.info::before {
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  }

  .stat-content {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  .stat-info {
    flex: 1;
  }

  .stat-value {
    font-size: 32px;
    font-weight: 700;
    color: #1e293b;
    margin: 0 0 8px 0;
    line-height: 1;
  }

  .stat-title {
    font-size: 14px;
    color: #64748b;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin: 0 0 8px 0;
  }
#acct1{
color:white;
background-color:blue;
}
#acct2{
color:white;
background-color:blue;
}
  .stat-trend {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 13px;
    font-weight: 600;
  }

  .stat-trend.positive {
    color: #10b981;
  }

  .stat-trend.negative {
    color: #ef4444;
  }

  .stat-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    flex-shrink: 0;
  }

  .stat-card.primary .stat-icon {
    background: linear-gradient(135deg, #667eea20 0%, #764ba220 100%);
    color: #667eea;
  }

  .stat-card.success .stat-icon {
    background: linear-gradient(135deg, #10b98120 0%, #05966920 100%);
    color: #10b981;
  }

  .stat-card.warning .stat-icon {
    background: linear-gradient(135deg, #f59e0b20 0%, #d9770620 100%);
    color: #f59e0b;
  }

  .stat-card.info .stat-icon {
    background: linear-gradient(135deg, #3b82f620 0%, #1d4ed820 100%);
    color: #3b82f6;
  }

  /* Dashboard Grid */
  .dashboard-grid {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 24px;
    margin-bottom: 32px;
  }

  @media (max-width: 1024px) {
    .dashboard-grid {
      grid-template-columns: 1fr;
    }
  }

  /* Main Content Cards */
  .dashboard-card {
    background: white;
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    border: 1px solid #f1f5f9;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  }

  .card-title {
    font-size: 18px;
    font-weight: 700;
    color: #1e293b;
    margin: 0;
  }

  .card-actions {
    display: flex;
    gap: 8px;
  }

  .card-action-btn {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 8px 12px;
    font-size: 13px;
    font-weight: 500;
    color: #475569;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .card-action-btn:hover {
    background: #f1f5f9;
    border-color: #cbd5e1;
  }

  /* Recent Activity */
  .activity-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .activity-item {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    padding: 16px;
    border-radius: 12px;
    transition: all 0.2s ease;
    cursor: pointer;
  }

  .activity-item:hover {
    background: #f8fafc;
  }

  .activity-icon {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    font-size: 16px;
  }

  .activity-icon.payment {
    background: linear-gradient(135deg, #10b98120 0%, #05966920 100%);
    color: #10b981;
  }

  .activity-icon.subscription {
    background: linear-gradient(135deg, #3b82f620 0%, #1d4ed820 100%);
    color: #3b82f6;
  }

  .activity-icon.alert {
    background: linear-gradient(135deg, #f59e0b20 0%, #d9770620 100%);
    color: #f59e0b;
  }

  .activity-content {
    flex: 1;
  }

  .activity-title {
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 4px;
    font-size: 14px;
  }

  .activity-description {
    color: #64748b;
    font-size: 13px;
    margin-bottom: 6px;
    line-height: 1.4;
  }

  .activity-meta {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 12px;
    color: #94a3b8;
  }

  .activity-amount {
    font-weight: 600;
    color: #10b981;
  }

  /* Quick Actions */
  .quick-actions-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
  }

  .quick-action-card {
    background: white;
    padding: 20px;
    border-radius: 12px;
    text-decoration: none;
    color: #1e293b;
    border: 1px solid #f1f5f9;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    text-align: center;
  }

  .quick-action-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    text-decoration: none;
    color: #1e293b;
    border-color: #e2e8f0;
  }

  .quick-action-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 12px;
    font-size: 20px;
    background: linear-gradient(135deg, #667eea20 0%, #764ba220 100%);
    color: #667eea;
  }

  .quick-action-title {
    font-weight: 600;
    margin-bottom: 4px;
    font-size: 14px;
  }

  .quick-action-description {
    color: #64748b;
    font-size: 12px;
    line-height: 1.4;
  }

  /* Payment Summary */
  .payment-summary-card {
    background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
    color: white;
    border-radius: 16px;
    padding: 24px;
    margin-bottom: 24px;
  }

  .payment-summary-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .payment-summary-title {
    font-size: 16px;
    font-weight: 600;
    margin: 0;
    color: #f8fafc;
  }

  .payment-due-badge {
    background: rgba(239, 68, 68, 0.2);
    color: #fecaca;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    border: 1px solid rgba(239, 68, 68, 0.3);
  }

  .payment-amount {
    font-size: 32px;
    font-weight: 700;
    margin-bottom: 8px;
    color: white;
  }

  .payment-due-date {
    color: #cbd5e1;
    font-size: 14px;
    margin-bottom: 20px;
  }

  .pay-now-btn {
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    color: white;
    border: none;
    border-radius: 8px;
    padding: 12px 24px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    width: 100%;
  }

  .pay-now-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
  }

  /* Progress Section */
  .progress-section {
    margin-bottom: 24px;
  }

  .progress-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  .progress-title {
    font-size: 14px;
    font-weight: 600;
    color: #1e293b;
    margin: 0;
  }

  .progress-percentage {
    font-size: 14px;
    font-weight: 600;
    color: #10b981;
  }

  .progress-bar {
    background: #e2e8f0;
    border-radius: 10px;
    height: 8px;
    overflow: hidden;
    margin-bottom: 8px;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    border-radius: 10px;
    transition: width 0.5s ease;
  }

  .progress-labels {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: #64748b;
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .dashboard-container {
      padding: 16px;
    }

    .stats-overview {
      grid-template-columns: 1fr;
    }
#acct1{
color:white;
background-color:blue;
}
#acct2{
color:white;
background-color:blue;
}
    .quick-actions-grid {
      grid-template-columns: 1fr;
    }

    .notification-dropdown {
      width: calc(100vw - 48px);
      right: 24px;
    }

    .dashboard-title {
      font-size: 24px;
    }
  }

  /* Loading States */
  .loading-shimmer {
    background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: 8px;
  }

  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }

  /* Alert Styles */
  .alert {
    padding: 16px 20px;
    border-radius: 12px;
    margin-bottom: 24px;
    display: flex;
    align-items: flex-start;
    gap: 12px;
    border: 1px solid;
  }

  .alert-success {
    background: #f0fdf4;
    color: #166534;
    border-color: #bbf7d0;
  }

  .alert-warning {
    background: #fffbeb;
    color: #92400e;
    border-color: #fed7aa;
  }

  .alert-error {
    background: #fef2f2;
    color: #991b1b;
    border-color: #fecaca;
  }

  .alert-info {
    background: #eff6ff;
    color: #1e40af;
    border-color: #bfdbfe;
  }

  .alert-icon {
    font-size: 20px;
    flex-shrink: 0;
  }

  .alert-content {
    flex: 1;
  }

  .alert-title {
    font-weight: 600;
    margin-bottom: 4px;
  }

  .alert-description {
    font-size: 14px;
    opacity: 0.9;
  }

  /* Empty States */
  .empty-state {
    text-align: center;
    padding: 48px 24px;
    color: #64748b;
  }

  .empty-state-icon {
    font-size: 64px;
    margin-bottom: 16px;
    opacity: 0.5;
  }

  .empty-state-title {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 8px;
    color: #475569;
  }

  .empty-state-description {
    font-size: 14px;
    margin-bottom: 20px;
  }

  /* Utility Classes */
  .text-center { text-align: center; }
  .text-left { text-align: left; }
  .text-right { text-align: right; }

  .mb-0 { margin-bottom: 0; }
  .mb-4 { margin-bottom: 16px; }
  .mb-8 { margin-bottom: 32px; }

  .mt-0 { margin-top: 0; }
  .mt-4 { margin-top: 16px; }
  .mt-8 { margin-top: 32px; }

  .flex { display: flex; }
  .flex-col { flex-direction: column; }
  .items-center { align-items: center; }
  .justify-between { justify-content: space-between; }
  .gap-4 { gap: 16px; }
  .gap-8 { gap: 32px; }

  /* Dark mode support */
  @media (prefers-color-scheme: dark) {
    .dashboard-container {
      background: #0f172a;
    }

    .dashboard-card,
    .stat-card,
    .quick-action-card {
      background: #1e293b;
      border-color: #334155;
      color: #f8fafc;
    }

    .stat-value,
    .card-title,
    .activity-title {
      color: #f8fafc;
    }

    .stat-title,
    .activity-description,
    .quick-action-description {
      color: #cbd5e1;
    }
  }


        .notification-bell:hover {
          background: #3498db;
          transform: scale(1.1);
        }

        .notification-badge {
          position: absolute;
          top: -5px;
          right: -5px;
          background: #e74c3c;
          color: white;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          font-size: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
        }

        .notification-dropdown {
          position: absolute;
          top: 60px;
          right: 0;
          width: 350px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 5px 25px rgba(0,0,0,0.15);
          overflow: hidden;
        }

        .notification-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 20px;
          border-bottom: 1px solid #eee;
          background: #f8f9fa;
        }

        .notification-header h4 {
          margin: 0;
          color: #2c3e50;
        }

        .notification-header button {
          background: none;
          border: none;
          color: #666;
          cursor: pointer;
          font-size: 16px;
        }

        .notification-list {
          max-height: 400px;
          overflow-y: auto;
        }

        .notification-item {
          display: flex;
          padding: 15px 20px;
          border-bottom: 1px solid #f0f0f0;
          transition: background 0.3s ease;
        }

        .notification-item:hover {
          background: #f8f9fa;
        }

        .notification-item.success {
          border-left: 4px solid #27ae60;
        }

        .notification-icon {
          margin-right: 15px;
          color: #27ae60;
          font-size: 18px;
        }

        .notification-content {
          flex: 1;
        }

        .notification-content h5 {
          margin: 0 0 5px 0;
          color: #2c3e50;
          font-size: 14px;
        }

        .notification-content p {
          margin: 0 0 5px 0;
          color: #666;
          font-size: 13px;
          line-height: 1.4;
        }

        .notification-time {
          font-size: 11px;
          color: #999;
        }

        .notification-close {
          background: none;
          border: none;
          color: #999;
          cursor: pointer;
          font-size: 12px;
          align-self: flex-start;
        }

        .notification-empty {
          text-align: center;
          padding: 30px 20px;
          color: #999;
        }

        .notification-empty i {
          font-size: 2rem;
          margin-bottom: 10px;
          opacity: 0.5;
        }

        .notification-footer {
          padding: 15px 20px;
          border-top: 1px solid #eee;
          text-align: center;
        }

        .notification-footer button {
          background: none;
          border: none;
          color: #3498db;
          cursor: pointer;
          font-size: 14px;
        }

        .notification-footer button:hover {
          text-decoration: underline;
        }

        /* Dashboard Tabs */
        .dashboard-tabs {
          display: flex;
          border-bottom: 1px solid #e9ecef;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .tab-button {
          padding: 12px 24px;
          background: none;
          border: none;
          border-bottom: 3px solid transparent;
          cursor: pointer;
          font-weight: 500;
          color: #6c757d;
          transition: all 0.3s ease;
          white-space: nowrap;
        }

        .tab-button:hover {
          color: #495057;
        }

        .tab-button.active {
          color: #3498db;
          border-bottom-color: #3498db;
        }

        /* Stats Cards Compact */
        .stats-cards.compact {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin-bottom: 30px;
        }

        .stats-cards.compact .stat-card {
          background: white;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.08);
          text-align: center;
          transition: all 0.3s ease;
          border-left: 4px solid #3498db;
        }

        .stats-cards.compact .stat-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 5px 20px rgba(0,0,0,0.15);
        }

        .stat-main {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .stats-cards.compact .stat-icon {
          font-size: 32px;
          color: #667eea;
        }

        .stats-cards.compact .stat-icon.outstanding {
          color: #ef4444;
        }

        .stat-info {
          text-align: center;
        }

        .stats-cards.compact .stat-value {
          font-size: 24px;
          margin-bottom: 4px;
          font-weight: bold;
          color: #2c3e50;
        }

        .stats-cards.compact .stat-label {
          font-size: 13px;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        /* Dashboard Grid Layout */
        .dashboard-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 24px;
        }

        @media (max-width: 1024px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
          }
        }

        /* Recent Activity */
        .recent-activity {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.08);
        }

        .recent-activity h3 {
          margin: 0 0 20px 0;
          color: #2c3e50;
          font-size: 1.3rem;
          font-weight: 600;
        }

        .activity-list {
          space-y: 16px;
        }

        .activity-item {
          display: flex;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid #f0f0f0;
        }

        .activity-item:last-child {
          border-bottom: none;
        }

        .activity-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 16px;
          background: #e3f2fd;
          color: #1976d2;
        }

        .activity-content {
          flex: 1;
        }

        .activity-title {
          font-weight: 500;
          color: #2c3e50;
          margin-bottom: 4px;
        }

        .activity-description {
          color: #666;
          font-size: 14px;
          margin-bottom: 4px;
        }

        .activity-date {
          color: #999;
          font-size: 12px;
        }

        .activity-amount {
          font-weight: 600;
          color: #27ae60;
        }

        /* Payment Due Card */
        .payment-due-card {
          background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
          color: white;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 24px;
        }

        .payment-due-card h3 {
          margin: 0 0 10px 0;
          font-size: 1.2rem;
        }  .payment-terms {
    font-size: 14px;
    opacity: 0.9;
    margin-bottom: 15px;
    text-align: center;
  }

        .payment-due-card .due-date {
          font-size: 1.5rem;
          font-weight: bold;
          margin-bottom: 15px;
        }

        .payment-due-card .amount {
          font-size: 1.8rem;
          font-weight: bold;
          margin-bottom: 15px;
        }

        /* Progress Section */
        .progress-section {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.08);
          margin-bottom: 24px;
        }

        .progress-section h3 {
          margin: 0 0 20px 0;
          color: #2c3e50;
          font-size: 1.3rem;
          font-weight: 600;
        }

        .progress-bar {
          background: #e9ecef;
          border-radius: 10px;
          height: 12px;
          margin-bottom: 8px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #3498db, #2ecc71);
          border-radius: 10px;
          transition: width 0.3s ease;
        }

        .progress-info {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          color: #666;
        }

        /* Support Card */
        .support-card {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.08);
          text-align: center;
        }

        .support-card h3 {
          margin: 0 0 15px 0;
          color: #2c3e50;
          font-size: 1.3rem;
          font-weight: 600;
        }

        .support-card p {
          color: #666;
          margin-bottom: 20px;
          line-height: 1.5;
        }

        .support-contact {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 15px;
        }

        .support-contact p {
          margin: 5px 0;
          color: #495057;
        }

        /* Payment Instructions Card Styles */
        .payment-instructions-card {
          background: white;
          border-radius: 12px;
          padding: 30px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.08);
          margin-top: 20px;
        }

        .payment-header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 1px solid #e9ecef;
          padding-bottom: 20px;
        }

        .payment-header h3 {
          color: #2c3e50;
          margin: 0 0 10px 0;
          font-size: 1.5rem;
          font-weight: 600;
        }

        .payment-header p {
          color: #666;
          margin: 0;
          font-size: 14px;
        }

        .payment-options {
          display: grid;
          gap: 20px;
          margin-bottom: 30px;
        }

        .payment-option {
          border: 1px solid #e9ecef;
          border-radius: 8px;
          padding: 20px;
          transition: all 0.3s ease;
        }

        .payment-option:hover {
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          transform: translateY(-2px);
        }

        .payment-option:nth-child(1) {
          border-left: 4px solid #2b6cb0;
          background: #f8f9fa;
        }

        .payment-option:nth-child(2) {
          border-left: 4px solid #38a169;
          background: #f0fff4;
        }
@media (max-width: 600px) {
  .payment-option {
    padding: 15px;
  }

  .payment-option h4 {
    font-size: 16px;
  }

  .account-detail strong,
  .account-detail span {
    font-size: 14px;
    word-break: break-word;
  }

  .account-copy {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
  }

  .copy-btn {
    font-size: 12px;
    padding: 5px 8px;
  }
}

        .option-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 15px;
        }

        .option-icon {
          font-size: 20px;
        }

        .option-header h4 {
          margin: 0;
          color: #2c3e50;
          font-size: 1.1rem;
          font-weight: 600;
        }

        .option-details {
          space-y: 12px;
        }

        .account-detail {
        color: #085ae7ff;
          display: flex;
          align-items: center;
          margin-bottom: 10px;
          gap: 10px;
        }

        .account-detail strong {
        
          min-width: 140px;
          color: #2c3e50;
        }

        .account-copy {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .copy-btn {
          background: #edf2f7;
          border: none;
          padding: 6px 12px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 12px;
          transition: all 0.3s ease;
          color: #4a5568;
        }

        .copy-btn:hover {
          background: #e2e8f0;
        }

        .payment-summary {
          background: #fffaf0;
          border: 1px solid #ed8936;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 25px;
        }

        .summary-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 15px;
        }

        .summary-icon {
          font-size: 16px;
        }

        .summary-header h4 {
          margin: 0;
          color: #744210;
          font-size: 1.1rem;
        }

        .summary-details {
          space-y: 10px;
        }

        .summary-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 5px 0;
        }

        .summary-item strong {
          color: #744210;
        }

        .summary-note {
          margin-top: 15px;
          padding: 12px;
          background: #feebc8;
          border-radius: 6px;
          font-size: 13px;
          color: #744210;
          font-style: italic;
        }

        .payment-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }

        .payment-action-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 20px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 500;
          transition: all 0.3s ease;
          text-align: center;
        }

        .payment-action-btn.primary {
          background: #3498db;
          color: white;
        }

        .payment-action-btn.primary:hover {
          background: #2980b9;
          transform: translateY(-2px);
        }

        .payment-action-btn.secondary {
          background: #e9ecef;
          color: #2c3e50;
          border: 1px solid #dee2e6;
        }

        .payment-action-btn.secondary:hover {
          background: #dee2e6;
          transform: translateY(-2px);
        }

        @media (max-width: 768px) {
          .payment-actions {
            grid-template-columns: 1fr;
          }
          
          .account-detail {
            flex-direction: column;
            align-items: flex-start;
            gap: 5px;
          }
          
          .account-detail strong {
            min-width: auto;
          }

          .dashboard-tabs {
            overflow-x: auto;
          }

          .tab-button {
            padding: 10px 16px;
            font-size: 14px;
          }
        }

        .dashboard-container {
          display: flex;
          min-height: 100vh;
          background: #f8f9fa;
        }

        /* Mobile Menu Button */
        .mobile-menu-btn {
          position: fixed;
          top: 15px;
          left: 15px;
          z-index: 1001;
          background: #2c3e50;
          color: white;
          border: none;
          border-radius: 8px;
          width: 45px;
          height: 45px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          cursor: pointer;
          box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        }

        /* Sidebar Overlay */
        .sidebar-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          z-index: 998;
        }

        /* Sidebar */
        .sidebar {
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
          color: white;
          transition: all 0.3s ease;
          z-index: 999;
          box-shadow: 2px 0 10px rgba(0,0,0,0.1);
          overflow-y: auto;
        }

        .sidebar.collapsed {
          width: 70px;
        }

        .sidebar.expanded {
          width: 250px;
        }

        @media (max-width: 768px) {
          .sidebar.collapsed {
            transform: translateX(-100%);
          }
          .sidebar.expanded {
            width: 280px;
            transform: translateX(0);
          }
        }

        .sidebar-header {
          padding: 20px 15px;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          text-align: center;
        }

        .sidebar-header h3 {
          margin: 0;
          font-size: 1.2rem;
          font-weight: 600;
        }

        .sidebar-menu {
          list-style: none;
          padding: 0;
          margin: 20px 0;
        }

        .sidebar-menu li {
          margin: 5px 10px;
        }

        .sidebar-menu a, .logout-btn {
          display: flex;
          align-items: center;
          padding: 12px 15px;
          color: rgba(255,255,255,0.8);
          text-decoration: none;
          border-radius: 8px;
          transition: all 0.3s ease;
          background: none;
          border: none;
          width: 100%;
          text-align: left;
          font-size: 14px;
          cursor: pointer;
        }

        .sidebar-menu a:hover, .logout-btn:hover {
          background: rgba(255,255,255,0.1);
          color: white;
          transform: translateX(5px);
        }

        .sidebar-menu a.active {
          background: rgba(255,255,255,0.15);
          color: white;
          border-left: 4px solid #e74c3c;
        }

        .sidebar-menu i {
          width: 20px;
          margin-right: 15px;
          font-size: 16px;
        }

        .sidebar.collapsed .sidebar-menu i {
          margin-right: 0;
        }

        .sidebar.collapsed .sidebar-menu span {
          display: none;
        }

        /* Main Content */
        .main-content {
          flex: 1;
          padding: 20px;
          margin-left: 70px;
          transition: all 0.3s ease;
          min-height: 100vh;
        }

        @media (max-width: 768px) {
          .main-content {
            margin-left: 0;
            padding: 70px 15px 20px;
          }
          .main-content.sidebar-open {
            transform: translateX(280px);
          }
        }

        /* Welcome Card - Compact */
        .welcome-card {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 25px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          text-align: center;
        }

        .welcome-card h2 {
          margin: 0 0 10px 0;
          font-size: 1.4rem;
          font-weight: 600;
        }

        .welcome-card p {
          margin: 0 0 15px 0;
          font-size: 0.9rem;
          opacity: 0.9;
          line-height: 1.4;
        }

        .apply-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,255,255,0.2);
          color: white;
          padding: 10px 20px;
          border-radius: 25px;
          text-decoration: none;
          font-weight: 500;
          transition: all 0.3s ease;
          border: 1px solid rgba(255,255,255,0.3);
        }

        .apply-btn:hover {
          background: rgba(255,255,255,0.3);
          transform: translateY(-2px);
        }

        /* Stats Cards - Responsive Grid */
        .stats-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }

        @media (max-width: 480px) {
          .stats-cards {
            grid-template-columns: 1fr;
          }
        }

        .stat-card {
          background: white;
          padding: 25px 20px;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.08);
          text-align: center;
          transition: all 0.3s ease;
          border-left: 4px solid #3498db;
        }

        .stat-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 5px 20px rgba(0,0,0,0.15);
        }

        .card-icon {
          font-size: 2rem;
          color: #3498db;
          margin-bottom: 15px;
        }

        .stat-card h3 {
          margin: 0 0 10px 0;
          font-size: 1rem;
          color: #2c3e50;
          font-weight: 600;
        }

        .stat-card p {
          margin: 0;
          font-size: 1.5rem;
          font-weight: bold;
          color: #2c3e50;
        }

        /* Loading State */
        .loading-state {
          text-align: center;
          padding: 40px;
          color: #666;
        }

        /* Empty State */
        .empty-state {
          text-align: center;
          padding: 40px;
          color: #666;
        }

        .empty-state i {
          font-size: 3rem;
          color: #bdc3c7;
          margin-bottom: 15px;
        }

        /* Quick Actions Styles */
        .quick-actions {
          margin-top: 2rem;
        }

        .quick-actions h3 {
          color: #2c3e50;
          margin-bottom: 1rem;
          font-size: 1.3rem;
          font-weight: 600;
        }

        .quick-actions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
        }

        .quick-action-card {
          background: white;
          padding: 15px;
          border-radius: 8px;
          text-decoration: none;
          color: #2c3e50;
          text-align: center;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
          transition: all 0.3s ease;
          border: 1px solid #e9ecef;
        }

        .quick-action-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 10px rgba(0,0,0,0.15);
          text-decoration: none;
          color: #2c3e50;
        }

        .quick-action-icon {
          font-size: 1.5rem;
          margin-bottom: 8px;
        }

        .quick-action-text {
          font-weight: 500;
        }

        .whatsapp-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 24px;
          background: #25D366;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          width: 100%;
          font-size: 14px;
        }

        .whatsapp-btn:hover {
          background: #128C7E;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(37, 211, 102, 0.3);
        }

        .notification-alert {
          margin-bottom: 20px;
        }
        
        .alert {
          padding: 12px 20px;
          border-radius: 8px;
          background: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
          display: flex;
          align-items: center;
        }
        
        .alert i {
          margin-right: 8px;
        }
        
        .alert-success {
          background: #d4edda;
          color: #155724;
          border-color: #c3e6cb;
        }
          .payment-summary {
    background: #fffaf0;
    border: 1px solid #ed8936;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 25px;
  }

  .summary-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 15px;
  }

  .summary-icon {
    font-size: 16px;
  }

  .summary-header h4 {
    margin: 0;
    color: #744210;
    font-size: 1.1rem;
    font-weight: 600;
  }

  .summary-details {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .summary-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid #fed7aa;
  }

  .summary-item:last-child {
    border-bottom: none;
  }

  .summary-item strong {
    color: #744210;
    min-width: 140px;
  }

  .summary-item span {
    color: #744210;
    font-weight: 500;
  }

  .summary-note {
    margin-top: 15px;
    padding: 12px;
    background: #feebc8;
    border-radius: 6px;
    font-size: 13px;
    color: #744210;
    font-style: italic;
    line-height: 1.4;
    border-left: 3px solid #ed8936;
  }

  .summary-note strong {
    color: #744210;
  }
      `}</style>
    </div>
  );
};

const DashboardHome = ({ dashboardData, loading, notifications, subscriptionStatus, user, activeTab, setActiveTab }) => {
  const progressPercentage = dashboardData.totalDeposited > 0 ? 
    Math.min(100, (dashboardData.totalDeposited / (dashboardData.totalDeposited + dashboardData.outstandingBalance)) * 100) : 0;

  // Format currency function
  const formatCurrency = (amount) => {
    return `₦${parseFloat(amount || 0).toLocaleString()}`;
  };

  // Safe date formatting function
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleDateString();
  };

  // Safe date formatting with time
  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Copy account number function
  const copyAccountNumber = (accountNumber, buttonId) => {
    navigator.clipboard.writeText(accountNumber).then(() => {
      const button = document.getElementById(buttonId);
      const originalText = button.innerHTML;
      button.innerHTML = '✅ Copied!';
      button.style.background = '#c6f6d5';
      button.style.color = '#22543d';
      
      setTimeout(() => {
        button.innerHTML = originalText;
        button.style.background = '#edf2f7';
        button.style.color = '';
      }, 2000);
    });
  };

  // Add copy functionality after component mounts
  React.useEffect(() => {
    // Add event listeners for copy buttons
    const copy1 = document.getElementById('copy1');
    const copy2 = document.getElementById('copy2');
    
    if (copy1) {
      copy1.onclick = () => copyAccountNumber('4957926955', 'copy1');
    }
    if (copy2) {
      copy2.onclick = () => copyAccountNumber('0069055648', 'copy2');
    }
  }, [activeTab]);

  return (
    <div>
      {/* Show notification alert if there are notifications */}
      {notifications && notifications.length > 0 && (
        <div className="notification-alert">
          <div className="alert alert-info">
            <i className="fas fa-bell alert-icon"></i>
            <div className="alert-content">
              <div className="alert-title">New Notifications</div>
              <div className="alert-description">
                You have {notifications.length} new notification(s) requiring your attention
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Conditional Welcome Note - Only show if plotCount is 0 and not approved */}
      {dashboardData.plotCount === 0 && subscriptionStatus !== 'approved' && (
        <div className="welcome-card">
          <h2>Welcome to Your Dashboard 🎉</h2>
          <p>
            Get started by applying for your first plot. Manage everything in one place.
          </p>
          <Link to="/dashboard/subscribe" className="apply-btn">
            <i className="fas fa-file-signature"></i> Apply for Plot
          </Link>
        </div>
      )}

      {/* Dashboard Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Welcome back, {user?.name || 'User'}! 👋</h1>
          <p className="dashboard-subtitle">
            Here's what's happening with your plots and payments today
          </p>
        </div>
        
        {/* Dashboard Tabs */}
        <div className="dashboard-tabs">
          <button 
            className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <i className="fas fa-chart-pie"></i> Overview
          </button>
          <button 
            className={`tab-button ${activeTab === 'activity' ? 'active' : ''}`}
            onClick={() => setActiveTab('activity')}
          >
            <i className="fas fa-history"></i> Activity
          </button>
          <button 
            className={`tab-button ${activeTab === 'progress' ? 'active' : ''}`}
            onClick={() => setActiveTab('progress')}
          >
            <i className="fas fa-tasks"></i> Progress
          </button>
          <button 
            className={`tab-button ${activeTab === 'payments' ? 'active' : ''}`}
            onClick={() => setActiveTab('payments')}
          >
            <i className="fas fa-credit-card"></i> Payments
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="loading-shimmer" style={{ height: '200px', borderRadius: '16px' }}></div>
          <div className="loading-shimmer" style={{ height: '100px', borderRadius: '16px', marginTop: '20px' }}></div>
        </div>
      ) : (
        <>
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="dashboard-grid">
              <div>
                {/* Stats Overview */}
                <div className="stats-overview">
                  <div className="stat-card primary">
                    <div className="stat-content">
                      <div className="stat-info">
                        <div className="stat-value">{dashboardData.plotCount}</div>
                        <div className="stat-title">Total Plots</div>
                        <div className="stat-trend positive">
                          <i className="fas fa-arrow-up"></i>
                          Active
                        </div>
                      </div>
                      <div className="stat-icon">
                        <i className="fas fa-map-marked"></i>
                      </div>
                    </div>
                  </div>
                  
                  <div className="stat-card success">
                    <div className="stat-content">
                      <div className="stat-info">
                        <div className="stat-value">{dashboardData.transactionCount}</div>
                        <div className="stat-title">Transactions</div>
                        <div className="stat-trend positive">
                          <i className="fas fa-check"></i>
                          Completed
                        </div>
                      </div>
                      <div className="stat-icon">
                        <i className="fas fa-credit-card"></i>
                      </div>
                    </div>
                  </div>
                  
                  <div className="stat-card info">
                    <div className="stat-content">
                      <div className="stat-info">
                        <div className="stat-value">
                          {formatCurrency(dashboardData.totalDeposited)}
                        </div>
                        <div className="stat-title">Total Deposited</div>
                        <div className="stat-trend positive">
                          <i className="fas fa-arrow-up"></i>
                          Paid
                        </div>
                      </div>
                      <div className="stat-icon">
                        <i className="fas fa-money-bill-wave"></i>
                      </div>
                    </div>
                  </div>
                  
                  <div className="stat-card warning">
                    <div className="stat-content">
                      <div className="stat-info">
                        <div className="stat-value">
                          {formatCurrency(dashboardData.outstandingBalance)}
                        </div>
                        <div className="stat-title">Outstanding Balance</div>
                        <div className="stat-trend negative">
                          <i className="fas fa-exclamation"></i>
                          Pending
                        </div>
                      </div>
                      <div className="stat-icon">
                        <i className="fas fa-exclamation-triangle"></i>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Due Alert */}
                {dashboardData.nextPaymentDue && (
                  <div className="payment-summary-card">
                    <div className="payment-summary-header">
                      <div className="payment-summary-title">Next Payment Due</div>
                      <div className="payment-due-badge">Due Soon</div>
                    </div>
                    <div className="payment-amount">
                      {/* Calculate based on actual payment terms */}
                      {dashboardData.paymentTerms === "3 Months" 
                        ? formatCurrency(dashboardData.outstandingBalance / 3)
                        : dashboardData.paymentTerms === "12 Months"
                        ? formatCurrency(dashboardData.outstandingBalance / 12)
                        : dashboardData.paymentTerms === "18 Months"
                        ? formatCurrency(dashboardData.outstandingBalance / 18)
                        : dashboardData.paymentTerms === "24 Months"
                        ? formatCurrency(dashboardData.outstandingBalance / 24)
                        : dashboardData.paymentTerms === "30 Months"
                        ? formatCurrency(dashboardData.outstandingBalance / 30)
                        : formatCurrency(dashboardData.outstandingBalance / 18) // Default fallback
                      }
                    </div>
                    <div className="payment-due-date">
                      Due on {formatDate(dashboardData.nextPaymentDue)} • {dashboardData.paymentTerms || "12 Months"} Plan
                    </div>
                    <Link to="/dashboard/payments">
                      <button className="pay-now-btn">
                        <i className="fas fa-credit-card"></i> Make Payment Now
                      </button>
                    </Link>
                  </div>
                )}

                {/* Quick Actions Section for users with plots */}
                {dashboardData.plotCount > 0 && (
                  <div className="dashboard-card">
                    <div className="card-header">
                      <div className="card-title">Quick Actions</div>
                    </div>
                    <div className="quick-actions-grid">
                      <Link 
                        to="/dashboard/payments" 
                        className="quick-action-card"
                      >
                        <div className="quick-action-icon">
                          <i className="fas fa-credit-card"></i>
                        </div>
                        <div className="quick-action-title">Make Payment</div>
                        <div className="quick-action-description">Submit payment for your plots</div>
                      </Link>
                      
                      <Link 
                        to="/dashboard/plots" 
                        className="quick-action-card"
                      >
                        <div className="quick-action-icon">
                          <i className="fas fa-map-marked"></i>
                        </div>
                        <div className="quick-action-title">View Plots</div>
                        <div className="quick-action-description">Check your plot details</div>
                      </Link>

                      <Link 
                        to="/dashboard/documents" 
                        className="quick-action-card"
                      >
                        <div className="quick-action-icon">
                          <i className="fas fa-file-invoice"></i>
                        </div>
                        <div className="quick-action-title">Payment History</div>
                        <div className="quick-action-description">View transaction records</div>
                      </Link>

                      <Link 
                        to="/dashboard/profile" 
                        className="quick-action-card"
                      >
                        <div className="quick-action-icon">
                          <i className="fas fa-user-cog"></i>
                        </div>
                        <div className="quick-action-title">Update Profile</div>
                        <div className="quick-action-description">Manage your account</div>
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar Content */}
              <div>
                {/* Recent Activity */}
                <div className="dashboard-card">
                  <div className="card-header">
                    <div className="card-title">Recent Activity</div>
                    <div className="card-actions">
                      <button className="card-action-btn">View All</button>
                    </div>
                  </div>
                  <div className="activity-list">
                    {dashboardData.recentActivity.length > 0 ? (
                      dashboardData.recentActivity.map(activity => (
                        <div key={activity.id} className="activity-item">
                          <div className={`activity-icon ${activity.type === 'initial_payment' ? 'payment' : 'subscription'}`}>
                            <i className={`fas fa-${activity.type === 'initial_payment' ? 'home' : 'credit-card'}`}></i>
                          </div>
                          <div className="activity-content">
                            <div className="activity-title">{activity.description}</div>
                            <div className="activity-description">
                              {activity.type === 'initial_payment' ? 'Initial plot allocation payment' : 'Monthly installment payment'}
                            </div>
                            <div className="activity-meta">
                              <span className="activity-amount">{formatCurrency(activity.amount)}</span>
                              <span>{formatDate(activity.date)}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="empty-state">
                        <i className="fas fa-history empty-state-icon"></i>
                        <div className="empty-state-title">No Recent Activity</div>
                        <div className="empty-state-description">
                          Your activity will appear here once you start making payments
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Support Card */}
                <div className="dashboard-card">
                  <div className="card-header">
                    <div className="card-title">Need Help?</div>
                  </div>
                  <div style={{ padding: '20px 0' }}>
                    <p style={{ color: '#64748b', marginBottom: '20px', fontSize: '14px', lineHeight: '1.5' }}>
                      Our support team is here to help you with any questions about your plots or payments.
                    </p>
                    
                    <div className="support-contact">
                      <p style={{ margin: '0 0 8px 0', fontWeight: '600', color: '#1e293b' }}>MUSABAHA HOMES LTD.</p>
                      <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: '#475569', lineHeight: '1.4' }}>
                        No. 015, City Plaza Along Ring Road Western Bypass Along Yankaba Road, Kano State.
                      </p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', color: '#475569' }}>
                        <div><i className="fas fa-phone" style={{ marginRight: '8px' }}></i> +2349084220705, +2349039108863, +2347038192719</div>
                        <div><i className="fas fa-envelope" style={{ marginRight: '8px' }}></i> musababahomesth@gmail.com</div>
                        <div><i className="fas fa-clock" style={{ marginRight: '8px' }}></i> Mon - Fri: 9AM - 5PM</div>
                      </div>
                    </div>
                    
                    <button 
                      className="whatsapp-btn"
                      onClick={() => window.open('https://wa.me/2347038192719?text=Hello%20Musabaha%20Homes%20LTD,%20I%20need%20assistance%20with%20my%20plot%20application/payment.', '_blank')}
                      style={{ marginTop: '16px' }}
                    >
                      <i className="fab fa-whatsapp"></i> Contact Support via WhatsApp
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Activity Tab */}
          {activeTab === 'activity' && (
            <div className="dashboard-card">
              <div className="card-header">
                <div className="card-title">All Activity</div>
                <div className="card-actions">
                  <button className="card-action-btn">Export</button>
                  <button className="card-action-btn">Filter</button>
                </div>
              </div>
              <div className="activity-list">
                {dashboardData.recentActivity.length > 0 ? (
                  dashboardData.recentActivity.map(activity => (
                    <div key={activity.id} className="activity-item">
                      <div className={`activity-icon ${activity.type === 'initial_payment' ? 'payment' : 'subscription'}`}>
                        <i className={`fas fa-${activity.type === 'initial_payment' ? 'home' : 'credit-card'}`}></i>
                      </div>
                      <div className="activity-content">
                        <div className="activity-title">{activity.description}</div>
                        <div className="activity-description">
                          {activity.type === 'initial_payment' ? 'Initial plot allocation payment' : 'Monthly installment payment'}
                        </div>
                        <div className="activity-meta">
                          <span className="activity-amount">{formatCurrency(activity.amount)}</span>
                          <span>{formatDateTime(activity.date)}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-state">
                    <i className="fas fa-history empty-state-icon"></i>
                    <div className="empty-state-title">No Activity Records</div>
                    <div className="empty-state-description">
                      Your activity will appear here once you start making payments
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Progress Tab */}
          {activeTab === 'progress' && (
            <div className="dashboard-card">
              <div className="card-header">
                <div className="card-title">Payment Progress</div>
              </div>
              
              <div className="progress-section">
                <div className="progress-header">
                  <div className="progress-title">Overall Payment Completion</div>
                  <div className="progress-percentage">{progressPercentage.toFixed(1)}%</div>
                </div>
                
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                
                <div className="progress-labels">
                  <span>Paid: {formatCurrency(dashboardData.totalDeposited)}</span>
                  <span>Total: {formatCurrency(dashboardData.totalDeposited + dashboardData.outstandingBalance)}</span>
                </div>
              </div>

              <div style={{ marginTop: '32px' }}>
                <div className="card-header">
                  <div className="card-title">Payment Breakdown</div>
                </div>
                <div className="stats-overview" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                  <div className="stat-card">
                    <div className="stat-content">
                      <div className="stat-info">
                        <div className="stat-value">{dashboardData.transactionCount}</div>
                        <div className="stat-title">Payments Made</div>
                      </div>
                      <div className="stat-icon">
                        <i className="fas fa-check-circle" style={{ color: '#10b981' }}></i>
                      </div>
                    </div>
                  </div>
                  
                  <div className="stat-card">
                    <div className="stat-content">
                      <div className="stat-info">
                        <div className="stat-value">
                          {dashboardData.nextPaymentDue ? 
                            formatDate(dashboardData.nextPaymentDue) : 'N/A'
                          }
                        </div>
                        <div className="stat-title">Next Due Date</div>
                      </div>
                      <div className="stat-icon">
                        <i className="fas fa-calendar" style={{ color: '#3b82f6' }}></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {dashboardData.outstandingBalance > 0 && (
                <div className="alert alert-warning" style={{ marginTop: '24px' }}>
                  <i className="fas fa-exclamation-triangle alert-icon"></i>
                  <div className="alert-content">
                    <div className="alert-title">Payment Reminder</div>
                    <div className="alert-description">
                      You have an outstanding balance of {formatCurrency(dashboardData.outstandingBalance)}. 
                      Please make your payment before the due date to avoid penalties.
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Payment Info Tab */}
          {activeTab === 'payments' && (
            <div className="dashboard-card">
              <div className="card-header">
                <div className="card-title">Payment Instructions</div>
              </div>
              
              <div style={{ padding: '24px 0' }}>
                <p style={{ color: '#64748b', marginBottom: '24px', fontSize: '14px', textAlign: 'center' }}>
                  Use the account details below to make payments for your plots
                </p>

                <div className="payment-options">
                  {/* Option 1 */}
                  <div className="payment-option">
                    <div className="option-header">
                      <span className="option-icon">🏦</span>
                      <h4>Option 1: Moniepoint MFB</h4>
                    </div>
                    <div className="option-details">
                      <div className="account-detail">
                        <strong>Account Number:</strong>
                        <div className="account-copy">
                          <span id="acct1">4957926955</span>
                          <button 
                            id="copy1" 
                            className="copy-btn"
                            onClick={() => copyAccountNumber('4957926955', 'copy1')}
                          >
                            📋 Copy
                          </button>
                        </div>
                      </div>
                      <div className="account-detail">
                        <strong>Account Name:</strong>
                        <span>Musabaha Homes and Related Services</span>
                      </div>
                    </div>
                  </div>

                  {/* Option 2 */}
                  <div className="payment-option">
                    <div className="option-header">
                      <span className="option-icon">💳</span>
                      <h4>Option 2: Stanbic IBTC Bank</h4>
                    </div>
                    <div className="option-details">
                      <div className="account-detail">
                        <strong>Account Number:</strong>
                        <div className="account-copy">
                          <span id="acct2">0069055648</span>
                          <button 
                            id="copy2" 
                            className="copy-btn"
                            onClick={() => copyAccountNumber('0069055648', 'copy2')}
                          >
                            📋 Copy
                          </button>
                        </div>
                      </div>
                      <div className="account-detail">
                        <strong>Account Name:</strong>
                        <span>Musabaha Homes and Related Services</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Summary */}
                <div className="payment-summary">
                  <div className="summary-header">
                    <span className="summary-icon">💰</span>
                    <h4>Payment Summary</h4>
                  </div>
                  <div className="summary-details">
                    <div className="summary-item">
                      <strong>Initial Deposit:</strong> 
                      <span>₦500,000 per plot</span>
                    </div>
                    <div className="summary-item">
                      <strong>Payment Methods:</strong>
                      <span>Bank Transfer to either account</span>
                    </div>
                    <div className="summary-note">
                      <strong>Note:</strong> After making payment, please upload your payment receipt in the Payments section for verification.
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="payment-actions">
                  <Link to="/dashboard/payments" className="payment-action-btn primary">
                    <i className="fas fa-upload"></i> Upload Payment Receipt
                  </Link>
                  <Link to="/dashboard/documents" className="payment-action-btn secondary">
                    <i className="fas fa-history"></i> View Payment History
                  </Link>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UserDashboard;