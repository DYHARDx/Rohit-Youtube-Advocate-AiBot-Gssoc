// src/utils/postData.js
export async function postData(url = "", data = {}) {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    
    // Check if response is OK
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Server error: ${response.status} ${response.statusText}`);
    }
    
    // Parse JSON response
    const result = await response.json();
    return { success: true, data: result };
  } catch (error) {
    // Handle network errors and other exceptions
    return { 
      success: false, 
      error: error.message || "Unknown error occurred",
      networkError: error instanceof TypeError
    };
  }
}