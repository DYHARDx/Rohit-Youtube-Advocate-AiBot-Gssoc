import React, { useState } from "react";
import { postData } from "../utils/postData";
import "../styles/CommonStyles.css";

/**
 * Content Safety Analyzer Component
 * ===============================
 * 
 * This component provides functionality to:
 * - Analyze content for YouTube policy compliance and safety
 * - Identify potential violations or areas of concern
 * - Provide safety recommendations and guidance
 * 
 * Features:
 * - Text area for content input
 * - Real-time validation and error handling
 * - Responsive loading states
 * - Accessible UI components
 * 
 * @component
 * @example
 * return (
 *   <ContentSafetyAnalyzer />
 * )
 */
const ContentSafetyAnalyzer = () => {
  // 🎯 State management for content safety functionality
  const [contentText, setContentText] = useState("");            // User content text
  const [safetyReport, setSafetyReport] = useState("");          // Safety report from API
  const [isAnalyzing, setIsAnalyzing] = useState(false);        // Analysis processing state
  const [error, setError] = useState(null);                     // Error state for API calls

  /**
   * Handle content text input changes
   * Updates the content text state as user types
   * @param {Event} e - Change event from textarea
   */
  const handleContentInputChange = (e) => {
    // 🎨 DEBUG: Content text updated - {e.target.value.length} characters
    setContentText(e.target.value);
    // Clear previous errors when user starts typing
    if (error) setError(null);
  };

  /**
   * Validate content input before processing
   * Ensures content is provided before analysis
   * @returns {boolean} - Validation result
   */
  const validateContentInput = () => {
    // 🎯 Check if content text is empty or only whitespace
    if (!contentText.trim()) {
      setError("⚠️ Please enter content to analyze for safety.");
      // 🎨 DEBUG: Content input validation failed - no content provided
      return false;
    }
    // 🎨 DEBUG: Content input validation passed
    return true;
  };

  /**
   * Handle content safety analysis submission
   * Processes content and sends to backend API for analysis
   * @param {Event} e - Form submit event
   */
  const handleContentAnalysis = async (e) => {
    // 🎯 Prevent default form submission behavior
    e.preventDefault();
    
    // 📋 Validate content input before processing
    if (!validateContentInput()) {
      return;
    }
    
    // 🚀 Set analyzing state and clear previous reports and errors
    setIsAnalyzing(true);
    setSafetyReport(""); // Clear previous safety reports
    setError(null); // Clear previous errors
    // 🎨 DEBUG: Starting content analysis process

    try {
      // 🌐 Send request to backend API for content analysis
      const analysisResponse = await postData("/api/content/check", { text: contentText });
      // 🎨 DEBUG: API response received - {analysisResponse ? 'success' : 'error'}

      // 📋 Handle API response
      if (analysisResponse.error) {
        // Handle different types of errors
        if (analysisResponse.networkError) {
          setError(`❌ Network Error: ${analysisResponse.error}`);
        } else if (analysisResponse.status === 503) {
          setError(`❌ Service Unavailable: ${analysisResponse.error}`);
        } else if (analysisResponse.status === 400) {
          setError(`❌ Invalid Request: ${analysisResponse.error}`);
        } else {
          setError(`❌ ${analysisResponse.error}${analysisResponse.details ? ` - ${analysisResponse.details}` : ''}`);
        }
        // 🎨 DEBUG: API returned error - {analysisResponse.error}
      } else {
        setSafetyReport(analysisResponse.report || "No safety report available.");
        // 🎨 DEBUG: Content analysis completed successfully
      }
    } catch (analysisError) {
      // 🚨 Handle network or processing errors
      setError(`❌ System Error: ${analysisError.message || "Content safety service unavailable"}`);
      // 🎨 DEBUG: Analysis error occurred - {analysisError.message}
    } finally {
      // 🎯 Always reset analyzing state
      setIsAnalyzing(false);
      // 🎨 DEBUG: Content analysis process completed
    }
  };

  /**
   * Render safety report content based on state
   * Handles loading, empty, and result states
   * @returns {JSX.Element} - Safety report content to display
   */
  const renderSafetyReport = () => {
    // 🔄 Show loading indicator during analysis
    if (isAnalyzing) {
      return (
        <div className="analysis-status">
          <span className="analysis-spinner"></span>
          🔍 Analyzing content safety...
        </div>
      );
    }
    
    // 🚨 Show error message if there's an error
    if (error) {
      return <div className="error-message">{error}</div>;
    }
    
    // 📋 Show safety report if available
    if (safetyReport) {
      return safetyReport;
    }
    
    // 🎯 Show placeholder when no report is available
    return "Content safety analysis and recommendations will appear here...";
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

  // 🎯 TODO: Add content history feature
  // 🎯 TODO: Implement content category filtering
  // 🎯 TODO: Add save functionality for important reports

  return (
    <section className="section-container safety-analyzer-section">
      {/* 🎯 SECTION HEADER WITH ICON AND EMOJI */}
      <h3 className="section-header">
        <svg className="header-icon" width="32" height="32" viewBox="0 0 38 38" fill="none" style={{ marginRight: "10px" }}>
          <rect width="38" height="38" rx="10" fill="currentColor" />
          <path d="M19 10L22 15L27 16L23 20L24 25L19 22L14 25L15 20L11 16L16 15L19 10Z" fill="white" />
        </svg>
        🔍 Content Safety Checker
      </h3>

      {/* 🎯 CONTENT ANALYSIS FORM */}
      <form onSubmit={handleContentAnalysis} className="content-analysis-form">
        {/* 📝 CONTENT TEXT AREA */}
        <textarea
          rows={6}
          value={contentText}
          onChange={handleContentInputChange}
          placeholder="Paste your YouTube content (video description, comments, etc.) to check for policy compliance and safety concerns..."
          disabled={isAnalyzing}
          className="content-input"
        />
        
        {/* 🚀 ANALYSIS SUBMIT BUTTON */}
        <button 
          type="submit" 
          className="analysis-button primary" 
          disabled={isAnalyzing}
        >
          {isAnalyzing ? "🔍 Analyzing..." : "Check Content Safety"}
        </button>
      </form>

      {/* 📊 SAFETY REPORT DISPLAY */}
      <div className="safety-report-container result-card">
        {renderSafetyReport()}
        {renderErrorMessage()}
      </div>
    </section>
  );
};

// 🎯 Placeholder for future enhancements
/**
 * Future enhancement placeholder function
 * @todo Implement advanced content analysis features
 */
const futureEnhancement = () => {
  // Reserved for future implementation
};

export default ContentSafetyAnalyzer;