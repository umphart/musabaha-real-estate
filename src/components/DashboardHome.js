import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

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
  useEffect(() => {
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

export default DashboardHome;