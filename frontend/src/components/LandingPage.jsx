import React from "react";
import heroImg from "../assets/hero1.png";
import "../styles/LandingPage.css";

const HomePageHero = () => {
  return (
    <div className="landing-page-container">
      <div className="hero-content-section">
        <h1 className="hero-main-heading">
          Your <span className="accent-highlight">AI-Powered</span> Legal Companion
        </h1>
        <p className="hero-description-text">
          Streamline legal workflows including policy analysis, invoice creation, 
          content safety evaluation, and more using advanced AI technology.
        </p>
        <button className="primary-cta-button">Start Exploring</button>
      </div>

      <div className="hero-visual-section">
        <img 
          src={heroImg} 
          alt="AI Legal Assistant Visualization" 
          className="hero-main-image"
        />
      </div>
    </div>
  );
};

export default HomePageHero;