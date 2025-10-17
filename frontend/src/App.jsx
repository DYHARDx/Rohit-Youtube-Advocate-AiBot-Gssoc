import React, { useContext, useState } from "react";
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import { ThemeProvider, ThemeContext } from './context/ThemeContext';
import { ErrorProvider } from './context/ErrorContext';
import LegalContractAnalyzer from "./components/ContractExplainer";
import ContentSafetyAnalyzer from "./components/ContentSafetyChecker";
import InvoiceGenerator from "./components/InvoiceGenerator";
import YouTubeAdvisorAMA from "./components/AMA";
import YouTubePolicyQA from "./components/YouTubePolicyQA";
import LandingPage from "./components/LandingPage";
import Footer from "./components/Footer";
import "./styles/Navbar.css";
import "./styles/LandingPage.css";
import "./styles/Footer.css";
import './styles/theme.css';

// 🎯 MAIN APPLICATION COMPONENT
// ==============================
const App = () => {
  return (
    <ThemeProvider>
      <ErrorProvider>
        <Router>
          <AppContent />
        </Router>
      </ErrorProvider>
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
  const toggleMenu = () => setMenuOpen((prev) => !prev);
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
          aria-controls="mobile-nav-menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? '✖' : '☰'}
        </button>

        {/* 🎯 NAVIGATION LINKS */}
        <ul id="mobile-nav-menu" className={`nav-links ${menuOpen ? 'active' : ''}`} role="menubar">
          <li role="none">
            <NavLink to="/" onClick={handleNavLinkClick} role="menuitem">Home</NavLink>
          </li>
          <li role="none">
            <NavLink to="/content-safety" onClick={handleNavLinkClick} role="menuitem">Content Safety</NavLink>
          </li>
          <li role="none">
            <NavLink to="/contract-explainer" onClick={handleNavLinkClick} role="menuitem">Contract Explainer</NavLink>
          </li>
          <li role="none">
            <NavLink to="/invoice-generator" onClick={handleNavLinkClick} role="menuitem">Invoice Generator</NavLink>
          </li>
          <li role="none">
            <NavLink to="/ama" onClick={handleNavLinkClick} role="menuitem">Ask Me Anything</NavLink>
          </li>
          <li role="none">
            <NavLink to="/policy-qa" onClick={handleNavLinkClick} role="menuitem">Policy Q&A</NavLink>
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

      {/* ========== FOOTER COMPONENT ========== */}
      <Footer />
    </div>
  );
};

export default App;