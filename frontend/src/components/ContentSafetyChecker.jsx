import React, { useState } from "react";
import { postData } from "../utils/postData";
import { useError } from "../context/ErrorContext";
import ErrorDisplay from "./ErrorDisplay";
import LoadingSpinner from "./LoadingSpinner";
import "../styles/CommonStyles.css";

/**
 * Content Safety Analyzer Component
 * ================================
 * 
 * This component provides functionality to:
 * - Analyze content for potential YouTube policy violations
 * - Check for safety issues including hate speech, misinformation, etc.
 * - Display safety reports to users
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
   * Handle content input changes
   * Updates the content state as user types
   * @param {Event} e - Change event from textarea
   */
  const handleContentChange = (e) => {
    // 🎨 DEBUG: Content updated - {e.target.value.length} characters
    setContent(e.target.value);
    // Clear error when user starts typing
    if (error) setError("");
  };

  /**
   * Validate content before processing
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
   * Handle form submission
   * Processes content and sends to backend API for safety analysis
   * @param {Event} e - Form submit event
   */
  const handleSubmit = async (e) => {
    // 🎯 Prevent default form submission behavior
    e.preventDefault();
    
    // 📋 Validate content before processing
    if (!validateContent()) {
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
    } catch (error) {
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
   * Render result content based on state
   * Handles loading, empty, and result states
   * @returns {JSX.Element} - Result content to display
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
    
    // 📋 Show results if available
    if (result) {
      return result;
    }
    
    // 🎯 Show placeholder when no results are available
    return "Results will appear here...";
  };

  // 🎯 TODO: Add content categorization feature
  // 🎯 TODO: Implement history tracking for analyzed content
  // 🎯 TODO: Add export functionality for safety reports

  return (
    <section className="section-container safety-section" aria-labelledby="safety-title">
      {/* 🎯 SECTION HEADER WITH ICON */}
      <h3 id="safety-title" className="section-heading">
        <svg className="heading-icon" width="32" height="32" viewBox="0 0 38 38" fill="none" style={{ marginRight: "10px" }}>
          <rect width="38" height="38" rx="10" fill="currentColor" />
          <polygon points="15,12 28,19 15,26" fill="white" />
        </svg>
        Content Safety Analyzer
      </h3>
      
      {/* 🎯 CONTENT INPUT FORM */}
      <form onSubmit={handleSubmit} className="component-form">
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
        
        {/* 🚀 SUBMIT BUTTON */}
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