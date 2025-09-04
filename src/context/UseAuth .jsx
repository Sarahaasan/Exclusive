// context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();
const baseUrl = import.meta.env.VITE_API_BASE_URL || "https://exclusive.runasp.net/api";

export const UseAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication on app startup
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (token && userData) {
        // Check if token is expired (optional)
        if (isTokenValid(token)) {
          setUser(JSON.parse(userData));
          setIsAuthenticated(true);
        } else {
          // Token expired, clear storage
          logout();
        }
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const isTokenValid = (token) => {
    try {
      // Decode JWT payload (basic check)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp > currentTime; // Check if not expired
    } catch {
      return false;
    }
  };

  const login = (userData, accessToken, refreshToken) => {
    localStorage.setItem('token', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(userData));
    
    setUser(userData);
    setIsAuthenticated(true);
  };
 
  const logout = async () => {
    try {
      const token = localStorage.getItem("token");
      
      // Reset state first
      setUser(null);
      setIsAuthenticated(false);
      
      // Specifically remove known keys first
      const knownKeys = [
        'token',
        'refreshToken',
        'user',
        'wishlistIds',  // Specifically remove wishlist
        'wishlist'      // In case there's also a 'wishlist' key
      ];
      
      knownKeys.forEach(key => {
        try {
          localStorage.removeItem(key);
        } catch (e) {
          console.error(`Failed to remove ${key}:`, e);
        }
      });
      
      // Then get all remaining keys and remove them
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => {
        try {
          localStorage.removeItem(key);
        } catch (e) {
          console.error(`Failed to remove ${key}:`, e);
        }
      });
      
      // Also try localStorage.clear() as backup
      try {
        localStorage.clear();
      } catch (e) {
        console.error("localStorage.clear() failed:", e);
      }
      
      // Clear sessionStorage too if you use it
      try {
        sessionStorage.clear();
      } catch (e) {
        console.error("sessionStorage.clear() failed:", e);
      }
      
      // Try to call logout API (optional since token might be expired)
      if (token) {
        try {
          await fetch(`${baseUrl}/Account/logout`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            }
          });
        } catch (apiError) {
          // Ignore API errors since we're logging out anyway
          console.log("Logout API call failed, but continuing with logout");
        }
      }
      
      // Dispatch a custom event to notify other components
      window.dispatchEvent(new Event('userLoggedOut'));
      
      // Use a small timeout to ensure state updates have processed
      setTimeout(() => {
        // Use replace instead of href to prevent back navigation
        window.location.replace("/");
      }, 100);
      
    } catch (error) {
      console.error("Error during logout:", error);
      
      // Fallback: ensure we still clear storage and redirect
      try {
        localStorage.clear();
        sessionStorage.clear();
      } catch (e) {
        // Ignore errors
      }
      
      // Even if there's an error, still redirect
      window.location.replace("/");
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};