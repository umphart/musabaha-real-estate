import React from 'react';


const TermsModal = ({ showTermsModal, setShowTermsModal }) => {
  if (!showTermsModal) return null;
    return (
      <div className="modal-overlay" onClick={() => setShowTermsModal(false)}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3>Terms and Conditions</h3>
            <button className="modal-close" onClick={() => setShowTermsModal(false)}>×</button>
          </div>
          <div className="modal-body">
            <div className="terms-content">
              <p><strong>By subscribing to this installment plan for a plot of land at Location Name, the Buyer agrees to the following terms and conditions:</strong></p>
              
              <ol>
                <li>The land is allocated strictly for residential use only. Commercial or industrial use is not permitted unless approved in writing.</li>
                
                <li>
                  <strong>PAYMENT STRUCTURE</strong>
                  <ul>
                    <li>Client agrees to pay the initial deposit before the installment plan begins.</li>
                    <li>Monthly payments must be made on or before the 5th of every month.</li>
                  </ul>
                </li>
                
                <li>
                  <strong>PENALTIES FOR LATE PAYMENT</strong>
                  <ul>
                    <li>₦5,000 penalty applies if payment is delayed beyond 7 days.</li>
                    <li>3 consecutive missed payments may result in allocation cancellation and refund with a 20% administrative fee.</li>
                  </ul>
                </li>
                
                <li>
                  <strong>DEFAULT & CANCELLATION POLICY</strong>
                  <ul>
                    <li>Failure to complete payments within the agreed period may lead to reallocation.</li>
                    <li>Refund requests will be processed within 90 days, minus administrative fees.</li>
                  </ul>
                </li>
                
                <li><strong>ALLOCATION OF PLOT</strong> - Final allocation and title documents will only be given after full payment.</li>
                
                <li>
                  <strong>TRANSFER OF OWNERSHIP</strong>
                  <ul>
                    <li>Client cannot resell or transfer ownership without company approval (on installment).</li>
                    <li>Ownership change requires a ₦20,000 processing fee.</li>
                  </ul>
                </li>
                
                <li>
                  <strong>Basic Facilities to Be Provided by Seller</strong>
                  <ul>
                    <li>Grading Access roads</li>
                    <li>Drainage on main roads</li>
                    <li>Solar street lights</li>
                    <li>Entry gate and security</li>
                  </ul>
                </li>
                
                <li>
                  <strong>DEVELOPMENT RESTRICTIONS</strong>
                  <ul>
                    <li>No development is allowed until full payment is made.</li>
                    <li>No batchers or temporary structures for residence.</li>
                    <li>No commercial use without approval.</li>
                  </ul>
                </li>
                <li>
                  <strong>NON-BUILDING PLAN</strong>
                  <ul>
                    <li>Buyer may hold land undeveloped, but must keep it clean and fenced.</li>
                  </ul>
                </li>
                <li>
                  <strong>MENTAL INCAPACITY</strong>
                  <ul>
                    <li>Upon receipt of notice that client/customer is suffering from mental incapacity, the next of kin must properly present the necessary evidence of all relevant documents and claim the right of ownership in support with witnesses.</li>
                  </ul>
                </li>
                
                <li>
                  <strong>DEATH</strong>
                  <ul>
                    <li>Death is an inevitable in nature to every human being in the world. In case we receive the notice of customer death, the contact should immediately be suspended, and only the next of kin/witnesses is liable to present the deed of the deceased attached with court order.</li>
                    <li><strong>Note:</strong> Debt must be settled before continuation or termination of contract.</li>
                  </ul>
                </li>
              </ol>
              
              <div className="payment-mode">
                <h5>PAYMENT MODE</h5>
                <div className="payment-options">
                  <span>Cheque</span>
                  <span>Bank Draft</span>
                  <span>E-Banking</span>
                </div>
                <p>1. All payments shall be made into MUSABAHA HOMES LTD. designated accounts.</p>
                <p>2. Allocations are done on the basis of first come first serve at full payment.</p>
                <p>3. This subscription form is free.</p>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button className="modal-button" onClick={() => setShowTermsModal(false)}>Close</button>
          </div>
        </div>
      </div>
    );
  };


export default TermsModal;