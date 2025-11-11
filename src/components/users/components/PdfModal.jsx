import React, { useState } from 'react';
import { Document, Page } from 'react-pdf';
import { FiInfo, FiDownload } from "react-icons/fi";

const PdfModal = ({
  showPdfModal,
  handleClosePdfModal,
  currentPdf,
  pdfError,
  setPdfError,
  selectedLayout,
  handleDownloadLayout
}) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPageNumber(1);
    setPdfError(null);
  };

  const onDocumentLoadError = (error) => {
    console.error('Error loading PDF:', error);
    setPdfError('Failed to load PDF document. Please try downloading the layout plan instead.');
  };

  if (!showPdfModal) return null;

  return (
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
  );
};

export default PdfModal;