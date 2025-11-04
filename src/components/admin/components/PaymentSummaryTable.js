import React from "react";
import { FiUser, FiDownload, FiPrinter, FiInfo } from "react-icons/fi";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { contentTableStyles, tableHeaderStyles, tableTitleStyles, tableStyles, thStyles, tdStyles, trStyles, secondaryButtonStyles } from "../styles/componentStyles";

const PaymentSummaryTable = ({ userPaymentSummary, formatCurrency, payments }) => {
  
  const downloadAllUserPayments = (user) => {
    const userPayments = payments.filter(p => p.userId === user.id);
    if (userPayments.length === 0) {
      alert("No payments found for this user");
      return;
    }
    
    const wb = XLSX.utils.book_new();
    const excelData = userPayments.map((payment, idx) => {
      const date = new Date(payment.date);
      return {
        "#": idx + 1,
        "Payment ID": payment.id,
        Date: date.toLocaleDateString("en-NG"),
        Amount: payment.amount,
        Status: payment.status || "",
        "Recorded By": payment.admin || "",
      };
    });
    
    const ws = XLSX.utils.json_to_sheet(excelData);
    XLSX.utils.book_append_sheet(wb, ws, "Payments");
    XLSX.writeFile(wb, `${user.userName.replace(/\s+/g, "_")}_payments.xlsx`);
  };

  const generateReceipt = async (user, paymentsForUser) => {
    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    
    // Header
    doc.setFontSize(20);
    doc.setTextColor(44, 62, 80);
    doc.text("PAYMENT STATEMENT", 105, 20, { align: "center" });
    
    // Company Info
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("Estate Management System", 105, 30, { align: "center" });
    
    // User Info
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`User: ${user.userName}`, 20, 45);
    doc.text(`Plot: ${user.userPlot}`, 20, 52);
    doc.text(`Statement Date: ${new Date().toLocaleDateString('en-NG')}`, 20, 59);
    
    // Summary
    const totalAmount = paymentsForUser.reduce((sum, p) => sum + p.amount, 0);
    doc.text(`Total Amount: ${formatCurrency(totalAmount)}`, 150, 45);
    doc.text(`Total Payments: ${paymentsForUser.length}`, 150, 52);

    autoTable(doc, {
      head: [["#", "Payment ID", "Date", "Amount", "Status", "Recorded By"]],
      body: paymentsForUser.map((p, idx) => [
        idx + 1,
        p.id,
        new Date(p.date).toLocaleDateString("en-NG"),
        formatCurrency(p.amount),
        p.status || "",
        p.admin,
      ]),
      startY: 65,
      theme: "grid",
      headStyles: {
        fillColor: [44, 62, 80],
        textColor: 255,
        fontStyle: 'bold'
      },
      styles: {
        fontSize: 9,
        cellPadding: 3,
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      }
    });

    doc.save(`receipt_${user.userName.replace(/\s+/g, "_")}.pdf`);
  };

  return (
    <div style={contentTableStyles}>
      <div style={tableHeaderStyles}>
        <span style={tableTitleStyles}>
          User Payment Summary ({userPaymentSummary.length} users)
        </span>
      </div>
      
      <table style={tableStyles}>
        <thead>
          <tr>
            <th style={thStyles}>S.No</th>
            <th style={thStyles}>User Name</th>
            <th style={thStyles}>Plot</th>
            <th style={thStyles}>Total Payments</th>
            <th style={thStyles}>Total Amount</th>
            <th style={thStyles}>Last Payment</th>
            <th style={thStyles}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {userPaymentSummary.length > 0 ? (
            userPaymentSummary.map((user, index) => (
              <tr key={user.id} style={trStyles}>
                <td style={tdStyles}>{index + 1}</td>
                <td style={tdStyles}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FiUser style={{ color: '#3498db' }} />
                    {user.userName}
                  </div>
                </td>
                <td style={tdStyles}>{user.userPlot}</td>
                <td style={tdStyles}>{user.totalPayments}</td>
                <td style={{...tdStyles, fontWeight: '600', color: '#27ae60'}}>
                  {formatCurrency(user.totalAmount)}
                </td>
                <td style={tdStyles}>
                  {user.lastPaymentDate ? 
                    new Date(user.lastPaymentDate).toLocaleDateString('en-NG'): 'N/A'
                  }
                </td>
                <td style={tdStyles}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      style={{
                        padding: "6px",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "rgba(40, 167, 69, 0.1)",
                        color: "#28a745"
                      }}
                      onClick={() => downloadAllUserPayments(user)}
                      title="Download Excel"
                    >
                      <FiDownload />
                    </button>
                    <button 
                      style={{
                        padding: "6px",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "rgba(0, 123, 255, 0.1)",
                        color: "#007bff"
                      }}
                      onClick={() => generateReceipt(user, user.payments)}
                      title="Generate PDF"
                    >
                      <FiPrinter />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" style={{...tdStyles, textAlign: 'center', padding: '40px'}}>
                <FiInfo style={{ fontSize: '48px', marginBottom: '16px', opacity: '0.5' }} />
                <p>No users with payments found.</p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentSummaryTable;