// src/utils/postData.js

/**
 * Utility function to make POST requests to the backend API
 * @param {string} url - The API endpoint URL
 * @param {Object} data - The data to send in the request body
 * @returns {Promise<Object>} - The response data or error object
 */
export async function postData(url = "", data = {}) {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    // Check if the response is OK (status in the range 200-299)
    if (!response.ok) {
      // Try to parse the error response
      let errorData;
      try {
        errorData = await response.json();
      } catch (parseError) {
        // If parsing fails, create a generic error message
        errorData = {
          error: `Server error: ${response.status} ${response.statusText}`,
          status: response.status
        };
      }
      
      // Return error data with additional context
      return {
        error: errorData.error || "An unknown error occurred",
        status: errorData.status || response.status,
        details: errorData.details || null
      };
    }

    // Parse and return successful response
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    // Handle network errors or other exceptions
    return { 
      error: error.message || "Network error - please check your connection",
      networkError: true
    };
  }
}