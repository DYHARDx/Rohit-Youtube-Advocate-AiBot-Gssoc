import React, { useState } from "react";
import { postData } from "../utils/postData";
import "../styles/CommonStyles.css";

const ContractExplainer = () => {
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const validateInput = () => {
    if (!text.trim()) {
      setResult("⚠️ Please paste your contract text.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateInput()) {
      return;
    }
    
    setLoading(true);
    setResult(""); // Clear previous results
    
    try {
      const response = await postData("/api/contract/simplify", { text });
      
      if (response.error) {
        setResult(`❌ Error: ${response.error}`);
      } else {
        setResult(response.summary || "No summary returned.");
      }
    } catch (error) {
      setResult(`❌ Unexpected error: ${error.message || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  const renderResult = () => {
    if (loading) {
      return "⏳ Simplifying contract...";
    }
    
    if (result) {
      return result;
    }
    
    return "Simplified contract will appear here...";
  };

  return (
    <section className="section-container">
      <h3>
        <svg className="h3-icon" width="32" height="32" viewBox="0 0 38 38" fill="none" style={{ marginRight: "10px" }}>
          <rect width="38" height="38" rx="10" />
          <polygon points="15,12 28,19 15,26" />
        </svg>
        YouTube Contract Explainer
      </h3>
      <form onSubmit={handleSubmit}>
        <textarea
          rows={6}
          value={text}
          onChange={handleTextChange}
          placeholder="Paste contract text here..."
          disabled={loading}
        />
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Simplifying..." : "Simplify Contract"}
        </button>
      </form>
      <div className="result-card">
        {renderResult()}
      </div>
    </section>
  );
};

export default ContractExplainer;