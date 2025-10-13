// src/context/ThemeContext.jsx
// ===== THEME CONTEXT PROVIDER - ENHANCED VERSION =====

import React, { createContext, useState, useEffect } from 'react';

// Create the theme context instance
export const ThemeContext = createContext();

// Theme Provider component - manages application theme state
export const ThemeProvider = ({ children }) => {
  // Initialize theme state from localStorage or default to 'light'
  const [currentTheme, setCurrentTheme] = useState(() => {
    return localStorage.getItem('app-theme') || 'light';
  });

  // Effect hook to handle theme changes and persistence
  useEffect(() => {
    // Apply theme class to document body element
    document.body.className = '';
    document.body.classList.add(currentTheme);
    
    // Store theme preference in localStorage for persistence
    localStorage.setItem('app-theme', currentTheme);
    
    // Debug log for development (removed in production)
    console.log(`Theme updated to: ${currentTheme}`);
  }, [currentTheme]);

  // Function to toggle between light and dark themes
  const switchTheme = () => {
    setCurrentTheme((previousTheme) => 
      previousTheme === 'light' ? 'dark' : 'light'
    );
  };

  // Context value containing theme state and toggle function
  const contextValue = {
    theme: currentTheme,
    toggleTheme: switchTheme
  };

  // Render the provider with context value
  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook for easier context consumption
export const useTheme = () => {
  const context = React.useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Placeholder for future theme extensions
export const ThemeUtils = {
  // Reserved for additional theme utilities
  version: '1.0.0'
};
