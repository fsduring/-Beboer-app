import { createContext, useEffect, useState } from 'react';
import { api } from '../services/api';

export interface UserProfile {
  id: number;
  email: string;
  fullName: string;
  role: 'TENANT' | 'ADVISOR' | 'SITE_MANAGER';
  unitId?: number | null;
}

interface AuthContextValue {
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
  logout: () => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextValue>({
  user: null,
  setUser: () => undefined,
  logout: () => undefined,
  loading: true,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get('/me')
      .then((res) => setUser(res.data))
      .catch(() => {
        localStorage.removeItem('token');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, setUser, logout, loading }}>{children}</AuthContext.Provider>;
};
