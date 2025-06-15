import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for existing session
    const storedUser = localStorage.getItem('votingSystemUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Admin login
  const loginAdmin = (email, password) => {
    // In a real app, this would be an API call
    if (email === 'admin@university.edu' && password === 'admin123') {
      const user = { 
        role: 'admin', 
        email,
        name: 'Election Admin'
      };
      setCurrentUser(user);
      localStorage.setItem('votingSystemUser', JSON.stringify(user));
      return true;
    }
    return false;
  };

  // Voter login
  const loginVoter = (email) => {
    // Simple validation
    if (!email.endsWith('.com')) {
      return false;
    }
    
    const user = { 
      role: 'voter', 
      email,
      name: email.split('@')[0]
    };
    setCurrentUser(user);
    localStorage.setItem('votingSystemUser', JSON.stringify(user));
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('votingSystemUser');
  };

  const value = {
    currentUser,
    loading,
    loginAdmin,
    loginVoter,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}