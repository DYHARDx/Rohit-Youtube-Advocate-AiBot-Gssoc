import React, { useContext, useState, useRef, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import { ThemeProvider, ThemeContext } from './context/ThemeContext';
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
  const navRef = useRef(null);
  const menuRef = useRef(null);

  // 🎯 MOBILE NAVIGATION HANDLERS
  // ==============================
  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuOpen && navRef.current && !navRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  // Handle Escape key to close menu
  useEffect(() => {
    const handleEscape = (event) => {
      if (menuOpen && event.key === 'Escape') {
        setMenuOpen(false);
        // Focus hamburger button after closing menu
        const hamburgerButton = document.querySelector('.hamburger');
        if (hamburgerButton) {
          hamburgerButton.focus();
        }
      }
    };

    if (menuOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [menuOpen]);

  // Focus management for mobile menu
  useEffect(() => {
    if (menuOpen && menuRef.current) {
      const firstLink = menuRef.current.querySelector('a');
      if (firstLink) {
        firstLink.focus();
      }
    }
  }, [menuOpen]);

  // 🎨 DEBUG: Mobile menu state management initialized
  const handleNavLinkClick = () => {
    setMenuOpen(false);
    // Return focus to main content after navigation
    const mainContent = document.querySelector('main');
    if (mainContent) {
      mainContent.focus();
    }
  };

  return (
    <div className="app-wrapper">
      {/* ========== NAVIGATION COMPONENT ========== */}
      <nav 
        className="navbar" 
        role="navigation" 
        aria-label="Main navigation"
        ref={navRef}
      >
        {/* 🎯 BRAND LOGO */}
        <div className="logo">YouTube Advisor</div>

        {/* 🎯 MOBILE HAMBURGER MENU BUTTON */}
        <button 
          className="hamburger" 
          onClick={toggleMenu} 
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-controls="mobile-nav-menu"
          aria-expanded={menuOpen}
          aria-haspopup="true"
        >
          <span aria-hidden="true">{menuOpen ? '✖' : '☰'}</span>
        </button>

        {/* 🎯 NAVIGATION LINKS */}
        <ul 
          id="mobile-nav-menu" 
          className={`nav-links ${menuOpen ? 'active' : ''}`} 
          role="menubar"
          ref={menuRef}
        >
          <li role="none">
            <NavLink 
              to="/" 
              onClick={handleNavLinkClick} 
              role="menuitem"
              aria-current={window.location.pathname === '/' ? 'page' : undefined}
            >
              Home
            </NavLink>
          </li>
          <li role="none">
            <NavLink 
              to="/content-safety" 
              onClick={handleNavLinkClick} 
              role="menuitem"
              aria-current={window.location.pathname === '/content-safety' ? 'page' : undefined}
            >
              Content Safety
            </NavLink>
          </li>
          <li role="none">
            <NavLink 
              to="/contract-explainer" 
              onClick={handleNavLinkClick} 
              role="menuitem"
              aria-current={window.location.pathname === '/contract-explainer' ? 'page' : undefined}
            >
              Contract Explainer
            </NavLink>
          </li>
          <li role="none">
            <NavLink 
              to="/invoice-generator" 
              onClick={handleNavLinkClick} 
              role="menuitem"
              aria-current={window.location.pathname === '/invoice-generator' ? 'page' : undefined}
            >
              Invoice Generator
            </NavLink>
          </li>
          <li role="none">
            <NavLink 
              to="/ama" 
              onClick={handleNavLinkClick} 
              role="menuitem"
              aria-current={window.location.pathname === '/ama' ? 'page' : undefined}
            >
              Ask Me Anything
            </NavLink>
          </li>
          <li role="none">
            <NavLink 
              to="/policy-qa" 
              onClick={handleNavLinkClick} 
              role="menuitem"
              aria-current={window.location.pathname === '/policy-qa' ? 'page' : undefined}
            >
              Policy Q&A
            </NavLink>
          </li>
          
          {/* 🎯 THEME TOGGLE BUTTON */}
          <li role="none">
            <button 
              className="theme-toggle-nav" 
              onClick={toggleTheme} 
              title="Toggle theme"
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              <span aria-hidden="true">{theme === 'light' ? '🌙' : '☀️'}</span>
            </button>
          </li>
        </ul>
      </nav>

      {/* ========== MAIN CONTENT AREA ========== */}
      <main className="main-content" role="main" tabIndex="-1">
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