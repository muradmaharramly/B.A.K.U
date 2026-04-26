import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Current API URL:", import.meta.env.VITE_API_URL);
    const token = localStorage.getItem('token');
    if (token) {
      checkAdmin(token);
    } else {
      setLoading(false);
    }
  }, []);

  const checkAdmin = async (token) => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAdmin(res.data);
    } catch (err) {
      localStorage.removeItem('token');
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    setError(null);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, { username, password });
      localStorage.setItem('token', res.data.token);
      setAdmin(res.data.admin);
      return true;
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, login, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};
