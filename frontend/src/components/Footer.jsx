import React, { useContext, useState } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import '../styles/Footer.css';

const Footer = () => {
  const { theme } = useContext(ThemeContext);
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      // In a real app, this would connect to a backend service
      setIsSubscribed(true);
      setEmail('');
      // Reset subscription status after 5 seconds
      setTimeout(() => setIsSubscribed(false), 5000);
    }
  };

  return (
    <footer className={`footer ${theme}`} role="contentinfo">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>YouTube Advisor AiBot</h3>
            <p>Your AI-powered guide for YouTube content creation, monetization, and policy compliance.</p>
          </div>
          
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="https://www.youtube.com/yt/about/policies/" target="_blank" rel="noopener noreferrer">YouTube Policies</a></li>
              <li><a href="https://creatoracademy.youtube.com/" target="_blank" rel="noopener noreferrer">Creator Academy</a></li>
              <li><a href="https://github.com/rohit-youtube-advocate" target="_blank" rel="noopener noreferrer">GitHub</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Tools</h4>
            <ul>
              <li><a href="/content-safety">Content Safety Checker</a></li>
              <li><a href="/contract-explainer">Contract Explainer</a></li>
              <li><a href="/invoice-generator">Invoice Generator</a></li>
              <li><a href="/ama">Ask Me Anything</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Follow Us</h4>
            <div className="social-links">
              <a href="https://twitter.com/rohit_youtube" target="_blank" rel="noopener noreferrer" aria-label="Twitter">🐦</a>
              <a href="https://linkedin.com/in/rohit-youtube-advocate" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">💼</a>
              <a href="https://youtube.com/@rohit-advocate" target="_blank" rel="noopener noreferrer" aria-label="YouTube">📺</a>
            </div>
          </div>
          
          {/* Newsletter Subscription Section */}
          <div className="footer-section">
            <h4>Stay Updated</h4>
            <p>Subscribe to our newsletter for the latest YouTube policy updates and tips.</p>
            <form onSubmit={handleSubscribe} className="newsletter-form" aria-label="Newsletter subscription form">
              <label htmlFor="email-input" className="sr-only">Email address</label>
              <input
                type="email"
                id="email-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                aria-required="true"
                className="newsletter-input"
              />
              <button type="submit" className="newsletter-button" aria-label="Subscribe to newsletter">
                {isSubscribed ? 'Subscribed!' : 'Subscribe'}
              </button>
            </form>
            {isSubscribed && (
              <p className="subscription-success" role="alert">
                Thank you for subscribing!
              </p>
            )}
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} YouTube Advisor AiBot. All rights reserved.</p>
          <div className="footer-links">
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;