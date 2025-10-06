import React, { useState } from "react";
import { postData } from "../utils/postData";
import "../styles/CommonStyles.css";

// 🎯 CONTENT SAFETY CHECKER COMPONENT
// ===================================
// AI-powered content safety analysis for YouTube creators
const ContentSafetyChecker = () => {
  // 🎯 STATE MANAGEMENT
  // ===================
  const [script, setScript] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  // 🎯 INPUT HANDLER
  // ================
  // Update state when user types in the text area
  const handleScriptChange = (e) => {
    setScript(e.target.value);
  };

  // 🎯 FORM SUBMISSION HANDLER
  // ===========================
  // Process form submission and content safety analysis
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 🎯 INPUT VALIDATION
    // ===================
    // Validate that content has been entered
    if (!script.trim()) {
      setResult("⚠️ Please enter content to check.");
      return;
    }
    
    // 🎨 DEBUG: Content safety analysis initiated
    // Set loading state and clear previous results
    setLoading(true);
    setResult("");
    
    try {
      // 🎯 API INTEGRATION
      // ==================
      // Send content to backend for safety analysis
      const response = await postData("/api/content/check", { text: script });
      
      // 🎯 RESPONSE PROCESSING
      // ======================
      // Process the API response
      if (response.error) {
        setResult(`❌ Error: ${response.error}`);
      } else {
        setResult(response.report || "No report returned.");
      }
    } catch (error) {
      // 🎯 ERROR HANDLING
      // =================
      // Handle any unexpected errors
      setResult(`❌ Unexpected error: ${error.message || "Unknown error"}`);
    } finally {
      // 🎯 CLEANUP
      // ===========
      // Always reset loading state
      setLoading(false);
    }
  };

  // 🎯 RESULT RENDERER
  // ==================
  // Determine what to display in the results area
  const renderResult = () => {
    // 🎯 LOADING STATE
    // ================
    // Show loading message during API request
    if (loading) {
      return "⏳ Checking content safety...";
    }
    
    // 🎯 RESULTS DISPLAY
    // ==================
    // Display results if available
    if (result) {
      return result;
    }
    
    // 🎯 PLACEHOLDER STATE
    // ====================
    // Show placeholder text
    return "Results will appear here...";
  };

  return (
    <section className="section-container" aria-labelledby="content-safety-title">
      {/* 🎯 COMPONENT HEADER */}
      <h3 id="content-safety-title">
        <svg 
          className="h3-icon" 
          width="32" 
          height="32" 
          viewBox="0 0 38 38" 
          fill="none" 
          style={{ marginRight: "10px" }}
          aria-hidden="true"
        >
          <rect width="38" height="38" rx="10" />
          <polygon points="15,12 28,19 15,26" />
        </svg>
        YouTube Content Safety Checker
      </h3>
      
      {/* 🎯 CONTENT INPUT FORM */}
      <form onSubmit={handleSubmit} role="form" aria-label="Content safety check form">
        <textarea
          rows={6}
          value={script}
          onChange={handleScriptChange}
          placeholder="Paste your content here for safety analysis..."
          disabled={loading}
          aria-label="Content to check for safety"
          aria-required="true"
        />
        <button 
          type="submit" 
          className="btn-primary" 
          disabled={loading}
          aria-label={loading ? "Checking content safety" : "Check content safety"}
        >
          {loading ? "Checking..." : "Check Content Safety"}
        </button>
      </form>
      
      {/* 🎯 RESULTS DISPLAY */}
      <div 
        className="result-card" 
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {renderResult()}
      </div>
    </section>
  );
};

export default ContentSafetyChecker;
