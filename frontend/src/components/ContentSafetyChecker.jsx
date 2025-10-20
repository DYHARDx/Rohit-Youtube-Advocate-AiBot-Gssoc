import React, { useState } from "react";
import { postData } from "../utils/postData";
import { useError } from "../context/ErrorContext";
import ErrorDisplay from "./ErrorDisplay";
import LoadingSpinner from "./LoadingSpinner";
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
  // 🎯 State management for content safety analysis functionality
  const [content, setContent] = useState("");              // User input content for analysis
  const [result, setResult] = useState("");               // Analysis results from API
  const [loading, setLoading] = useState(false);           // Loading state indicator
  const [error, setError] = useState("");                 // Error message state

  /**
   * Handle content text input changes
   * Updates the content text state as user types
   * @param {Event} e - Change event from textarea
   */
  const handleContentChange = (e) => {
    // 🎨 DEBUG: Content updated - {e.target.value.length} characters
    setContent(e.target.value);
    // Clear error when user starts typing
    if (error) setError("");
  };

  /**
   * Validate content input before processing
   * Ensures content is provided before analysis
   * @returns {boolean} - Validation result
   */
  const validateContent = () => {
    // 🎯 Check if content is empty or only whitespace
    if (!content.trim()) {
      setError("⚠️ Please provide content for safety analysis.");
      // 🎨 DEBUG: Content validation failed - no content provided
      return false;
    }
    
    // Check minimum length
    if (content.trim().length < 10) {
      setError(componentId, "Please provide more detailed content for analysis (at least 10 characters).");
      return false;
    }
    
    // 🎨 DEBUG: Content validation passed
    clearError(componentId);
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
    
    // 🚀 Set loading state and clear previous results
    setLoading(componentId, true);
    setResult("");
    setError(""); // Clear previous errors
    // 🎨 DEBUG: Starting content safety analysis

    try {
      // 🌐 Send request to backend API for content safety check
      const apiResponse = await postData("/api/content/check", { text: content }, 15000);
      // 🎨 DEBUG: API response received - {apiResponse ? 'success' : 'error'}

      // 📋 Handle API response
      if (apiResponse.error) {
        setError(`❌ ${apiResponse.error}`);
        // 🎨 DEBUG: API returned error - {apiResponse.error}
      } else {
        setResult(apiResponse.data.report || "No safety report generated.");
        // 🎨 DEBUG: Safety analysis completed successfully
      }
    } catch (analysisError) {
      // 🚨 Handle network or processing errors
      setError(`❌ Network Error: ${error.message || "Connection failed"}`);
      // 🎨 DEBUG: Network error occurred - {error.message}
    } finally {
      // 🎯 Always reset loading state
      setLoading(componentId, false);
      // 🎨 DEBUG: Content safety analysis completed
    }
  };

  /**
   * Render safety report content based on state
   * Handles loading, empty, and result states
   * @returns {JSX.Element} - Safety report content to display
   */
  const renderResult = () => {
    // 🔄 Show loading indicator during processing
    if (isLoading(componentId)) {
      return <LoadingSpinner message="Checking content safety..." />;
    }
    
    // ❌ Show error message if present
    if (error) {
      return <div className="error-message">{error}</div>;
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
          value={content}
          onChange={handleContentChange}
          placeholder="Enter your video script or content for safety evaluation..."
          disabled={isLoading(componentId)}
          className="component-textarea"
          aria-label="Content to check for safety"
        />
        
        {/* 🚀 ANALYSIS SUBMIT BUTTON */}
        <button 
          type="submit" 
          className="submit-button primary" 
          disabled={isLoading(componentId)}
          aria-label={isLoading(componentId) ? "Analyzing content" : "Run safety check"}
        >
          {isLoading(componentId) ? "Analyzing Content..." : "Run Safety Check"}
        </button>
      </form>
      
      {/* 📊 ANALYSIS RESULTS DISPLAY */}
      <div className="result-container result-card" role="status" aria-live="polite">
        <ErrorDisplay message={isLoading(componentId) ? null : (useError().errors[componentId] || null)} />
        {renderResult()}
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