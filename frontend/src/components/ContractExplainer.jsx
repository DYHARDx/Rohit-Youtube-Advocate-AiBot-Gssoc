import React, { useState } from "react";
import { postData } from "../utils/postData";
import "../styles/CommonStyles.css";
import { AlertCircle } from "lucide-react";

/**
 * Legal Contract Analyzer Component
 * =================================
 * 
 * This component provides functionality to:
 * - Analyze complex legal contracts and simplify them for better understanding
 * - Accept text input or PDF file uploads
 * - Display simplified contract analysis to users
 * 
 * Features:
 * - Text area for direct contract input
 * - PDF file upload capability
 * - Real-time validation and error handling
 * - Responsive loading states
 * - Accessible UI components
 * 
 * @component
 * @example
 * return (
 *   <LegalContractAnalyzer />
 * )
 */
const LegalContractAnalyzer = () => {
  // 🎯 State management for contract analysis functionality
  const [contractText, setContractText] = useState("");           // User input contract text
  const [analysis, setAnalysis] = useState("");                  // Analysis results from API
  const [processing, setProcessing] = useState(false);           // Processing state indicator
  const [file, setFile] = useState(null);                       // Uploaded PDF file
  const [fileError, setFileError] = useState("");               // File validation errors
  const [error, setError] = useState(null);                     // API error state

  /**
   * Handle contract text input changes
   * @param {Event} e - Change event from textarea
   */
  const handleTextChange = (e) => {
    // 🎨 DEBUG: Contract text updated - {e.target.value.length} characters
    setContractText(e.target.value);
    // Clear previous errors when user starts typing
    if (error) setError(null);
  };

  /**
   * Handle PDF file upload
   * Validates file type and sets file state
   * @param {Event} e - Change event from file input
   */
  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    
    // 🎯 Early return if no file selected
    if (!uploadedFile) return;

    // 📋 Validate file type is PDF
    if (uploadedFile.type !== "application/pdf") {
      setFileError("Please upload a valid PDF file.");
      setFile(null);
      // 🎨 DEBUG: Invalid file type uploaded - {uploadedFile.type}
      return;
    }

    // 🎯 Clear any previous errors and set file
    setFileError("");
    setFile(uploadedFile);
    // Clear previous errors when user uploads a file
    if (error) setError(null);
    // 🎨 DEBUG: Valid PDF file uploaded - {uploadedFile.name}
  };

  /**
   * Validate contract input before processing
   * Ensures either text or file is provided
   * @returns {boolean} - Validation result
   */
  const validateInput = () => {
    // 🎯 Check if both text and file are empty
    if (!contractText.trim() && !file) {
      setError("⚠️ Please provide contract text or upload a PDF file.");
      // 🎨 DEBUG: Input validation failed - no content provided
      return false;
    }
    // 🎨 DEBUG: Input validation passed
    return true;
  };

  /**
   * Handle form submission
   * Processes contract text and sends to backend API
   * @param {Event} e - Form submit event
   */
  const handleSubmit = async (e) => {
    // 🎯 Prevent default form submission behavior
    e.preventDefault();

    // 📋 Validate input before processing
    if (!validateInput()) return;

    // 🚀 Set processing state and clear previous analysis and errors
    setProcessing(true);
    setAnalysis("");
    setError(null);
    // 🎨 DEBUG: Starting contract analysis process

    try {
      // 📦 Prepare payload with contract text
      let payload = { text: contractText };

      // 📄 If file is uploaded, extract and append text content
      if (file) {
        const fileText = await file.text();
        payload.text += `\n${fileText}`;
        // 🎨 DEBUG: PDF content appended to payload - {fileText.length} characters
      }

      // 🌐 Send request to backend API for contract simplification
      const apiResponse = await postData("/api/contract/simplify", payload);
      // 🎨 DEBUG: API response received - {apiResponse ? 'success' : 'error'}

      // 📋 Handle API response
      if (apiResponse.error) {
        // Handle different types of errors
        if (apiResponse.networkError) {
          setError(`❌ Network Error: ${apiResponse.error}`);
        } else if (apiResponse.status === 503) {
          setError(`❌ Service Unavailable: ${apiResponse.error}`);
        } else if (apiResponse.status === 400) {
          setError(`❌ Invalid Request: ${apiResponse.error}`);
        } else {
          setError(`❌ ${apiResponse.error}${apiResponse.details ? ` - ${apiResponse.details}` : ''}`);
        }
        // 🎨 DEBUG: API returned error - {apiResponse.error}
      } else {
        setAnalysis(apiResponse.summary || "No analysis generated.");
        // 🎨 DEBUG: Analysis completed successfully
      }
    } catch (error) {
      // 🚨 Handle network or processing errors
      setError(`❌ Processing Error: ${error.message || "Service unavailable"}`);
      // 🎨 DEBUG: Processing error occurred - {error.message}
    } finally {
      // 🎯 Always reset processing state
      setProcessing(false);
      // 🎨 DEBUG: Contract analysis process completed
    }
  };

  /**
   * Render analysis content based on state
   * Handles loading, empty, and result states
   * @returns {JSX.Element} - Analysis content to display
   */
  const renderAnalysis = () => {
    // 🔄 Show loading indicator during processing
    if (processing) {
      return (
        <div className="loading-indicator">
          <span className="spinner"></span>
          Analyzing legal contract terms...
        </div>
      );
    }
    
    // 🚨 Show error message if there's an error
    if (error) {
      return <div className="error-message">{error}</div>;
    }
    
    // 📋 Show analysis results if available
    if (analysis) {
      return analysis;
    }
    
    // 🎯 Show placeholder when no analysis is available
    return "Contract analysis results will be displayed here...";
  };

  /**
   * Render error message with appropriate styling
   * @returns {JSX.Element|null} - Error message element or null
   */
  const renderErrorMessage = () => {
    if (!error) return null;
    
    return (
      <div className="error-message-container">
        <div className="error-message">{error}</div>
        {error.includes("Network error") && (
          <div className="error-suggestion">
            💡 Tip: Check your internet connection and make sure the backend server is running.
          </div>
        )}
        {error.includes("Service Unavailable") && (
          <div className="error-suggestion">
            💡 Tip: The service may be temporarily unavailable. Please try again in a few minutes.
          </div>
        )}
      </div>
    );
  };

  // 🎯 TODO: Add caching mechanism for repeated contract analyses
  // 🎯 TODO: Implement contract comparison feature
  // 🎯 TODO: Add export functionality for analysis results

  return (
    <section className="section-container contract-section" aria-labelledby="contract-title">
      {/* 🎯 SECTION HEADER WITH ICON */}
      <h3 id="contract-title" className="section-heading">
        <svg className="heading-icon" width="32" height="32" viewBox="0 0 38 38" fill="none" style={{ marginRight: "10px" }}>
          <rect width="38" height="38" rx="10" fill="currentColor" />
          <polygon points="15,12 28,19 15,26" fill="white" />
        </svg>
        Legal Contract Analyzer
      </h3>
      
      {/* 🎯 CONTRACT INPUT FORM */}
      <form onSubmit={handleSubmit} className="component-form">
        {/* 📝 CONTRACT TEXT AREA */}
        <textarea
          rows={6}
          value={contractText}
          onChange={handleTextChange}
          placeholder="Insert your legal contract text for simplification..."
          disabled={processing}
          className="component-textarea"
          aria-label="Legal contract text"
        />

        {/* 📄 PDF FILE UPLOAD */}
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileUpload}
          disabled={processing}
          className="component-file-input"
          aria-label="Upload PDF contract"
          style={{ marginTop: "10px" }}
        />

        {/* ⚠️ FILE ERROR MESSAGE */}
        {fileError && (
          <div className="file-error-message" role="alert">
            <AlertCircle className="error-icon" />
            {fileError}
          </div>
        )}

        {/* 🚀 SUBMIT BUTTON */}
        <button 
          type="submit" 
          className="submit-button primary" 
          disabled={processing}
          aria-label={processing ? "Analyzing contract" : "Analyze legal terms"}
          style={{ marginTop: "10px" }}
        >
          {processing ? "Analyzing Contract..." : "Analyze Legal Terms"}
        </button>
      </form>
      
      {/* 📊 ANALYSIS RESULTS DISPLAY */}
      <div className="result-container result-card" role="status" aria-live="polite">
        {renderAnalysis()}
        {renderErrorMessage()}
      </div>
    </section>
  );
};

// 🎯 Placeholder for future enhancements
/**
 * Future enhancement placeholder function
 * @todo Implement advanced contract analysis features
 */
const futureEnhancement = () => {
  // Reserved for future implementation
};

export default LegalContractAnalyzer;