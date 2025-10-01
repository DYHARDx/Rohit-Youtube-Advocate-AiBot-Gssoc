import React, { useState } from "react";
import { postData } from "../utils/postData";
import "../styles/CommonStyles.css";

const AMA = () => {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle changes to the question input field
  const handleQuestionChange = (e) => {
    setQuestion(e.target.value);
  };

  // Validate user input before submission
  const validateInput = () => {
    if (!question.trim()) {
      setResult("⚠️ Please enter your question.");
      return false;
    }
    return true;
  };

  // Handle form submission and API communication
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate input before proceeding
    if (!validateInput()) {
      return;
    }
    
    // Set loading state and clear previous results
    setLoading(true);
    setResult("");
    
    try {
      // Send question to backend API
      const response = await postData("/api/ama/ask", { question });
      
      // Handle API response
      if (response.error) {
        setResult(`❌ Error: ${response.error}`);
      } else {
        setResult(response.answer || "No answer returned.");
      }
    } catch (error) {
      // Handle unexpected errors
      setResult(`❌ Unexpected error: ${error.message || "Unknown error"}`);
    } finally {
      // Reset loading state
      setLoading(false);
    }
  };

  // Render the appropriate result based on state
  const renderResult = () => {
    // Show loading indicator when request is in progress
    if (loading) {
      return "⏳ Consulting YouTube Advisor...";
    }
    
    // Display result if available
    if (result) {
      return result;
    }
    
    // Show placeholder text
    return "Advisor response will appear here...";
  };

  return (
    <section className="section-container">
      <h3>
        <svg className="h3-icon" width="32" height="32" viewBox="0 0 38 38" fill="none" style={{ marginRight: "10px" }}>
          <rect width="38" height="38" rx="10" />
          <polygon points="15,12 28,19 15,26" />
        </svg>
        YouTube AMA
      </h3>
      <form onSubmit={handleSubmit}>
        <textarea
          rows={4}
          value={question}
          onChange={handleQuestionChange}
          placeholder="Ask your question"
          disabled={loading}
        />
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Asking..." : "Ask YouTube Advisor"}
        </button>
      </form>
      <div className="result-card">
        {renderResult()}
      </div>
    </section>
  );
};

export default AMA;