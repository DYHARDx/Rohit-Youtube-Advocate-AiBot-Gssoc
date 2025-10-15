import React, { useState } from "react";
import { postData } from "../utils/postData";
import "../styles/CommonStyles.css";

const YouTubePolicyAdvisor = () => {
  const [policyQuestion, setPolicyQuestion] = useState("");
  const [policyAnswer, setPolicyAnswer] = useState("");
  const [isResearching, setIsResearching] = useState(false);

  const handlePolicyInputChange = (e) => {
    setPolicyQuestion(e.target.value);
  };

  const validatePolicyInput = () => {
    if (!policyQuestion.trim()) {
      setPolicyAnswer("⚠️ Please enter a question about YouTube policies.");
      return false;
    }
    return true;
  };

  const handlePolicyResearch = async (e) => {
    e.preventDefault();
    
    if (!validatePolicyInput()) {
      return;
    }
    
    setIsResearching(true);
    setPolicyAnswer(""); // Clear previous policy answers
    
    try {
      const researchResponse = await postData("/api/youtube/policy", { question: policyQuestion });
      
      if (researchResponse.error) {
        setPolicyAnswer(`❌ Research Error: ${researchResponse.error}`);
      } else {
        setPolicyAnswer(researchResponse.answer || "No policy information available.");
      }
    } catch (researchError) {
      setPolicyAnswer(`❌ System Error: ${researchError.message || "Policy service unavailable"}`);
    } finally {
      setIsResearching(false);
    }
  };

  const renderPolicyResponse = () => {
    if (isResearching) {
      return (
        <div className="research-status">
          <span className="research-spinner"></span>
          🔍 Researching YouTube policies...
        </div>
      );
    }
    
    if (policyAnswer) {
      return policyAnswer;
    }
    
    return "Policy insights and answers will appear here...";
  };

  return (
    <section className="section-container policy-advisor-section">
      <h3 className="section-header">
        <svg className="header-icon" width="32" height="32" viewBox="0 0 38 38" fill="none" style={{ marginRight: "10px" }}>
          <rect width="38" height="38" rx="10" fill="currentColor" />
          <polygon points="15,12 28,19 15,26" fill="white" />
        </svg>
        🛡️ YouTube Policy Advisor
      </h3>

      <form onSubmit={handlePolicyResearch} className="policy-research-form">
        <textarea
          rows={4}
          value={policyQuestion}
          onChange={handlePolicyInputChange}
          placeholder="Ask about YouTube community guidelines, monetization, or content policies..."
          disabled={isResearching}
          className="policy-question-input"
        />
        <button 
          type="submit" 
          className="research-button primary" 
          disabled={isResearching}
        >
          {isResearching ? "🔍 Researching..." : "Get Policy Insights"}
        </button>
      </form>

      <div className="policy-response-container result-card">
        {renderPolicyResponse()}
      </div>
    </section>
  );
};

export default YouTubePolicyAdvisor;
