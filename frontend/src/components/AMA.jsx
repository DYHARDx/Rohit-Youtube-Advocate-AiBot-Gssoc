import React, { useState } from "react";
import { postData } from "../utils/postData";
import "../styles/CommonStyles.css";

/**
 * YouTube Policy Advisor AMA Component
 * ===================================
 * 
 * This component provides functionality to:
 * - Answer general questions about YouTube policies and content creation
 * - Provide personalized advice from Rohit's knowledge base
 * - Display responses retrieved from backend RAG system
 * 
 * Features:
 * - Text area for question input
 * - Real-time validation and error handling
 * - Responsive loading states
 * - Accessible UI components
 * 
 * @component
 * @example
 * return (
 *   <YouTubeAdvisorAMA />
 * )
 */
const YouTubeAdvisorAMA = () => {
  // 🎯 State management for AMA functionality
  const [question, setQuestion] = useState("");          // User question input
  const [response, setResponse] = useState("");          // Advisor response from API
  const [isLoading, setIsLoading] = useState(false);     // Loading state indicator
  const [error, setError] = useState("");               // Error message state

  /**
   * Handle question input changes
   * Updates the question state as user types
   * @param {Event} e - Change event from textarea
   */
  const handleQuestionChange = (e) => {
    // 🎨 DEBUG: Question updated - {e.target.value.length} characters
    setQuestion(e.target.value);
    // Clear error when user starts typing
    if (error) setError("");
  };

  /**
   * Validate user input before submission
   * Ensures a valid question is provided before processing
   * @returns {boolean} - Validation result
   */
  const validateInput = () => {
    // 🎯 Check if question is empty or only whitespace
    if (!question.trim()) {
      setError("⚠️ Please enter a valid question before submitting.");
      // 🎨 DEBUG: Input validation failed - no question provided
      return false;
    }
    // 🎨 DEBUG: Input validation passed
    return true;
  };

  /**
   * Handle form submission
   * Processes question and sends to backend API for response
   * @param {Event} e - Form submit event
   */
  const handleSubmit = async (e) => {
    // 🎯 Prevent default form submission behavior
    e.preventDefault();
    
    // 📋 Validate input before processing
    if (!validateInput()) {
      return;
    }
    
    // 🚀 Set loading state and clear previous response
    setIsLoading(true);
    setResponse("");
    setError(""); // Clear previous errors
    // 🎨 DEBUG: Starting advisor consultation process

    try {
      // 🌐 Send request to backend API for advisor response
      const apiResponse = await postData("/api/ama/ask", { question }, 15000);
      // 🎨 DEBUG: API response received - {apiResponse ? 'success' : 'error'}

      // 📋 Handle API response
      if (apiResponse.error) {
        setError(`❌ ${apiResponse.error}`);
        // 🎨 DEBUG: API returned error - {apiResponse.error}
      } else {
        setResponse(apiResponse.answer || "No response received from advisor.");
        // 🎨 DEBUG: Advisor response received successfully
      }
    } catch (error) {
      // 🚨 Handle network or processing errors
      setError(`❌ Network Error: ${error.message || "Connection failed"}`);
      // 🎨 DEBUG: Network error occurred - {error.message}
    } finally {
      // 🎯 Always reset loading state
      setIsLoading(false);
      // 🎨 DEBUG: Advisor consultation process completed
    }
  };

  /**
   * Render response content based on state
   * Handles loading, empty, and result states
   * @returns {JSX.Element} - Response content to display
   */
  const renderResponse = () => {
    // 🔄 Show loading indicator during processing
    if (isLoading) {
      return (
        <div className="loading-indicator">
          <span className="spinner"></span>
          Consulting YouTube Policy Advisor...
        </div>
      );
    }
    
    // ❌ Show error message if present
    if (error) {
      return <div className="error-message">{error}</div>;
    }
    
    // 📋 Show response if available
    if (response) {
      return response;
    }
    
    // 🎯 Show placeholder when no response is available
    return "Your advisor's response will appear in this section...";
  };

  // 🎯 TODO: Add question history feature
  // 🎯 TODO: Implement response rating system
  // 🎯 TODO: Add follow-up question suggestions

  return (
    <section className="section-container advisor-section" aria-labelledby="advisor-title">
      {/* 🎯 SECTION HEADER WITH ICON */}
      <h3 id="advisor-title" className="section-heading">
        <svg className="heading-icon" width="32" height="32" viewBox="0 0 38 38" fill="none" style={{ marginRight: "10px" }}>
          <rect width="38" height="38" rx="10" fill="currentColor" />
          <polygon points="15,12 28,19 15,26" fill="white" />
        </svg>
        YouTube Policy Advisor
      </h3>
      
      {/* 🎯 QUESTION INPUT FORM */}
      <form onSubmit={handleSubmit} className="component-form">
        {/* ❓ QUESTION TEXT AREA */}
        <textarea
          rows={4}
          value={question}
          onChange={handleQuestionChange}
          placeholder="Enter your YouTube policy question here..."
          disabled={isLoading}
          className="component-textarea"
          aria-label="Enter your YouTube policy question"
        />
        
        {/* 🚀 SUBMIT BUTTON */}
        <button 
          type="submit" 
          className="submit-button primary" 
          disabled={isLoading}
          aria-label={isLoading ? "Processing request" : "Consult advisor"}
        >
          {isLoading ? "Processing Request..." : "Consult Advisor"}
        </button>
      </form>
      
      {/* 📊 ADVISOR RESPONSE DISPLAY */}
      <div className="response-container result-card" role="status" aria-live="polite">
        {renderResponse()}
      </div>
    </section>
  );
};

// 🎯 Placeholder for future enhancements
/**
 * Future enhancement placeholder function
 * @todo Implement advanced advisor features
 */
const futureEnhancement = () => {
  // Reserved for future implementation
};

export default YouTubeAdvisorAMA;