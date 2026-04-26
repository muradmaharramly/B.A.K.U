import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// Fail-safe API URL: Use environment variable or fallback to production Render URL
const API_URL = import.meta.env.VITE_API_URL || 'https://baku-transit-backend.onrender.com/api';

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    // Safety timeout: Never stay in loading for more than 10s
    const safetyTimeout = setTimeout(() => {
      setLoading(false);
    }, 10000);

    if (token) {
      checkAdmin(token).finally(() => clearTimeout(safetyTimeout));
    } else {
      setLoading(false);
      clearTimeout(safetyTimeout);
    }

    return () => clearTimeout(safetyTimeout);
  }, []);

  const checkAdmin = async (token) => {
    try {
      const res = await axios.get(`${API_URL}/auth/me`, {
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
      const res = await axios.post(`${API_URL}/auth/login`, { username, password });
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
