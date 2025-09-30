import React, { useState } from "react";
import { postData } from "../utils/postData";
import "../styles/CommonStyles.css";

export default function ContentSafetyChecker() {
  const [script, setScript] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleScriptChange = (event) => {
    setScript(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!script.trim()) {
      setResult("Please enter some content to check.");
      return;
    }
    
    setLoading(true);
    setResult("");
    
    try {
      const response = await postData("/api/content/check", { text: script });
      
      if (response.error) {
        setResult(`❌ Error: ${response.error}`);
      } else {
        setResult(response.report || "No report returned.");
      }
    } catch (error) {
      setResult(`❌ Unexpected error occurred: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setScript("");
    setResult("");
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
        <div className="button-group">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Checking..." : "Check Content Safety"}
          </button>
          <button type="button" className="btn-secondary" onClick={handleClear} disabled={loading}>
            Clear
          </button>
        </div>
      </form>
      <div className="result-card">
        {loading ? (
          <div className="loading-indicator">
            <span className="spinner"></span>
            Analyzing content for YouTube policy compliance...
          </div>
        ) : (
          <div className="result-content" style={{ whiteSpace: "pre-wrap" }}>
            {result}
          </div>
        )}
      </div>
    </section>
  );
}