import React, { useState } from "react";
import { postData } from "../utils/postData";
import "../styles/CommonStyles.css";

// YouTube Policy Advisor Component
// Provides users with answers to YouTube policy questions
const YouTubeAdvisorAMA = () => {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Handle question input changes
  const handleQuestionChange = (e) => {
    setQuestion(e.target.value);
  };

  // Validate user input before submission
  const validateInput = () => {
    if (!question.trim()) {
      setResponse("⚠️ Please enter a valid question before submitting.");
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateInput()) {
      return;
    }
    
    setIsLoading(true);
    setResponse("");
    
    try {
      const apiResponse = await postData("/api/ama/ask", { question });
      
      if (apiResponse.error) {
        setResponse(`❌ API Error: ${apiResponse.error}`);
      } else {
        setResponse(apiResponse.answer || "No response received from advisor.");
      }
    } catch (error) {
      setResponse(`❌ Network Error: ${error.message || "Connection failed"}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Render response content based on state
  const renderResponse = () => {
    if (isLoading) {
      return (
        <div className="loading-indicator">
          <span className="spinner"></span>
          Consulting YouTube Policy Advisor...
        </div>
      );
    }
    
    if (response) {
      return response;
    }
    
    return "Your advisor's response will appear in this section...";
  };

  return (
    <section className="section-container advisor-section" aria-labelledby="advisor-title">
      <h3 id="advisor-title" className="section-heading">
        <svg className="heading-icon" width="32" height="32" viewBox="0 0 38 38" fill="none" style={{ marginRight: "10px" }}>
          <rect width="38" height="38" rx="10" fill="currentColor" />
          <polygon points="15,12 28,19 15,26" fill="white" />
        </svg>
        YouTube Policy Advisor
      </h3>
      <form onSubmit={handleSubmit} className="component-form">
        <textarea
          rows={4}
          value={question}
          onChange={handleQuestionChange}
          placeholder="Enter your YouTube policy question here..."
          disabled={isLoading}
          className="component-textarea"
          aria-label="Enter your YouTube policy question"
        />
        <button 
          type="submit" 
          className="submit-button primary" 
          disabled={isLoading}
          aria-label={isLoading ? "Processing request" : "Consult advisor"}
        >
          {isLoading ? "Processing Request..." : "Consult Advisor"}
        </button>
      </form>
      <div className="response-container result-card" role="status" aria-live="polite">
        {renderResponse()}
      </div>
    </section>
  );
};

export default YouTubeAdvisorAMA;