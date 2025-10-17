import React, { useState } from "react";
import { postData } from "../utils/postData";
import { jsPDF } from "jspdf";
import { useError } from "../context/ErrorContext";
import ErrorDisplay from "./ErrorDisplay";
import LoadingSpinner from "./LoadingSpinner";
import "../styles/CommonStyles.css";

/**
 * Professional Invoice Creator Component
 * =====================================
 * 
 * This component provides functionality to:
 * - Generate professional invoices for content creator services
 * - Collect client/brand information and service details
 * - Include optional GST taxation calculation
 * - Export invoices as PDF documents
 * 
 * Features:
 * - Form-based input collection
 * - Real-time validation and error handling
 * - Responsive loading states
 * - PDF export capability
 * - Accessible UI components
 * 
 * @component
 * @example
 * return (
 *   <ProfessionalInvoiceCreator />
 * )
 */
const ProfessionalInvoiceCreator = () => {
  // 🎯 State management for invoice creation functionality
  const [formData, setFormData] = useState({
    brand: "",              // Client/brand name
    service: "",            // Service description
    amount: "",             // Service amount in INR
    include_gst: true,      // GST inclusion flag
  });
  
  const [invoiceOutput, setInvoiceOutput] = useState("");     // Generated invoice text
  const { setError, clearError, setLoading, isLoading } = useError();
  const componentId = "invoice-generator";

  /**
   * Handle form input changes
   * Updates form data state based on user input
   * @param {Event} e - Change event from form inputs
   */
  const handleFormInputChange = (e) => {
    const { id, value, type, checked } = e.target;
    
    // 🎨 DEBUG: Form input updated - {id}: {type === 'checkbox' ? checked : value}
    setFormData((previousState) => ({
      ...previousState,
      [id]: type === "checkbox" ? checked : value,
    }));
    
    clearError(componentId);
  };

  /**
   * Validate form data before processing
   * Ensures all required fields are filled
   * @returns {boolean} - Validation result
   */
  const validateFormData = () => {
    // 🎯 Check if required fields are filled
    if (!formData.brand.trim()) {
      setError(componentId, "Please enter the brand or client name.");
      // 🎨 DEBUG: Form validation failed - missing brand name
      return false;
    }
    
    if (!formData.service.trim()) {
      setError(componentId, "Please describe the service provided.");
      // 🎨 DEBUG: Form validation failed - missing service description
      return false;
    }
    
    if (!formData.amount || isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      setError(componentId, "Please enter a valid amount greater than zero.");
      // 🎨 DEBUG: Form validation failed - invalid amount
      return false;
    }
    
    // 🎨 DEBUG: Form validation passed
    clearError(componentId);
    return true;
  };

  /**
   * Handle invoice generation
   * Processes form data and sends to backend API to generate invoice
   * @param {Event} e - Form submit event
   */
  const handleInvoiceGeneration = async (e) => {
    // 🎯 Prevent default form submission behavior
    e.preventDefault();
    
    // 📋 Validate form data before processing
    if (!validateFormData()) {
      return;
    }
    
    // 🚀 Set generation state and clear previous results
    setLoading(componentId, true);
    setInvoiceOutput(""); // Clear previous invoice results
    clearError(componentId);
    // 🎨 DEBUG: Starting invoice generation process

    try {
      // 🌐 Send request to backend API for invoice generation
      const apiResponse = await postData("/api/invoice/generate", formData);
      // 🎨 DEBUG: API response received - {apiResponse ? 'success' : 'error'}

      // 📋 Handle API response
      if (!apiResponse.success) {
        setError(componentId, apiResponse.error || "Failed to generate invoice. Please try again.");
        // 🎨 DEBUG: API returned error - {apiResponse.error}
      } else {
        setInvoiceOutput(apiResponse.data.invoice_text || "No invoice content generated.");
        // 🎨 DEBUG: Invoice generated successfully
      }
    } catch (processingError) {
      // 🚨 Handle network or processing errors
      setError(componentId, `System Error: ${processingError.message || "Invoice service unavailable"}`);
      // 🎨 DEBUG: Processing error occurred - {processingError.message}
    } finally {
      // 🎯 Always reset generation state
      setLoading(componentId, false);
      // 🎨 DEBUG: Invoice generation process completed
    }
  };

  /**
   * Download invoice as PDF
   * Converts invoice text to PDF and triggers download
   */
  const downloadInvoicePDF = () => {
    // 📄 Create new PDF document
    const pdfDocument = new jsPDF();
    
    // 📝 Add invoice text to PDF
    pdfDocument.text(invoiceOutput, 10, 20);
    
    // 📁 Generate filename based on brand name
    const fileName = `invoice_${formData.brand.replace(/\s+/g, "_").toLowerCase()}.pdf`;
    
    // 🚀 Trigger PDF download
    pdfDocument.save(fileName);
    // 🎨 DEBUG: Invoice PDF downloaded - {fileName}
  };

  /**
   * Render invoice content based on state
   * Handles loading, empty, and result states
   * @returns {JSX.Element} - Invoice content to display
   */
  const renderInvoiceContent = () => {
    // 🔄 Show loading indicator during generation
    if (isLoading(componentId)) {
      return <LoadingSpinner message="Creating professional invoice..." />;
    }
    
    // 📋 Show invoice output if available
    if (invoiceOutput) {
      return (
        <>
          <div className="invoice-display">{invoiceOutput}</div>
          {/* 🎯 Show download button only for successful invoices */}
          {!invoiceOutput.startsWith("❌") && (
            <button
              onClick={downloadInvoicePDF}
              className="download-button primary"
              disabled={isLoading(componentId)}
            >
              {isLoading(componentId) ? "Processing Download..." : "Export as PDF"}
            </button>
          )}
        </>
      );
    }
    
    // 🎯 Show placeholder when no invoice is available
    return <div className="invoice-placeholder">Your generated invoice will appear in this section...</div>;
  };

  /**
   * Render input fields for invoice form
   * @returns {JSX.Element} - Form input fields
   */
  const renderInputFields = () => (
    <>
      {/* 🏢 BRAND/CLIENT NAME INPUT */}
      <input
        id="brand"
        type="text"
        value={formData.brand}
        onChange={handleFormInputChange}
        placeholder="Enter brand or sponsor name"
        className="form-input-field"
        disabled={isLoading(componentId)}
      />
      
      {/* 🛠️ SERVICE DESCRIPTION INPUT */}
      <input
        id="service"
        type="text"
        value={formData.service}
        onChange={handleFormInputChange}
        placeholder="Describe service provided"
        className="form-input-field"
        disabled={isLoading(componentId)}
      />
      
      {/* 💰 AMOUNT INPUT */}
      <input
        id="amount"
        type="number"
        value={formData.amount}
        onChange={handleFormInputChange}
        placeholder="Enter amount in INR"
        className="form-input-field"
        disabled={isLoading(componentId)}
      />

      {/* 🧾 GST SELECTION CHECKBOX */}
      <label className="gst-selection-label">
        <input
          id="include_gst"
          type="checkbox"
          checked={formData.include_gst}
          onChange={handleFormInputChange}
          disabled={isLoading(componentId)}
          className="gst-selection-checkbox"
        />
        <span className="gst-option-text">Include GST taxation (18%)</span>
      </label>
    </>
  );

  // 🎯 TODO: Add currency selection feature
  // 🎯 TODO: Implement invoice template customization
  // 🎯 TODO: Add email invoice functionality

  return (
    <section className="section-container invoice-creator-section">
      {/* 🎯 SECTION HEADER WITH ICON */}
      <h3 className="section-heading">
        <svg className="heading-icon" width="32" height="32" viewBox="0 0 38 38" fill="none">
          <rect width="38" height="38" rx="10" fill="currentColor" />
          <polygon points="15,12 28,19 15,26" fill="white" />
        </svg>
        Professional Invoice Creator
      </h3>

      {/* 🎯 INVOICE CREATION FORM */}
      <form onSubmit={handleInvoiceGeneration} className="invoice-creation-form">
        {renderInputFields()}
        <button 
          type="submit" 
          className="generate-invoice-button primary" 
          disabled={isLoading(componentId)}
        >
          {isLoading(componentId) ? "Creating Invoice..." : "Generate Professional Invoice"}
        </button>
      </form>

      {/* 📊 INVOICE RESULTS DISPLAY */}
      <div className="invoice-result-container result-card">
        <ErrorDisplay message={isLoading(componentId) ? null : (useError().errors[componentId] || null)} />
        {renderInvoiceContent()}
      </div>
    </section>
  );
};

// 🎯 Placeholder for future enhancements
/**
 * Future enhancement placeholder function
 * @todo Implement advanced invoice features
 */
const futureEnhancement = () => {
  // Reserved for future implementation
};

export default ProfessionalInvoiceCreator;