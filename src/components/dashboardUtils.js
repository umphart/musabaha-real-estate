// Utility functions for the dashboard

// Format currency function
export const formatCurrency = (amount) => {
  return `₦${parseFloat(amount || 0).toLocaleString()}`;
};

// Safe date formatting function
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleDateString();
};

// Safe date formatting with time
export const formatDateTime = (dateString) => {
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
export const copyAccountNumber = (accountNumber, buttonId) => {
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

// Calculate progress percentage
export const calculateProgressPercentage = (totalDeposited, outstandingBalance) => {
  return totalDeposited > 0 ? 
    Math.min(100, (totalDeposited / (totalDeposited + outstandingBalance)) * 100) : 0;
};

// Calculate next payment amount based on payment terms
export const calculateNextPaymentAmount = (outstandingBalance, paymentTerms) => {
  switch (paymentTerms) {
    case "3 Months":
      return outstandingBalance / 3;
    case "12 Months":
      return outstandingBalance / 12;
    case "18 Months":
      return outstandingBalance / 18;
    case "24 Months":
      return outstandingBalance / 24;
    case "30 Months":
      return outstandingBalance / 30;
    default:
      return outstandingBalance / 12;
  }
};

// Get payment frequency based on payment terms
export const getPaymentFrequency = (paymentTerms) => {
  switch (paymentTerms) {
    case "3 Months":
      return "Monthly";
    case "12 Months":
      return "Monthly";
    case "18 Months":
      return "Monthly";
    case "24 Months":
      return "Monthly";
    case "30 Months":
      return "Monthly";
    default:
      return "Monthly";
  }
};