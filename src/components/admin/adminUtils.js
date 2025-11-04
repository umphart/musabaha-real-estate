import Swal from 'sweetalert2'; 
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

// Get auth token from localStorage
export const getAuthToken = () => {
  return localStorage.getItem('adminToken');
};

// Show SweetAlert2 notifications
export const showAlert = (type, message) => {
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 4000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    }
  });

  Toast.fire({
    icon: type,
    title: message
  });
};

// Show confirmation dialog
export const showConfirmDialog = (title, text, confirmButtonText = 'Yes') => {
  return Swal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText
  });
};

// Format currency
export const formatCurrency = (amount) => {
  return `₦${parseFloat(amount || 0).toLocaleString('en-NG')}`;
};

// Calculate total price from price_per_plot string
export const calculateTotalPrice = (pricePerPlotStr) => {
  if (!pricePerPlotStr) return 0;
  return pricePerPlotStr
    .split(",")
    .map(p => parseFloat(p.trim()) || 0)
    .reduce((a, b) => a + b, 0);
};

// Convert amount to words
export const convertAmountToWords = (amount) => {
  let num = parseFloat(amount);
  if (isNaN(num)) return 'Invalid Amount';
  if (num === 0) return 'Zero Naira';
  
  const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', 'Ten', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  
  const convertLessThanThousand = (n) => {
    if (n === 0) return '';
    let words = '';
    
    if (n >= 100) {
      words += units[Math.floor(n / 100)] + ' Hundred ';
      n %= 100;
    }
    
    if (n > 0) {
      if (n < 10) {
        words += units[n];
      } else if (n < 20) {
        words += teens[n - 10];
      } else {
        words += tens[Math.floor(n / 10)];
        if (n % 10 > 0) {
          words += ' ' + units[n % 10];
        }
      }
    }
    
    return words;
  };
  
  let words = '';
  let n = Math.floor(num);
  
  if (n >= 1000000) {
    words += convertLessThanThousand(Math.floor(n / 1000000)) + ' Million ';
    n %= 1000000;
  }
  
  if (n >= 1000) {
    words += convertLessThanThousand(Math.floor(n / 1000)) + ' Thousand ';
    n %= 1000;
  }
  
  if (n > 0) {
    words += convertLessThanThousand(n);
  }
  
  const kobo = Math.round((num - Math.floor(num)) * 100);
  if (kobo > 0) {
    words += ' Naira and ' + convertLessThanThousand(kobo) + ' Kobo';
  } else {
    words += ' Naira';
  }
  
  return words + ' Only';
};

/* ✅✅✅ UPDATED: Two receipts printed on same A4 page */
export const generateReceipt = async (payment, user) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  const loadImageAsBase64 = async (path) => {
    try {
      const res = await fetch(path);
      const blob = await res.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.warn('Could not load image:', path);
      return null;
    }
  };

  const logo = await loadImageAsBase64("/images/MHL.jpg");

  const drawReceipt = (startY, copyType) => {
    if (logo) {
      doc.addImage(logo, "JPEG", 10, startY, 25, 25);
      doc.addImage(logo, "JPEG", 175, startY, 25, 25);
    }

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(14);
    doc.text("MUSABAHA HOMES LTD.", 105, startY + 10, { align: "center" });

    doc.setFontSize(8);
    doc.text("RC NO.: 8176032", 105, startY + 15, { align: "center" });
    doc.text("No. 015, City Plaza, Ring Road Western Bypass, Kano State", 105, startY + 20, { align: "center" });
    doc.text("TEL: +2349064220705, +2349039108853, +2347038192719", 105, startY + 25, { align: "center" });
    doc.text("Email: musabahohomesltd@gmail.com", 105, startY + 30, { align: "center" });

    doc.setFontSize(16);
    doc.setFont("Helvetica", "bold");
    doc.text(`CASH RECEIPT (${copyType})`, 105, startY + 45, { align: "center" });

    // Draw border line after header
    doc.setLineWidth(0.5);
    doc.line(10, startY + 48, 200, startY + 48);

    doc.setFontSize(9);
    doc.setFont("Helvetica", "normal");

    doc.text(`Receipt No: ${payment.id}`, 10, startY + 60);
    doc.text(`Date: ${new Date(payment.date).toLocaleString("en-NG")}`, 150, startY + 60);

    // Underline for "Received from" field
    doc.setFont("Helvetica", "bold");
    doc.text("Received from:", 10, startY + 75);
    doc.setFont("Helvetica", "normal");
    doc.text(user.name, 40, startY + 75);
    doc.line(40, startY + 76, 190, startY + 76);

    const amountInWords = convertAmountToWords(payment.amount);
    const splitWords = doc.splitTextToSize(amountInWords, 180);

    // Underline for "The Sum of" field
    doc.setFont("Helvetica", "bold");
    doc.text("The Sum of:", 10, startY + 90);
    doc.setFont("Helvetica", "normal");
    doc.text(splitWords, 40, startY + 90);
    doc.line(40, startY + 91, 190, startY + 91);

    // Underline for "Amount" field
    doc.setFont("Helvetica", "bold");
    doc.text("Amount (₦):", 10, startY + 110);
    doc.setFont("Helvetica", "normal");
    doc.text(formatCurrency(payment.amount), 40, startY + 110);
    doc.line(40, startY + 111, 190, startY + 111);

    // Underline for "Being payment for" field
    doc.setFont("Helvetica", "bold");
    doc.text("Being payment for:", 10, startY + 125);
    doc.setFont("Helvetica", "normal");
    doc.text(`Plot(s): ${user.plot_taken} - ${payment.note || "Payment on account"}`, 40, startY + 125);
    doc.line(40, startY + 126, 190, startY + 126);

    // Underline for "Recorded by" field
    doc.setFont("Helvetica", "bold");
    doc.text("Recorded by:", 10, startY + 140);
    doc.setFont("Helvetica", "normal");
    doc.text(payment.admin || payment.recorded_by || "Admin", 40, startY + 140);
    doc.line(40, startY + 141, 100, startY + 141);

    // Underline for "Signature" field
    doc.setFont("Helvetica", "bold");
    doc.text("Signature:", 150, startY + 140);
    doc.line(170, startY + 141, 200, startY + 141);

    doc.setFontSize(8);
    doc.setFont("Helvetica", "italic");
    doc.text("For MUSABAHA HOMES LTD.", 150, startY + 150);
  };

  drawReceipt(10, "CUSTOMER COPY");

  doc.setLineWidth(0.8);
  doc.line(10, 155, 200, 155);

  drawReceipt(160, "COMPANY COPY");

  doc.save(`receipt_${user.name.replace(/\s+/g, "_")}_${payment.id}.pdf`);
  showAlert("success", "Receipt downloaded successfully.");
};

// Export Excel
export const exportToExcel = (users) => {
  const XLSX = require('xlsx');
  const worksheet = XLSX.utils.json_to_sheet(users);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');
  XLSX.writeFile(workbook, 'musabaha_users.xlsx');
  showAlert('success', 'Excel file downloaded successfully.');
};

// Export PDF
export const exportToPDF = async (users, totals) => {
  try {
    const doc = new jsPDF();
    const { totalBalance, totalPlotValue, totalDeposits, totalPlotsSold } = totals;

    const loadImageAsBase64 = async (path) => {
      try {
        const res = await fetch(path);
        const blob = await res.blob();
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        });
      } catch (error) {
        console.warn('Could not load logo image:', path);
        return null;
      }
    };

    const logo = await loadImageAsBase64("/images/MHL.jpg");

    if (logo) {
      doc.addImage(logo, "JPEG", 14, 5, 20, 20);
    }

    doc.setFontSize(18);
    doc.text('MUSABAHA HOMES LTD. - Users Report', logo ? 40 : 14, 15);
    
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, logo ? 40 : 14, 22);
    
    doc.setFontSize(10);
    doc.text(`Total Outstanding Balance: ${formatCurrency(totalBalance)}`, 14, logo ? 35 : 32);
    doc.text(`Total Plot Value: ${formatCurrency(totalPlotValue)}`, 14, logo ? 41 : 38);
    doc.text(`Total Deposits Received: ${formatCurrency(totalDeposits)}`, 14, logo ? 47 : 44);
    doc.text(`Total Plots Sold: ${totalPlotsSold}`, 14, logo ? 53 : 50);
    
    const tableData = users.map(user => [
      user.name || '',
      user.contact || '',
      user.plot_taken || '',
      user.date_taken || '',
      formatCurrency(calculateTotalPrice(user.price_per_plot)) || '',
      formatCurrency(user.initial_deposit) || '',
      user.price_per_plot ? user.price_per_plot.split(",").map(p => formatCurrency(p.trim())).join(", ") : '',
      user.payment_schedule || '',
      formatCurrency(user.total_balance) || '',
      user.number_of_plots || '1',
      user.status || ''
    ]);

    const startY = logo ? 60 : 55;

    if (typeof doc.autoTable === 'function') {
      doc.autoTable({
        head: [['Name', 'Contact', 'Plot Taken', 'Date Taken', 'Total Money to Pay', 'Initial Deposit', 'Price per Plot', 'Payment Schedule', 'Total Balance', 'Plots', 'Status']],
        body: tableData,
        startY: startY,
        styles: { 
          fontSize: 8,
          cellPadding: 1
        },
        headStyles: { 
          fillColor: [44, 62, 80],
          textColor: [255, 255, 255],
          fontStyle: 'bold'
        },
        alternateRowStyles: {
          fillColor: [240, 240, 240]
        },
        margin: { top: startY }
      });
    }

    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text('MUSABAHA HOMES LTD. - RC NO.: 8176032', 14, pageHeight - 15);
    doc.text('Contact: +2349064220705, +2349039108853, +2347038192719', 14, pageHeight - 10);

    doc.save('musabaha_users_report.pdf');
    showAlert('success', 'PDF report downloaded successfully.');
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    showAlert('error', 'Failed to generate PDF. Please try again.');
  }
};