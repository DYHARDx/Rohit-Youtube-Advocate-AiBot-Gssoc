import React, { useContext, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { ThemeProvider, ThemeContext } from './context/ThemeContext';
import ContractExplainer from "./components/ContractExplainer";
import ContentSafetyChecker from "./components/ContentSafetyChecker";
import InvoiceGenerator from "./components/InvoiceGenerator";
import AMA from "./components/AMA";
import YouTubePolicyQA from "./components/YouTubePolicyQA";
import LandingPage from "./components/LandingPage";
import "./styles/Navbar.css";
import "./styles/LandingPage.css";
import './styles/theme.css';

const App = () => {
  return (
    <ThemeProvider>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
};

// // We create a new component to access the theme context inside the Router
// const AppContent = () => {
//   const { theme, toggleTheme } = useContext(ThemeContext);

//   return (
//     <div className="app-wrapper">
//       <nav className="navbar">
//         <div className="logo">YouTube Advisor</div>
//         <ul className="nav-links">
//           <li><Link to="/">Home</Link></li>
//           <li><Link to="/content-safety">Content Safety</Link></li>
//           <li><Link to="/contract-explainer">Contract Explainer</Link></li>
//           <li><Link to="/invoice-generator">Invoice Generator</Link></li>
//           <li><Link to="/ama">Ask Me Anything</Link></li>
//           <li><Link to="/policy-qa">Policy Q&A</Link></li>

//           <li>
//             <button className="theme-toggle-nav" onClick={toggleTheme} title="Toggle theme">
//               {theme === 'light' ? '🌙' : '☀️'}
//             </button>
//           </li>
//         </ul>
//       </nav>

//       <main className="main-content">
//         <Routes>
//           <Route path="/" element={<LandingPage />} />
//           <Route path="/content-safety" element={<ContentSafetyChecker />} />
//           <Route path="/contract-explainer" element={<ContractExplainer />} />
//           <Route path="/invoice-generator" element={<InvoiceGenerator />} />
//           <Route path="/ama" element={<AMA />} />
//           <Route path="/policy-qa" element={<YouTubePolicyQA />} />
//         </Routes>
//       </main>
//     </div>
//   );
// }

// export default App;

const AppContent = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <div className="app-wrapper">
      <nav className="navbar">
        <div className="logo">YouTube Advisor</div>

        <button className="hamburger" onClick={toggleMenu} aria-label="Toggle menu">
          {menuOpen ? '✖' : '☰'}
        </button>

        <ul className={`nav-links ${menuOpen ? 'active' : ''}`}>
          <li><Link to="/" onClick={toggleMenu}>Home</Link></li>
          <li><Link to="/content-safety" onClick={toggleMenu}>Content Safety</Link></li>
          <li><Link to="/contract-explainer" onClick={toggleMenu}>Contract Explainer</Link></li>
          <li><Link to="/invoice-generator" onClick={toggleMenu}>Invoice Generator</Link></li>
          <li><Link to="/ama" onClick={toggleMenu}>Ask Me Anything</Link></li>
          <li><Link to="/policy-qa" onClick={toggleMenu}>Policy Q&A</Link></li>
          <li>
            <button className="theme-toggle-nav" onClick={toggleTheme} title="Toggle theme">
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
          </li>
        </ul>
      </nav>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/content-safety" element={<ContentSafetyChecker />} />
          <Route path="/contract-explainer" element={<ContractExplainer />} />
          <Route path="/invoice-generator" element={<InvoiceGenerator />} />
          <Route path="/ama" element={<AMA />} />
          <Route path="/policy-qa" element={<YouTubePolicyQA />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
