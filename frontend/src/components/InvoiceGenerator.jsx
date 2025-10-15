import React, { useState } from "react";
import { postData } from "../utils/postData";
import { jsPDF } from "jspdf";
import "../styles/CommonStyles.css";

const ProfessionalInvoiceCreator = () => {
  const [formData, setFormData] = useState({
    brand: "",
    service: "",
    amount: "",
    include_gst: true,
  });
  const [invoiceOutput, setInvoiceOutput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleFormInputChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((previousState) => ({
      ...previousState,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const validateFormData = () => {
    if (!formData.brand.trim() || !formData.service.trim() || !formData.amount) {
      setInvoiceOutput("⚠️ Please complete all required form fields.");
      return false;
    }
    return true;
  };

  const handleInvoiceGeneration = async (e) => {
    e.preventDefault();
    
    if (!validateFormData()) {
      return;
    }
    
    setIsGenerating(true);
    setInvoiceOutput(""); // Clear previous invoice results
    
    try {
      const apiResponse = await postData("/api/invoice/generate", formData);
      
      if (apiResponse.error) {
        setInvoiceOutput(`❌ Generation Error: ${apiResponse.error}`);
      } else {
        setInvoiceOutput(apiResponse.invoice_text || "No invoice content generated.");
      }
    } catch (processingError) {
      setInvoiceOutput(`❌ System Error: ${processingError.message || "Invoice service unavailable"}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadInvoicePDF = () => {
    const pdfDocument = new jsPDF();
    pdfDocument.text(invoiceOutput, 10, 20);
    const fileName = `invoice_${formData.brand.replace(/\s+/g, "_").toLowerCase()}.pdf`;
    pdfDocument.save(fileName);
  };

  const renderInvoiceContent = () => {
    if (isGenerating) {
      return (
        <div className="generation-status">
          <span className="generation-spinner"></span>
          Creating professional invoice...
        </div>
      );
    }
    
    if (invoiceOutput) {
      return (
        <>
          <div className="invoice-display">{invoiceOutput}</div>
          {!invoiceOutput.startsWith("❌") && (
            <button
              onClick={downloadInvoicePDF}
              className="download-button primary"
              disabled={isGenerating}
            >
              {isGenerating ? "Processing Download..." : "Export as PDF"}
            </button>
          )}
        </>
      );
    }
    
    return <div className="invoice-placeholder">Your generated invoice will appear in this section...</div>;
  };

  const renderInputFields = () => (
    <>
      <input
        id="brand"
        type="text"
        value={formData.brand}
        onChange={handleFormInputChange}
        placeholder="Enter brand or sponsor name"
        className="form-input-field"
        disabled={isGenerating}
      />
      <input
        id="service"
        type="text"
        value={formData.service}
        onChange={handleFormInputChange}
        placeholder="Describe service provided"
        className="form-input-field"
        disabled={isGenerating}
      />
      <input
        id="amount"
        type="number"
        value={formData.amount}
        onChange={handleFormInputChange}
        placeholder="Enter amount in INR"
        className="form-input-field"
        disabled={isGenerating}
      />

      <label className="gst-selection-label">
        <input
          id="include_gst"
          type="checkbox"
          checked={formData.include_gst}
          onChange={handleFormInputChange}
          disabled={isGenerating}
          className="gst-selection-checkbox"
        />
        <span className="gst-option-text">Include GST taxation (18%)</span>
      </label>
    </>
  );

  return (
    <section className="section-container invoice-creator-section">
      <h3 className="section-heading">
        <svg className="heading-icon" width="32" height="32" viewBox="0 0 38 38" fill="none">
          <rect width="38" height="38" rx="10" fill="currentColor" />
          <polygon points="15,12 28,19 15,26" fill="white" />
        </svg>
        Professional Invoice Creator
      </h3>

      <form onSubmit={handleInvoiceGeneration} className="invoice-creation-form">
        {renderInputFields()}
        <button 
          type="submit" 
          className="generate-invoice-button primary" 
          disabled={isGenerating}
        >
          {isGenerating ? "Creating Invoice..." : "Generate Professional Invoice"}
        </button>
      </form>

      <div className="invoice-result-container result-card">
        {renderInvoiceContent()}
      </div>
    </section>
  );
};

export default ProfessionalInvoiceCreator;
