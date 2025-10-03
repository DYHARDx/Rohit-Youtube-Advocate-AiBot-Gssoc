import React, { useState } from "react";
import { postData } from "../utils/postData";
import "../styles/CommonStyles.css";

const YouTubeAdvisorAMA = () => {
  const [userQuestion, setUserQuestion] = useState("");
  const [advisorResponse, setAdvisorResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Handle input changes in the question field
  const handleInputChange = (e) => {
    setUserQuestion(e.target.value);
  };

  // Validate user input before processing
  const validateUserInput = () => {
    if (!userQuestion.trim()) {
      setAdvisorResponse("⚠️ Please enter a valid question before submitting.");
      return false;
    }
    return true;
  };

  // Process form submission and communicate with backend API
  const handleFormSubmission = async (e) => {
    e.preventDefault();
    
    // Validate user input before proceeding with API call
    if (!validateUserInput()) {
      return;
    }
    
    // Update loading state and clear previous responses
    setIsLoading(true);
    setAdvisorResponse("");
    
    try {
      // Send user question to backend API endpoint
      const apiResponse = await postData("/api/ama/ask", { question: userQuestion });
      
      // Process and display API response
      if (apiResponse.error) {
        setAdvisorResponse(`❌ API Error: ${apiResponse.error}`);
      } else {
        setAdvisorResponse(apiResponse.answer || "No response received from advisor.");
      }
    } catch (networkError) {
      // Handle network or unexpected errors
      setAdvisorResponse(`❌ Network Error: ${networkError.message || "Connection failed"}`);
    } finally {
      // Reset loading state regardless of outcome
      setIsLoading(false);
    }
  };

  // Render appropriate content based on component state
  const renderResponseContent = () => {
    // Display loading indicator during API request
    if (isLoading) {
      return (
        <div className="loading-indicator">
          <span className="spinner"></span>
          Consulting YouTube Policy Advisor...
        </div>
      );
    }
    
    // Display advisor response when available
    if (advisorResponse) {
      return advisorResponse;
    }
    
    // Default placeholder text
    return "Your advisor's response will appear in this section...";
  };

  return (
    <section className="section-container advisor-section">
      <h3 className="section-heading">
        <svg className="heading-icon" width="32" height="32" viewBox="0 0 38 38" fill="none" style={{ marginRight: "10px" }}>
          <rect width="38" height="38" rx="10" fill="currentColor" />
          <polygon points="15,12 28,19 15,26" fill="white" />
        </svg>
        YouTube Policy Advisor
      </h3>
      <form onSubmit={handleFormSubmission} className="advisor-form">
        <textarea
          rows={4}
          value={userQuestion}
          onChange={handleInputChange}
          placeholder="Enter your YouTube policy question here..."
          disabled={isLoading}
          className="question-input"
        />
        <button 
          type="submit" 
          className="submit-button primary" 
          disabled={isLoading}
        >
          {isLoading ? "Processing Request..." : "Consult Advisor"}
        </button>
      </form>
      <div className="response-container result-card">
        {renderResponseContent()}
      </div>
    </section>
  );
};

export default YouTubeAdvisorAMA;
