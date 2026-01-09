import React, { useState } from "react";
import {
  FiX, FiUser, FiPlus, FiClock, FiDollarSign, FiFileText,
  FiUpload, FiMessageSquare
} from "react-icons/fi";
import Swal from "sweetalert2";
import { jsPDF } from "jspdf";

const AddPaymentModal = ({ payment, subsequentPayments, onClose, onSubmit, submitting }) => {
  const [formData, setFormData] = useState({
    amount: "",
    payment_method: "",
    note: "",
    receipt: null,
  });
  const [fileInputKey, setFileInputKey] = useState(Date.now());

  const userSubsequentPayments = subsequentPayments.filter(
    (p) => p.user_id === payment.user_id
  );

  const handleSubmit = async () => {
    if (!formData.amount || !formData.payment_method || !formData.receipt) {
      Swal.fire({
        icon: "warning",
        title: "Missing Information",
        text: "Please fill in all required fields.",
      });
      return;
    }

    await onSubmit(formData);
    // Reset form after successful submission
    setFormData({ amount: "", payment_method: "", note: "", receipt: null });
    setFileInputKey(Date.now());
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire({
          icon: "error",
          title: "File Too Large",
          text: "Please select a file smaller than 5MB.",
        });
        return;
      }
      setFormData({ ...formData, receipt: file });
    }
  };

  const handleUploadAreaClick = () => {
    document.getElementById('file-input').click();
  };

  const handleUploadAreaDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileChange({ target: { files: [file] } });
    }
  };

  const handleUploadAreaDragOver = (e) => {
    e.preventDefault();
  };

  const convertAmountToWords = (num) => {
    const a = [
      "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
      "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
      "Seventeen", "Eighteen", "Nineteen"
    ];
    const b = [
      "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"
    ];

    const inWords = (n) => {
      if (n < 20) return a[n];
      if (n < 100) return b[Math.floor(n / 10)] + (n % 10 ? " " + a[n % 10] : "");
      if (n < 1000) return a[Math.floor(n / 100)] + " Hundred " + inWords(n % 100);
      if (n < 1000000) return inWords(Math.floor(n / 1000)) + " Thousand " + inWords(n % 1000);
      return n;
    };

    return inWords(Number(num)) + " Naira Only";
  };

  const generateReceipt = async (paymentItem) => {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: [148.5, 210],
    });

    // Helper: load image as base64
    const loadImageAsBase64 = async (path) => {
      const res = await fetch(path);
      const blob = await res.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
    };

    const logo = await loadImageAsBase64("/images/MHL.jpg");
    const bg = await loadImageAsBase64("/images/bg.jpg");

    // Background
    doc.addImage(bg, "JPEG", 0, 20, 210, 148.5);
    // Logo
    doc.addImage(logo, "JPEG", 10, 17, 25, 25);

    // Header
    doc.setFontSize(12).setFont(undefined, "bold");
    doc.text("MUSABAHA HOMES LTD.", 40, 18);

    doc.setFontSize(9).setFont(undefined, "normal");
    doc.text("RC NO.: 8176032", 40, 24);
    doc.text("No. 015, City Plaza Along Ring Road Western Bypass", 40, 30);
    doc.text("Along Yankaba Road, Kano State", 40, 34);
    doc.text("TEL: +2349064220705, +2349039108853, +2347038192719", 40, 40);
    doc.text("Email: musabahohomesltd@gmail.com", 40, 44);

    // Title
    doc.setFontSize(30).setFont(undefined, "bold");
    doc.text("CASH RECEIPT", 105, 60, { align: "center" });

    // Receipt details
    doc.setFontSize(9).setFont(undefined, "normal");
    doc.text("No.:", 10, 70);
    doc.line(20, 70, 70, 70);
    doc.text(`${paymentItem.id}`, 22, 69);

    doc.text("Date & Time:", 130, 70);
    doc.line(160, 70, 200, 70);
    const paymentDate = paymentItem.created_at
      ? new Date(paymentItem.created_at)
      : new Date();

    doc.text(paymentDate.toLocaleString("en-NG"), 162, 69);

    // Received from
    doc.setFont(undefined, "bold");
    doc.text("Received from:", 10, 85);
    doc.line(45, 85, 200, 85);
    doc.setFont(undefined, "normal");
    doc.text(payment.name, 47, 84);

    // Amount in words
    const amountInWords = convertAmountToWords(paymentItem.amount);
    const splitWords = doc.splitTextToSize(amountInWords, 150);

    doc.setFont(undefined, "bold");
    doc.text("The Sum of:", 10, 100);
    doc.line(40, 100, 200, 100);
    doc.setFont(undefined, "normal");
    doc.text(splitWords, 42, 99);

    // Amount in figures
    doc.setFont(undefined, "bold");
    doc.text("Naira:", 120, 115);
    doc.line(140, 115, 200, 115);
    doc.setFont(undefined, "normal");
    doc.text(`₦${Number(paymentItem.amount).toLocaleString()}`, 142, 114);

    // Payment For
    doc.setFont(undefined, "bold");
    doc.text("Being payment for:", 10, 125);
    doc.line(60, 125, 200, 125);
    doc.setFont(undefined, "normal");
    doc.text(
      `Plot(s): ${payment.number_of_plots || "N/A"} - ${paymentItem.note || "Payment on account"}`,
      62,
      124
    );

    // Recorded by
    doc.setFont(undefined, "bold");
    doc.text("Approved by:", 10, 140);
    doc.line(38, 140, 100, 140);
    doc.setFont(undefined, "normal");
    doc.text(paymentItem.admin || paymentItem.recorded_by || "Admin", 40, 139);

    // Signature
    doc.setFont(undefined, "bold");
    doc.text("Signature:", 150, 140);
    doc.line(170, 140, 200, 140);

    doc.setFontSize(8).setFont(undefined, "italic");
    doc.text("For MUSABAHA HOMES LTD.", 170, 145);

    // Save file
    doc.save(`receipt_${payment.name.replace(/\s+/g, "_")}_${paymentItem.id}.pdf`);

    Swal.fire({
      icon: "success",
      title: "Receipt Generated",
      text: "Receipt downloaded successfully!",
      timer: 2000,
      showConfirmButton: false,
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="header-content">
            <FiUser className="header-icon" />
            <div className="header-text">
              <h3>Add Payment</h3>
              <p>For {payment.name}</p>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>
            <FiX size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* User Summary Card */}
          <div className="summary-card">
            <div className="summary-grid">
              <div className="summary-item">
                <span className="label">Contact</span>
                <span className="value">{payment.contact || "N/A"}</span>
              </div>
              <div className="summary-item">
                <span className="label">Plot Size</span>
                <span className="value">{payment.plot_size || "N/A"}</span>
              </div>
              <div className="summary-item">
                <span className="label">Plots</span>
                <span className="value">{payment.number_of_plots || "N/A"}</span>
              </div>
              <div className="summary-item">
                <span className="label">Total Price</span>
                <span className="value highlight">
                  ₦{Number(payment.total_price || 0).toLocaleString()}
                </span>
              </div>
            </div>
            
            <div className="balance-section">
              <div className="balance-item">
                <span className="label">Paid</span>
                <span className="value success">
                  ₦{Number(payment.amount || 0).toLocaleString()}
                </span>
              </div>
              <div className="balance-item">
                <span className="label">Balance</span>
                <span className={`value ${payment.outstanding_balance === 0 ? 'success' : 'warning'}`}>
                  ₦{Number(payment.outstanding_balance || 0).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Payment History */}
          <div className="section">
            <div className="section-header">
              <FiClock className="section-icon" />
              <h4>Payment History</h4>
              <span className="badge">{userSubsequentPayments.length}</span>
            </div>
            
            {userSubsequentPayments.length === 0 ? (
              <div className="empty-state">
                <FiDollarSign size={24} />
                <p>No payment history found</p>
              </div>
            ) : (
              <div className="payment-list">
                {userSubsequentPayments.map((paymentItem) => (
                  <div key={paymentItem.id} className="payment-item">
                    <div className="payment-info">
                      <div className="payment-meta">
                        <span className="date">
                          {paymentItem.created_at
                            ? new Date(paymentItem.created_at).toLocaleDateString()
                            : "-"}
                        </span>
                        <span className="method">
                          {paymentItem.payment_method || "N/A"}
                        </span>
                      </div>
                      <div className="payment-amount">
                        ₦{Number(paymentItem.amount).toLocaleString()}
                      </div>
                    </div>
                    <div className="payment-actions">
                      <span className={`status ${paymentItem.status}`}>
                        {paymentItem.status}
                      </span>
                      <button
                        className="icon-btn"
                        onClick={() => {
                          if (paymentItem.status === "approved") {
                            generateReceipt(paymentItem);
                          } else {
                            Swal.fire({
                              icon: "warning",
                              title: "Not Approved",
                              text: "Cannot generate receipt for unapproved payments",
                            });
                          }
                        }}
                        disabled={paymentItem.status !== "approved"}
                        title="Generate Receipt"
                      >
                        <FiFileText size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add Payment Form */}
          <div className="section">
            <div className="section-header">
              <FiPlus className="section-icon" />
              <h4>New Payment</h4>
            </div>

            <div className="form">
              <div className="form-row">
                <div className="form-group">
                  <label>Amount (₦) *</label>
                  <div className="input-with-icon">
                    <input
                      type="number"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      placeholder="Enter amount"
                      className="input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Payment Method *</label>
                  <div className="input-with-icon">
                    <select
                      value={formData.payment_method}
                      onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                      className="input"
                    >
                      <option value="">Select method</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="Card">Card</option>
                      <option value="Cash">Cash</option>
                      <option value="Online Transfer">Online Transfer</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>Payment Receipt *</label>
                <div className="file-upload">
                  <input
                    key={fileInputKey}
                    id="file-input"
                    type="file"
                    accept="image/*,.pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="file-input"
                  />
                  <div 
                    className={`upload-area ${formData.receipt ? 'has-file' : ''}`}
                    onClick={handleUploadAreaClick}
                    onDrop={handleUploadAreaDrop}
                    onDragOver={handleUploadAreaDragOver}
                  >
                    <FiUpload className="upload-icon" />
                    <div className="upload-text">
                      {formData.receipt ? (
                        <>
                          <span>File selected: {formData.receipt.name}</span>
                          <small>Click to change file</small>
                        </>
                      ) : (
                        <>
                          <span>Click to upload receipt or drag & drop</span>
                          <small>Supports images, PDF, Word documents (Max 5MB)</small>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>Notes (Optional)</label>
                <div className="input-with-icon">
                  <FiMessageSquare className="input-icon" />
                  <textarea
                    value={formData.note}
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                    placeholder="Add any additional notes..."
                    rows="3"
                    className="input textarea"
                  />
                </div>
              </div>

              <div className="form-actions">
                <button
                  className="btn btn-secondary"
                  onClick={onClose}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleSubmit}
                  disabled={submitting || !formData.amount || !formData.payment_method || !formData.receipt}
                >
                  {submitting ? (
                    <>
                      <div className="spinner"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <FiPlus size={16} />
                      Submit Payment
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
          backdrop-filter: blur(4px);
        }

        .modal-container {
          background: white;
          border-radius: 12px;
          width: 100%;
          max-width: 550px;
          max-height: 85vh;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          animation: modalSlideIn 0.3s ease-out;
        }

        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          position: relative;
        }

        .header-content {
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }

        .header-icon {
          margin-top: 2px;
          flex-shrink: 0;
        }

        .header-text h3 {
          margin: 0 0 4px 0;
          font-size: 1.2rem;
          font-weight: 700;
        }

        .header-text p {
          margin: 0;
          opacity: 0.9;
          font-size: 0.85rem;
        }

        .close-btn {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: white;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          flex-shrink: 0;
        }

        .close-btn:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: rotate(90deg);
        }

        .modal-body {
          padding: 0;
          max-height: calc(85vh - 80px);
          overflow-y: auto;
        }

        /* Summary Card */
        .summary-card {
          padding: 20px;
          border-bottom: 1px solid #f0f0f0;
          background: #f8f9fa;
        }

        .summary-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-bottom: 12px;
        }

        .summary-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .summary-item .label {
          font-size: 0.7rem;
          font-weight: 600;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .summary-item .value {
          font-size: 0.85rem;
          font-weight: 500;
          color: #374151;
        }

        .summary-item .highlight {
          color: #059669;
          font-weight: 700;
        }

        .balance-section {
          display: flex;
          gap: 20px;
          padding-top: 12px;
          border-top: 1px solid #e5e7eb;
        }

        .balance-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .balance-item .success {
          color: #059669;
          font-weight: 700;
        }

        .balance-item .warning {
          color: #dc2626;
          font-weight: 700;
        }

        /* Sections */
        .section {
          padding: 20px;
          border-bottom: 1px solid #f0f0f0;
        }

        .section:last-child {
          border-bottom: none;
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
        }

        .section-icon {
          color: #667eea;
        }

        .section-header h4 {
          margin: 0;
          font-size: 1rem;
          font-weight: 600;
          color: #374151;
        }

        .badge {
          background: #667eea;
          color: white;
          padding: 2px 6px;
          border-radius: 10px;
          font-size: 0.7rem;
          font-weight: 600;
        }

        /* Empty State */
        .empty-state {
          text-align: center;
          padding: 30px 15px;
          color: #9ca3af;
        }

        .empty-state p {
          margin: 10px 0 0 0;
          font-size: 0.85rem;
        }

        /* Payment List */
        .payment-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .payment-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px;
          background: #f8f9fa;
          border-radius: 6px;
          border: 1px solid #e5e7eb;
        }

        .payment-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .payment-meta {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .payment-meta .date {
          font-size: 0.75rem;
          color: #6b7280;
        }

        .payment-meta .method {
          font-size: 0.7rem;
          color: #374151;
          font-weight: 500;
        }

        .payment-amount {
          font-weight: 700;
          color: #059669;
          font-size: 0.9rem;
        }

        .payment-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .status {
          padding: 3px 6px;
          border-radius: 4px;
          font-size: 0.65rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .status.approved {
          background: #d1fae5;
          color: #065f46;
        }

        .status.pending {
          background: #fef3c7;
          color: #92400e;
        }

        .status.rejected {
          background: #fee2e2;
          color: #991b1b;
        }

        .icon-btn {
          background: white;
          border: 1px solid #d1d5db;
          border-radius: 4px;
          padding: 5px;
          cursor: pointer;
          color: #6b7280;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .icon-btn:hover:not(:disabled) {
          background: #f3f4f6;
          color: #374151;
        }

        .icon-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Form Styles */
        .form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-group label {
          font-weight: 600;
          color: #374151;
          font-size: 0.85rem;
        }

        .input-with-icon {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 10px;
          color: #9ca3af;
          z-index: 1;
        }

        .input {
          width: 100%;
          padding: 10px 10px 10px 35px;
          border: 2px solid #e5e7eb;
          border-radius: 6px;
          font-size: 0.85rem;
          transition: all 0.2s;
          background: white;
        }

        .input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
        }

        .input.textarea {
          padding: 10px 10px 10px 35px;
          resize: vertical;
          min-height: 70px;
        }

        select.input {
          appearance: none;
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
          background-position: right 10px center;
          background-repeat: no-repeat;
          background-size: 14px;
          padding-right: 35px;
        }

        /* File Upload */
        .file-upload {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .file-input {
          display: none;
        }

        .upload-area {
          border: 2px dashed #d1d5db;
          border-radius: 6px;
          padding: 20px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;
          background: #f9fafb;
          position: relative;
        }

        .upload-area:hover {
          border-color: #667eea;
          background: #f0f4ff;
        }

        .upload-area.has-file {
          border-color: #059669;
          background: #f0fff4;
        }

        .upload-icon {
          color: #9ca3af;
          margin-bottom: 6px;
        }

        .upload-area.has-file .upload-icon {
          color: #059669;
        }

        .upload-text span {
          display: block;
          font-weight: 600;
          color: #374151;
          margin-bottom: 3px;
          font-size: 0.85rem;
        }

        .upload-text small {
          color: #6b7280;
          font-size: 0.75rem;
        }

        /* Form Actions */
        .form-actions {
          display: flex;
          gap: 10px;
          justify-content: flex-end;
          padding-top: 6px;
        }

        .btn {
          padding: 10px 20px;
          border: none;
          border-radius: 6px;
          font-weight: 600;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none !important;
        }

        .btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 3px 8px rgba(102, 126, 234, 0.3);
        }

        .btn-secondary {
          background: #6b7280;
          color: white;
        }

        .btn-secondary:hover:not(:disabled) {
          background: #4b5563;
        }

        /* Spinner */
        .spinner {
          width: 14px;
          height: 14px;
          border: 2px solid transparent;
          border-top: 2px solid currentColor;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Responsive */
        @media (max-width: 640px) {
          .modal-container {
            margin: 10px;
            max-height: 90vh;
            max-width: 95vw;
          }

          .modal-header {
            padding: 16px;
          }

          .header-text h3 {
            font-size: 1.1rem;
          }

          .summary-grid {
            grid-template-columns: 1fr;
            gap: 10px;
          }

          .form-row {
            grid-template-columns: 1fr;
            gap: 10px;
          }

          .balance-section {
            flex-direction: column;
            gap: 10px;
          }

          .payment-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }

          .payment-info {
            width: 100%;
            justify-content: space-between;
          }

          .payment-actions {
            width: 100%;
            justify-content: space-between;
          }

          .form-actions {
            flex-direction: column;
          }

          .btn {
            justify-content: center;
          }
        }

        @media (max-width: 480px) {
          .modal-overlay {
            padding: 10px;
          }

          .section {
            padding: 15px;
          }

          .summary-card {
            padding: 15px;
          }
        }
      `}</style>
    </div>
  );
};

export default AddPaymentModal;