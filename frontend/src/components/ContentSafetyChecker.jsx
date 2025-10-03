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
        setAnalysisResult(`❌ Analysis Error: ${apiResponse.error}`);
      } else {
        setAnalysisResult(apiResponse.report || "No safety report generated.");
      }
    } catch (networkError) {
      // Handle network or unexpected errors
      setAnalysisResult(`❌ System Error: ${networkError.message || "Analysis service unavailable"}`);
    } finally {
      // Reset analysis state regardless of outcome
      setIsAnalyzing(false);
    }
  };

  // Render appropriate content based on component state
  const renderAnalysisOutput = () => {
    // Display loading state during analysis
    if (isAnalyzing) {
      return (
        <div className="analysis-loading">
          <span className="loading-spinner"></span>
          Scanning content for policy compliance...
        </div>
      );
    }
    
    // Display analysis results when available
    if (analysisResult) {
      return analysisResult;
    }
    
    // Default placeholder message
    return "Safety analysis results will be displayed here...";
  };

  return (
    <section className="section-container safety-analyzer-section">
      <h3 className="section-title">
        <svg className="title-icon" width="32" height="32" viewBox="0 0 38 38" fill="none" style={{ marginRight: "10px" }}>
          <rect width="38" height="38" rx="10" fill="currentColor" />
          <polygon points="15,12 28,19 15,26" fill="white" />
        </svg>
        Content Safety Analyzer
      </h3>
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

export default ContentSafetyAnalyzer;
