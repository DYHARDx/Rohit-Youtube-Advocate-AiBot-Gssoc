import React, { useState } from "react";
import { postData } from "../utils/postData";
import { useError } from "../context/ErrorContext";
import ErrorDisplay from "./ErrorDisplay";
import LoadingSpinner from "./LoadingSpinner";
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
  const [file, setFile] = useState(null);                       // Uploaded PDF file
  const { setError, clearError, setLoading, isLoading } = useError();
  const componentId = "contract-analyzer";

  /**
   * Handle contract text input changes
   * @param {Event} e - Change event from textarea
   */
  const handleTextChange = (e) => {
    // 🎨 DEBUG: Contract text updated - {e.target.value.length} characters
    setContractText(e.target.value);
    clearError(componentId);
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
      setError(componentId, "Please upload a valid PDF file.");
      setFile(null);
      // 🎨 DEBUG: Invalid file type uploaded - {uploadedFile.type}
      return;
    }

    // 🎯 Clear any previous errors and set file
    clearError(componentId);
    setFile(uploadedFile);
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
      setError(componentId, "Please provide contract text or upload a PDF file.");
      // 🎨 DEBUG: Input validation failed - no content provided
      return false;
    }
    
    // Check minimum length if only text is provided
    if (contractText.trim() && contractText.trim().length < 20 && !file) {
      setError(componentId, "Please provide a more detailed contract (at least 20 characters) or upload a PDF file.");
      return false;
    }
    
    // 🎨 DEBUG: Input validation passed
    clearError(componentId);
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

    // 🚀 Set processing state and clear previous analysis
    setLoading(componentId, true);
    setAnalysis("");
    clearError(componentId);
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
      if (!apiResponse.success) {
        setError(componentId, apiResponse.error || "Failed to analyze contract. Please try again.");
        // 🎨 DEBUG: API returned error - {apiResponse.error}
      } else {
        setAnalysis(apiResponse.data.summary || "No analysis generated.");
        // 🎨 DEBUG: Analysis completed successfully
      }
    } catch (error) {
      // 🚨 Handle network or processing errors
      setError(componentId, `Processing Error: ${error.message || "Service unavailable"}`);
      // 🎨 DEBUG: Processing error occurred - {error.message}
    } finally {
      // 🎯 Always reset processing state
      setLoading(componentId, false);
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
    if (isLoading(componentId)) {
      return <LoadingSpinner message="Analyzing legal contract terms..." />;
    }
    
    // 📋 Show analysis results if available
    if (analysis) {
      return analysis;
    }
    
    // 🎯 Show placeholder when no analysis is available
    return "Contract analysis results will be displayed here...";
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
          disabled={isLoading(componentId)}
          className="component-textarea"
          aria-label="Legal contract text"
        />

        {/* 📄 PDF FILE UPLOAD */}
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileUpload}
          disabled={isLoading(componentId)}
          className="component-file-input"
          aria-label="Upload PDF contract"
          style={{ marginTop: "10px" }}
        />

        {/* 🚀 SUBMIT BUTTON */}
        <button 
          type="submit" 
          className="submit-button primary" 
          disabled={isLoading(componentId)}
          aria-label={isLoading(componentId) ? "Analyzing contract" : "Analyze legal terms"}
          style={{ marginTop: "10px" }}
        >
          {isLoading(componentId) ? "Analyzing Contract..." : "Analyze Legal Terms"}
        </button>
      </form>
      
      {/* 📊 ANALYSIS RESULTS DISPLAY */}
      <div className="result-container result-card" role="status" aria-live="polite">
        <ErrorDisplay message={isLoading(componentId) ? null : (useError().errors[componentId] || null)} />
        {renderAnalysis()}
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