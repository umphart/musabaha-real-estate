import React from 'react';
import { FiFileText } from 'react-icons/fi';
import Swal from 'sweetalert2';
import { jsPDF } from 'jspdf';

const ReceiptGenerator = ({ payment, user }) => {
  // Format currency
  const formatCurrency = (amount) => {
    return `₦${parseFloat(amount || 0).toLocaleString('en-NG')}`;
  };

  // Convert amount to words
  const convertAmountToWords = (amount) => {
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

// Generate receipt function
const generateReceipt = async (paymentData, userData) => {
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

  // Safe data access with defaults
  const receiptNo = paymentData?.id || 'N/A';
  const receiptDate = paymentData?.date ? new Date(paymentData.date).toLocaleString("en-NG") : new Date().toLocaleString("en-NG");
  const customerName = userData?.name || paymentData?.user_name || 'Customer';
  const plotTaken = userData?.plot_taken || paymentData?.plot_taken || 'N/A';
  const amount = paymentData?.amount || 0;
  const note = paymentData?.note || paymentData?.notes || `Plot(s): ${plotTaken}`;
  const recordedBy = paymentData?.admin || paymentData?.recorded_by || "Admin";

  if (logo) {
    doc.addImage(logo, "JPEG", 10, 10, 25, 25);
    doc.addImage(logo, "JPEG", 175, 10, 25, 25);
  }

  doc.setFont("Helvetica", "bold");
  doc.setFontSize(14);
  doc.text("MUSABAHA HOMES LTD.", 105, 20, { align: "center" });

  doc.setFontSize(8);
  doc.text("RC NO.: 8176032", 105, 25, { align: "center" });
  doc.text("No. 015, City Plaza, Ring Road Western Bypass, Kano State", 105, 30, { align: "center" });
  doc.text("TEL: +2349064220705, +2349039108853, +2347038192719", 105, 35, { align: "center" });
  doc.text("Email: musabahohomesltd@gmail.com", 105, 40, { align: "center" });

  doc.setFontSize(16);
  doc.setFont("Helvetica", "bold");
  doc.text("CASH RECEIPT", 105, 55, { align: "center" });

  // Draw border line after header
  doc.setLineWidth(0.5);
  doc.line(10, 58, 200, 58);

  doc.setFontSize(9);
  doc.setFont("Helvetica", "normal");

  doc.text(`Receipt No: ${receiptNo}`, 10, 70);
  doc.text(`Date: ${receiptDate}`, 150, 70);

  // Underline for "Received from" field
  doc.setFont("Helvetica", "bold");
  doc.text("Received from:", 10, 85);
  doc.setFont("Helvetica", "normal");
  doc.text(customerName, 40, 85);
  doc.line(40, 86, 190, 86);

  const amountInWords = convertAmountToWords(amount);
  const splitWords = doc.splitTextToSize(amountInWords, 180);

  // Underline for "The Sum of" field
  doc.setFont("Helvetica", "bold");
  doc.text("The Sum of:", 10, 100);
  doc.setFont("Helvetica", "normal");
  doc.text(splitWords, 40, 100);
  doc.line(40, 101, 190, 101);

  // Underline for "Amount" field
  doc.setFont("Helvetica", "bold");
  doc.text("Amount (₦):", 10, 120);
  doc.setFont("Helvetica", "normal");
  doc.text(formatCurrency(amount), 40, 120);
  doc.line(40, 121, 190, 121);

  // Underline for "Being payment for" field
  doc.setFont("Helvetica", "bold");
  doc.text("Being payment for:", 10, 135);
  doc.setFont("Helvetica", "normal");
  doc.text(note, 40, 135);
  doc.line(40, 136, 190, 136);

  // Underline for "Recorded by" field
  doc.setFont("Helvetica", "bold");
  doc.text("Recorded by:", 10, 150);
  doc.setFont("Helvetica", "normal");
  doc.text(recordedBy, 40, 150);
  doc.line(40, 151, 100, 151);

  // Underline for "Signature" field
  doc.setFont("Helvetica", "bold");
  doc.text("Signature:", 150, 150);
  doc.line(170, 151, 200, 151);

  doc.setFontSize(8);
  doc.setFont("Helvetica", "italic");
  doc.text("For MUSABAHA HOMES LTD.", 150, 160);

  const fileName = `receipt_${(userData?.name || paymentData?.user_name || 'customer').replace(/\s+/g, "_")}_${paymentData?.id || 'receipt'}.pdf`;
  doc.save(fileName);
  
  // Show success message
  Swal.fire({
    toast: true,
    position: 'top-end',
    icon: 'success',
    title: 'Receipt downloaded successfully',
    showConfirmButton: false,
    timer: 3000
  });
};
  const handleGenerateReceipt = () => {
    if (!isApproved) return;
    
    try {
      // Prepare payment data with safe defaults
      const receiptData = {
        id: payment?.id || '20',
        amount: payment?.amount || 40000,
        date: payment?.created_at || payment?.transaction_date || new Date().toISOString(),
        note: payment?.note || payment?.notes || `Plot(s): ${user?.plot_taken || 'A3'}`,
        admin: payment?.recorded_by || 'Admin',
        user_name: payment?.user_name // Fallback for user name
      };

      // Prepare user data with safe defaults
      const userData = {
        name: user?.name || payment?.user_name || 'Umar Musa Halliru',
        plot_taken: user?.plot_taken || 'A3'
      };

      // Generate receipt
      generateReceipt(receiptData, userData);
      
    } catch (error) {
      console.error('Error generating receipt:', error);
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'error',
        title: 'Error generating receipt',
        showConfirmButton: false,
        timer: 3000
      });
    }
  };

  const isApproved = payment?.status === 'approved';

  return (
    <button
      className={`receipt-btn ${isApproved ? 'approved' : 'not-approved'} ${!isApproved ? 'disabled' : ''}`}
      onClick={isApproved ? handleGenerateReceipt : undefined}
      disabled={!isApproved}
      title={isApproved ? 'Generate Receipt' : 'Approval pending'}
    >
      <FiFileText size={14} />
      {isApproved ? 'Receipt' : 'Pending'}
    </button>
  );
};

export default ReceiptGenerator;