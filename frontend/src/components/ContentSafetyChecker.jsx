import React, { useState } from "react";
import { postData } from "../utils/postData";
import "../styles/CommonStyles.css";

const ContentSafetyChecker = () => {
  const [script, setScript] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  // Update state when user types in the text area
  const handleScriptChange = (e) => {
    setScript(e.target.value);
  };

  // Process form submission and content safety analysis
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate that content has been entered
    if (!script.trim()) {
      setResult("⚠️ Please enter content to check.");
      return;
    }
    
    // Set loading state and clear previous results
    setLoading(true);
    setResult("");
    
    try {
      // Send content to backend for safety analysis
      const response = await postData("/api/content/check", { text: script });
      
      // Process the API response
      if (response.error) {
        setResult(`❌ Error: ${response.error}`);
      } else {
        setResult(response.report || "No report returned.");
      }
    } catch (error) {
      // Handle any unexpected errors
      setResult(`❌ Unexpected error: ${error.message || "Unknown error"}`);
    } finally {
      // Always reset loading state
      setLoading(false);
    }
  };

  // Determine what to display in the results area
  const renderResult = () => {
    // Show loading message during API request
    if (loading) {
      return "⏳ Checking content safety...";
    }
    
    // Display results if available
    if (result) {
      return result;
    }
    
    // Show placeholder text
    return "Results will appear here...";
  };

  return (
    <section className="section-container">
      <h3>
        <svg className="h3-icon" width="32" height="32" viewBox="0 0 38 38" fill="none" style={{ marginRight: "10px" }}>
          <rect width="38" height="38" rx="10" />
          <polygon points="15,12 28,19 15,26" />
        </svg>
        YouTube Content Safety Checker
      </h3>
      <form onSubmit={handleSubmit}>
        <textarea
          rows={6}
          value={script}
          onChange={handleScriptChange}
          placeholder="Paste your content here..."
          disabled={loading}
        />
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Checking..." : "Check Content Safety"}
        </button>
      </form>
      <div className="result-card">
        {renderResult()}
      </div>
    </section>
  );
};

export default ContentSafetyChecker;