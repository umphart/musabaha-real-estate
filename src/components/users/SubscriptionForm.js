import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { pdfjs } from "react-pdf";
import "./SubscriptionForm.css";
import SubscriberData from "./components/SubscriberData";
import NextOfKinData from "./components/NextOfKinData";
import PlotInformation from "./components/PlotInformation";
import LayoutModal from "./components/LayoutModal";
import PdfModal from "./components/PdfModal";
import TermsModal from "./components/TermsModal";
import SuccessMessage from "./components/SuccessMessage";

// PDF worker setup
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

// Import child components

const SubscriptionForm = () => {
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
  });

  // Field max lengths
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
    plotSize: 20,
    paymentTerms: 50,
    price: 20,
    signatureText: 100
  };

  // Fetch all layout plans from backend
  const fetchAllLayoutPlans = async () => {
    try {
      const res = await fetch("https://musabaha-homes.onrender.com/api/layout-pla12345679ll");
      const data = await res.json();
      
      if (data.success) {
        setAllLayoutPlans(data.data);
        
        // Set the first layout as current PDF if available
        if (data.data.length > 0) {
          setSelectedLayout(data.data[0]);
          const fullUrl = `https://musabaha-homes.onrender.com${data.data[0].file_url}`;
          setCurrentPdf(fullUrl);
        }
      }
    } catch (error) {
      console.error("Error fetching all layout plans:", error);
    }
  };

  // Fetch plots from backend
  const fetchPlots = async () => {
    try {
      const res = await fetch("https://musabaha-homes.onrender.com/api/plots");
      const data = await res.json();
      
      if (data.success) {
        setPlots(data.data.filter(plot => plot.status === "Available" || plot.status === "available"));
      }
    } catch (err) {
      console.error("Error fetching plots:", err);
    }
  };

  useEffect(() => {
    fetchPlots();
    fetchAllLayoutPlans();
  }, []);

  // Handle layout selection
  const handleLayoutSelect = (layout) => {
    setSelectedLayout(layout);
    const fullUrl = `https://musabaha-homes.onrender.com${layout.file_url}`;
    setCurrentPdf(fullUrl);
    setShowLayoutModal(false);
  };

  const handleViewPdf = (fileUrl) => {
    setCurrentPdf(fileUrl);
    setShowPdfModal(true);
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
      if (!layout || !layout.id) {
        alert('Invalid layout plan data');
        return;
      }

      const token = localStorage.getItem("userToken");
      const response = await fetch(`https://musabaha-homes.onrender.com/api/layout-plan/download/${layout.id}`, {
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
    const isAlreadySelected = formData.selectedPlots.some(p => p.id === plot.id);
    
    let updatedSelection;
    
    if (isAlreadySelected) {
      updatedSelection = formData.selectedPlots.filter(p => p.id !== plot.id);
    } else {
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

  const validateStep = (step) => {
    const newErrors = {};
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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

      // Append price_per_plot
      if (formData.price_per_plot) {
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

      const token = localStorage.getItem("userToken");
      const response = await fetch("https://musabaha-homes.onrender.com/api/subscriptions", {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: data,
      });

      const result = await response.json();

      if (result.success) {
        setSubmitSuccess(true);
        setTimeout(() => {
          window.location.href = '/dashboard';
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

          {/* Step Components */}
          {step === 1 && (
            <SubscriberData 
              formData={formData}
              errors={errors}
              fieldMaxLengths={fieldMaxLengths}
              handleChange={handleChange}
            />
          )}

          {step === 2 && (
            <NextOfKinData 
              formData={formData}
              errors={errors}
              fieldMaxLengths={fieldMaxLengths}
              handleChange={handleChange}
            />
          )}

          {step === 3 && (
            <PlotInformation 
              formData={formData}
              errors={errors}
              fieldMaxLengths={fieldMaxLengths}
              handleChange={handleChange}
              plots={plots}
              selectedLayout={selectedLayout}
              handlePlotSelection={handlePlotSelection}
              setShowLayoutModal={setShowLayoutModal}
              setShowTermsModal={setShowTermsModal}
              handleViewPdf={handleViewPdf}
              handleDownloadLayout={handleDownloadLayout}
            />
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

      {/* Modal Components */}
      <LayoutModal 
        showLayoutModal={showLayoutModal}
        handleCloseLayoutModal={handleCloseLayoutModal}
        allLayoutPlans={allLayoutPlans}
        selectedLayout={selectedLayout}
        handleLayoutSelect={handleLayoutSelect}
        handleViewPdf={handleViewPdf}
        handleDownloadLayout={handleDownloadLayout}
      />

      <PdfModal 
        showPdfModal={showPdfModal}
        handleClosePdfModal={handleClosePdfModal}
        currentPdf={currentPdf}
        pdfError={pdfError}
        setPdfError={setPdfError}
        selectedLayout={selectedLayout}
        handleDownloadLayout={handleDownloadLayout}
      />

      <TermsModal 
        showTermsModal={showTermsModal}
        setShowTermsModal={setShowTermsModal}
      />
    </div>
  );
};

export default SubscriptionForm;