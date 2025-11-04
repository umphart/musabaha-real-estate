import Swal from "sweetalert2";

const PaymentInstructions = {
  show: () => {
    return Swal.fire({
      title: '<span style="font-size:14px;">Payment Instructions</span>',
      html: `
        <div style="text-align:left;font-size:11px;line-height:1.3;">
          <p><strong>Bank Transfer Details:</strong></p>

          <!-- Option 1 -->
          <div style="background:#f8f9fa;padding:6px;border-radius:4px;margin:4px 0;border-left:3px solid #2b6cb0;">
            <p style="margin:2px 0;font-weight:600;color:#2c5282;display:flex;align-items:center;gap:4px;">
              <span style="font-size:11px;">🏦</span> Option 1: Moniepoint MFB
            </p>
            <p style="margin:2px 0 0 16px;display:flex;align-items:center;gap:6px;">
              <strong>Acct No:</strong> 
              <span id="acct1">4957926955</span>
              <button id="copy1" 
                style="background:#edf2f7;border:none;padding:2px 6px;border-radius:3px;cursor:pointer;font-size:10px;">
                📋 Copy
              </button>
            </p>
            <p style="margin:1px 0 0 16px;"><strong>Name:</strong> Musabaha Homes and Related Services</p>
          </div>

          <!-- Option 2 -->
          <div style="background:#f0fff4;padding:6px;border-radius:4px;margin:4px 0;border-left:3px solid #38a169;">
            <p style="margin:2px 0;font-weight:600;color:#276749;display:flex;align-items:center;gap:4px;">
              <span style="font-size:11px;">💳</span> Option 2: Stanbic IBTC Bank
            </p>
            <p style="margin:2px 0 0 16px;display:flex;align-items:center;gap:6px;">
              <strong>Acct No:</strong> 
              <span id="acct2">0069055648</span>
              <button id="copy2" 
                style="background:#edf2f7;border:none;padding:2px 6px;border-radius:3px;cursor:pointer;font-size:10px;">
                📋 Copy
              </button>
            </p>
            <p style="margin:1px 0 0 16px;"><strong>Name:</strong> Musabaha Homes and Related Services</p>
          </div>

          <!-- Important Notes -->
          <div style="background:#fffaf0;padding:6px;border-radius:4px;border:1px solid #ed8936;margin-top:6px;">
            <p style="margin:2px 0;display:flex;align-items:center;gap:4px;">
              <span style="font-size:11px;">📝</span> 
              <strong>Important Notes</strong>
            </p>
            <ul style="margin:3px 0 2px 16px;padding-left:10px;font-size:10px;">
              <li>Make payment to either of the bank accounts above</li>
              <li>Upload your payment receipt/screenshot in the next step</li>
              <li>Payments will be verified before approval</li>
              <li>Keep your transaction reference for reference</li>
            </ul>
          </div>
        </div>
      `,
      icon: "info",
      confirmButtonText: "I Understand & Proceed",
      confirmButtonColor: "#2b6cb0",
      showCancelButton: true,
      cancelButtonText: "Cancel",
      width: "500px",
      didOpen: () => {
        const copyAction = (id, btnId) => {
          const text = document.getElementById(id).innerText;
          const btn = document.getElementById(btnId);
          navigator.clipboard.writeText(text).then(() => {
            const oldText = btn.innerText;
            btn.innerText = "✅ Copied!";
            btn.disabled = true;
            setTimeout(() => {
              btn.innerText = oldText;
              btn.disabled = false;
            }, 1500);
          });
        };

        document.getElementById("copy1").addEventListener("click", () => copyAction("acct1", "copy1"));
        document.getElementById("copy2").addEventListener("click", () => copyAction("acct2", "copy2"));
      },
    });
  }
};

export default PaymentInstructions;