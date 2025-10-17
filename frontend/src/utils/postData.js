// src/utils/postData.js
import { handleApiError } from './errorHandler';

/**
 * Enhanced POST data utility with retry functionality
 * @param {string} url - API endpoint URL
 * @param {Object} data - Data to send in request body
 * @param {number} retries - Number of retry attempts
 * @returns {Promise<Object>} - API response or error object
 */
export async function postData(url = "", data = {}, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        // For 5xx errors, we might want to retry
        if (response.status >= 500 && attempt < retries) {
          // Wait before retrying with exponential backoff
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
          continue;
        }
        throw new Error(`Server error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      // If this is the last attempt, return the error
      if (attempt === retries) {
        return { error: error.message || "Unknown error" };
      }
      
      // Wait before retrying with exponential backoff
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    }
  }
}