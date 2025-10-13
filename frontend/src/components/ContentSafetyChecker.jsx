import React, { useState } from "react";
import { postData } from "../utils/postData";
import "../styles/CommonStyles.css";


const ContentSafetyAnalyzer = () => {
  const [contentText, setContentText] = useState("");
  const [analysisResult, setAnalysisResult] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Handle content input changes in the text area
  const handleContentChange = (e) => {
    setContentText(e.target.value);
  };

  // Validate content before processing safety analysis
  const validateContent = () => {
    if (!contentText.trim()) {
      setAnalysisResult("⚠️ Please provide content for safety analysis.");
      return false;
    }
    return true;
  };

  // Process form submission and content safety evaluation
  const handleAnalysisRequest = async (e) => {
    e.preventDefault();
    
    // Validate content input before proceeding
    if (!validateContent()) {
      return;
    }
    
    // Update analysis state and clear previous results
    setIsAnalyzing(true);
    setAnalysisResult("");
    
    try {
      // Submit content to backend safety analysis API
      const apiResponse = await postData("/api/content/check", { text: contentText });
      
      // Handle and display API response
      if (apiResponse.error) {

      } else {
        setAnalysisResult(apiResponse.report || "No safety report generated.");
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
        Content Safety Analyzer
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
=======
      <form onSubmit={handleAnalysisRequest} className="safety-form">
        <textarea
          rows={6}
          value={contentText}
          onChange={handleContentChange}
          placeholder="Enter your video script or content for safety evaluation..."
          disabled={isAnalyzing}
          className="content-input"
        />
        <button 
          type="submit" 
          className="analyze-button primary" 
          disabled={isAnalyzing}
        >
          {isAnalyzing ? "Analyzing Content..." : "Run Safety Check"}
        </button>
      </form>
      <div className="analysis-output result-card">
        {renderAnalysisOutput()}

      </div>
    </section>
  );
};


export default ContentSafetyChecker;

