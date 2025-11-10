import React, { useState, useEffect } from "react";
import { 
  FiUser, FiMail, FiPhone, FiCalendar, FiMapPin, 
  FiDollarSign, FiFileText, FiHome, FiCreditCard,
  FiCheckCircle, FiClock, FiTrendingUp, FiAward,
  FiDatabase, FiEdit, FiDownload, FiEye, FiPercent,
  FiBarChart2, FiPieChart
} from "react-icons/fi";

const UserProfile = ({ user, users = [], approveUser, setSelectedUser, setModalType }) => {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("usersTable");

  const styles = {
    profileContainer: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "20px",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      minHeight: "100vh",
    },
    header: {
      background: "rgba(255, 255, 255, 0.95)",
      backdropFilter: "blur(10px)",
      borderRadius: "20px",
      padding: "30px",
      marginBottom: "25px",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
      border: "1px solid rgba(255, 255, 255, 0.2)",
    },
    userHeader: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: "20px",
    },
    userAvatar: {
      width: "80px",
      height: "80px",
      borderRadius: "50%",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      fontSize: "32px",
      fontWeight: "bold",
      boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
    },
    userInfo: {
      flex: 1,
      marginLeft: "20px",
    },
    userName: {
      fontSize: "28px",
      fontWeight: "700",
      color: "#2d3748",
      marginBottom: "5px",
    },
    userEmail: {
      fontSize: "16px",
      color: "#718096",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    statsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "15px",
      marginTop: "20px",
    },
    statCard: {
      background: "rgba(255, 255, 255, 0.8)",
      padding: "20px",
      borderRadius: "15px",
      textAlign: "center",
      boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
      border: "1px solid rgba(255, 255, 255, 0.3)",
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
    },
    statCardHover: {
      transform: "translateY(-5px)",
      boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
    },
    statIcon: {
      fontSize: "24px",
      marginBottom: "10px",
      color: "#667eea",
    },
    statValue: {
      fontSize: "24px",
      fontWeight: "700",
      color: "#2d3748",
      marginBottom: "5px",
    },
    statLabel: {
      fontSize: "14px",
      color: "#718096",
      fontWeight: "500",
    },
    tabContainer: {
      display: "flex",
      marginBottom: "25px",
      gap: "10px",
      background: "rgba(255, 255, 255, 0.9)",
      padding: "10px",
      borderRadius: "15px",
      boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
    },
    tab: {
      flex: 1,
      padding: "15px 20px",
      borderRadius: "12px",
      cursor: "pointer",
      textAlign: "center",
      fontWeight: "600",
      fontSize: "14px",
      transition: "all 0.3s ease",
      background: "transparent",
      color: "#718096",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
    },
    activeTab: {
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "white",
      boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
    },
    section: {
      background: "rgba(255, 255, 255, 0.95)",
      borderRadius: "20px",
      marginBottom: "25px",
      overflow: "hidden",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
      border: "1px solid rgba(255, 255, 255, 0.2)",
    },
    sectionHeader: {
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "white",
      padding: "20px 25px",
      fontSize: "18px",
      fontWeight: "700",
      display: "flex",
      alignItems: "center",
      gap: "12px",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
      gap: "0",
    },
    infoCard: {
      padding: "20px 25px",
      borderBottom: "1px solid #e2e8f0",
      borderRight: "1px solid #e2e8f0",
      transition: "background-color 0.2s ease",
    },
    infoCardHover: {
      backgroundColor: "#f7fafc",
    },
    infoLabel: {
      fontSize: "12px",
      fontWeight: "600",
      color: "#718096",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      marginBottom: "8px",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    infoValue: {
      fontSize: "16px",
      fontWeight: "600",
      color: "#2d3748",
      lineHeight: "1.4",
    },
    statusBadge: {
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      padding: "6px 12px",
      borderRadius: "20px",
      fontSize: "12px",
      fontWeight: "600",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },
    statusActive: {
      background: "#c6f6d5",
      color: "#276749",
    },
    statusCompleted: {
      background: "#bee3f8",
      color: "#2c5aa0",
    },
    statusPending: {
      background: "#fed7d7",
      color: "#c53030",
    },
    statusApproved: {
      background: "#c6f6d5",
      color: "#276749",
    },
    progressBar: {
      width: "100%",
      height: "8px",
      backgroundColor: "#e2e8f0",
      borderRadius: "10px",
      overflow: "hidden",
      marginTop: "8px",
    },
    progressFill: {
      height: "100%",
      background: "linear-gradient(90deg, #48bb78, #68d391)",
      borderRadius: "10px",
      transition: "width 0.5s ease",
    },
    loadingContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "400px",
      flexDirection: "column",
      gap: "20px",
    },
    spinner: {
      width: "50px",
      height: "50px",
      border: "4px solid #e2e8f0",
      borderTop: "4px solid #667eea",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
    },
    emptyState: {
      textAlign: "center",
      padding: "60px 40px",
      background: "rgba(255, 255, 255, 0.95)",
      borderRadius: "20px",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
    },
    emptyIcon: {
      fontSize: "64px",
      color: "#667eea",
      marginBottom: "20px",
    },
    actionButton: {
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "white",
      border: "none",
      padding: "12px 24px",
      borderRadius: "12px",
      fontWeight: "600",
      fontSize: "14px",
      cursor: "pointer",
      transition: "all 0.3s ease",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
    },
    actionButtonHover: {
      transform: "translateY(-2px)",
      boxShadow: "0 6px 20px rgba(102, 126, 234, 0.6)",
    },
    // New styles for financial section
    financialGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
      gap: "0",
    },
    financialCard: {
      padding: "25px",
      borderBottom: "1px solid #e2e8f0",
      borderRight: "1px solid #e2e8f0",
      transition: "background-color 0.2s ease",
      display: "flex",
      flexDirection: "column",
    },
    financialValue: {
      fontSize: "20px",
      fontWeight: "700",
      color: "#2d3748",
      marginBottom: "8px",
    },
    financialLabel: {
      fontSize: "12px",
      fontWeight: "600",
      color: "#718096",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      marginBottom: "12px",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    progressSection: {
      gridColumn: "1 / -1",
      padding: "25px",
      borderBottom: "1px solid #e2e8f0",
    },
    progressHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "15px",
    },
    progressStats: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "20px",
      marginTop: "20px",
    },
    progressStat: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "15px",
      background: "rgba(255, 255, 255, 0.6)",
      borderRadius: "12px",
      border: "1px solid rgba(255, 255, 255, 0.3)",
    },
    progressStatValue: {
      fontSize: "18px",
      fontWeight: "700",
      color: "#2d3748",
      marginBottom: "5px",
    },
    progressStatLabel: {
      fontSize: "12px",
      color: "#718096",
      fontWeight: "500",
    },
  };

  // Get active data - MOVED TO TOP
  const getActiveData = () => {
    return userData.find(item => item.source === activeTab);
  };

  // Add CSS animation
  useEffect(() => {
    const styleSheet = document.styleSheets[0];
    styleSheet.insertRule(`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `, styleSheet.cssRules.length);
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `https://musabaha-homes.onrender.com/api/subscriptions?email=${user.email}`
        );
        const result = await response.json();
        
        if (result.success && result.data && result.data.length > 0) {
          setUserData(result.data);
          const hasUsersTable = result.data.some(item => item.source === 'usersTable');
          setActiveTab(hasUsersTable ? 'usersTable' : result.data[0].source);
        } else {
          setError("No user data found");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Error loading user data");
      } finally {
        setLoading(false);
      }
    };

    if (user?.email) {
      fetchUserData();
    }
  }, [user]);

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount) return "₦0.00";
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(parseFloat(amount));
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get user initials for avatar
  const getUserInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U';
  };

  // Calculate payment progress based on total_money_to_pay and total_balance
  const calculatePaymentProgress = (data) => {
    if (!data.total_money_to_pay || data.total_money_to_pay === 0) return 0;
    if (!data.total_balance && data.total_balance !== 0) return 0;
    
    const totalToPay = parseFloat(data.total_money_to_pay);
    const totalBalance = parseFloat(data.total_balance);
    
    // Calculate paid amount: total_money_to_pay - total_balance
    const paidAmount = totalToPay - totalBalance;
    
    return Math.min(Math.round((paidAmount / totalToPay) * 100), 100);
  };

  // Calculate paid amount
  const calculatePaidAmount = (data) => {
    if (!data.total_money_to_pay || !data.total_balance) return 0;
    const totalToPay = parseFloat(data.total_money_to_pay);
    const totalBalance = parseFloat(data.total_balance);
    return Math.max(totalToPay - totalBalance, 0);
  };

  // Get progress color based on percentage
  const getProgressColor = (progress) => {
    if (progress >= 80) return 'linear-gradient(90deg, #48bb78, #68d391)';
    if (progress >= 50) return 'linear-gradient(90deg, #4299e1, #63b3ed)';
    if (progress >= 25) return 'linear-gradient(90deg, #ed8936, #f6ad55)';
    return 'linear-gradient(90deg, #f56565, #fc8181)';
  };

  // Render usersTable data
  const renderUsersTableData = (data) => {
    const progress = calculatePaymentProgress(data);
    const paidAmount = calculatePaidAmount(data);
    const totalToPay = parseFloat(data.total_money_to_pay || 0);
    const remainingBalance = parseFloat(data.total_balance || 0);
    
    return (
      <>
        {/* Stats Overview */}
        <div style={styles.statsGrid}>
          <div 
            style={styles.statCard}
            onMouseEnter={(e) => e.currentTarget.style.transform = styles.statCardHover.transform}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}
          >
            <FiDollarSign style={styles.statIcon} />
            <div style={styles.statValue}>{formatCurrency(data.total_money_to_pay)}</div>
            <div style={styles.statLabel}>Total Investment</div>
          </div>
          
          <div 
            style={styles.statCard}
            onMouseEnter={(e) => e.currentTarget.style.transform = styles.statCardHover.transform}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}
          >
            <FiCreditCard style={styles.statIcon} />
            <div style={styles.statValue}>{formatCurrency(paidAmount)}</div>
            <div style={styles.statLabel}>Amount Paid</div>
          </div>
          
          <div 
            style={styles.statCard}
            onMouseEnter={(e) => e.currentTarget.style.transform = styles.statCardHover.transform}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}
          >
            <FiBarChart2 style={styles.statIcon} />
            <div style={styles.statValue}>{progress}%</div>
            <div style={styles.statLabel}>Payment Progress</div>
          </div>
          
          <div 
            style={styles.statCard}
            onMouseEnter={(e) => e.currentTarget.style.transform = styles.statCardHover.transform}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}
          >
            <FiAward style={styles.statIcon} />
            <div style={styles.statValue}>
              <span style={{
                ...styles.statusBadge,
                ...(data.status === 'Active' ? styles.statusActive : 
                    data.status === 'Completed' ? styles.statusCompleted : styles.statusPending)
              }}>
                {data.status === 'Active' ? <FiCheckCircle /> : <FiClock />}
                {data.status}
              </span>
            </div>
            <div style={styles.statLabel}>Account Status</div>
          </div>
        </div>

        {/* Personal Information */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <FiUser />
            Personal Information
          </div>
          <div style={styles.grid}>
            <div style={styles.infoCard}>
              <div style={styles.infoLabel}><FiUser /> Full Name</div>
              <div style={styles.infoValue}>{data.name}</div>
            </div>
            <div style={styles.infoCard}>
              <div style={styles.infoLabel}><FiMail /> Email Address</div>
              <div style={styles.infoValue}>{data.email}</div>
            </div>
            <div style={styles.infoCard}>
              <div style={styles.infoLabel}><FiPhone /> Contact Number</div>
              <div style={styles.infoValue}>{data.contact}</div>
            </div>
            <div style={styles.infoCard}>
              <div style={styles.infoLabel}><FiDatabase /> User ID</div>
              <div style={styles.infoValue}>{data.user_id}</div>
            </div>
          </div>
        </div>

        {/* Plot Information */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <FiHome />
            Plot Information
          </div>
          <div style={styles.grid}>
            <div style={styles.infoCard}>
              <div style={styles.infoLabel}><FiMapPin /> Plots Assigned</div>
              <div style={styles.infoValue}>{data.plot_taken}</div>
            </div>
            <div style={styles.infoCard}>
              <div style={styles.infoLabel}><FiCalendar /> Date Taken</div>
              <div style={styles.infoValue}>{formatDate(data.date_taken)}</div>
            </div>
            <div style={styles.infoCard}>
              <div style={styles.infoLabel}><FiHome /> Number of Plots</div>
              <div style={styles.infoValue}>{data.plot_number}</div>
            </div>
            <div style={styles.infoCard}>
              <div style={styles.infoLabel}><FiCreditCard /> Payment Schedule</div>
              <div style={styles.infoValue}>{data.payment_schedule}</div>
            </div>
          </div>
        </div>

        {/* Updated Financial Details Section */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <FiDollarSign />
            Financial Overview
          </div>
          
          {/* Financial Summary Cards */}
          <div style={styles.financialGrid}>
            <div style={styles.financialCard}>
              <div style={styles.financialLabel}>
                <FiDollarSign />
                Total Amount to Pay
              </div>
              <div style={styles.financialValue}>
                {formatCurrency(data.total_money_to_pay)}
              </div>
              <div style={{fontSize: '12px', color: '#718096'}}>
                Complete payment required
              </div>
            </div>
            
            <div style={styles.financialCard}>
              <div style={styles.financialLabel}>
                <FiCreditCard />
                Amount Paid
              </div>
              <div style={{...styles.financialValue, color: '#48bb78'}}>
                {formatCurrency(paidAmount)}
              </div>
              <div style={{fontSize: '12px', color: '#718096'}}>
                {progress}% of total amount
              </div>
            </div>
            
            <div style={styles.financialCard}>
              <div style={styles.financialLabel}>
                <FiBarChart2 />
                Remaining Balance
              </div>
              <div style={{...styles.financialValue, color: remainingBalance > 0 ? '#f56565' : '#48bb78'}}>
                {formatCurrency(remainingBalance)}
              </div>
              <div style={{fontSize: '12px', color: '#718096'}}>
                {remainingBalance > 0 ? 'Balance due' : 'Fully paid'}
              </div>
            </div>
            
            <div style={styles.financialCard}>
              <div style={styles.financialLabel}>
                <FiPieChart />
                Initial Deposit
              </div>
              <div style={styles.financialValue}>
                {formatCurrency(data.initial_deposit)}
              </div>
              <div style={{fontSize: '12px', color: '#718096'}}>
                Initial payment made
              </div>
            </div>
          </div>

          {/* Payment Progress Section */}
          <div style={styles.progressSection}>
            <div style={styles.progressHeader}>
              <div style={styles.infoLabel}>
                <FiTrendingUp />
                Payment Progress ({progress}%)
              </div>
              <div style={{fontSize: '14px', fontWeight: '600', color: '#2d3748'}}>
                {formatCurrency(paidAmount)} of {formatCurrency(totalToPay)}
              </div>
            </div>
            
            <div style={styles.progressBar}>
              <div 
                style={{
                  ...styles.progressFill,
                  width: `${progress}%`,
                  background: getProgressColor(progress)
                }}
              ></div>
            </div>

            {/* Progress Statistics */}
            <div style={styles.progressStats}>
              <div style={styles.progressStat}>
                <div style={styles.progressStatValue}>{formatCurrency(totalToPay)}</div>
                <div style={styles.progressStatLabel}>Total Amount</div>
              </div>
              <div style={styles.progressStat}>
                <div style={{...styles.progressStatValue, color: '#48bb78'}}>
                  {formatCurrency(paidAmount)}
                </div>
                <div style={styles.progressStatLabel}>Paid Amount</div>
              </div>
              <div style={styles.progressStat}>
                <div style={{...styles.progressStatValue, color: remainingBalance > 0 ? '#f56565' : '#48bb78'}}>
                  {formatCurrency(remainingBalance)}
                </div>
                <div style={styles.progressStatLabel}>Remaining Balance</div>
              </div>
              <div style={styles.progressStat}>
                <div style={styles.progressStatValue}>{progress}%</div>
                <div style={styles.progressStatLabel}>Completion</div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  // Render subscription data
  const renderSubscriptionData = (data) => {
    return (
      <>
        {/* Application Overview */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <FiFileText style={styles.statIcon} />
            <div style={styles.statValue}>{data.layout_name}</div>
            <div style={styles.statLabel}>Layout Name</div>
          </div>
          
          <div style={styles.statCard}>
            <FiHome style={styles.statIcon} />
            <div style={styles.statValue}>{data.number_of_plots}</div>
            <div style={styles.statLabel}>Plots Requested</div>
          </div>
          
          <div style={styles.statCard}>
            <FiDollarSign style={styles.statIcon} />
            <div style={styles.statValue}>{formatCurrency(data.price)}</div>
            <div style={styles.statLabel}>Total Price</div>
          </div>
          
          <div style={styles.statCard}>
            <FiAward style={styles.statIcon} />
            <div style={styles.statValue}>
              <span style={{
                ...styles.statusBadge,
                ...(data.status === 'approved' ? styles.statusApproved : 
                    data.status === 'pending' ? styles.statusPending : styles.statusActive)
              }}>
                {data.status === 'approved' ? <FiCheckCircle /> : <FiClock />}
                {data.status}
              </span>
            </div>
            <div style={styles.statLabel}>Application Status</div>
          </div>
        </div>

        {/* Personal Information */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <FiUser />
            Applicant Information
          </div>
          <div style={styles.grid}>
            <div style={styles.infoCard}>
              <div style={styles.infoLabel}><FiUser /> Full Name</div>
              <div style={styles.infoValue}>{data.name}</div>
            </div>
            <div style={styles.infoCard}>
              <div style={styles.infoLabel}><FiMail /> Email</div>
              <div style={styles.infoValue}>{data.email}</div>
            </div>
            <div style={styles.infoCard}>
              <div style={styles.infoLabel}><FiPhone /> Phone</div>
              <div style={styles.infoValue}>{data.phone_number}</div>
            </div>
            <div style={styles.infoCard}>
              <div style={styles.infoLabel}><FiCalendar /> Date of Birth</div>
              <div style={styles.infoValue}>{formatDate(data.dob)}</div>
            </div>
            <div style={styles.infoCard}>
              <div style={styles.infoLabel}>Occupation</div>
              <div style={styles.infoValue}>{data.occupation}</div>
            </div>
            <div style={styles.infoCard}>
              <div style={styles.infoLabel}>Residential Address</div>
              <div style={styles.infoValue}>{data.residential_address}</div>
            </div>
            <div style={styles.infoCard}>
              <div style={styles.infoLabel}>Office Address</div>
              <div style={styles.infoValue}>{data.office_address}</div>
            </div>
            <div style={styles.infoCard}>
              <div style={styles.infoLabel}>State of Origin</div>
              <div style={styles.infoValue}>{data.state_of_origin}</div>
            </div>
          </div>
        </div>

        {/* Plot Application Details */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <FiHome />
            Plot Application
          </div>
          <div style={styles.grid}>
            <div style={styles.infoCard}>
              <div style={styles.infoLabel}>Layout Name</div>
              <div style={styles.infoValue}>{data.layout_name}</div>
            </div>
            <div style={styles.infoCard}>
              <div style={styles.infoLabel}>Plot Size</div>
              <div style={styles.infoValue}>{data.plot_size}</div>
            </div>
            <div style={styles.infoCard}>
              <div style={styles.infoLabel}>Proposed Use</div>
              <div style={styles.infoValue}>{data.proposed_use}</div>
            </div>
            <div style={styles.infoCard}>
              <div style={styles.infoLabel}>Payment Terms</div>
              <div style={styles.infoValue}>{data.payment_terms}</div>
            </div>
            <div style={styles.infoCard}>
              <div style={styles.infoLabel}>Plot ID</div>
              <div style={styles.infoValue}>{data.plot_id}</div>
            </div>
            <div style={styles.infoCard}>
              <div style={styles.infoLabel}>Agreed to Terms</div>
              <div style={styles.infoValue}>
                <span style={{
                  ...styles.statusBadge,
                  ...(data.agreed_to_terms ? styles.statusApproved : styles.statusPending)
                }}>
                  {data.agreed_to_terms ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Next of Kin */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <FiUser />
            Next of Kin
          </div>
          <div style={styles.grid}>
            <div style={styles.infoCard}>
              <div style={styles.infoLabel}>Full Name</div>
              <div style={styles.infoValue}>{data.next_of_kin_name}</div>
            </div>
            <div style={styles.infoCard}>
              <div style={styles.infoLabel}>Phone Number</div>
              <div style={styles.infoValue}>{data.next_of_kin_phone_number}</div>
            </div>
            <div style={styles.infoCard}>
              <div style={styles.infoLabel}>Relationship</div>
              <div style={styles.infoValue}>{data.next_of_kin_relationship}</div>
            </div>
            <div style={styles.infoCard}>
              <div style={styles.infoLabel}>Address</div>
              <div style={styles.infoValue}>{data.next_of_kin_address}</div>
            </div>
          </div>
        </div>
      </>
    );
  };

  if (loading) {
    return (
      <div style={styles.profileContainer}>
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <div style={{color: 'white', fontSize: '18px', fontWeight: '600'}}>
            Loading user profile...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.profileContainer}>
        <div style={styles.emptyState}>
          <FiUser style={styles.emptyIcon} />
          <h3 style={{color: '#2d3748', marginBottom: '10px'}}>Error Loading Profile</h3>
          <p style={{color: '#718096', marginBottom: '20px'}}>{error}</p>
          <button 
            style={styles.actionButton}
            onClick={() => window.location.reload()}
          >
            <FiEye />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (userData.length === 0) {
    return (
      <div style={styles.profileContainer}>
        <div style={styles.emptyState}>
          <FiUser style={styles.emptyIcon} />
          <h3 style={{color: '#2d3748', marginBottom: '10px'}}>No Profile Found</h3>
          <p style={{color: '#718096', marginBottom: '20px'}}>
            No user data available for this email address.
          </p>
        </div>
      </div>
    );
  }

  const activeData = getActiveData();
  const userInitials = getUserInitials(activeData?.name);

  return (
    <div style={styles.profileContainer}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.userHeader}>
          <div style={{display: 'flex', alignItems: 'center'}}>
            <div style={styles.userAvatar}>
              {userInitials}
            </div>
            <div style={styles.userInfo}>
              <div style={styles.userName}>{activeData?.name}</div>
              <div style={styles.userEmail}>
                <FiMail />
                {user.email}
              </div>
            </div>
          </div>
          <button 
            style={styles.actionButton}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.actionButtonHover)}
            onMouseLeave={(e) => Object.assign(e.currentTarget.style, styles.actionButton)}
          >
            <FiEdit />
            Edit Profile
          </button>
        </div>

        {/* Tabs */}
        {userData.length > 1 && (
          <div style={styles.tabContainer}>
            {userData.map((item) => (
              <div
                key={item.source}
                style={{
                  ...styles.tab,
                  ...(activeTab === item.source ? styles.activeTab : {})
                }}
                onClick={() => setActiveTab(item.source)}
                onMouseEnter={(e) => {
                  if (activeTab !== item.source) {
                    e.currentTarget.style.background = 'rgba(102, 126, 234, 0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== item.source) {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                {item.source === 'usersTable' ? <FiUser /> : <FiFileText />}
                {item.source === 'usersTable' ? 'Customer Profile' : 'Subscription'}
                <span style={{
                  ...styles.statusBadge,
                  ...(item.status === 'Active' || item.status === 'approved' ? styles.statusActive : 
                      item.status === 'Completed' ? styles.statusCompleted : styles.statusPending),
                  marginLeft: '8px',
                  fontSize: '10px',
                  padding: '4px 8px',
                }}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      {activeData && (
        activeData.source === 'usersTable' 
          ? renderUsersTableData(activeData)
          : renderSubscriptionData(activeData)
      )}
    </div>
  );
};

export default UserProfile;