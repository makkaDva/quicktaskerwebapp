'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext<{
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
}>({
  isLoggedIn: false,
  setIsLoggedIn: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Read auth state from localStorage on initial render
  useEffect(() => {
    const storedAuthState = localStorage.getItem('isLoggedIn');
    if (storedAuthState) {
      setIsLoggedIn(JSON.parse(storedAuthState));
    }
  }, []);

  // Write auth state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('isLoggedIn', JSON.stringify(isLoggedIn));
  }, [isLoggedIn]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};