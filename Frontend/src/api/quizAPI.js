// src/api/quizAPI.js

const API_BASE_URL = 'http://localhost:4000';

/**
 * Save quiz result to the database
 * @param {Object} quizResult - The quiz result data to save
 * @returns {Promise<Object>} - The saved quiz result from the server
 */
export const saveQuizResultToDB = async (quizResult) => {
  try {
    console.log('Saving quiz result to:', `${API_BASE_URL}/api/quiz-results/save-quiz`);
    console.log('Quiz data:', quizResult);
    
    // Note: Your backend doesn't require token for saveQuizResult function
    const response = await fetch(`${API_BASE_URL}/api/quiz-results/save-quiz`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(quizResult)
    });
    
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      let errorMessage = `Server error: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        // Couldn't parse JSON error response
      }
      throw new Error(errorMessage);
    }
    
    const result = await response.json();
    console.log('Save successful:', result);
    return result;
  } catch (error) {
    console.error('Error saving quiz result:', error.message);
    throw error;
  }
};

/**
 * Get quiz results for a specific user
 * @param {string} userId - The ID of the user
 * @returns {Promise<Array>} - Array of quiz results
 */
export const getQuizResultsByUser = async (userId) => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_BASE_URL}/api/quiz-results/user/${userId}`, {
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch quiz results: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching quiz results by user:', error);
    throw error;
  }
};

/**
 * Get all quiz results for the current user
 * @returns {Promise<Array>} - Array of quiz results
 */
export const getAllQuizResults = async () => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_BASE_URL}/api/quiz-results`, {
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch quiz results: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching all quiz results:', error);
    throw error;
  }
};

/**
 * Get a single quiz result by ID
 * @param {string} resultId - The ID of the quiz result
 * @returns {Promise<Object>} - The quiz result object
 */
export const getQuizResultById = async (resultId) => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_BASE_URL}/api/quiz-results/${resultId}`, {
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch quiz result: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching quiz result by ID:', error);
    throw error;
  }
};

/**
 * Delete a quiz result by ID
 * @param {string} resultId - The ID of the quiz result to delete
 * @returns {Promise<Object>} - Confirmation message
 */
export const deleteQuizResult = async (resultId) => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_BASE_URL}/api/quiz-results/${resultId}`, {
      method: 'DELETE',
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete quiz result: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error deleting quiz result:', error);
    throw error;
  }
};

// Helper function to get current user (adjust based on your auth system)
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch (e) {
      console.error('Error parsing user from localStorage:', e);
    }
  }
  return null;
};

// Add this test function to check backend connection
export const testBackendConnection = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/test`);
    if (!response.ok) {
      throw new Error(`Backend unreachable: ${response.status}`);
    }
    const data = await response.json();
    return { success: true, message: 'Backend connected', data };
  } catch (error) {
    console.error('Backend connection test failed:', error);
    return { 
      success: false, 
      message: 'Cannot connect to backend', 
      error: error.message 
    };
  }
};

// Local static quiz loader (uses `quizzes.json`). This allows frontend-only quizzes.
import quizzes from './quizzes.json'

/**
 * Get quiz data for a given technology and level from local JSON.
 * Returns null if not found.
 */
export const getQuiz = (technology, level) => {
  if (!technology) return null
  const techKey = technology.toLowerCase()
  const lvlKey = (level || '').toLowerCase()
  if (quizzes[techKey] && quizzes[techKey][lvlKey]) {
    return quizzes[techKey][lvlKey]
  }
  return null
}