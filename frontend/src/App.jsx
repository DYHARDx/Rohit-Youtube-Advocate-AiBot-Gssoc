import React, { useContext, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { ThemeProvider, ThemeContext } from './context/ThemeContext';
import LegalContractAnalyzer from "./components/ContractExplainer";
import ContentSafetyAnalyzer from "./components/ContentSafetyChecker";
import InvoiceGenerator from "./components/InvoiceGenerator";
import YouTubeAdvisorAMA from "./components/AMA";
import YouTubePolicyQA from "./components/YouTubePolicyQA";
import LandingPage from "./components/LandingPage";
import "./styles/Navbar.css";
import "./styles/LandingPage.css";
import './styles/theme.css';
import './components/HeroSection.css';

// 🎯 MAIN APPLICATION COMPONENT
// ==============================
const App = () => {
  return (
    <ThemeProvider>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
};

// 🎯 APPLICATION CONTENT COMPONENT
// ================================
// Handles theme context and mobile navigation state
const AppContent = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [menuOpen, setMenuOpen] = useState(false);

  // 🎯 MOBILE NAVIGATION HANDLERS
  // ==============================
  const toggleMenu = () => setMenuOpen(!menuOpen);
  
  // 🎨 DEBUG: Mobile menu state management initialized
  const handleNavLinkClick = () => {
    setMenuOpen(false);
  };

  return (
    <div className="app-wrapper">
      {/* ========== NAVIGATION COMPONENT ========== */}
      <nav className="navbar" role="navigation" aria-label="Main navigation">
        {/* 🎯 BRAND LOGO */}
        <div className="logo">YouTube Advisor</div>

        {/* 🎯 MOBILE HAMBURGER MENU BUTTON */}
        <button 
          className="hamburger" 
          onClick={toggleMenu} 
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? '✖' : '☰'}
        </button>

        {/* 🎯 NAVIGATION LINKS */}
        <ul className={`nav-links ${menuOpen ? 'active' : ''}`} role="menubar">
          <li role="none">
            <Link to="/" onClick={handleNavLinkClick} role="menuitem">Home</Link>
          </li>
          <li role="none">
            <Link to="/content-safety" onClick={handleNavLinkClick} role="menuitem">Content Safety</Link>
          </li>
          <li role="none">
            <Link to="/contract-explainer" onClick={handleNavLinkClick} role="menuitem">Contract Explainer</Link>
          </li>
          <li role="none">
            <Link to="/invoice-generator" onClick={handleNavLinkClick} role="menuitem">Invoice Generator</Link>
          </li>
          <li role="none">
            <Link to="/ama" onClick={handleNavLinkClick} role="menuitem">Ask Me Anything</Link>
          </li>
          <li role="none">
            <Link to="/policy-qa" onClick={handleNavLinkClick} role="menuitem">Policy Q&A</Link>
          </li>
          
          {/* 🎯 THEME TOGGLE BUTTON */}
          <li role="none">
            <button 
              className="theme-toggle-nav" 
              onClick={toggleTheme} 
              title="Toggle theme"
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
          </li>
        </ul>
      </nav>

      {/* ========== MAIN CONTENT AREA ========== */}
      <main className="main-content" role="main">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/content-safety" element={<ContentSafetyAnalyzer />} />
          <Route path="/contract-explainer" element={<LegalContractAnalyzer />} />
          <Route path="/invoice-generator" element={<InvoiceGenerator />} />
          <Route path="/ama" element={<YouTubeAdvisorAMA />} />
          <Route path="/policy-qa" element={<YouTubePolicyQA />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;