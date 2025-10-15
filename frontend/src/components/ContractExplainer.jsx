import React, { useState } from "react";
import { postData } from "../utils/postData";
import "../styles/CommonStyles.css";
import { AlertCircle } from "lucide-react";

// Legal Contract Analyzer Component
// Simplifies legal contracts for better understanding
const LegalContractAnalyzer = () => {
  const [contractText, setContractText] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [processing, setProcessing] = useState(false);
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState("");

  // Handle contract text input changes
  const handleTextChange = (e) => {
    setContractText(e.target.value);
  };

  // Handle PDF file upload
  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;

    if (uploadedFile.type !== "application/pdf") {
      setFileError("Please upload a valid PDF file.");
      setFile(null);
      return;
    }

    setFileError("");
    setFile(uploadedFile);
  };

  // Validate contract input before processing
  const validateInput = () => {
    if (!contractText.trim() && !file) {
      setAnalysis("⚠️ Please provide contract text or upload a PDF file.");
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateInput()) return;

    setProcessing(true);
    setAnalysis("");

    try {
      let payload = { text: contractText };

      // If file is uploaded, include it in payload
      if (file) {
        const fileText = await file.text();
        payload.text += `\n${fileText}`;
      }

      const apiResponse = await postData("/api/contract/simplify", payload);

      if (apiResponse.error) {
        setAnalysis(`❌ Analysis Error: ${apiResponse.error}`);
      } else {
        setAnalysis(apiResponse.summary || "No analysis generated.");
      }
    } catch (error) {
      setAnalysis(`❌ Processing Error: ${error.message || "Service unavailable"}`);
    } finally {
      setProcessing(false);
    }
  };

  // Render analysis content based on state
  const renderAnalysis = () => {
    if (processing) {
      return (
        <div className="loading-indicator">
          <span className="spinner"></span>
          Analyzing legal contract terms...
        </div>
      );
    }
    
    if (analysis) {
      return analysis;
    }
    
    return "Contract analysis results will be displayed here...";
  };

  return (
    <section className="section-container contract-section" aria-labelledby="contract-title">
      <h3 id="contract-title" className="section-heading">
        <svg className="heading-icon" width="32" height="32" viewBox="0 0 38 38" fill="none" style={{ marginRight: "10px" }}>
          <rect width="38" height="38" rx="10" fill="currentColor" />
          <polygon points="15,12 28,19 15,26" fill="white" />
        </svg>
        Legal Contract Analyzer
      </h3>
      <form onSubmit={handleSubmit} className="component-form">
        <textarea
          rows={6}
          value={contractText}
          onChange={handleTextChange}
          placeholder="Insert your legal contract text for simplification..."
          disabled={processing}
          className="component-textarea"
          aria-label="Legal contract text"
        />

        {/* PDF File Upload */}
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileUpload}
          disabled={processing}
          className="component-file-input"
          aria-label="Upload PDF contract"
          style={{ marginTop: "10px" }}
        />

        {/* File Error Message */}
        {fileError && (
          <div className="file-error-message" role="alert">
            <AlertCircle className="error-icon" />
            {fileError}
          </div>
        )}

        <button 
          type="submit" 
          className="submit-button primary" 
          disabled={processing}
          aria-label={processing ? "Analyzing contract" : "Analyze legal terms"}
          style={{ marginTop: "10px" }}
        >
          {processing ? "Analyzing Contract..." : "Analyze Legal Terms"}
        </button>
      </form>
      <div className="result-container result-card" role="status" aria-live="polite">
        {renderAnalysis()}
      </div>
    </section>
  );
};

export default LegalContractAnalyzer;