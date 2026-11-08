import { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import {
  api,
  saveTokens,
  getAccessToken,
  getRefreshToken,
  clearTokens,
} from '../services/api';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Login
  async function login(username, password) {
    clearTokens();

    const data = await api.post('/accounts/login/', {
      username,
      password,
    });

    saveTokens(data.access, data.refresh);

    const currentUser = await api.get('/accounts/me/');
    setUser(currentUser);

    return currentUser;
  }

  // Register
  async function register(username, email, password) {
    return api.post('/accounts/register/', {
      username,
      email,
      password,
    });
  }

  // Logout
  async function logout() {
    const refresh = getRefreshToken();

    try {
      if (refresh) {
        await api.post('/accounts/logout/', { refresh });
      }
    } catch (error) {
      console.error('Logout request failed:', error);
    } finally {
      clearTokens();
      setUser(null);
    }
  }

  // Restore the session when React starts
  useEffect(() => {
    async function restoreSession() {
      if (!getAccessToken() && !getRefreshToken()) {
        setLoading(false);
        return;
      }

      try {
        const currentUser = await api.get('/accounts/me/');
        setUser(currentUser);
      } catch (error) {
        clearTokens();
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    restoreSession();
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated: Boolean(user),
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}