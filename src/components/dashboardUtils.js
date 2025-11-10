// Utility functions for the dashboard

// Format currency function
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) return '₦0';
  return `₦${parseFloat(amount).toLocaleString('en-NG', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  })}`;
};

// Safe date formatting function
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'N/A' : date.toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (error) {
    return 'N/A';
  }
};

// Safe date formatting with time
export const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'N/A' : date.toLocaleDateString('en-NG', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    return 'N/A';
  }
};

// Copy account number function
export const copyAccountNumber = async (accountNumber, buttonId) => {
  if (!accountNumber) {
    console.warn('No account number provided to copy');
    return;
  }

  try {
    await navigator.clipboard.writeText(accountNumber);
    const button = document.getElementById(buttonId);
    if (button) {
      const originalText = button.innerHTML;
      const originalBackground = button.style.background;
      const originalColor = button.style.color;

      button.innerHTML = '✅ Copied!';
      button.style.background = '#10b981';
      button.style.color = 'white';
      button.style.borderColor = '#10b981';
      
      setTimeout(() => {
        button.innerHTML = originalText;
        button.style.background = originalBackground;
        button.style.color = originalColor;
        button.style.borderColor = '';
      }, 2000);
    }
  } catch (err) {
    console.error('Failed to copy account number:', err);
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = accountNumber;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      // Show success feedback even with fallback
      const button = document.getElementById(buttonId);
      if (button) {
        const originalText = button.innerHTML;
        button.innerHTML = '✅ Copied!';
        setTimeout(() => {
          button.innerHTML = originalText;
        }, 2000);
      }
    } catch (fallbackErr) {
      console.error('Fallback copy failed:', fallbackErr);
      alert('Failed to copy account number. Please copy manually: ' + accountNumber);
    }
    document.body.removeChild(textArea);
  }
};

// Calculate progress percentage based on total_money_to_pay and total_balance
export const calculateProgressPercentage = (totalMoneyToPay, totalBalance) => {
  if (!totalMoneyToPay || totalMoneyToPay <= 0) return 0;
  
  const totalToPay = parseFloat(totalMoneyToPay);
  const balance = parseFloat(totalBalance || 0);
  
  // Calculate paid amount: total_money_to_pay - total_balance
  const paidAmount = totalToPay - balance;
  
  const percentage = (paidAmount / totalToPay) * 100;
  return Math.min(100, Math.max(0, Math.round(percentage)));
};

// Calculate paid amount from total_money_to_pay and total_balance
export const calculatePaidAmount = (totalMoneyToPay, totalBalance) => {
  if (!totalMoneyToPay) return 0;
  const totalToPay = parseFloat(totalMoneyToPay);
  const balance = parseFloat(totalBalance || 0);
  return Math.max(totalToPay - balance, 0);
};

// Calculate remaining balance
export const calculateRemainingBalance = (totalMoneyToPay, totalBalance) => {
  if (!totalMoneyToPay) return 0;
  const totalToPay = parseFloat(totalMoneyToPay);
  const balance = parseFloat(totalBalance || 0);
  return Math.max(balance, 0);
};

// Calculate next payment amount based on payment terms
export const calculateNextPaymentAmount = (outstandingBalance, paymentTerms) => {
  if (!outstandingBalance || outstandingBalance <= 0) return 0;
  
  const balance = parseFloat(outstandingBalance);
  
  switch (paymentTerms?.toLowerCase()) {
    case "3 months":
      return Math.ceil(balance / 3);
    case "12 months":
      return Math.ceil(balance / 12);
    case "18 months":
      return Math.ceil(balance / 18);
    case "24 months":
      return Math.ceil(balance / 24);
    case "30 months":
      return Math.ceil(balance / 30);
    case "monthly":
      return Math.ceil(balance / 12);
    case "quarterly":
      return Math.ceil(balance / 4);
    case "yearly":
      return Math.ceil(balance);
    default:
      return Math.ceil(balance / 12); // Default to monthly
  }
};

// Get payment frequency based on payment terms
export const getPaymentFrequency = (paymentTerms) => {
  if (!paymentTerms) return "Monthly";
  
  switch (paymentTerms.toLowerCase()) {
    case "3 months":
      return "Monthly";
    case "12 months":
      return "Monthly";
    case "18 months":
      return "Monthly";
    case "24 months":
      return "Monthly";
    case "30 months":
      return "Monthly";
    case "monthly":
      return "Monthly";
    case "quarterly":
      return "Quarterly";
    case "yearly":
      return "Yearly";
    default:
      return "Monthly";
  }
};

// Get days until next payment
export const getDaysUntilNextPayment = (nextPaymentDue) => {
  if (!nextPaymentDue) return null;
  
  try {
    const dueDate = new Date(nextPaymentDue);
    const today = new Date();
    
    if (isNaN(dueDate.getTime())) return null;
    
    const timeDiff = dueDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    return daysDiff;
  } catch (error) {
    return null;
  }
};

// Get payment status color
export const getPaymentStatusColor = (status) => {
  if (!status) return '#6b7280';
  
  switch (status.toLowerCase()) {
    case 'approved':
    case 'completed':
    case 'success':
      return '#10b981';
    case 'pending':
    case 'processing':
      return '#f59e0b';
    case 'rejected':
    case 'failed':
    case 'declined':
      return '#ef4444';
    case 'overdue':
    case 'late':
      return '#dc2626';
    default:
      return '#6b7280';
  }
};

// Format file size
export const formatFileSize = (bytes) => {
  if (!bytes) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Validate email format
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate phone number (basic Nigerian format)
export const isValidPhone = (phone) => {
  const phoneRegex = /^(\+234|0)[789][01]\d{8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

// Debounce function for search inputs
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Get initial from name
export const getInitials = (name) => {
  if (!name) return 'U';
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Generate random color for avatars
export const generateRandomColor = () => {
  const colors = [
    '#667eea', '#764ba2', '#f093fb', '#f5576c',
    '#4facfe', '#00f2fe', '#43e97b', '#38f9d7',
    '#fa709a', '#fee140', '#a8edea', '#fed6e3'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Check if value is empty
export const isEmpty = (value) => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
};

// Safe number parsing
export const safeParseFloat = (value) => {
  if (value === null || value === undefined) return 0;
  const parsed = parseFloat(value);
  return isNaN(parsed) ? 0 : parsed;
};

// Safe integer parsing
export const safeParseInt = (value) => {
  if (value === null || value === undefined) return 0;
  const parsed = parseInt(value);
  return isNaN(parsed) ? 0 : parsed;
};