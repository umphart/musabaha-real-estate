import React, { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { useNavigate } from "react-router-dom";
import {
  FiFileText,
  FiX,
  FiInfo,
  FiCheck,
  FiChevronDown,
  FiChevronUp,
  FiDownload,
  FiEye,
} from "react-icons/fi";
import "./SubscriptionForm.css";

// ✅ FIX: Use modern worker setup (no need to import pdf.worker.min.mjs)
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const SubscriptionForm = () => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [visiblePlotsCount, setVisiblePlotsCount] = useState(5);
  const initialVisiblePlots = 5;
  const [step, setStep] = useState(1);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [showLayoutModal, setShowLayoutModal] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [plots, setPlots] = useState([]);
  const [currentPdf, setCurrentPdf] = useState(null);
  const [allLayoutPlans, setAllLayoutPlans] = useState([]);
  const [selectedLayout, setSelectedLayout] = useState(null);
  const [pdfError, setPdfError] = useState(null);
  const navigate = useNavigate();

  // Add loading states
  const [loadingPlots, setLoadingPlots] = useState(true);
  const [loadingLayouts, setLoadingLayouts] = useState(true);
  const [apiErrors, setApiErrors] = useState({ plots: null, layouts: null });

const [formData, setFormData] = useState({
  selectedPlots: [],
  title: '',
  name: '',
  residentialAddress: '',
  occupation: '',
  officeAddress: '',
  dob: '',
  stateOfOrigin: '',
  lga: '',
  sex: '',
  phoneNumber: '',
  nationality: '',
  homeNumber: '',
  email: '',
  identification: '',
  passportPhoto: null,
  identificationFile: null,
  nextOfKinName: '',
  nextOfKinAddress: '',
  nextOfKinRelationship: '',
  nextOfKinPhoneNumber: '',
  nextOfKinOccupation: '',
  nextOfKinOfficeAddress: '',
  layoutName: '',
  numberOfPlots: '',
  proposedUse: '',
  plotSize: '',
  paymentTerms: '',
  price: '',
  price_per_plot: '',
  plotId: '',
  agreedToTerms: false,
  signatureText: '',
  signatureFile: null
  // REMOVED: proposedType
});
// Fetch plots from backend with better error handling
const fetchPlots = async () => {
  try {
    console.log("🔄 Fetching plots from API...");
    const res = await fetch("https://musabaha-homes-ltd.vercel.app/api/plots");
    
    // Check if response is HTML (error page)
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('text/html')) {
      const text = await res.text();
      console.error("❌ Server returned HTML instead of JSON:", text.substring(0, 200));
      throw new Error('Server error: Received HTML instead of JSON response');
    }
    
    const data = await res.json();
    console.log("✅ Plots response:", data);
    
    if (data.success) {
      const availablePlots = data.data?.filter(plot => plot.status === "Available") || [];
      console.log(`✅ Found ${availablePlots.length} available plots`);
      setPlots(availablePlots);
    } else {
      console.error("❌ API returned error:", data.message);
      setPlots([]);
    }
  } catch (err) {
    console.error("❌ Error fetching plots:", err);
    setPlots([]);
  }
};

// Fetch all layout plans from backend with better error handling
const fetchAllLayoutPlans = async () => {
  try {
    console.log("🔄 Fetching layout plans from API...");
    const res = await fetch("https://musabaha-homes-ltd.vercel.app/api/layout-plan/all");
    
    // Check if response is HTML (error page)
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('text/html')) {
      const text = await res.text();
      console.error("❌ Server returned HTML instead of JSON:", text.substring(0, 200));
      throw new Error('Server error: Received HTML instead of JSON response');
    }
    
    const data = await res.json();
    console.log("✅ Layout plans response:", data);
    
    if (data.success) {
      setAllLayoutPlans(data.data || []);
      
      // Set the first layout as current PDF if available
      if (data.data && data.data.length > 0) {
        const firstLayout = data.data[0];
        setSelectedLayout(firstLayout);
        const fullUrl = `https://musabaha-homes-ltd.vercel.app${firstLayout.file_url}`;
        console.log("✅ Setting current PDF URL:", fullUrl);
        setCurrentPdf(fullUrl);
      } else {
        console.log("ℹ️ No layout plans available");
      }
    } else {
      console.error("❌ API returned error:", data.message);
      setAllLayoutPlans([]);
    }
  } catch (error) {
    console.error("❌ Error fetching all layout plans:", error);
    setAllLayoutPlans([]);
  }
};
  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setPageNumber(1);
    setPdfError(null);
  }

  function onDocumentLoadError(error) {
    console.error('Error loading PDF:', error);
    setPdfError('Failed to load PDF document. Please try downloading the layout plan instead.');
  }

useEffect(() => {
  const fetchData = async () => {
    setLoadingPlots(true);
    setLoadingLayouts(true);
    setApiErrors({ plots: null, layouts: null });

    try {
      await Promise.all([
        fetchPlots(),
        fetchAllLayoutPlans()
      ]);
    } catch (error) {
      console.error("Error in initial data fetch:", error);
    } finally {
      setLoadingPlots(false);
      setLoadingLayouts(false);
    }
  };

  fetchData();
}, []);

  // Handle layout selection
  const handleLayoutSelect = (layout) => {
    setSelectedLayout(layout);
    const fullUrl = `https://musabaha-homes-ltd.vercel.app${layout.file_url}`;
    console.log("Setting selected layout PDF URL:", fullUrl);
    setCurrentPdf(fullUrl);
    setShowLayoutModal(false);
  };

  const handleViewPdf = (fileUrl) => {
    console.log("Viewing PDF:", fileUrl);
    setCurrentPdf(fileUrl);
    setShowPdfModal(true);
    setPageNumber(1);
    setPdfError(null);
  };

  const handleClosePdfModal = () => {
    setShowPdfModal(false);
    setPdfError(null);
  };

  const handleCloseLayoutModal = () => {
    setShowLayoutModal(false);
  };

  // Download layout plan
  const handleDownloadLayout = async (layout) => {
    try {
      console.log("Downloading layout:", layout);
      
      if (!layout || !layout.id) {
        alert('Invalid layout plan data');
        return;
      }

      const token = localStorage.getItem("userToken");
      const response = await fetch(`https://musabaha-homes-ltd.vercel.app/api/layout-plan/download/${layout.id}`, {
        method: 'GET',
        headers: token ? { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        } : {},
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        
        const contentDisposition = response.headers.get('content-disposition');
        let filename = layout.filename || 'layout-plan';
        
        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename="(.+)"/);
          if (filenameMatch) {
            filename = filenameMatch[1];
          }
        }
        
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        const errorData = await response.json();
        alert(`Failed to download layout plan: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Error downloading layout plan:", error);
      alert('Download failed. Try again later.');
    }
  };

const handlePlotSelection = (plot) => {
  console.log("Selected plot:", plot);
  
  // Check if plot is already selected
  const isAlreadySelected = formData.selectedPlots.some(p => p.id === plot.id);
  
  let updatedSelection;
  
  if (isAlreadySelected) {
    // Remove plot if already selected
    updatedSelection = formData.selectedPlots.filter(p => p.id !== plot.id);
  } else {
    // Add plot if not selected
    updatedSelection = [...formData.selectedPlots, plot];
  }

  setFormData(prev => ({
    ...prev,
    selectedPlots: updatedSelection,
    plotId: updatedSelection.length > 0 ? updatedSelection[0].id : '',
    layoutName: updatedSelection.length ? updatedSelection[0].location : "",
    numberOfPlots: updatedSelection.length,
    plotSize: updatedSelection.map((p) => p.dimension).join(", "),
    price: updatedSelection.map((p) => parseFloat(p.price)).join(", ")
  }));
};

  const handleRemovePlotSelection = () => {
    setFormData(prevData => ({
      ...prevData,
      plotId: '',
      layoutName: '',
      plotSize: '',
      price: ''
    }));
  };

  const fieldMaxLengths = {
    title: 10,
    name: 100,
    residentialAddress: 200,
    occupation: 50,
    officeAddress: 200,
    stateOfOrigin: 50,
    lga: 50,
    sex: 10,
    phoneNumber: 20,
    nationality: 50,
    homeNumber: 20,
    email: 100,
    identification: 50,
    nextOfKinName: 100,
    nextOfKinAddress: 200,
    nextOfKinRelationship: 50,
    nextOfKinPhoneNumber: 20,
    nextOfKinOccupation: 50,
    nextOfKinOfficeAddress: 200,
    layoutName: 100,
    numberOfPlots: 10,
    proposedUse: 50,
    proposedType: 50,
    plotSize: 20,
    paymentTerms: 50,
    price: 20,
    signatureText: 100
  };

  const validateStep = (step) => {
    const newErrors = {};
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type !== 'file' && type !== 'checkbox' && fieldMaxLengths[name]) {
      if (value.length > fieldMaxLengths[name]) {
        return;
      }
    }
    
    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else if (type === 'file') {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    
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

  if (!validateStep(3)) return;

  setIsSubmitting(true);

  try {
    const data = new FormData();

  

    // Append ALL selected plot IDs
    formData.selectedPlots.forEach((plot, index) => {
      data.append(`selectedPlotIds[${index}]`, plot.id);
   
    });

    // ✅ FIXED: Append price_per_plot ONLY ONCE and ensure it's a single value
    if (formData.price_per_plot) {
      // If it's an array, take the first value only
      const priceValue = Array.isArray(formData.price_per_plot) 
        ? formData.price_per_plot[0] 
        : formData.price_per_plot;
      
      data.append('price_per_plot', priceValue);
    
    }

    // Append all other form data
    for (const key in formData) {
      if (key !== 'selectedPlots' && key !== 'price_per_plot' && formData[key] !== null && formData[key] !== undefined) {
        if (formData[key] instanceof File) {
          data.append(key, formData[key], formData[key].name);
        } else {
          data.append(key, formData[key]);
        }
      }
    }

    // Log all FormData entries for debugging
    console.log("All FormData entries:");
    for (let pair of data.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }

    const token = localStorage.getItem("userToken");

    const response = await fetch("https://musabaha-homes-ltd.vercel.app/api/subscriptions", {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: data,
    });

    const result = await response.json();

    if (result.success) {
      setSubmitSuccess(true);
      console.log("✅ Subscription created successfully:", result);
      
      // ✅ REDIRECT TO USER DASHBOARD AFTER SUCCESS
      setTimeout(() => {
        window.location.href = '/dashboard'; // Adjust path as needed
      }, 2000);
      
    } else {
      alert("❌ Failed to create subscription: " + (result.message || "Unknown error"));
    }
  } catch (err) {
    console.error("Error submitting form:", err);
    alert("Network error submitting subscription form");
  } finally {
    setIsSubmitting(false);
  }
};
  const TermsModal = () => {
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

  const SuccessMessage = () => (
    <div className="success-overlay">
      <div className="success-message">
        <div className="success-icon">✅</div>
        <h2>Application Submitted Successfully!</h2>
        <p>Thank you for your application. Your subscription is under review.</p>
        <p>Please wait for approval. You will be redirected to your profile shortly.</p>
        <div className="loading-spinner"></div>
      </div>
    </div>
  );

  if (submitSuccess) {
    return <SuccessMessage />;
  }

  return (
    <div className="subscription-form-container">
      <div className="form-overlay">
        <form onSubmit={handleSubmit}>
          <div className="form-header">
            <h2>MUSABAHA HOMES LTD.</h2>
            <h3>PLOT SUBSCRIPTION FORM</h3>
          </div>

          <div className="progress-indicator">
            {[1, 2, 3].map((num) => (
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
                  <label>Phone Number *</label>
                  <input 
                    type="tel" 
                    name="phoneNumber" 
                    value={formData.phoneNumber} 
                    onChange={handleChange} 
                    maxLength={fieldMaxLengths.phoneNumber}
                    required 
                  />
                  {errors.phoneNumber && <span className="error-text">{errors.phoneNumber}</span>}
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
                  <label>Home Number</label>
                  <input 
                    type="tel" 
                    name="homeNumber" 
                    value={formData.homeNumber} 
                    onChange={handleChange} 
                    maxLength={fieldMaxLengths.homeNumber}
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
                  <label>Phone Number *</label>
                  <input 
                    type="tel" 
                    name="nextOfKinPhoneNumber" 
                    value={formData.nextOfKinPhoneNumber} 
                    onChange={handleChange} 
                    maxLength={fieldMaxLengths.nextOfKinPhoneNumber}
                    required 
                  />
                  {errors.nextOfKinPhoneNumber && <span className="error-text">{errors.nextOfKinPhoneNumber}</span>}
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
            </div>
          )}
{/* Step 3: Plot Information & Agreement */}
{step === 3 && (
  <div className="form-section">
    <h4>Plot Information & Agreement</h4>

    {/* Layout Plan Selection Section */}
    <div className="layout-plan-section">
      <div className="form-group">
        <label>Estate Layout Plan *</label>
        <div className="layout-plan-selector">
          {selectedLayout ? (
            <div className="selected-layout">
              <div className="layout-info">
                <strong>{selectedLayout.layout_name}</strong>
                <span>File: {selectedLayout.filename}</span>
                <span>Size: {(selectedLayout.file_size / 1024 / 1024).toFixed(2)} MB</span>
                <span>Uploaded: {new Date(selectedLayout.created_at).toLocaleDateString()}</span>
              </div>
              <div className="layout-actions">
                <button 
                  type="button" 
                  className="btn-view-layout"
                  onClick={() => handleViewPdf(`https://musabaha-homes-ltd.vercel.app${selectedLayout.file_url}`)}
                >
                  <FiEye className="icon" /> View
                </button>
                <button 
                  type="button" 
                  className="btn-download-layout"
                  onClick={() => handleDownloadLayout(selectedLayout)}
                >
                  <FiDownload className="icon" /> Download
                </button>
                <button 
                  type="button" 
                  className="btn-change-layout"
                  onClick={() => setShowLayoutModal(true)}
                >
                  Change Layout
                </button>
              </div>
            </div>
          ) : (
            <div className="no-layout">
              <p>No layout plan selected</p>
              <button 
                type="button" 
                className="btn-select-layout"
                onClick={() => setShowLayoutModal(true)}
              >
                Select Layout Plan
              </button>
            </div>  
          )}
        </div>
        <small>Select an estate layout plan to view available plots</small>
      </div>
    </div>

{/* Plot Selection */}
<div className="form-group">
  <label>Select Plot(s) *</label>

  <div className="plots-list-container">
    {loadingPlots ? (
      <div className="loading-state">
        <p>Loading available plots...</p>
      </div>
    ) : apiErrors.plots ? (
      <div className="error-state">
        <p>❌ Failed to load plots: {apiErrors.plots}</p>
        <button 
          type="button" 
          className="btn-retry"
          onClick={fetchPlots}
        >
          Retry
        </button>
      </div>
    ) : plots.length === 0 ? (
      <div className="empty-state">
        <p>No available plots found.</p>
        <p className="small-text">Please check back later or contact support.</p>
      </div>
    ) : (
          <>
            <ul className="plots-list">
              {plots.slice(0, visiblePlotsCount).map((plot) => {
                const isSelected = formData.selectedPlots.some(
                  (p) => p.id === plot.id
                );

                return (
                  <li
                    key={plot.id}
                    className={`plot-item ${isSelected ? "selected" : ""}`}
                    onClick={() => {
                      let updatedSelection;

                      if (isSelected) {
                        // Remove plot
                        updatedSelection = formData.selectedPlots.filter(
                          (p) => p.id !== plot.id
                        );
                      } else {
                        // Add plot
                        updatedSelection = [...formData.selectedPlots, plot];
                      }

                      // Calculate price per plot
                      const pricePerPlot = updatedSelection.length > 1 
                        ? updatedSelection.map(p => parseFloat(p.price)).join(", ")
                        : updatedSelection.length === 1 
                          ? parseFloat(updatedSelection[0].price)
                          : '';

                      // Update form data with the new selection
                      setFormData(prev => ({
                        ...prev,
                        selectedPlots: updatedSelection,
                        layoutName: updatedSelection.length ? updatedSelection[0].location : "",
                        numberOfPlots: updatedSelection.length,
                        plotSize: updatedSelection.map((p) => p.dimension).join(", "),
                        price: updatedSelection.reduce((sum, p) => sum + parseFloat(p.price), 0),
                        price_per_plot: pricePerPlot, // Set price per plot
                        plotId: updatedSelection.length > 0 ? updatedSelection[0].id : ''
                      }));
                    }}
                  >
                    <div className="plot-main">
                      <span className="plot-number">{plot.number}</span>
                      <span className="plot-estate">{plot.location}</span>
                      <span className="plot-price">
                        ₦{parseFloat(plot.price).toLocaleString()}
                      </span>
                      <span className={`plot-status ${plot.status.toLowerCase()}`}>
                        {plot.status}
                      </span>
                    </div>
                    {isSelected && <FiCheck className="check-icon" />}
                  </li>
                );
              })}
            </ul>

            {plots.length > initialVisiblePlots && (
              <div className="plots-toggle-section">
                <button
                  type="button"
                  className="btn-show-more"
                  onClick={() => {
                    if (visiblePlotsCount >= plots.length) {
                      setVisiblePlotsCount(initialVisiblePlots);
                    } else {
                      setVisiblePlotsCount(plots.length);
                    }
                  }}
                >
                  {visiblePlotsCount >= plots.length ? (
                    <>
                      <FiChevronUp className="icon" />
                      Show Less
                    </>
                  ) : (
                    <>
                      <FiChevronDown className="icon" />
                      Show More ({plots.length - visiblePlotsCount} more plots)
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Summary of selected plots */}
      {formData.selectedPlots.length > 0 && (
        <div className="selected-plots-summary">
          <h5>Selected Plots ({formData.selectedPlots.length})</h5>
          <p>
            <strong>Plots:</strong>{" "}
            {formData.selectedPlots.map((p) => p.number).join(", ")}
          </p>
          <p>
            <strong>Layout Name:</strong> {formData.layoutName}
          </p>
          <p>
            <strong>Prices:</strong> {formData.selectedPlots
              .map((p) => `₦${parseFloat(p.price).toLocaleString()}`)
              .join(", ")}
          </p>
          <p>
            <strong>Total Price:</strong> ₦
            {formData.selectedPlots
              .reduce((sum, p) => sum + parseFloat(p.price), 0)
              .toLocaleString()}
          </p>
        </div>
      )}

      {errors.selectedPlots && (
        <span className="error-text">{errors.selectedPlots}</span>
      )}
    </div>

    {/* Plot Details */}
    <div className="form-row">
      <div className="form-group">
        <label>Number of Selected Plots *</label>
        <input
          type="number"
          name="numberOfPlots"
          value={formData.selectedPlots.length}
          readOnly
          className="readonly-input"
        />
      </div>

      <div className="form-group">
        <label>Layout Name *</label>
        <input
          type="text"
          name="layoutName"
          value={formData.layoutName}
          onChange={handleChange}
          required
          placeholder="Layout name will auto-fill when plots are selected"
        />
        {errors.layoutName && <span className="error-text">{errors.layoutName}</span>}
      </div>
    </div>

    <div className="form-row">
      <div className="form-group">
        <label>Proposed Use *</label>
        <select
          name="proposedUse"
          value={formData.proposedUse}
          onChange={handleChange}
          required
        >
          <option value="">Select Use</option>
          <option value="Residential">Residential</option>
          <option value="Commercial">Commercial</option>
          <option value="Industrial">Industrial</option>
          <option value="Agricultural">Agricultural</option>
        </select>
        {errors.proposedUse && <span className="error-text">{errors.proposedUse}</span>}
      </div>

      {/* REMOVED: Proposed Type Field */}
    </div>

    <div className="form-row">
      <div className="form-group">
        <label>Plot Size *</label>
        <input
          type="text"
          name="plotSize"
          value={formData.plotSize}
          onChange={handleChange}
          required
          placeholder="Plot size will auto-fill when plots are selected"
        />
        {errors.plotSize && <span className="error-text">{errors.plotSize}</span>}
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
          <option value="3 Months">3 Months</option>
          <option value="12 Months">12 Months</option>
          <option value="18 Months">18 Months</option>
          <option value="24 Months">24 Months</option>
          <option value="30 Months">30 Months</option>
        </select>
        {errors.paymentTerms && <span className="error-text">{errors.paymentTerms}</span>}
      </div>
    </div>

    <div className="form-group">
      <label>Total Price (₦)</label>
      <input
        type="text"
        value={formData.selectedPlots
          .reduce((sum, plot) => sum + parseFloat(plot.price || 0), 0)
          .toLocaleString() || '0'}
        readOnly
        className="total-price-display"
      />
    </div>

    {/* Agreement Section */}
    <div className="agreement-section">
      <div className="terms-preview">
        <p>By submitting this form, you agree to our Terms and Conditions</p>
        <button type="button" className="view-terms-btn" onClick={() => setShowTermsModal(true)}>
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
            
            {step < 3 ? (
              <button type="button" className="next-btn" onClick={handleNext}>
                Next
              </button>
            ) : (
              <button type="submit" className="submit-btn" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Subscription'}
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

      {/* Layout Selection Modal */}
      {showLayoutModal && (
        <div className="modal-overlay" onClick={handleCloseLayoutModal}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3><FiFileText /> Select Estate Layout Plan</h3>
              <button className="modal-close" onClick={handleCloseLayoutModal}>×</button>
            </div>
            <div className="modal-body">
              <div className="layouts-grid">
                {allLayoutPlans.map(layout => (
                  <div key={layout.id} className="layout-card">
                    <div className="layout-header">
                      <h4>{layout.layout_name}</h4>
                      {selectedLayout && selectedLayout.id === layout.id && (
                        <span className="current-badge">Selected</span>
                      )}
                    </div>
                    <div className="layout-details">
                      <p><strong>File:</strong> {layout.filename}</p>
                      <p><strong>Uploaded:</strong> {new Date(layout.created_at).toLocaleDateString()}</p>
                      <p><strong>Size:</strong> {(layout.file_size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    <div className="layout-actions">
                      <button 
                        className="btn-select"
                        onClick={() => handleLayoutSelect(layout)}
                      >
                        Select
                      </button>
                      <button 
                        type="button" 
                        className="btn-view-layout"
                        onClick={() => handleViewPdf(`https://musabaha-homes-ltd.vercel.app${layout.file_url}`)} 
                      >
                        <FiEye className="icon" /> View
                      </button>
                      <button 
                        className="btn-download"
                        onClick={() => handleDownloadLayout(layout)}
                      >
                        <FiDownload /> Download
                      </button>
                    </div>
                  </div>
                ))}
                {allLayoutPlans.length === 0 && (
                  <div className="no-layouts">
                    <FiInfo className="icon" />
                    <p>No layout plans available.</p>
                    <p>Please contact the administrator for estate layout plans.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PDF View Modal */}
      {showPdfModal && currentPdf && (
        <div className="modal-overlay" onClick={handleClosePdfModal}>
          <div className="modal-content pdf-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Layout Plan</h3>
              <button className="modal-close" onClick={handleClosePdfModal}>×</button>
            </div>
            <div className="modal-body pdf-viewer">
              {pdfError ? (
                <div className="pdf-error">
                  <FiInfo className="error-icon" />
                  <p>{pdfError}</p>
                  <button 
                    className="btn-download-layout"
                    onClick={() => selectedLayout && handleDownloadLayout(selectedLayout)}
                  >
                    <FiDownload className="icon" /> Download Layout Instead
                  </button>
                </div>
              ) : (
                <>
                  <Document
                    file={currentPdf}
                    onLoadSuccess={onDocumentLoadSuccess}
                    onLoadError={onDocumentLoadError}
                    loading={
                      <div className="pdf-loading">
                        <p>Loading PDF document...</p>
                      </div>
                    }
                  >
                    <Page pageNumber={pageNumber} />
                  </Document>
                  <div className="pdf-controls">
                    <button 
                      disabled={pageNumber <= 1}
                      onClick={() => setPageNumber(prev => prev - 1)}
                    >
                      Previous
                    </button>
                    <span>Page {pageNumber} of {numPages || '?'}</span>
                    <button 
                      disabled={pageNumber >= (numPages || 1)}
                      onClick={() => setPageNumber(prev => prev + 1)}
                    >
                      Next
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      
      <TermsModal />
    </div>
  );
};

export default SubscriptionForm;