// src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        setCurrentUser(JSON.parse(user));
      } catch (e) {
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
       localStorage.setItem('token', userData.token); 
    setCurrentUser(userData);
    return true;
  };

  const register = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
       localStorage.setItem('token', userData.token); 
    setCurrentUser(userData);
    return true;
  };

  const logout = () => {
    localStorage.removeItem('user');
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      login,
      register,
      logout,
      isAuthenticated: !!currentUser
    }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
}