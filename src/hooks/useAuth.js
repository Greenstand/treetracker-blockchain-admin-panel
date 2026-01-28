import { useEffect, useState } from 'react';
import api from '../services/api';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    const savedUser = api.auth.getUser();
    if (savedUser) {
      setIsAuthenticated(true);
      setCurrentUser(savedUser);
    }
  }, []);

  const login = async ({ username, password, rememberMe }) => {
    setLoginError('');
    try {
      const response = await api.auth.loginAdmin({ username, password });
      if (!response.success || !response.data) {
        setLoginError(response.error || 'Invalid username or password');
        return { success: false };
      }

      const user = response.data.user;
      setIsAuthenticated(true);
      setCurrentUser(user);

      if (!rememberMe) {
        window.localStorage.removeItem('adminUser');
      }

      return { success: true };
    } catch (error) {
      setLoginError(error.message || 'Login failed');
      return { success: false };
    }
  };

  const logout = async () => {
    await api.auth.logout();
    setIsAuthenticated(false);
    setCurrentUser(null);
    setLoginError('');
    window.sessionStorage.clear();
  };

  return {
    isAuthenticated,
    currentUser,
    loginError,
    login,
    logout,
    setLoginError
  };
};
