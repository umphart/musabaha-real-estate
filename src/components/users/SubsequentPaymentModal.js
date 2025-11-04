import React, { useState } from "react";
import { FiX, FiUpload, FiCalendar, FiCheck, FiCreditCard } from "react-icons/fi";
import Swal from "sweetalert2";

const SubsequentPaymentModal = ({ plot, user, onClose, onSuccess }) => {
  const [payment, setPayment] = useState({
    amount: "",
    paymentMethod: "bank_transfer",
    transactionDate: new Date().toISOString().split("T")[0],
    notes: "",
    receiptFile: null
  });

  const getAuthToken = () => {
    return (
      localStorage.getItem("userToken") ||
      localStorage.getItem("token") ||
      localStorage.getItem("authToken")
    );
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!payment.amount) return Swal.fire("Error!", "Enter amount", "warning");
  if (!payment.receiptFile) return Swal.fire("Error!", "Upload receipt", "warning");

  // ✅ Log to console
  console.log("✅ Payment Submitted:");
  console.log("Payment:", payment);
  console.log("User:", user);
  console.log("Plot:", plot);

  const token = getAuthToken();
  const formData = new FormData();
  formData.append("userId", plot.id);
  formData.append("plotId", user.plot_id);
  formData.append("amount", payment.amount);
  formData.append("paymentMethod", payment.paymentMethod);
  formData.append("transactionDate", payment.transactionDate);
  formData.append("notes", payment.notes);
  formData.append("receipt", payment.receiptFile);

  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  try {
    const res = await fetch("http://localhost:5000/api/subsequent-payments", {
      method: "POST",
      headers,
      body: formData,
    });

    const result = await res.json();

    if (result.success) {
      Swal.fire("Success!", "Payment recorded successfully!", "success");
      onSuccess && onSuccess();
      onClose();
    } else {
      Swal.fire("Error!", result.message || "Payment failed!", "error");
    }
  } catch (err) {
    Swal.fire("Error!", "Something went wrong!", "error");
  }
};

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        
        {/* HEADER */}
        <div style={styles.header}>
          <h3 style={styles.title}>
            <FiCreditCard style={{ marginRight: 6 }} /> Subsequent Payment
          </h3>
          <button style={styles.closeBtn} onClick={onClose}>
            <FiX size={20} />
          </button>
        </div>

        {/* Debug Info - You can remove this later */}
        <div style={styles.debugInfo}>
          <small>Debug: User ID: {user?.id}, Plot ID: {plot?.id}</small>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} style={styles.form}>

          <label style={styles.label}>Amount Paid</label>
          <input
            style={styles.input}
            type="number"
            placeholder="Enter amount"
            value={payment.amount}
            onChange={(e) => setPayment({ ...payment, amount: e.target.value })}
            required
          />

          <label style={styles.label}>Payment Method</label>
          <select
            style={styles.input}
            value={payment.paymentMethod}
            onChange={(e) => setPayment({ ...payment, paymentMethod: e.target.value })}
          >
            <option value="bank_transfer">Bank Transfer</option>
            <option value="cash">Cash</option>
            <option value="ussd">USSD</option>
            <option value="pos">POS</option>
          </select>

          <label style={styles.label}>Payment Date</label>
          <div style={styles.iconInput}>
            <FiCalendar />
            <input
              type="date"
              style={{ ...styles.input, border: "none" }}
              value={payment.transactionDate}
              onChange={(e) => setPayment({ ...payment, transactionDate: e.target.value })}
              max={new Date().toISOString().split("T")[0]}
            />
          </div>

          <label style={styles.label}>Upload Receipt</label>
          <div style={styles.uploadBox}>
            <FiUpload size={18} />
            <input
              type="file"
              accept=".jpg,.png,.pdf"
              style={styles.fileInput}
              onChange={(e) => setPayment({ ...payment, receiptFile: e.target.files[0] })}
              required
            />
          </div>

          {payment.receiptFile && (
            <p style={styles.fileName}>✔ {payment.receiptFile.name}</p>
          )}

          <label style={styles.label}>Notes (Optional)</label>
          <textarea
            style={styles.textarea}
            value={payment.notes}
            onChange={(e) => setPayment({ ...payment, notes: e.target.value })}
            placeholder="e.g. transfer reference code..."
          />

          <button type="submit" style={styles.submitBtn}>
            <FiCheck style={{ marginRight: 6 }} /> Submit Payment
          </button>
        </form>
      </div>
    </div>
  );
};

// ✅ Modal Styling
const styles = {
  overlay: {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2000
  },
  modal: {
    width: "400px",
    background: "#fff",
    padding: "22px",
    borderRadius: "10px",
    boxShadow: "0px 4px 20px rgba(0,0,0,0.2)",
    animation: "fadeIn 0.3s",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    fontWeight: 600,
    fontSize: "18px",
    display: "flex",
    alignItems: "center"
  },
  closeBtn: {
    border: "none",
    background: "transparent",
    cursor: "pointer"
  },
  debugInfo: {
    background: "#f3f4f6",
    padding: "8px",
    borderRadius: "4px",
    marginBottom: "10px",
    fontSize: "12px",
    color: "#6b7280"
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    fontSize: "14px",
    marginTop: 10,
    marginBottom: 4,
    fontWeight: "500"
  },
  input: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    outline: "none",
    width: "100%",
  },
  iconInput: {
    display: "flex",
    alignItems: "center",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: 6,
    gap: 6
  },
  uploadBox: {
    padding: "8px",
    border: "1px dashed #aaa",
    borderRadius: 6,
    display: "flex",
    alignItems: "center",
    gap: 8,
    cursor: "pointer"
  },
  fileInput: {
    flex: 1,
  },
  fileName: {
    fontSize: "13px",
    color: "green",
    marginTop: 4,
  },
  textarea: {
    height: "70px",
    padding: 10,
    borderRadius: 6,
    border: "1px solid #ddd",
    outline: "none"
  },
  submitBtn: {
    marginTop: 18,
    padding: "10px",
    background: "#0284C7",
    color: "#fff",
    fontWeight: "600",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }
};

export default SubsequentPaymentModal;