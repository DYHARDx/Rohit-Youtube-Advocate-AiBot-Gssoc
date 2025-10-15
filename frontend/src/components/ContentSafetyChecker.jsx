import React, { useState } from "react";
import { postData } from "../utils/postData";
import "../styles/CommonStyles.css";

// Content Safety Analyzer Component
// Analyzes content for potential safety issues
const ContentSafetyAnalyzer = () => {
  const [content, setContent] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle content input changes
  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  // Validate content before processing
  const validateContent = () => {
    if (!content.trim()) {
      setResult("⚠️ Please provide content for safety analysis.");
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateContent()) {
      return;
    }
    
    setLoading(true);
    setResult("");
    
    try {
      const apiResponse = await postData("/api/content/check", { text: content });
      
      if (apiResponse.error) {
        setResult(`❌ API Error: ${apiResponse.error}`);
      } else {
        setResult(apiResponse.report || "No safety report generated.");
      }
    } catch (error) {
      setResult(`❌ Network Error: ${error.message || "Connection failed"}`);
    } finally {
      setLoading(false);
    }
  };

  // Render result content based on state
  const renderResult = () => {
    if (loading) {
      return (
        <div className="loading-indicator">
          <span className="spinner"></span>
          Checking content safety...
        </div>
      );
    }
    
    if (result) {
      return result;
    }
    
    return "Results will appear here...";
  };

  return (
    <section className="section-container safety-section" aria-labelledby="safety-title">
      <h3 id="safety-title" className="section-heading">
        <svg className="heading-icon" width="32" height="32" viewBox="0 0 38 38" fill="none" style={{ marginRight: "10px" }}>
          <rect width="38" height="38" rx="10" fill="currentColor" />
          <polygon points="15,12 28,19 15,26" fill="white" />
        </svg>
        Content Safety Analyzer
      </h3>
      <form onSubmit={handleSubmit} className="component-form">
        <textarea
          rows={6}
          value={content}
          onChange={handleContentChange}
          placeholder="Enter your video script or content for safety evaluation..."
          disabled={loading}
          className="component-textarea"
          aria-label="Content to check for safety"
        />
        <button 
          type="submit" 
          className="submit-button primary" 
          disabled={loading}
          aria-label={loading ? "Analyzing content" : "Run safety check"}
        >
          {loading ? "Analyzing Content..." : "Run Safety Check"}
        </button>
      </form>
      <div className="result-container result-card" role="status" aria-live="polite">
        {renderResult()}
      </div>
    </section>
  );
};

export default ContentSafetyAnalyzer;