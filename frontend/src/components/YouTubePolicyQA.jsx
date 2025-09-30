import React, { useState } from "react";
import { postData } from "../utils/postData";
import "../styles/CommonStyles.css";

const YouTubePolicyQA = () => {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleQuestionChange = (e) => {
    setQuestion(e.target.value);
  };

  const validateInput = () => {
    if (!question.trim()) {
      setResult("⚠️ Please enter a question about YouTube policy.");
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
      const response = await postData("/api/youtube/policy", { question });
      
      if (response.error) {
        setResult(`❌ Error: ${response.error}`);
      } else {
        setResult(response.answer || "No answer returned.");
      }
    } catch (error) {
      setResult(`❌ Unexpected error: ${error.message || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  const renderResult = () => {
    if (loading) {
      return "⏳ Analyzing YouTube policy...";
    }
    
    if (result) {
      return result;
    }
    
    return "Policy answers will appear here...";
  };

  return (
    <section className="section-container">
      <h3>
        <svg className="h3-icon" width="32" height="32" viewBox="0 0 38 38" fill="none" style={{ marginRight: "10px" }}>
          <rect width="38" height="38" rx="10" />
          <polygon points="15,12 28,19 15,26" />
        </svg>
        YouTube Policy Q&A
      </h3>

      <form onSubmit={handleSubmit}>
        <textarea
          rows={4}
          value={question}
          onChange={handleQuestionChange}
          placeholder="Ask a question about YouTube policy..."
          disabled={loading}
        />
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Analyzing..." : "Ask Policy"}
        </button>
      </form>

      <div className="result-card">
        {renderResult()}
      </div>
    </section>
  );
};

export default YouTubePolicyQA;