import React, { useState } from "react";
import { postData } from "../utils/postData";
import "../styles/CommonStyles.css";

const ContentSafetyChecker = () => {
  const [script, setScript] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleScriptChange = (e) => {
    setScript(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate input
    if (!script.trim()) {
      setResult("⚠️ Please enter content to check.");
      return;
    }
    
    setLoading(true);
    setResult(""); // Clear previous results
    
    try {
      const response = await postData("/api/content/check", { text: script });
      
      if (response.error) {
        setResult(`❌ Error: ${response.error}`);
      } else {
        setResult(response.report || "No report returned.");
      }
    } catch (error) {
      setResult(`❌ Unexpected error: ${error.message || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  const renderResult = () => {
    if (loading) {
      return "⏳ Checking content safety...";
    }
    
    if (result) {
      return result;
    }
    
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