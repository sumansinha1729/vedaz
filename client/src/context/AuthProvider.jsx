import { useCallback, useEffect, useMemo, useState } from 'react';
import { AuthContext } from './AuthContext';
import { login as loginRequest, getMe } from '../api/auth';
import { setUnauthorizedHandler } from '../api/client';
import { useToast } from '../hooks/useToast';
import { getToken, getStoredUser, saveSession, clearSession } from '../utils/storage';

export function AuthProvider({ children }) {
  const { showToast } = useToast();
  const [user, setUser] = useState(getStoredUser);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  const expireSession = useCallback(() => {
    logout();
    showToast('Your session has expired. Please log in again.', 'info');
  }, [logout, showToast]);

  const login = useCallback(async (username) => {
    const { token, user } = await loginRequest(username);
    saveSession({ token, user });
    setUser(user);
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(expireSession);
  }, [expireSession]);

  // Refresh the stored user in the background; a 401 logs out via the handler above
  useEffect(() => {
    if (!getToken()) return;

    getMe()
      .then(({ user }) => {
        saveSession({ user });
        setUser(user);
      })
      .catch(() => {});
  }, []);

  const value = useMemo(
    () => ({ user, login, logout, expireSession }),
    [user, login, logout, expireSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
