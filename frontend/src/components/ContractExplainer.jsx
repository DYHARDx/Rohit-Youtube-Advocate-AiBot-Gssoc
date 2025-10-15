import React, { useState } from "react";
import { postData } from "../utils/postData";
import "../styles/CommonStyles.css";
import { AlertCircle } from "lucide-react"; // for error icon

const LegalContractAnalyzer = () => {
  const [contractContent, setContractContent] = useState("");
  const [analysisOutput, setAnalysisOutput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState("");

  // Handle contract text input changes
  const handleContractInput = (e) => {
    setContractContent(e.target.value);
  };

  // Handle PDF file upload
  const handleFileUpload = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf") {
      setFileError("Please upload a valid PDF file.");
      setFile(null);
      return;
    }

    setFileError("");
    setFile(selectedFile);
  };

  // Validate contract content before processing
  const validateContractInput = () => {
    if (!contractContent.trim() && !file) {
      setAnalysisOutput("⚠️ Please provide contract text or upload a PDF file.");
      return false;
    }
    return true;
  };

  // Process contract analysis request
  const handleContractAnalysis = async (e) => {
    e.preventDefault();

    if (!validateContractInput()) return;

    setIsProcessing(true);
    setAnalysisOutput("");

    try {
      let payload = { text: contractContent };

      // If file is uploaded, include it in payload
      if (file) {
        const fileText = await file.text(); // simple text extraction from PDF (for demo)
        payload.text += `\n${fileText}`;
      }

      const apiResult = await postData("/api/contract/simplify", payload);

      if (apiResult.error) {
        setAnalysisOutput(`❌ Analysis Error: ${apiResult.error}`);
      } else {
        setAnalysisOutput(apiResult.summary || "No analysis generated.");
      }
    } catch (processingError) {
      setAnalysisOutput(`❌ Processing Error: ${processingError.message || "Service unavailable"}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Render analysis content
  const renderAnalysisContent = () => {
    if (isProcessing) {
      return (
        <div className="processing-indicator">
          <span className="processing-spinner"></span>
          Analyzing legal contract terms...
        </div>
      );
    }
    if (analysisOutput) return analysisOutput;
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

        {/* PDF File Upload */}
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileUpload}
          disabled={isProcessing}
          className="contract-input"
          style={{ marginTop: "10px" }}
        />

        {/* File Error Message */}
        {fileError && (
          <div className="flex items-center text-red-600 text-sm mt-1">
            <AlertCircle className="w-4 h-4 mr-1" />
            {fileError}
          </div>
        )}

        <button 
          type="submit" 
          className="analyze-contract-button primary" 
          disabled={isProcessing}
          style={{ marginTop: "10px" }}
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
