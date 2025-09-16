// import React, { useState } from 'react';
// import axios from 'axios';
// import './SubscriptionForm.css';

// const SubscriptionForm = () => {
//   const [formData, setFormData] = useState({
//     title: '',
//     name: '',
//     residentialAddress: '',
//     occupation: '',
//     officeAddress: '',
//     dob: '',
//     stateOfOrigin: '',
//     lga: '',
//     sex: '',
//     telephone: '',
//     nationality: '',
//     officeNumber: '',
//     homeNumber: '',
//     postalAddress: '',
//     email: '',
//     identification: '',
//     utilityBill: '',
//     nextOfKinName: '',
//     nextOfKinAddress: '',
//     nextOfKinRelationship: '',
//     nextOfKinTel: '',
//     nextOfKinOccupation: '',
//     nextOfKinOfficeAddress: '',
//     nextOfKinEmail: '',
//     estateName: '',
//     numberOfPlots: '',
//     proposedUse: '',
//     proposedType: '',
//     plotSize: '',
//     paymentTerms: '',
//     altContactName: '',
//     altContactAddress: '',
//     altContactRelationship: '',
//     altContactTel: '',
//     altContactEmail: '',
//     referralAgentName: '',
//     referralAgentContact: '',
//     agreedToTerms: false,
//     signatureText: ''
//   });

//   const [files, setFiles] = useState({
//     passportPhoto: null,
//     identificationFile: null,
//     utilityBillFile: null,
//     signatureFile: null
//   });

//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [responseMessage, setResponseMessage] = useState('');

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;

//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }));
//   };

//   const handleFileChange = (e) => {
//     const { name, files: selectedFiles } = e.target;
//     setFiles(prev => ({
//       ...prev,
//       [name]: selectedFiles[0]
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     setResponseMessage('');

//     const payload = new FormData();

//     // Append text fields
//     for (const key in formData) {
//       payload.append(key, formData[key]);
//     }

//     // Append files
//     for (const key in files) {
//       if (files[key]) {
//         payload.append(key, files[key]);
//       }
//     }

//     try {
//       const response = await axios.post('/api/subscriptions', payload, {
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         }
//       });

//       setResponseMessage('Subscription created successfully!');
//       setFormData({});
//       setFiles({});
//     } catch (err) {
//       console.error(err);
//       setResponseMessage('Error submitting subscription. Please try again.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="subscription-form-container">
//       <form className="form-overlay" onSubmit={handleSubmit}>
//         <div className="form-header">
//           <h2>Subscription Form</h2>
//           <h3>Complete your details below</h3>
//         </div>

//         <div className="form-section">
//           <h4>Personal Information</h4>
//           <div className="form-row">
//             <div className="form-group">
//               <label>Full Name</label>
//               <input name="name" value={formData.name || ''} onChange={handleChange} required />
//             </div>
//             <div className="form-group">
//               <label>Title</label>
//               <input name="title" value={formData.title || ''} onChange={handleChange} />
//             </div>
//           </div>

//           <div className="form-row">
//             <div className="form-group">
//               <label>Email</label>
//               <input name="email" type="email" value={formData.email || ''} onChange={handleChange} />
//             </div>
//             <div className="form-group">
//               <label>Phone Number</label>
//               <input name="telephone" value={formData.telephone || ''} onChange={handleChange} />
//             </div>
//           </div>

//           {/* File Upload */}
//           <div className="form-row">
//             <div className="form-group">
//               <label>Passport Photo</label>
//               <input type="file" name="passportPhoto" className="file-input" onChange={handleFileChange} />
//               <small>Accepted formats: jpg, png</small>
//             </div>
//             <div className="form-group">
//               <label>Identification Document</label>
//               <input type="file" name="identificationFile" className="file-input" onChange={handleFileChange} />
//               <small>e.g. National ID, Driver’s License</small>
//             </div>
//           </div>

//           <div className="form-row">
//             <div className="form-group">
//               <label>Utility Bill</label>
//               <input type="file" name="utilityBillFile" className="file-input" onChange={handleFileChange} />
//               <small>Recent bill (within 3 months)</small>
//             </div>
//             <div className="form-group">
//               <label>Signature</label>
//               <input type="file" name="signatureFile" className="file-input" onChange={handleFileChange} />
//               <small>Upload scanned signature</small>
//             </div>
//           </div>

//           {/* Terms Agreement */}
//           <div className="checkbox-label">
//             <input
//               type="checkbox"
//               name="agreedToTerms"
//               checked={formData.agreedToTerms || false}
//               onChange={handleChange}
//               required
//             />
//             <label>I agree to the terms and conditions.</label>
//           </div>
//         </div>

//         <div className="step-actions">
//           <button type="submit" className="submit-btn" disabled={isSubmitting}>
//             {isSubmitting ? 'Submitting...' : 'Submit'}
//           </button>
//         </div>

//         {responseMessage && (
//           <div className="terms-preview">
//             <strong>{responseMessage}</strong>
//           </div>
//         )}
//       </form>
//     </div>
//   );
// };

// export default SubscriptionForm;

import React, { useState,useEffect } from 'react';
import './SubscriptionForm.css';

const SubscriptionForm = () => {
  const [step, setStep] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    // Subscriber's Data
    title: '',
    name: '',
    residentialAddress: '',
    occupation: '',
    officeAddress: '',
    dob: '',
    stateOfOrigin: '',
    lga: '',
    sex: '',
    telephone: '',
    nationality: '',
    officeNumber: '',
    homeNumber: '',
    postalAddress: '',
    email: '',
    identification: '',
    utilityBill: '',
    passportPhoto: null,
    identificationFile: null,
    utilityBillFile: null,
    
    // Next of Kin's Data
    nextOfKinName: '',
    nextOfKinAddress: '',
    nextOfKinRelationship: '',
    nextOfKinTel: '',
    nextOfKinOccupation: '',
    nextOfKinOfficeAddress: '',
    nextOfKinEmail: '',
    
    // Plot Information
    estateName: '',
    numberOfPlots: '',
    proposedUse: '',
    proposedType: '',
    plotSize: '',
    paymentTerms: '',
    
    // Alternative Contact
    altContactName: '',
    altContactAddress: '',
    altContactRelationship: '',
    altContactTel: '',
    altContactEmail: '',
    
    // Referral Information
    referralAgentName: '',
    referralAgentContact: '',
    
    // Agreement
    agreedToTerms: false,
    signatureText: '',
    signatureFile: null
  });

const handleChange = (e) => {
  const { name, value, type, checked } = e.target;
  
  setFormData((prev) => ({
    ...prev,
    [name]: type === 'checkbox' ? checked : value,
  }));
};



  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files[0]
    }));
  };

  const nextStep = () => {
    setStep(step + 1);
    window.scrollTo(0, 0);
  };

  const prevStep = () => {
    setStep(step - 1);
    window.scrollTo(0, 0);
  };

  // Prevent form submission on Enter key press
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields on the last step
    if (!formData.agreedToTerms || !formData.signatureText) {
      alert("Please agree to the terms and provide a signature");
      return;
    }

    try {
      const data = new FormData();

      // Append all formData fields
      for (const key in formData) {
        if (formData[key] !== null && formData[key] !== undefined) {
          // For file inputs, we need to handle them differently
          if (formData[key] instanceof File) {
            data.append(key, formData[key], formData[key].name);
          } else {
            data.append(key, formData[key]);
          }
        }
      }

      const response = await fetch("http://localhost:5000/api/subscriptions", {
        method: "POST",
        body: data,
      });

      const result = await response.json();

      if (result.success) {
        alert("✅ Subscription created successfully!");
        // Reset form
        setStep(1);
        setFormData({
          title: '',
          name: '',
          residentialAddress: '',
          occupation: '',
          officeAddress: '',
          dob: '',
          stateOfOrigin: '',
          lga: '',
          sex: '',
          telephone: '',
          nationality: '',
          officeNumber: '',
          homeNumber: '',
          postalAddress: '',
          email: '',
          identification: '',
          utilityBill: '',
          passportPhoto: null,
          identificationFile: null,
          utilityBillFile: null,
          nextOfKinName: '',
          nextOfKinAddress: '',
          nextOfKinRelationship: '',
          nextOfKinTel: '',
          nextOfKinOccupation: '',
          nextOfKinOfficeAddress: '',
          nextOfKinEmail: '',
          estateName: '',
          numberOfPlots: '',
          proposedUse: '',
          proposedType: '',
          plotSize: '',
          paymentTerms: '',
          altContactName: '',
          altContactAddress: '',
          altContactRelationship: '',
          altContactTel: '',
          altContactEmail: '',
          referralAgentName: '',
          referralAgentContact: '',
          agreedToTerms: false,
          signatureText: '',
          signatureFile: null
        });
      } else {
        alert("❌ Failed to create subscription: " + (result.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      alert("Network error submitting subscription form");
    }
  };

  const TermsModal = () => {
    if (!showModal) return null;
    
    return (
      <div className="modal-overlay" onClick={() => setShowModal(false)}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3>Terms and Conditions</h3>
            <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
          </div>
          <div className="modal-body">
            <div className="terms-content">
              <p><strong>By subscribing to this installment plan for a plot of land at Location Name, the Buyer agrees to the following terms and conditions:</strong></p>
   
   
              
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
            <button className="modal-button" onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      </div>
    );
  };

  // Step 1: Subscriber's Data
  const Step1 = React.memo(() => (
  
    <div className="form-section" onKeyDown={handleKeyDown}>
      <h4>SUBSCRIBER'S DATA</h4>
      
      <div className="form-row">
        <div className="form-group">
          <label>Title *</label>
          <select 
            name="title" 
            value={formData.title} 
            onChange={handleChange}
            required
          >
            <option value="">Select Title</option>
            <option value="Mr.">Mr.</option>
            <option value="Miss.">Miss.</option>
            <option value="Mrs.">Mrs.</option>
            <option value="Chief.">Chief.</option>
            <option value="Dr.">Dr.</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>Full Name *</label>
<input 
  type="text" 
  name="name" 
  value={formData.name || ''} 
  onChange={handleChange}
/>


        </div>
      </div>

      <div className="form-group">
        <label>Residential Address *</label>
        <input 
          type="text" 
          name="residentialAddress" 
          value={formData.residentialAddress} 
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Occupation *</label>
          <input 
            type="text" 
            name="occupation" 
            value={formData.occupation} 
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Office Address</label>
          <input 
            type="text" 
            name="officeAddress" 
            value={formData.officeAddress} 
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Date of Birth *</label>
          <input 
            type="date" 
            name="dob" 
            value={formData.dob} 
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>State of Origin *</label>
          <input 
            type="text" 
            name="stateOfOrigin" 
            value={formData.stateOfOrigin} 
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>L.G.A *</label>
          <input 
            type="text" 
            name="lga" 
            value={formData.lga} 
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Sex *</label>
          <select 
            name="sex" 
            value={formData.sex} 
            onChange={handleChange}
            required
          >
            <option value="">Select Sex</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Telephone Number *</label>
          <input 
            type="tel" 
            name="telephone" 
            value={formData.telephone} 
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Nationality *</label>
          <input 
            type="text" 
            name="nationality" 
            value={formData.nationality} 
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Office Number</label>
          <input 
            type="tel" 
            name="officeNumber" 
            value={formData.officeNumber} 
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <label>Home Number</label>
          <input 
            type="tel" 
            name="homeNumber" 
            value={formData.homeNumber} 
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-group">
        <label>Postal Address</label>
        <input 
          type="text" 
          name="postalAddress" 
          value={formData.postalAddress} 
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Email Address *</label>
        <input 
          type="email" 
          name="email" 
          value={formData.email} 
          onChange={handleChange}
          required
        />
      </div>

      {/* Passport Photo Upload */}
      <div className="form-group">
        <label>Passport Photograph *</label>
        <input 
          type="file" 
          name="passportPhoto" 
          accept=".jpg,.jpeg,.png" 
          onChange={handleFileChange}
          required
          className="file-input"
        />
        <small>Please upload a recent passport photograph (JPG or PNG)</small>
      </div>

      <div className="form-row"> 
        {/* Mode of Identification */}
        <div className="form-group">
          <label>Mode of Identification *</label>
          <select 
            name="identification" 
            value={formData.identification} 
            onChange={handleChange}
            required
          >
            <option value="">Select ID</option>
            <option value="National ID Card">National ID Card</option>
            <option value="International Passport">International Passport</option>
            <option value="Driver's License">Driver's License</option>
          </select>

          {/* Upload ID File */}
          <input 
            type="file" 
            name="identificationFile" 
            accept=".jpg,.jpeg,.png,.pdf" 
            onChange={handleFileChange}
            required
            className="file-input"
          />
        </div>

        {/* Utility Bill */}
        <div className="form-group">
          <label>Copy of Current Utility Bill *</label>
          <select 
            name="utilityBill" 
            value={formData.utilityBill} 
            onChange={handleChange}
            required
          >
            <option value="">Select Utility Bill</option>
            <option value="Water Bill">Water Bill</option>
            <option value="Electricity Bill">Electricity Bill</option>
            <option value="LAWMA">LAWMA</option>
          </select>

          {/* Upload Utility Bill File */}
          <input 
            type="file" 
            name="utilityBillFile" 
            accept=".jpg,.jpeg,.png,.pdf" 
            onChange={handleFileChange}
            required
            className="file-input"
          />
        </div>
      </div>

      {/* Referral Agent Information */}
      <div className="form-section">
        <h4>REFERRAL AGENT INFORMATION (IF ANY)</h4>
        <div className="form-row">
          <div className="form-group">
            <label>Referral Agent Name</label>
            <input 
              type="text" 
              name="referralAgentName" 
              value={formData.referralAgentName} 
              onChange={handleChange}
              placeholder="Enter the name of the agent who referred you"
            />
          </div>
          
          <div className="form-group">
            <label>Agent Contact Number</label>
            <input 
              type="tel" 
              name="referralAgentContact" 
              value={formData.referralAgentContact} 
              onChange={handleChange}
              placeholder="Agent's phone number"
            />
          </div>
        </div>
      </div>

      <div className="step-actions">
        <button type="button" className="next-btn" onClick={nextStep}>
          Next: Next of Kin's Data
        </button>
      </div>
    </div>
  ));

  // Step 2: Next of Kin's Data & Plot Information
  const Step2 = () => (
    <div onKeyDown={handleKeyDown}>
      <div className="form-section">
        <h4>NEXT OF KIN'S DATA</h4>
        
        <div className="form-group">
          <label>Name *</label>
          <input 
            type="text" 
            name="nextOfKinName" 
            value={formData.nextOfKinName} 
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Residential Address *</label>
          <input 
            type="text" 
            name="nextOfKinAddress" 
            value={formData.nextOfKinAddress} 
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Relationship *</label>
            <input 
              type="text" 
              name="nextOfKinRelationship" 
              value={formData.nextOfKinRelationship} 
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Telephone *</label>
            <input 
              type="tel" 
              name="nextOfKinTel" 
              value={formData.nextOfKinTel} 
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Occupation</label>
            <input 
              type="text" 
              name="nextOfKinOccupation" 
              value={formData.nextOfKinOccupation} 
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label>Office Address</label>
            <input 
              type="text" 
              name="nextOfKinOfficeAddress" 
              value={formData.nextOfKinOfficeAddress} 
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Email Address</label>
          <input 
            type="email" 
            name="nextOfKinEmail" 
            value={formData.nextOfKinEmail} 
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-section">
        <h4>PLOT INFORMATION</h4>
        <div className="form-group">
          <label>Estate / Plot Location</label>
          <select
            name="estateName"
            value={formData.estateName}
            onChange={handleChange}
            required
          >
            <option value="">-- Select Estate Location --</option>
            <option value="Gwarzo Road Kano">Gwarzo Road Kano</option>
            <option value="Azman University Kano">Azman University Kano</option>
            <option value="Zaria Road Kano">Zaria Road Kano</option>
          </select>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Number of Plots *</label>
            <select 
              name="numberOfPlots" 
              value={formData.numberOfPlots} 
              onChange={handleChange}
              required
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5+">5+</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Plot Size *</label>
            <select 
              name="plotSize" 
              value={formData.plotSize} 
              onChange={handleChange}
              required
            >
              <option value="">Select Plot Size</option>
              <option value="50x50">50x50</option>
              <option value="75x50">75x50</option>
              <option value="50x100">50x100</option>
              <option value="100x100">100x100</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Proposed Use of Land *</label>
            <select 
              name="proposedUse" 
              value={formData.proposedUse} 
              onChange={handleChange}
              required
            >
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Proposed Type of House</label>
            <select 
              name="proposedType" 
              value={formData.proposedType} 
              onChange={handleChange}
            >
              <option value="">Select Type</option>
              <option value="Bungalow">Bungalow</option>
              <option value="Story Building">Story Building</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Payment Terms *</label>
          <select 
            name="paymentTerms" 
            value={formData.paymentTerms} 
            onChange={handleChange}
            required
          >
            <option value="">Select Payment Terms</option>
            <option value="Outright">Outright</option>
            <option value="3 months">3 months</option>
            <option value="6 months">6 months</option>
            <option value="12 months">12 months</option>
            <option value="13 months">13 months</option>
          </select>
        </div>
      </div>

      <div className="step-actions">
        <button type="button" className="prev-btn" onClick={prevStep}>
          Back: Subscriber's Data
        </button>
        <button type="button" className="next-btn" onClick={nextStep}>
          Next: Final Details
        </button>
      </div>
    </div>
  );

  // Step 3: Alternative Contact & Terms
  const Step3 = () => (
    <div onKeyDown={handleKeyDown}>
      <div className="form-section">
        <h4>ALTERNATIVE CONTACT DETAILS (OPTIONAL)</h4>
        
        <div className="form-group">
          <label>Name</label>
          <input 
            type="text" 
            name="altContactName" 
            value={formData.altContactName} 
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Address</label>
          <input 
            type="text" 
            name="altContactAddress" 
            value={formData.altContactAddress} 
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Relationship</label>
            <input 
              type="text" 
              name="altContactRelationship" 
              value={formData.altContactRelationship} 
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label>Telephone</label>
            <input 
              type="tel" 
              name="altContactTel" 
              value={formData.altContactTel} 
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Email Address</label>
          <input 
            type="email" 
            name="altContactEmail" 
            value={formData.altContactEmail} 
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-section terms-section">
        <h4>TERMS AND CONDITIONS</h4>
        
        <div className="terms-preview">
          <p>Please read and agree to our Terms and Conditions before submitting your subscription.</p>
          <button type="button" className="view-terms-btn" onClick={() => setShowModal(true)}>
            View Terms and Conditions
          </button>
        </div>
        
        <div className="agreement">
          <label className="checkbox-label">
            <input 
              type="checkbox" 
              name="agreedToTerms" 
              checked={formData.agreedToTerms} 
              onChange={handleChange}
              required
            />
            <span>I hereby confirm that I have read, understood, and agree to all the terms and conditions stated above. I shall strictly abide by the payment mode and shall submit copy(ies) of payment(s) made in favor of MUSABAHA HOMES LTD. promptly. I undertake to be liable if payment made is not in accordance with the above payment mode.</span>
          </label>
        </div>
        
        <div className="signature-section">
          <div className="form-group">
            <label>Signature *</label>
            <input 
              type="text" 
              name="signatureText"
              value={formData.signatureText || ""}
              onChange={handleChange}
              placeholder="Your full name as signature"
              required
            />
            <input 
              type="file" 
              name="signatureFile"
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={handleFileChange}
              className="file-input"
            />
          </div>
        </div>
      </div>

      <div className="step-actions">
        <button type="button" className="prev-btn" onClick={prevStep}>
          Back: Plot Information
        </button>
        <button type="submit" className="submit-btn" onClick={handleSubmit}>
          Submit Subscription Form
        </button>
      </div>
    </div>
  );

  return (
    <div className="subscription-form-container">
      <div className="form-overlay">
        <div className="form-header">
          <h2>MUSABAHA HOMES LTD.</h2>
          <p>RC NO.: 8176032</p>
          <h3>SUBSCRIPTION FORM</h3>
          <div className="progress-indicator">
            <div className={`step ${step >= 1 ? 'active' : ''}`}>1</div>
            <div className={`step ${step >= 2 ? 'active' : ''}`}>2</div>
            <div className={`step ${step >= 3 ? 'active' : ''}`}>3</div>
          </div>
        </div>
        
        <div className="subscription-form">
          {step === 1 && <Step1 />}
          {step === 2 && <Step2 />}
          {step === 3 && <Step3 />}
        </div>

        <div className="company-footer">
          <p><strong>MUSABAHA HOMES LTD.</strong></p>
          <p>No. 015, City Plaza Along Ring Road Western Bypass Along Yankaba Road, Kano State.</p>
          <p>📞 TEL: +2349084220705, +2349039108863, +2347038192719</p>
          <p>📧 Email: musababahomesth@gmail.com</p>
        </div>
      </div>

      <TermsModal />
    </div>
  );
};

export default SubscriptionForm;




import React, { useState } from 'react';
import './SubscriptionForm.css';

const SubscriptionForm = () => {
  const [step, setStep] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  
  const [formData, setFormData] = useState({
    // Subscriber's Data
    title: '',
    name: '',
    residentialAddress: '',
    occupation: '',
    officeAddress: '',
    dob: '',
    stateOfOrigin: '',
    lga: '',
    sex: '',
    telephone: '',
    nationality: '',
    officeNumber: '',
    homeNumber: '',
    postalAddress: '',
    email: '',
    identification: '',
    utilityBill: '',
    passportPhoto: null,
    identificationFile: null,
    utilityBillFile: null,
    
    // Next of Kin's Data
    nextOfKinName: '',
    nextOfKinAddress: '',
    nextOfKinRelationship: '',
    nextOfKinTel: '',
    nextOfKinOccupation: '',
    nextOfKinOfficeAddress: '',
    nextOfKinEmail: '',
    
    // Plot Information
    estateName: '',
    numberOfPlots: '',
    proposedUse: '',
    proposedType: '',
    plotSize: '',
    paymentTerms: '',
    
    // Alternative Contact
    altContactName: '',
    altContactAddress: '',
    altContactRelationship: '',
    altContactTel: '',
    altContactEmail: '',
    
    // Referral Information
    referralAgentName: '',
    referralAgentContact: '',
    
    // Agreement
    agreedToTerms: false,
    signatureText: '',
    signatureFile: null
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files[0]
    }));
  };

  const nextStep = () => {
    setStep(step + 1);
    window.scrollTo(0, 0);
  };

  const prevStep = () => {
    setStep(step - 1);
    window.scrollTo(0, 0);
  };

  // Prevent form submission on Enter key press
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setResponseMessage('');
    
    // Validate required fields on the last step
    if (!formData.agreedToTerms || !formData.signatureText) {
      alert("Please agree to the terms and provide a signature");
      setIsSubmitting(false);
      return;
    }

    try {
      const data = new FormData();

      // Append all formData fields
      for (const key in formData) {
        if (formData[key] !== null && formData[key] !== undefined) {
          // For file inputs, we need to handle them differently
          if (formData[key] instanceof File) {
            data.append(key, formData[key], formData[key].name);
          } else {
            data.append(key, formData[key]);
          }
        }
      }

      const response = await fetch("http://localhost:5000/api/subscriptions", {
        method: "POST",
        body: data,
      });

      const result = await response.json();

      if (result.success) {
        setResponseMessage("✅ Subscription created successfully!");
        // Reset form
        setStep(1);
        setFormData({
          title: '',
          name: '',
          residentialAddress: '',
          occupation: '',
          officeAddress: '',
          dob: '',
          stateOfOrigin: '',
          lga: '',
          sex: '',
          telephone: '',
          nationality: '',
          officeNumber: '',
          homeNumber: '',
          postalAddress: '',
          email: '',
          identification: '',
          utilityBill: '',
          passportPhoto: null,
          identificationFile: null,
          utilityBillFile: null,
          nextOfKinName: '',
          nextOfKinAddress: '',
          nextOfKinRelationship: '',
          nextOfKinTel: '',
          nextOfKinOccupation: '',
          nextOfKinOfficeAddress: '',
          nextOfKinEmail: '',
          estateName: '',
          numberOfPlots: '',
          proposedUse: '',
          proposedType: '',
          plotSize: '',
          paymentTerms: '',
          altContactName: '',
          altContactAddress: '',
          altContactRelationship: '',
          altContactTel: '',
          altContactEmail: '',
          referralAgentName: '',
          referralAgentContact: '',
          agreedToTerms: false,
          signatureText: '',
          signatureFile: null
        });
      } else {
        setResponseMessage("❌ Failed to create subscription: " + (result.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      setResponseMessage("Network error submitting subscription form");
    } finally {
      setIsSubmitting(false);
    }
  };

  const TermsModal = () => {
    if (!showModal) return null;
    
    return (
      <div className="modal-overlay" onClick={() => setShowModal(false)}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3>Terms and Conditions</h3>
            <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
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
                
                <li><strong>ALLocation OF PLOT</strong> - Final allocation and title documents will only be given after full payment.</li>
                
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
            <button className="modal-button" onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      </div>
    );
  };

  // Step 1: Subscriber's Data
  const Step1 = () => (
    <div className="form-section" onKeyDown={handleKeyDown}>
      <h4>SUBSCRIBER'S DATA</h4>
      
      <div className="form-row">
        <div className="form-group">
          <label>Title *</label>
          <select 
            name="title" 
            value={formData.title} 
            onChange={handleChange}
            required
          >
            <option value="">Select Title</option>
            <option value="Mr.">Mr.</option>
            <option value="Miss.">Miss.</option>
            <option value="Mrs.">Mrs.</option>
            <option value="Chief.">Chief.</option>
            <option value="Dr.">Dr.</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>Full Name *</label>
          <input 
            type="text" 
            name="name" 
            value={formData.name} 
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label>Residential Address *</label>
        <input 
          type="text" 
          name="residentialAddress" 
          value={formData.residentialAddress} 
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Occupation *</label>
          <input 
            type="text" 
            name="occupation" 
            value={formData.occupation} 
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Office Address</label>
          <input 
            type="text" 
            name="officeAddress" 
            value={formData.officeAddress} 
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Date of Birth *</label>
          <input 
            type="date" 
            name="dob" 
            value={formData.dob} 
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>State of Origin *</label>
          <input 
            type="text" 
            name="stateOfOrigin" 
            value={formData.stateOfOrigin} 
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>L.G.A *</label>
          <input 
            type="text" 
            name="lga" 
            value={formData.lga} 
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Sex *</label>
          <select 
            name="sex" 
            value={formData.sex} 
            onChange={handleChange}
            required
          >
            <option value="">Select Sex</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Telephone Number *</label>
          <input 
            type="tel" 
            name="telephone" 
            value={formData.telephone} 
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Nationality *</label>
          <input 
            type="text" 
            name="nationality" 
            value={formData.nationality} 
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Office Number</label>
          <input 
            type="tel" 
            name="officeNumber" 
            value={formData.officeNumber} 
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <label>Home Number</label>
          <input 
            type="tel" 
            name="homeNumber" 
            value={formData.homeNumber} 
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-group">
        <label>Postal Address</label>
        <input 
          type="text" 
          name="postalAddress" 
          value={formData.postalAddress} 
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Email Address *</label>
        <input 
          type="email" 
          name="email" 
          value={formData.email} 
          onChange={handleChange}
          required
        />
      </div>

      {/* Passport Photo Upload */}
      <div className="form-group">
        <label>Passport Photograph *</label>
        <input 
          type="file" 
          name="passportPhoto" 
          accept=".jpg,.jpeg,.png" 
          onChange={handleFileChange}
          required
          className="file-input"
        />
        <small>Please upload a recent passport photograph (JPG or PNG)</small>
      </div>

      <div className="form-row"> 
        {/* Mode of Identification */}
        <div className="form-group">
          <label>Mode of Identification *</label>
          <select 
            name="identification" 
            value={formData.identification} 
            onChange={handleChange}
            required
          >
            <option value="">Select ID</option>
            <option value="National ID Card">National ID Card</option>
            <option value="International Passport">International Passport</option>
            <option value="Driver's License">Driver's License</option>
          </select>

          {/* Upload ID File */}
          <input 
            type="file" 
            name="identificationFile" 
            accept=".jpg,.jpeg,.png,.pdf" 
            onChange={handleFileChange}
            required
            className="file-input"
          />
        </div>

        {/* Utility Bill */}
        <div className="form-group">
          <label>Copy of Current Utility Bill *</label>
          <select 
            name="utilityBill" 
            value={formData.utilityBill} 
            onChange={handleChange}
            required
          >
            <option value="">Select Utility Bill</option>
            <option value="Water Bill">Water Bill</option>
            <option value="Electricity Bill">Electricity Bill</option>
            <option value="LAWMA">LAWMA</option>
          </select>

          {/* Upload Utility Bill File */}
          <input 
            type="file" 
            name="utilityBillFile" 
            accept=".jpg,.jpeg,.png,.pdf" 
            onChange={handleFileChange}
            required
            className="file-input"
          />
        </div>
      </div>

      {/* Referral Agent Information */}
      <div className="form-section">
        <h4>REFERRAL AGENT INFORMATION (IF ANY)</h4>
        <div className="form-row">
          <div className="form-group">
            <label>Referral Agent Name</label>
            <input 
              type="text" 
              name="referralAgentName" 
              value={formData.referralAgentName} 
              onChange={handleChange}
              placeholder="Enter the name of the agent who referred you"
            />
          </div>
          
          <div className="form-group">
            <label>Agent Contact Number</label>
            <input 
              type="tel" 
              name="referralAgentContact" 
              value={formData.referralAgentContact} 
              onChange={handleChange}
              placeholder="Agent's phone number"
            />
          </div>
        </div>
      </div>

      <div className="step-actions">
        <button type="button" className="next-btn" onClick={nextStep}>
          Next: Next of Kin's Data
        </button>
      </div>
    </div>
  );

  
  // Step 3: Alternative Contact & Terms
const Step3 = () => (
    <div onKeyDown={handleKeyDown}>
      <div className="form-section">
        <h4>ALTERNATIVE CONTACT DETAILS (OPTIONAL)</h4>
        
        <div className="form-group">
          <label>Name</label>
          <input 
            type="text" 
            name="altContactName" 
            value={formData.altContactName} 
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Address</label>
          <input 
            type="text" 
            name="altContactAddress" 
            value={formData.altContactAddress} 
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Relationship</label>
            <input 
              type="text" 
              name="altContactRelationship" 
              value={formData.altContactRelationship} 
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label>Telephone</label>
            <input 
              type="tel" 
              name="altContactTel" 
              value={formData.altContactTel} 
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Email Address</label>
          <input 
            type="email" 
            name="altContactEmail" 
            value={formData.altContactEmail} 
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-section terms-section">
        <h4>TERMS AND CONDITIONS</h4>
        
        <div className="terms-preview">
          <p>Please read and agree to our Terms and Conditions before submitting your subscription.</p>
          <button type="button" className="view-terms-btn" onClick={() => setShowModal(true)}>
            View Terms and Conditions
          </button>
        </div>
        
        <div className="agreement">
          <label className="checkbox-label">
            <input 
              type="checkbox" 
              name="agreedToTerms" 
              checked={formData.agreedToTerms} 
              onChange={handleChange}
              required
            />
            <span>I hereby confirm that I have read, understood, and agree to all the terms and conditions stated above. I shall strictly abide by the payment mode and shall submit copy(ies) of payment(s) made in favor of MUSABAHA HOMES LTD. promptly. I undertake to be liable if payment made is not in accordance with the above payment mode.</span>
          </label>
        </div>
        
        <div className="signature-section">
          <div className="form-group">
            <label>Signature *</label>
            <input 
              type="text" 
              name="signatureText"
              value={formData.signatureText || ""}
              onChange={handleChange}
              placeholder="Your full name as signature"
              required
            />
            <input 
              type="file" 
              name="signatureFile"
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={handleFileChange}
              className="file-input"
            />
          </div>
        </div>
      </div>

      {responseMessage && (
        <div className="response-message">
          {responseMessage}
        </div>
      )}

      <div className="step-actions">
        <button type="button" className="prev-btn" onClick={prevStep}>
          Back: Plot Information
        </button>
        <button 
          type="button" 
          className="submit-btn" 
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Subscription Form'}
        </button>
      </div>
    </div>
  );

return (
  <div className="subscription-form-container">
    <div className="form-overlay">
      <div className="form-header">
        <h2>MUSABAHA HOMES LTD.</h2>
        <p>RC NO.: 8176032</p>
        <h3>SUBSCRIPTION FORM</h3>
        <div className="progress-indicator">
          <div className={`step ${step >= 1 ? 'active' : ''}`}>1</div>
          <div className={`step ${step >= 2 ? 'active' : ''}`}>2</div>
          <div className={`step ${step >= 3 ? 'active' : ''}`}>3</div>
        </div>
      </div>
      
      <div className="subscription-form">
        {step === 1 && <Step1 />}
  
        {step === 3 && <Step3 />}
      </div>

      <div className="company-footer">
        <p><strong>MUSABAHA HOMES LTD.</strong></p>
        <p>No. 015, City Plaza Along Ring Road Western Bypass Along Yankaba Road, Kano State.</p>
        <p>📞 TEL: +2349084220705, +2349039108863, +2347038192719</p>
        <p>📧 Email: musababahomesth@gmail.com</p>
      </div>
    </div>

    <TermsModal />
  </div>
);
};


export default SubscriptionForm;


import React, { useState } from 'react';
import './SubscriptionForm.css';

const SubscriptionForm = () => {
  const [step, setStep] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    // Subscriber's Data
    title: '',
    name: '',
    residentialAddress: '',
    occupation: '',
    officeAddress: '',
    dob: '',
    stateOfOrigin: '',
    lga: '',
    sex: '',
    telephone: '',
    nationality: '',
    officeNumber: '',
    homeNumber: '',
    postalAddress: '',
    email: '',
    identification: '',
    utilityBill: '',
    passportPhoto: null,
    identificationFile: null,
    utilityBillFile: null,
    
    // Next of Kin's Data
    nextOfKinName: '',
    nextOfKinAddress: '',
    nextOfKinRelationship: '',
    nextOfKinTel: '',
    nextOfKinOccupation: '',
    nextOfKinOfficeAddress: '',
    nextOfKinEmail: '',
    
    // Plot Information
    estateName: '',
    numberOfPlots: '',
    proposedUse: '',
    proposedType: '',
    plotSize: '',
    paymentTerms: '',
    
    // Alternative Contact
    altContactName: '',
    altContactAddress: '',
    altContactRelationship: '',
    altContactTel: '',
    altContactEmail: '',
    
    // Referral Information
    referralAgentName: '',
    referralAgentContact: '',
    
    // Agreement
    agreedToTerms: false,
    signatureText: '',
    signatureFile: null
  });

  // Field length validation based on database constraints
  const fieldMaxLengths = {
    title: 10,
    name: 100,
    residentialAddress: 200,
    occupation: 50,
    officeAddress: 200,
    stateOfOrigin: 50,
    lga: 50,
    sex: 10,
    telephone: 20,
    nationality: 50,
    officeNumber: 20,
    homeNumber: 20,
    postalAddress: 200,
    email: 100,
    identification: 50,
    utilityBill: 50,
    nextOfKinName: 100,
    nextOfKinAddress: 200,
    nextOfKinRelationship: 50,
    nextOfKinTel: 20,
    nextOfKinOccupation: 50,
    nextOfKinOfficeAddress: 200,
    nextOfKinEmail: 100,
    estateName: 100,
    numberOfPlots: 10,
    proposedUse: 50,
    proposedType: 50,
    plotSize: 20,
    paymentTerms: 50,
    altContactName: 100,
    altContactAddress: 200,
    altContactRelationship: 50,
    altContactTel: 20,
    altContactEmail: 100,
    referralAgentName: 100,
    referralAgentContact: 20,
    signatureText: 100
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.title) newErrors.title = 'Title is required';
      if (!formData.name) newErrors.name = 'Full name is required';
      if (formData.name && formData.name.length > fieldMaxLengths.name) 
        newErrors.name = `Name must be less than ${fieldMaxLengths.name} characters`;
      if (!formData.residentialAddress) newErrors.residentialAddress = 'Residential address is required';
      if (!formData.occupation) newErrors.occupation = 'Occupation is required';
      if (formData.occupation && formData.occupation.length > fieldMaxLengths.occupation) 
        newErrors.occupation = `Occupation must be less than ${fieldMaxLengths.occupation} characters`;
      if (!formData.dob) newErrors.dob = 'Date of birth is required';
      if (!formData.stateOfOrigin) newErrors.stateOfOrigin = 'State of origin is required';
      if (!formData.lga) newErrors.lga = 'LGA is required';
      if (!formData.sex) newErrors.sex = 'Sex is required';
      if (!formData.telephone) newErrors.telephone = 'Telephone is required';
      if (formData.telephone && formData.telephone.length > fieldMaxLengths.telephone) 
        newErrors.telephone = `Telephone must be less than ${fieldMaxLengths.telephone} characters`;
      if (!formData.nationality) newErrors.nationality = 'Nationality is required';
      if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) 
        newErrors.email = 'Email is invalid';
      if (!formData.identification) newErrors.identification = 'Identification is required';
      if (!formData.utilityBill) newErrors.utilityBill = 'Utility bill is required';
      if (!formData.passportPhoto) newErrors.passportPhoto = 'Passport photo is required';
      if (!formData.identificationFile) newErrors.identificationFile = 'Identification document is required';
      if (!formData.utilityBillFile) newErrors.utilityBillFile = 'Utility bill document is required';
    }
    
    if (step === 2) {
      if (!formData.nextOfKinName) newErrors.nextOfKinName = 'Next of kin name is required';
      if (!formData.nextOfKinAddress) newErrors.nextOfKinAddress = 'Next of kin address is required';
      if (!formData.nextOfKinRelationship) newErrors.nextOfKinRelationship = 'Relationship is required';
      if (!formData.nextOfKinTel) newErrors.nextOfKinTel = 'Next of kin telephone is required';
      if (formData.nextOfKinTel && formData.nextOfKinTel.length > fieldMaxLengths.nextOfKinTel) 
        newErrors.nextOfKinTel = `Telephone must be less than ${fieldMaxLengths.nextOfKinTel} characters`;
      if (!formData.nextOfKinOccupation) newErrors.nextOfKinOccupation = 'Next of kin occupation is required';
      if (formData.nextOfKinEmail && !/\S+@\S+\.\S+/.test(formData.nextOfKinEmail)) 
        newErrors.nextOfKinEmail = 'Email is invalid';
    }
    
    if (step === 3) {
      if (!formData.estateName) newErrors.estateName = 'Estate name is required';
      if (!formData.numberOfPlots) newErrors.numberOfPlots = 'Number of plots is required';
      if (!formData.proposedUse) newErrors.proposedUse = 'Proposed use is required';
      if (!formData.proposedType) newErrors.proposedType = 'Proposed type is required';
      if (!formData.plotSize) newErrors.plotSize = 'Plot size is required';
      if (!formData.paymentTerms) newErrors.paymentTerms = 'Payment terms is required';
    }
    
    if (step === 4) {
      if (!formData.altContactName) newErrors.altContactName = 'Alternative contact name is required';
      if (!formData.altContactAddress) newErrors.altContactAddress = 'Alternative contact address is required';
      if (!formData.altContactTel) newErrors.altContactTel = 'Alternative contact telephone is required';
      if (formData.altContactEmail && !/\S+@\S+\.\S+/.test(formData.altContactEmail)) 
        newErrors.altContactEmail = 'Email is invalid';
    }
    
    if (step === 5) {
      if (!formData.agreedToTerms) newErrors.agreedToTerms = 'You must agree to the terms and conditions';
      if (!formData.signatureText) newErrors.signatureText = 'Signature is required';
      if (formData.signatureText && formData.signatureText.length > fieldMaxLengths.signatureText) 
        newErrors.signatureText = `Signature must be less than ${fieldMaxLengths.signatureText} characters`;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    // Apply field length restrictions
    if (type !== 'file' && type !== 'checkbox' && fieldMaxLengths[name]) {
      if (value.length > fieldMaxLengths[name]) {
        return; // Don't update if exceeds max length
      }
    }
    
    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else if (type === 'file') {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    
    // Clear error when field is updated
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handlePrev = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(5)) {
      return;
    }

    try {
      const data = new FormData();

      // Append all formData fields
      for (const key in formData) {
        if (formData[key] !== null && formData[key] !== undefined) {
          // For file inputs, we need to handle them differently
          if (formData[key] instanceof File) {
            data.append(key, formData[key], formData[key].name);
          } else {
            data.append(key, formData[key]);
          }
        }
      }

      const response = await fetch("http://localhost:5000/api/subscriptions", {
        method: "POST",
        body: data,
      });

      const result = await response.json();

      if (result.success) {
        alert("✅ Subscription created successfully!");
        // Reset form
        setStep(1);
        setFormData({
          title: '',
          name: '',
          residentialAddress: '',
          occupation: '',
          officeAddress: '',
          dob: '',
          stateOfOrigin: '',
          lga: '',
          sex: '',
          telephone: '',
          nationality: '',
          officeNumber: '',
          homeNumber: '',
          postalAddress: '',
          email: '',
          identification: '',
          utilityBill: '',
          passportPhoto: null,
          identificationFile: null,
          utilityBillFile: null,
          nextOfKinName: '',
          nextOfKinAddress: '',
          nextOfKinRelationship: '',
          nextOfKinTel: '',
          nextOfKinOccupation: '',
          nextOfKinOfficeAddress: '',
          nextOfKinEmail: '',
          estateName: '',
          numberOfPlots: '',
          proposedUse: '',
          proposedType: '',
          plotSize: '',
          paymentTerms: '',
          altContactName: '',
          altContactAddress: '',
          altContactRelationship: '',
          altContactTel: '',
          altContactEmail: '',
          referralAgentName: '',
          referralAgentContact: '',
          agreedToTerms: false,
          signatureText: '',
          signatureFile: null
        });
        setErrors({});
      } else {
        alert("❌ Failed to create subscription: " + (result.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      alert("Network error submitting subscription form");
    }
  };

  const TermsModal = () => {
    if (!showModal) return null;
    
    return (
      <div className="modal-overlay" onClick={() => setShowModal(false)}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3>Terms and Conditions</h3>
            <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
          </div>
          <div className="modal-body">
            <div className="terms-content">
              <p><strong>By subscribing to this installment plan for a plot of land at Location Name, the Buyer agrees to the following terms and conditions:</strong></p>
              
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
            <button className="modal-button" onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="subscription-form-container">
      <div className="form-overlay">
        <form onSubmit={handleSubmit}>
          <div className="form-header">
            <h2>MUSABAHA HOMES LTD.</h2>
            <h3>PLOT SUBSCRIPTION FORM</h3>
          </div>

          <div className="progress-indicator">
            {[1, 2, 3, 4, 5].map((num) => (
              <div key={num} className={`step ${step === num ? 'active' : ''}`}>
                {num}
              </div>
            ))}
          </div>

          {/* Step 1: Subscriber's Data */}
          {step === 1 && (
            <div className="form-section">
              <h4>Subscriber's Data</h4>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Title *</label>
                  <select name="title" value={formData.title} onChange={handleChange} required>
                    <option value="">Select Title</option>
                    <option value="Mr">Mr</option>
                    <option value="Mrs">Mrs</option>
                    <option value="Miss">Miss</option>
                    <option value="Dr">Dr</option>
                    <option value="Prof">Prof</option>
                  </select>
                  {errors.title && <span className="error-text">{errors.title}</span>}
                </div>
                
                <div className="form-group">
                  <label>Full Name *</label>
                  <input 
                    type="text" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    maxLength={fieldMaxLengths.name}
                    required 
                  />
                  {errors.name && <span className="error-text">{errors.name}</span>}
                </div>
              </div>
              
              <div className="form-group">
                <label>Residential Address *</label>
                <input 
                  type="text" 
                  name="residentialAddress" 
                  value={formData.residentialAddress} 
                  onChange={handleChange} 
                  maxLength={fieldMaxLengths.residentialAddress}
                  required 
                />
                {errors.residentialAddress && <span className="error-text">{errors.residentialAddress}</span>}
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Occupation *</label>
                  <input 
                    type="text" 
                    name="occupation" 
                    value={formData.occupation} 
                    onChange={handleChange} 
                    maxLength={fieldMaxLengths.occupation}
                    required 
                  />
                  {errors.occupation && <span className="error-text">{errors.occupation}</span>}
                </div>
                
                <div className="form-group">
                  <label>Office Address</label>
                  <input 
                    type="text" 
                    name="officeAddress" 
                    value={formData.officeAddress} 
                    onChange={handleChange} 
                    maxLength={fieldMaxLengths.officeAddress}
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Date of Birth *</label>
                  <input type="date" name="dob" value={formData.dob} onChange={handleChange} required />
                  {errors.dob && <span className="error-text">{errors.dob}</span>}
                </div>
                
                <div className="form-group">
                  <label>State of Origin *</label>
                  <input 
                    type="text" 
                    name="stateOfOrigin" 
                    value={formData.stateOfOrigin} 
                    onChange={handleChange} 
                    maxLength={fieldMaxLengths.stateOfOrigin}
                    required 
                  />
                  {errors.stateOfOrigin && <span className="error-text">{errors.stateOfOrigin}</span>}
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>LGA *</label>
                  <input 
                    type="text" 
                    name="lga" 
                    value={formData.lga} 
                    onChange={handleChange} 
                    maxLength={fieldMaxLengths.lga}
                    required 
                  />
                  {errors.lga && <span className="error-text">{errors.lga}</span>}
                </div>
                
                <div className="form-group">
                  <label>Sex *</label>
                  <select name="sex" value={formData.sex} onChange={handleChange} required>
                    <option value="">Select Sex</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                  {errors.sex && <span className="error-text">{errors.sex}</span>}
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Telephone *</label>
                  <input 
                    type="tel" 
                    name="telephone" 
                    value={formData.telephone} 
                    onChange={handleChange} 
                    maxLength={fieldMaxLengths.telephone}
                    required 
                  />
                  {errors.telephone && <span className="error-text">{errors.telephone}</span>}
                </div>
                
                <div className="form-group">
                  <label>Nationality *</label>
                  <input 
                    type="text" 
                    name="nationality" 
                    value={formData.nationality} 
                    onChange={handleChange} 
                    maxLength={fieldMaxLengths.nationality}
                    required 
                  />
                  {errors.nationality && <span className="error-text">{errors.nationality}</span>}
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Office Number</label>
                  <input 
                    type="tel" 
                    name="officeNumber" 
                    value={formData.officeNumber} 
                    onChange={handleChange} 
                    maxLength={fieldMaxLengths.officeNumber}
                  />
                </div>
                
                <div className="form-group">
                  <label>Home Number</label>
                  <input 
                    type="tel" 
                    name="homeNumber" 
                    value={formData.homeNumber} 
                    onChange={handleChange} 
                    maxLength={fieldMaxLengths.homeNumber}
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Postal Address</label>
                  <input 
                    type="text" 
                    name="postalAddress" 
                    value={formData.postalAddress} 
                    onChange={handleChange} 
                    maxLength={fieldMaxLengths.postalAddress}
                  />
                </div>
                
                <div className="form-group">
                  <label>Email *</label>
                  <input 
                    type="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    maxLength={fieldMaxLengths.email}
                    required 
                  />
                  {errors.email && <span className="error-text">{errors.email}</span>}
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Means of Identification *</label>
                  <select name="identification" value={formData.identification} onChange={handleChange} required>
                    <option value="">Select ID</option>
                    <option value="National ID">National ID</option>
                    <option value="Driver's License">Driver's License</option>
                    <option value="International Passport">International Passport</option>
                    <option value="Voter's Card">Voter's Card</option>
                  </select>
                  {errors.identification && <span className="error-text">{errors.identification}</span>}
                </div>
                
                <div className="form-group">
                  <label>Utility Bill *</label>
                  <select name="utilityBill" value={formData.utilityBill} onChange={handleChange} required>
                    <option value="">Select Utility Bill</option>
                    <option value="Electricity Bill">Electricity Bill</option>
                    <option value="Water Bill">Water Bill</option>
                    <option value="Waste Bill">Waste Bill</option>
                  </select>
                  {errors.utilityBill && <span className="error-text">{errors.utilityBill}</span>}
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Passport Photo *</label>
                  <input type="file" name="passportPhoto" onChange={handleChange} accept="image/*" required />
                  <small>Upload a recent passport photograph</small>
                  {errors.passportPhoto && <span className="error-text">{errors.passportPhoto}</span>}
                </div>
                
                <div className="form-group">
                  <label>Identification Document *</label>
                  <input type="file" name="identificationFile" onChange={handleChange} accept="image/*,.pdf" required />
                  <small>Upload a clear copy of your ID</small>
                  {errors.identificationFile && <span className="error-text">{errors.identificationFile}</span>}
                </div>
              </div>
              
              <div className="form-group">
                <label>Utility Bill Document *</label>
                <input type="file" name="utilityBillFile" onChange={handleChange} accept="image/*,.pdf" required />
                <small>Upload a clear copy of your utility bill</small>
                {errors.utilityBillFile && <span className="error-text">{errors.utilityBillFile}</span>}
              </div>
            </div>
          )}

          {/* Step 2: Next of Kin's Data */}
          {step === 2 && (
            <div className="form-section">
              <h4>Next of Kin's Data</h4>
              
              <div className="form-group">
                <label>Full Name *</label>
                <input 
                  type="text" 
                  name="nextOfKinName" 
                  value={formData.nextOfKinName} 
                  onChange={handleChange} 
                  maxLength={fieldMaxLengths.nextOfKinName}
                  required 
                />
                {errors.nextOfKinName && <span className="error-text">{errors.nextOfKinName}</span>}
              </div>
              
              <div className="form-group">
                <label>Address *</label>
                <input 
                  type="text" 
                  name="nextOfKinAddress" 
                  value={formData.nextOfKinAddress} 
                  onChange={handleChange} 
                  maxLength={fieldMaxLengths.nextOfKinAddress}
                  required 
                />
                {errors.nextOfKinAddress && <span className="error-text">{errors.nextOfKinAddress}</span>}
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Relationship *</label>
                  <input 
                    type="text" 
                    name="nextOfKinRelationship" 
                    value={formData.nextOfKinRelationship} 
                    onChange={handleChange} 
                    maxLength={fieldMaxLengths.nextOfKinRelationship}
                    required 
                  />
                  {errors.nextOfKinRelationship && <span className="error-text">{errors.nextOfKinRelationship}</span>}
                </div>
                
                <div className="form-group">
                  <label>Telephone *</label>
                  <input 
                    type="tel" 
                    name="nextOfKinTel" 
                    value={formData.nextOfKinTel} 
                    onChange={handleChange} 
                    maxLength={fieldMaxLengths.nextOfKinTel}
                    required 
                  />
                  {errors.nextOfKinTel && <span className="error-text">{errors.nextOfKinTel}</span>}
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Occupation *</label>
                  <input 
                    type="text" 
                    name="nextOfKinOccupation" 
                    value={formData.nextOfKinOccupation} 
                    onChange={handleChange} 
                    maxLength={fieldMaxLengths.nextOfKinOccupation}
                    required 
                  />
                  {errors.nextOfKinOccupation && <span className="error-text">{errors.nextOfKinOccupation}</span>}
                </div>
                
                <div className="form-group">
                  <label>Office Address</label>
                  <input 
                    type="text" 
                    name="nextOfKinOfficeAddress" 
                    value={formData.nextOfKinOfficeAddress} 
                    onChange={handleChange} 
                    maxLength={fieldMaxLengths.nextOfKinOfficeAddress}
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Email</label>
                <input 
                  type="email" 
                  name="nextOfKinEmail" 
                  value={formData.nextOfKinEmail} 
                  onChange={handleChange} 
                  maxLength={fieldMaxLengths.nextOfKinEmail}
                />
                {errors.nextOfKinEmail && <span className="error-text">{errors.nextOfKinEmail}</span>}
              </div>
            </div>
          )}

          {/* Step 3: Plot Information */}
          {step === 3 && (
            <div className="form-section">
              <h4>Plot Information</h4>
              
              <div className="form-group">
                <label>Estate Name *</label>
                <input 
                  type="text" 
                  name="estateName" 
                  value={formData.estateName} 
                  onChange={handleChange} 
                  maxLength={fieldMaxLengths.estateName}
                  required 
                />
                {errors.estateName && <span className="error-text">{errors.estateName}</span>}
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Number of Plots *</label>
                  <input 
                    type="number" 
                    name="numberOfPlots" 
                    value={formData.numberOfPlots} 
                    onChange={handleChange} 
                    min="1" 
                    maxLength={fieldMaxLengths.numberOfPlots}
                    required 
                  />
                  {errors.numberOfPlots && <span className="error-text">{errors.numberOfPlots}</span>}
                </div>
                
                <div className="form-group">
                  <label>Proposed Use *</label>
                  <select name="proposedUse" value={formData.proposedUse} onChange={handleChange} required>
                    <option value="">Select Use</option>
                    <option value="Residential">Residential</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Industrial">Industrial</option>
                    <option value="Agricultural">Agricultural</option>
                  </select>
                  {errors.proposedUse && <span className="error-text">{errors.proposedUse}</span>}
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Proposed Type *</label>
                  <select name="proposedType" value={formData.proposedType} onChange={handleChange} required>
                    <option value="">Select Type</option>
                    <option value="Bungalow">Bungalow</option>
                    <option value="Duplex">Duplex</option>
                    <option value="Block of Flats">Block of Flats</option>
                    <option value="Warehouse">Warehouse</option>
                  </select>
                  {errors.proposedType && <span className="error-text">{errors.proposedType}</span>}
                </div>
                
                <div className="form-group">
                  <label>Plot Size *</label>
                  <input 
                    type="text" 
                    name="plotSize" 
                    value={formData.plotSize} 
                    onChange={handleChange} 
                    maxLength={fieldMaxLengths.plotSize}
                    required 
                  />
                  {errors.plotSize && <span className="error-text">{errors.plotSize}</span>}
                </div>
              </div>
              
              <div className="form-group">
                <label>Payment Terms *</label>
                <select name="paymentTerms" value={formData.paymentTerms} onChange={handleChange} required>
                  <option value="">Select Payment Terms</option>
                  <option value="Full Payment">Full Payment</option>
                  <option value="Installment - 3 Months">Installment - 3 Months</option>
                  <option value="Installment - 6 Months">Installment - 6 Months</option>
                  <option value="Installment - 12 Months">Installment - 12 Months</option>
                </select>
                {errors.paymentTerms && <span className="error-text">{errors.paymentTerms}</span>}
              </div>
            </div>
          )}

          {/* Step 4: Alternative Contact & Referral */}
          {step === 4 && (
            <div className="form-section">
              <h4>Alternative Contact Person</h4>
              
              <div className="form-group">
                <label>Full Name *</label>
                <input 
                  type="text" 
                  name="altContactName" 
                  value={formData.altContactName} 
                  onChange={handleChange} 
                  maxLength={fieldMaxLengths.altContactName}
                  required 
                />
                {errors.altContactName && <span className="error-text">{errors.altContactName}</span>}
              </div>
              
              <div className="form-group">
                <label>Address *</label>
                <input 
                  type="text" 
                  name="altContactAddress" 
                  value={formData.altContactAddress} 
                  onChange={handleChange} 
                  maxLength={fieldMaxLengths.altContactAddress}
                  required 
                />
                {errors.altContactAddress && <span className="error-text">{errors.altContactAddress}</span>}
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Relationship</label>
                  <input 
                    type="text" 
                    name="altContactRelationship" 
                    value={formData.altContactRelationship} 
                    onChange={handleChange} 
                    maxLength={fieldMaxLengths.altContactRelationship}
                  />
                </div>
                
                <div className="form-group">
                  <label>Telephone *</label>
                  <input 
                    type="tel" 
                    name="altContactTel" 
                    value={formData.altContactTel} 
                    onChange={handleChange} 
                    maxLength={fieldMaxLengths.altContactTel}
                    required 
                  />
                  {errors.altContactTel && <span className="error-text">{errors.altContactTel}</span>}
                </div>
              </div>
              
              <div className="form-group">
                <label>Email</label>
                <input 
                  type="email" 
                  name="altContactEmail" 
                  value={formData.altContactEmail} 
                  onChange={handleChange} 
                  maxLength={fieldMaxLengths.altContactEmail}
                />
                {errors.altContactEmail && <span className="error-text">{errors.altContactEmail}</span>}
              </div>
              
              <h4 style={{marginTop: '30px'}}>Referral Information</h4>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Referral Agent Name</label>
                  <input 
                    type="text" 
                    name="referralAgentName" 
                    value={formData.referralAgentName} 
                    onChange={handleChange} 
                    maxLength={fieldMaxLengths.referralAgentName}
                  />
                </div>
                
                <div className="form-group">
                  <label>Referral Agent Contact</label>
                  <input 
                    type="text" 
                    name="referralAgentContact" 
                    value={formData.referralAgentContact} 
                    onChange={handleChange} 
                    maxLength={fieldMaxLengths.referralAgentContact}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Agreement */}
          {step === 5 && (
            <div className="form-section">
              <h4>Agreement</h4>
              
              <div className="terms-preview">
                <p>By submitting this form, you agree to our Terms and Conditions</p>
                <button type="button" className="view-terms-btn" onClick={() => setShowModal(true)}>
                  View Terms and Conditions
                </button>
              </div>
              
              <div className="form-group checkbox-label">
                <input 
                  type="checkbox" 
                  name="agreedToTerms" 
                  checked={formData.agreedToTerms} 
                  onChange={handleChange} 
                  required 
                />
                <label>I agree to the terms and conditions</label>
                {errors.agreedToTerms && <span className="error-text">{errors.agreedToTerms}</span>}
              </div>
              
              <div className="form-group">
                <label>Signature *</label>
                <input 
                  type="text" 
                  name="signatureText" 
                  value={formData.signatureText} 
                  onChange={handleChange} 
                  placeholder="Type your full name as signature" 
                  maxLength={fieldMaxLengths.signatureText}
                  required 
                />
                {errors.signatureText && <span className="error-text">{errors.signatureText}</span>}
              </div>
              
              <div className="form-group">
                <label>Upload Signature (Optional)</label>
                <input type="file" name="signatureFile" onChange={handleChange} accept="image/*" />
                <small>Upload an image of your signature if preferred</small>
              </div>
            </div>
          )}

          <div className="step-actions">
            {step > 1 ? (
              <button type="button" className="prev-btn" onClick={handlePrev}>
                Previous
              </button>
            ) : (
              <div></div>
            )}
            
            {step < 5 ? (
              <button type="button" className="next-btn" onClick={handleNext}>
                Next
              </button>
            ) : (
              <button type="submit" className="submit-btn">
                Submit Subscription
              </button>
            )}
          </div>
        </form>

   <div className="company-footer">
        <p><strong>MUSABAHA HOMES LTD.</strong></p>
        <p>No. 015, City Plaza Along Ring Road Western Bypass Along Yankaba Road, Kano State.</p>
        <p>📞 TEL: +2349084220705, +2349039108863, +2347038192719</p>
        <p>📧 Email: musababahomesth@gmail.com</p>
      </div>
      </div>

      <TermsModal />
    </div>
  );
};

export default SubscriptionForm;
  profileContainer: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    },
    profileForm: {
      background: '#f9f9f9',
      padding: '20px',
      borderRadius: '8px',
      marginBottom: '30px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    formGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '20px'
    },
    formGroup: {
      marginBottom: '15px'
    },
    label: {
      display: 'block',
      marginBottom: '5px',
      fontWeight: 'bold'
    },
    input: {
      width: '100%',
      padding: '8px 12px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '16px',
      boxSizing: 'border-box'
    },
    textarea: {
      width: '100%',
      padding: '8px 12px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '16px',
      minHeight: '80px',
      resize: 'vertical',
      boxSizing: 'border-box'
    },
    buttonPrimary: {
      padding: '10px 20px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      backgroundColor: '#007bff',
      color: 'white',
      fontSize: '16px',
      fontWeight: 'bold',
      marginTop: '10px'
    }















      const styles = {
    // Add these to your existing styles object
accountDetails: {
  backgroundColor: '#e8f4f8',
  padding: '15px',
  borderRadius: '6px',
  marginBottom: '20px',
  border: '1px solid #b8d8e6'
},
accountInfo: {
  marginBottom: '10px'
},
note: {
  fontSize: '14px',
  color: '#2c5282',
  fontStyle: 'italic',
  margin: '10px 0 0 0'
},
fileInfo: {
  fontSize: '14px',
  color: '#4a5568',
  margin: '5px 0 0 0',
  fontStyle: 'italic'
},
confirmation: {
  margin: '15px 0',
  padding: '10px',
  backgroundColor: '#f7fafc',
  borderRadius: '4px',
  border: '1px solid #e2e8f0'
},
checkboxLabel: {
  display: 'flex',
  alignItems: 'center',
  fontSize: '14px',
  cursor: 'pointer'
},
checkboxLabelInput: {
  marginRight: '10px'
},
    profileContainer: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    },
    profileForm: {
      background: '#f9f9f9',
      padding: '20px',
      borderRadius: '8px',
      marginBottom: '30px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    formGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '20px'
    },
    formGroup: {
      marginBottom: '15px'
    },
    label: {
      display: 'block',
      marginBottom: '5px',
      fontWeight: 'bold'
    },
    input: {
      width: '100%',
      padding: '8px 12px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '16px',
      boxSizing: 'border-box'
    },
    textarea: {
      width: '100%',
      padding: '8px 12px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '16px',
      minHeight: '80px',
      resize: 'vertical',
      boxSizing: 'border-box'
    },
    buttonPrimary: {
      padding: '10px 20px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      backgroundColor: '#007bff',
      color: 'white',
      fontSize: '16px',
      fontWeight: 'bold',
      marginTop: '10px'
    },
    subscriptionsSection: {
      marginTop: '30px'
    },
    subscriptionsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
      gap: '20px',
      marginTop: '20px'
    },
    subscriptionCard: {
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '20px',
      background: '#fff',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    },
    subscriptionDetails: {
      marginBottom: '15px',
      flexGrow: 1
    },
    subscriptionDetailsP: {
      margin: '8px 0',
      fontSize: '14px',
      lineHeight: '1.4'
    },
    subscriptionActions: {
      display: 'flex',
      gap: '10px',
      marginTop: 'auto',
      paddingTop: '15px',
      borderTop: '1px solid #eee'
    },
    buttonSecondary: {
      padding: '8px 16px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      backgroundColor: '#6c757d',
      color: 'white',
      fontSize: '14px',
      flex: 1
    },
    buttonWarning: {
      padding: '8px 16px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      backgroundColor: '#ffc107',
      color: 'black',
      fontSize: '14px',
      flex: 1
    },
    buttonSuccess: {
      padding: '8px 16px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      backgroundColor: '#28a745',
      color: 'white',
      fontSize: '14px',
      flex: 1
    },
    errorMessage: {
      color: '#dc3545',
      padding: '10px',
      background: '#f8d7da',
      border: '1px solid #f5c6cb',
      borderRadius: '4px',
      marginBottom: '15px'
    },
    loadingText: {
      textAlign: 'center',
      padding: '20px',
      fontSize: '18px'
    },
    statusBadge: {
      display: 'inline-block',
      padding: '4px 8px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: 'bold',
      marginLeft: '8px'
    },
    statusPending: {
      backgroundColor: '#fff3cd',
      color: '#856404'
    },
    statusApproved: {
      backgroundColor: '#d4edda',
      color: '#155724'
    },
    statusRejected: {
      backgroundColor: '#f8d7da',
      color: '#721c24'
    },
    cardHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '15px'
    },
    subscriptionId: {
      color: '#6c757d',
      fontSize: '14px',
      margin: 0
    },
    estateName: {
      margin: '0 0 10px 0',
      color: '#2c3e50',
      fontSize: '18px'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginTop: '40px'
    },
    th: {
      backgroundColor: '#f2f2f2',
      fontWeight: 'bold',
      padding: '12px',
      border: '1px solid #ddd'
    },
    td: {
      padding: '10px',
      border: '1px solid #ddd',
      textAlign: 'center'
    },
    actionButtons: {
      display: 'flex',
      justifyContent: 'center',
      gap: '8px'
    },
    // Modal styles
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    },
    modalContent: {
      backgroundColor: 'white',
      borderRadius: '8px',
      width: '90%',
      maxWidth: '600px',
      maxHeight: '90vh',
      overflow: 'auto',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
    },
    modalHeader: {
      padding: '20px',
      borderBottom: '1px solid #eee',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    modalBody: {
      padding: '20px'
    },
    modalClose: {
      background: 'none',
      border: 'none',
      fontSize: '24px',
      cursor: 'pointer',
      color: '#999'
    },
    paymentSummary: {
      backgroundColor: '#f8f9fa',
      padding: '15px',
      borderRadius: '6px',
      marginBottom: '20px'
    },
    paymentForm: {
      display: 'grid',
      gap: '15px'
    },
    select: {
      width: '100%',
      padding: '10px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '16px'
    },
    submitButton: {
      padding: '12px 20px',
      backgroundColor: '#28a745',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: 'pointer',
      marginTop: '10px'
    }
  };








  replace this alert with  Swal'swe etalert2'; alert import React, { useState, useEffect } from 'react';  
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { 
  FiSearch, FiPlus, FiFileText, FiDownload, FiX, FiEye, 
  FiEdit, FiTrash2, FiDollarSign, FiCalendar, FiUser, 
  FiHome, FiCreditCard, FiPieChart, FiCheckCircle, FiClock,
  FiCheck, FiAlertCircle
} from 'react-icons/fi';
import './AdminUsers.css';

const AdminUsers = () => {
  const [alert, setAlert] = useState({ type: '', message: '', visible: false });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
const [editUser, setEditUser] = useState(null);

  const [newUser, setNewUser] = useState({
    name: '',
    contact: '',
    plot_taken: '',
    date_taken: '',
    initial_deposit: '',
    price_per_plot: '',
    payment_schedule: 'Monthly',
    total_balance: ''
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [paymentData, setPaymentData] = useState({ 
    amount: '', 
    date: new Date().toISOString().slice(0, 16), 
    note: '',
    admin: ''
  });

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  // Get auth token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem('adminToken');
  };

  const showAlert = (type, message) => {
    setAlert({ type, message, visible: true });
    setTimeout(() => {
      setAlert({ type: '', message: '', visible: false });
    }, 4000);
  };
  const handleEditInputChange = (e) => {
  const { name, value } = e.target;
  setEditUser(prev => ({ ...prev, [name]: value }));
};


  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();
      
      const response = await fetch(`${API_BASE_URL}/admin/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      if (data.success) {
        setUsers(data.data);
      } else {
        showAlert('error', data.message || 'Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      showAlert('error', 'Failed to fetch users. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const calculateTotalPrice = (pricePerPlotStr) => {
    if (!pricePerPlotStr) return 0;
    return pricePerPlotStr
      .split(",")
      .map(p => parseFloat(p.trim()) || 0)
      .reduce((a, b) => a + b, 0);
  };

  // Calculate totals
  const totalBalance = users.reduce((total, user) => {
    return total + parseFloat(user.total_balance || 0);
  }, 0);

  const totalPlotValue = users.reduce((total, user) => {
    return total + calculateTotalPrice(user.price_per_plot);
  }, 0);

  const totalDeposits = users.reduce((total, user) => {
    return total + parseFloat(user.initial_deposit || 0);
  }, 0);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.plot_taken.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser(prev => ({
      ...prev,
      [name]: value
    }));
  };
  

  // Create user via API
  const handleCreateUser = async (e) => {
    e.preventDefault();

    try {
      const token = getAuthToken();
      const totalPlotPrice = calculateTotalPrice(newUser.price_per_plot);
      const totalBalance = totalPlotPrice - parseFloat(newUser.initial_deposit || 0);

      if (!newUser.name || !newUser.contact || !newUser.plot_taken) {
        showAlert('error', 'Please fill in all required fields.');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/admin/users`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...newUser,
          total_balance: totalBalance.toString()
        })
      });

      const data = await response.json();

      if (data.success) {
        setShowCreateModal(false);
        setNewUser({
          name: '',
          contact: '',
          plot_taken: '',
          date_taken: '',
          initial_deposit: '',
          price_per_plot: '',
          payment_schedule: 'Monthly',
          total_balance: ''
        });
        showAlert('success', 'User created successfully.');
        fetchUsers(); // Refresh the user list
      } else {
        showAlert('error', data.message || 'Failed to create user.');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      showAlert('error', 'Failed to create user. Please try again.');
    }
  };

  // Add payment via API
  const handleAddPayment = async (userId) => {
    if (!paymentData.amount) {
      showAlert('error', 'Please enter a payment amount.');
      return;
    }

    try {
      const token = getAuthToken();
      
      const response = await fetch(`${API_BASE_URL}/admin/payments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: userId,
          amount: parseFloat(paymentData.amount),
          date: paymentData.date,
          note: paymentData.note,
          admin: paymentData.admin
        })
      });

      const data = await response.json();

      if (data.success) {
        setPaymentData({
          amount: '',
          date: new Date().toISOString().slice(0, 16),
          note: '',
          admin: paymentData.admin
        });
        showAlert('success', 'Payment added successfully.');
        fetchUsers(); // Refresh the user list
      } else {
        showAlert('error', data.message || 'Failed to add payment.');
      }
    } catch (error) {
      console.error('Error adding payment:', error);
      showAlert('error', 'Failed to add payment. Please try again.');
    }
  };

  // Fetch payments for a specific user
  const fetchUserPayments = async (userId) => {
    try {
      const token = getAuthToken();
      
      const response = await fetch(`${API_BASE_URL}/admin/payments/user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          return data.data;
        }
      }
      return [];
    } catch (error) {
      console.error('Error fetching payments:', error);
      return [];
    }
  };

  const handleViewUser = async (user) => {
   
  };
const handleEditUser = (user) => {

};


  // Handle delete user
const [confirmDelete, setConfirmDelete] = useState({ visible: false, userId: null });

const handleDeleteUser = (userId) => {
 
};

const confirmDeleteUser = async () => {

};

  const formatCurrency = (amount) => {
    return `₦${parseFloat(amount || 0).toLocaleString('en-NG')}`;
  };
  const handleUpdateUser = async (e) => {

};

const formatDateTime = (dateString) => {
   
  };

  const exportToExcel = () => {
   
  };

const exportToPDF = async () => {
 
   
};

// Update the createSimpleTable function to accept startY parameter
const createSimpleTable = (doc, tableData, startY = 50) => {

};

  const calculateRemainingBalance = (user) => {
  }
      (sum, p) => sum + parseFloat(p.amount || 0),
      0
 
    const initialDeposit = parseFloat(user.initial_deposit || 0);
    const totalPaid = initialDeposit + totalSubsequentPayments;
    
    return Math.max(0, totalPlotPrice - totalPaid);
  };

  // Fixed convertAmountToWords function
  const convertAmountToWords = (amount) => {
   
  };

  const generateReceipt = async (payment, user) => {
    // Half A4 in landscape (148.5mm x 210mm)
   
    };



  if (loading) return (
    <div className="loading">
      <div className="spinner"></div>
      <p>Loading users...</p>
    </div>
  );

  return (
    <div className="admin-content">
      {/* Alert Overlay */}
      {alert.visible && (
        <div className="alert-overlay">
          <div className={`alert alert-${alert.type}`}>
            <div className="alert-icon">
              {alert.type === 'success' ? (
                <div className="success-checkmark">
                  <FiCheck />
                </div>
              ) : (
                <FiAlertCircle />
              )}
            </div>
            <div className="alert-message">{alert.message}</div>
            <button 
              className="alert-close"
              onClick={() => setAlert({ type: '', message: '', visible: false })}
            >
              <FiX />
            </button>
          </div>
        </div>
      )}

      <div className="content-header"> 
        <h2><FiUser className="icon" /> User Management</h2>
        
        <div className="header-actions">
          {/* Search box */}
          <div className="search-box">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="  ...Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          {/* Export + Add User */}
          <div className="action-buttons">
            <div className="action-item excel" onClick={exportToExcel}>
              <FiDownload className="icon" /> Excel
            </div>
            <div className="action-item pdf" onClick={exportToPDF}>
              <FiFileText className="icon" /> PDF
            </div>
            <div className="action-item add-user" onClick={() => setShowCreateModal(true)}>
              <FiPlus className="icon" /> Add User
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card">
          <div className="summary-icon total-balance">
            <FiDollarSign />
          </div>
          <div className="summary-content">
            <h3>{formatCurrency(totalBalance)}</h3>
            <p>Total Outstanding Balance</p>
          </div>
        </div>
        
        <div className="summary-card">
          <div className="summary-icon total-value">
            <FiHome />
          </div>
          <div className="summary-content">
            <h3>{formatCurrency(totalPlotValue)}</h3>
            <p>Total Plot Value</p>
          </div>
        </div>
        
        <div className="summary-card">
          <div className="summary-icon deposits">
            <FiCreditCard />
          </div>
          <div className="summary-content">
            <h3>{formatCurrency(totalDeposits)}</h3>
            <p>Total Deposits Received</p>
          </div>
        </div>
        
        <div className="summary-card">
          <div className="summary-icon users">
            <FiUser />
          </div>
          <div className="summary-content">
            <h3>{users.length}</h3>
            <p>Total Users</p>
          </div>
        </div>
      </div>

      <div className="content-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Contact</th>
              <th>Plot Taken</th>
              <th>Date Taken</th>
              <th>Total money to Pay</th>
              <th>Initial Deposit</th>
              <th>Price per Plot</th>
              <th>Payment Schedule</th>
              <th>Total Balance</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td>
                  <div className="user-info">
                    <FiUser className="user-icon" />
                    <span>{user.name}</span>
                  </div>
                </td>
                <td>{user.contact}</td>
                <td>
                  <div className="plot-info">
                    <FiHome className="icon" />
                    <span>{user.plot_taken}</span>
                  </div>
                </td>
                <td>{user.date_taken}</td>
                <td>{formatCurrency(calculateTotalPrice(user.price_per_plot))}</td>
                <td>{formatCurrency(user.initial_deposit)}</td>
                <td>
                  {user.price_per_plot
                    .split(",")
                    .map((price, idx) => (
                      <span key={idx}>
                        {formatCurrency(price.trim())}
                        {idx < user.price_per_plot.split(",").length - 1 && ", "}
                      </span>
                    ))}
                </td>
                <td>
                  <div className="payment-schedule">
                    <FiCalendar className="icon" />
                    <span>{user.payment_schedule}</span>
                  </div>
                </td>
                <td>
                  <div className={`balance ${parseFloat(user.total_balance) === 0 ? 'paid' : ''}`}>
                    {formatCurrency(user.total_balance)}
                  </div>
                </td>
                <td>
                  <span className={`status-badge ${user.status.toLowerCase()}`}>
                    {user.status === 'Completed' && <FiCheckCircle className="icon" />}
                    {user.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <FiEye className="action-icon view" onClick={() => handleViewUser(user)} />
                    <FiEdit className="action-icon edit" onClick={() => handleEditUser(user)} />
                    <FiTrash2 className="action-icon delete" onClick={() => handleDeleteUser(user.id)} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3><FiUser className="icon" /> Add New User</h3>
              <button className="modal-close" onClick={() => setShowCreateModal(false)}>
                <FiX />
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleCreateUser}>
                <div className="form-group">
                  <label><FiUser className="icon" /> Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={newUser.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label><FiCalendar className="icon" /> Contact *</label>
                  <input
                    type="text"
                    name="contact"
                    value={newUser.contact}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label><FiHome className="icon" /> Plot Taken *</label>
                  <input
                    type="text"
                    name="plot_taken"
                    value={newUser.plot_taken}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label><FiCalendar className="icon" /> Date Taken *</label>
                  <input
                    type="date"
                    name="date_taken"
                    value={newUser.date_taken}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label><FiDollarSign className="icon" /> Price per Plot (₦) *</label>
                  <input
                    type="text"
                    name="price_per_plot"
                    value={newUser.price_per_plot}
                    onChange={handleInputChange}
                    placeholder="e.g. 2000000,400000"
                    required
                  />
                </div>
                <div className="form-group">
                  <label><FiDollarSign className="icon" /> Total Price Plots (₦) *</label>
                  <input
                    type="text"
                    value={formatCurrency(calculateTotalPrice(newUser.price_per_plot))}
                    disabled
                  />
                </div>
                <div className="form-group">
                  <label><FiDollarSign className="icon" /> Initial Deposit (₦) *</label>
                  <input
                    type="number"
                    name="initial_deposit"
                    value={newUser.initial_deposit}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label><FiPieChart className="icon" /> Payment Schedule *</label>
                  <select
                    name="payment_schedule"
                    value={newUser.payment_schedule}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly</option>
                    <option value="Bi-Annual">Bi-Annual</option>
                    <option value="Annual">Annual</option>
                  </select>
                </div>
                <div className="form-group">
                  <label><FiDollarSign className="icon" /> Remaining Balance (₦)</label>
                  <input
                    type="text"
                    value={formatCurrency(calculateTotalPrice(newUser.price_per_plot) - parseFloat(newUser.initial_deposit || 0))}
                    disabled
                  />
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Create User
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {/* Edit User Modal */}
{showEditModal && editUser && (
  <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <div className="modal-header">
        <h3><FiEdit className="icon" /> Edit User</h3>
        <button className="modal-close" onClick={() => setShowEditModal(false)}>
          <FiX />
        </button>
      </div>
      <div className="modal-body">
        <form onSubmit={handleUpdateUser}>
          <div className="form-group">
            <label>Name *</label>
            <input
              type="text"
              name="name"
              value={editUser.name}
              onChange={handleEditInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Contact *</label>
            <input
              type="text"
              name="contact"
              value={editUser.contact}
              onChange={handleEditInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Plot Taken *</label>
            <input
              type="text"
              name="plot_taken"
              value={editUser.plot_taken}
              onChange={handleEditInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Date Taken *</label>
            <input
              type="date"
              name="date_taken"
              value={editUser.date_taken}
              onChange={handleEditInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Price per Plot *</label>
            <input
              type="text"
              name="price_per_plot"
              value={editUser.price_per_plot}
              onChange={handleEditInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Initial Deposit *</label>
            <input
              type="number"
              name="initial_deposit"
              value={editUser.initial_deposit}
              onChange={handleEditInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Payment Schedule *</label>
            <select
              name="payment_schedule"
              value={editUser.payment_schedule}
              onChange={handleEditInputChange}
              required
            >
              <option value="Monthly">Monthly</option>
              <option value="Quarterly">Quarterly</option>
              <option value="Bi-Annual">Bi-Annual</option>
              <option value="Annual">Annual</option>
            </select>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Update User
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
)}
  
     
      {/* View User Modal with Payment History */}
      {showViewModal && selectedUser && (
        <div className="modal-overlay" onClick={() => setShowViewModal(false)}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3><FiUser className="icon" /> User Details: {selectedUser.name}</h3>
              <button className="modal-close" onClick={() => setShowViewModal(false)}>
                <FiX />
              </button>
            </div>
            <div className="modal-body">
              <div className="user-details">
                <div className="detail-row">
                  <div className="detail-item">
                    <label>Contact:</label>
                    <span>{selectedUser.contact}</span>
                  </div>
                  <div className="detail-item">
                    <label>Plot Taken:</label>
                    <span>{selectedUser.plot_taken}</span>
                  </div>
                </div>
                <div className="detail-row">
                  <div className="detail-item">
                    <label>Date Taken:</label>
                    <span>{selectedUser.date_taken}</span>
                  </div>
                  <div className="detail-item">
                    <label>Payment Schedule:</label>
                    <span>{selectedUser.payment_schedule}</span>
                  </div>
                </div>
                <div className="detail-row">
                  <div className="detail-item">
                    <label>Total Price:</label>
                    <span className="total-price">{formatCurrency(calculateTotalPrice(selectedUser.price_per_plot))}</span>
                  </div>
                  <div className="detail-item">
                    <label>Initial Deposit:</label>
                    <span className="deposit">{formatCurrency(selectedUser.initial_deposit)}</span>
                  </div>
                </div>
                
                {/* Calculate and display payment summary */}
                {selectedUser.payments && (
                  <div className="payment-summary">
                    <div className="summary-row">
                      <label>Total Subsequent Payments:</label>
                      <span>{formatCurrency(selectedUser.payments.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0))}</span>
                    </div>
                    <div className="summary-row">
                      <label>Total Paid (Deposit + Payments):</label>
                      <span className="total-paid">
                        {formatCurrency(parseFloat(selectedUser.initial_deposit || 0) + selectedUser.payments.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0))}
                      </span>
                    </div>
                    <div className="summary-row outstanding">
                      <label>Outstanding Balance:</label>
                      <span className={calculateRemainingBalance(selectedUser) === 0 ? 'paid' : 'pending'}>
                        {formatCurrency(calculateRemainingBalance(selectedUser))}
                      </span>
                    </div>
                  </div>
                )}
                
                <div className="detail-row">
                  <div className="detail-item">
                    <label>Status:</label>
                    <span className={`status-badge ${selectedUser.status.toLowerCase()}`}>
                      {selectedUser.status === 'Completed' && <FiCheckCircle className="icon" />}
                      {selectedUser.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="payment-section">
                <h4><FiDollarSign className="icon" /> Payment History</h4>
                {selectedUser.payments.map(payment => (
                  <div key={payment.id} className="payment-item">
                    <div className="payment-info">
                      <div className="payment-date">
                        <FiClock className="icon" /> 
                        {formatDateTime(payment.date)}
                      </div>
                      <div className="payment-note">{payment.note}</div>
                      <div className="payment-admin">Recorded by: {payment.admin || payment.recorded_by || "Admin"}</div>
                    </div>
                    <div className="payment-actions">
                      <div className="payment-amount">{formatCurrency(payment.amount)}</div>
                      <button 
                        className="btn btn-sm btn-success"
                        onClick={() => generateReceipt(payment, selectedUser)}
                        title="Download Receipt"
                      >
                        <FiFileText />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="add-payment-section">
                <h4><FiPlus className="icon" /> Add New Payment</h4>
                <div className="payment-form">
                  <div className="form-group">
                    <label>Amount (₦) *</label>
                    <input
                      type="number"
                      value={paymentData.amount}
                      onChange={(e) => setPaymentData({...paymentData, amount: e.target.value})}
                      required
                      placeholder="Enter payment amount"
                    />
                  </div>
                  <div className="form-group">
                    <label>Date & Time</label>
                    <input
                      type="datetime-local"
                      value={paymentData.date}
                      onChange={(e) => setPaymentData({...paymentData, date: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Note</label>
                    <input
                      type="text"
                      value={paymentData.note}
                      onChange={(e) => setPaymentData({...paymentData, note: e.target.value})}
                      placeholder="Payment note (e.g., Monthly installment)"
                    />
                  </div>
                  <div className="form-group">
                    <label>Recorded By</label>
                    <input
                      type="text"
                      value={paymentData.admin}
                      onChange={(e) => setPaymentData({...paymentData, admin: e.target.value})}
                      placeholder="Admin name"
                    />
                  </div>
                  <button 
                    className="btn btn-primary"
                    onClick={() => handleAddPayment(selectedUser.id)}
                    disabled={!paymentData.amount}
                  >
                    Add Payment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {confirmDelete.visible && (
  <div className="modal-overlay" onClick={() => setConfirmDelete({ visible: false, userId: null })}>
    <div className="modal-content small" onClick={(e) => e.stopPropagation()}>
      <div className="modal-header danger">
        <h3><FiTrash2 className="icon" /> Confirm Delete</h3>
        <button 
          className="modal-close" 
          onClick={() => setConfirmDelete({ visible: false, userId: null })}
        >
          <FiX />
        </button>
      </div>
      <div className="modal-body">
        <p>Are you sure you want to delete this user? <strong>This action cannot be undone.</strong></p>
      </div>
      <div className="modal-footer">
        <button 
          className="btn btn-danger" 
          onClick={confirmDeleteUser}
        >
          <FiTrash2 className="icon" /> Yes, Delete
        </button>
        <button 
          className="btn btn-secondary" 
          onClick={() => setConfirmDelete({ visible: false, userId: null })}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default AdminUsers;