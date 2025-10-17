import React, { useState } from "react";
import { postData } from "../utils/postData";
import { useError } from "../context/ErrorContext";
import ErrorDisplay from "./ErrorDisplay";
import LoadingSpinner from "./LoadingSpinner";
import "../styles/CommonStyles.css";

/**
 * YouTube Policy Advisor Component
 * ===============================
 * 
 * This component provides functionality to:
 * - Answer questions about YouTube policies and community guidelines
 * - Provide insights on monetization, content policies, and best practices
 * - Display policy information retrieved from backend RAG system
 * 
 * Features:
 * - Text area for policy question input
 * - Real-time validation and error handling
 * - Responsive loading states
 * - Accessible UI components
 * 
 * @component
 * @example
 * return (
 *   <YouTubePolicyAdvisor />
 * )
 */
const YouTubePolicyAdvisor = () => {
  // 🎯 State management for policy question and answer functionality
  const [policyQuestion, setPolicyQuestion] = useState("");      // User policy question
  const [policyAnswer, setPolicyAnswer] = useState("");          // Policy answer from API
  const { setError, clearError, setLoading, isLoading } = useError();
  const componentId = "policy-advisor";

  /**
   * Handle policy question input changes
   * Updates the policy question state as user types
   * @param {Event} e - Change event from textarea
   */
  const handlePolicyInputChange = (e) => {
    // 🎨 DEBUG: Policy question updated - {e.target.value.length} characters
    setPolicyQuestion(e.target.value);
    clearError(componentId);
  };

  /**
   * Validate policy input before processing
   * Ensures a question is provided before research
   * @returns {boolean} - Validation result
   */
  const validatePolicyInput = () => {
    // 🎯 Check if policy question is empty or only whitespace
    if (!policyQuestion.trim()) {
      setError(componentId, "Please enter a question about YouTube policies.");
      // 🎨 DEBUG: Policy input validation failed - no question provided
      return false;
    }
    
    // Check minimum length
    if (policyQuestion.trim().length < 5) {
      setError(componentId, "Please enter a more detailed question (at least 5 characters).");
      return false;
    }
    
    // 🎨 DEBUG: Policy input validation passed
    clearError(componentId);
    return true;
  };

  /**
   * Handle policy research submission
   * Processes policy question and sends to backend API for research
   * @param {Event} e - Form submit event
   */
  const handlePolicyResearch = async (e) => {
    // 🎯 Prevent default form submission behavior
    e.preventDefault();
    
    // 📋 Validate policy input before processing
    if (!validatePolicyInput()) {
      return;
    }
    
    // 🚀 Set researching state and clear previous answers
    setLoading(componentId, true);
    setPolicyAnswer(""); // Clear previous policy answers
    clearError(componentId);
    // 🎨 DEBUG: Starting policy research process

    try {
      // 🌐 Send request to backend API for policy research
      const researchResponse = await postData("/api/youtube/policy", { question: policyQuestion });
      // 🎨 DEBUG: API response received - {researchResponse ? 'success' : 'error'}

      // 📋 Handle API response
      if (!researchResponse.success) {
        setError(componentId, researchResponse.error || "Failed to get policy information. Please try again.");
        // 🎨 DEBUG: API returned error - {researchResponse.error}
      } else {
        setPolicyAnswer(researchResponse.data.answer || "No policy information available.");
        // 🎨 DEBUG: Policy research completed successfully
      }
    } catch (researchError) {
      // 🚨 Handle network or processing errors
      setError(componentId, `System Error: ${researchError.message || "Policy service unavailable"}`);
      // 🎨 DEBUG: Research error occurred - {researchError.message}
    } finally {
      // 🎯 Always reset researching state
      setLoading(componentId, false);
      // 🎨 DEBUG: Policy research process completed
    }
  };

  /**
   * Render policy response content based on state
   * Handles loading, empty, and result states
   * @returns {JSX.Element} - Policy response content to display
   */
  const renderPolicyResponse = () => {
    // 🔄 Show loading indicator during research
    if (isLoading(componentId)) {
      return <LoadingSpinner message="Researching YouTube policies..." />;
    }
    
    // 📋 Show policy answer if available
    if (policyAnswer) {
      return policyAnswer;
    }
    
    // 🎯 Show placeholder when no answer is available
    return "Policy insights and answers will appear here...";
  };

  // 🎯 TODO: Add policy question history feature
  // 🎯 TODO: Implement policy category filtering
  // 🎯 TODO: Add bookmark functionality for important answers

  return (
    <section className="section-container policy-advisor-section">
      {/* 🎯 SECTION HEADER WITH ICON AND EMOJI */}
      <h3 className="section-header">
        <svg className="header-icon" width="32" height="32" viewBox="0 0 38 38" fill="none" style={{ marginRight: "10px" }}>
          <rect width="38" height="38" rx="10" fill="currentColor" />
          <polygon points="15,12 28,19 15,26" fill="white" />
        </svg>
        🛡️ YouTube Policy Advisor
      </h3>

      {/* 🎯 POLICY RESEARCH FORM */}
      <form onSubmit={handlePolicyResearch} className="policy-research-form">
        {/* ❓ POLICY QUESTION TEXT AREA */}
        <textarea
          rows={4}
          value={policyQuestion}
          onChange={handlePolicyInputChange}
          placeholder="Ask about YouTube community guidelines, monetization, or content policies..."
          disabled={isLoading(componentId)}
          className="policy-question-input"
        />
        
        {/* 🚀 RESEARCH SUBMIT BUTTON */}
        <button 
          type="submit" 
          className="research-button primary" 
          disabled={isLoading(componentId)}
        >
          {isLoading(componentId) ? "🔍 Researching..." : "Get Policy Insights"}
        </button>
      </form>

      {/* 📊 POLICY RESPONSE DISPLAY */}
      <div className="policy-response-container result-card">
        <ErrorDisplay message={isLoading(componentId) ? null : (useError().errors[componentId] || null)} />
        {renderPolicyResponse()}
      </div>
    </section>
  );
};

// 🎯 Placeholder for future enhancements
/**
 * Future enhancement placeholder function
 * @todo Implement advanced policy research features
 */
const futureEnhancement = () => {
  // Reserved for future implementation
};

export default YouTubePolicyAdvisor;