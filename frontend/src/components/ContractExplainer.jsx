import React, { useState } from "react";
import { postData } from "../utils/postData";
import "../styles/CommonStyles.css";

const LegalContractAnalyzer = () => {
  const [contractContent, setContractContent] = useState("");
  const [analysisOutput, setAnalysisOutput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Handle contract text input changes
  const handleContractInput = (e) => {
    setContractContent(e.target.value);
  };

  // Validate contract content before processing
  const validateContractInput = () => {
    if (!contractContent.trim()) {
      setAnalysisOutput("⚠️ Please provide contract text for analysis.");
      return false;
    }
    return true;
  };

  // Process contract analysis request
  const handleContractAnalysis = async (e) => {
    e.preventDefault();
    
    // Validate input before proceeding with analysis
    if (!validateContractInput()) {
      return;
    }
    
    // Update processing state and clear previous analysis
    setIsProcessing(true);
    setAnalysisOutput("");
    
    try {
      // Submit contract to backend analysis service
      const apiResult = await postData("/api/contract/simplify", { text: contractContent });
      
      // Process and display analysis response
      if (apiResult.error) {
        setAnalysisOutput(`❌ Analysis Error: ${apiResult.error}`);
      } else {
        setAnalysisOutput(apiResult.summary || "No analysis generated.");
      }
    } catch (processingError) {
      // Handle processing or network errors
      setAnalysisOutput(`❌ Processing Error: ${processingError.message || "Service unavailable"}`);
    } finally {
      // Reset processing state
      setIsProcessing(false);
    }
  };

  // Render appropriate output based on component state
  const renderAnalysisContent = () => {
    // Display processing state during analysis
    if (isProcessing) {
      return (
        <div className="processing-indicator">
          <span className="processing-spinner"></span>
          Analyzing legal contract terms...
        </div>
      );
    }
    
    // Display analysis results when available
    if (analysisOutput) {
      return analysisOutput;
    }
    
    // Default placeholder content
    return "Contract analysis results will be displayed here...";
  };

  return (
    <section className="section-container contract-analyzer-section">
      <h3 className="section-header">
        <svg className="header-icon" width="32" height="32" viewBox="0 0 38 38" fill="none" style={{ marginRight: "10px" }}>
          <rect width="38" height="38" rx="10" fill="currentColor" />
          <polygon points="15,12 28,19 15,26" fill="white" />
        </svg>
        Legal Contract Analyzer
      </h3>
      <form onSubmit={handleContractAnalysis} className="contract-form">
        <textarea
          rows={6}
          value={contractContent}
          onChange={handleContractInput}
          placeholder="Insert your legal contract text for simplification..."
          disabled={isProcessing}
          className="contract-input"
        />
        <button 
          type="submit" 
          className="analyze-contract-button primary" 
          disabled={isProcessing}
        >
          {isProcessing ? "Analyzing Contract..." : "Analyze Legal Terms"}
        </button>
      </form>
      <div className="analysis-display result-card">
        {renderAnalysisContent()}
      </div>
    </section>
  );
};

export default LegalContractAnalyzer;
