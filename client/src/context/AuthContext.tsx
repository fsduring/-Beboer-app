import { createContext, type ReactNode, useEffect, useMemo, useState } from 'react';

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
  login: (email: string, password: string) => Promise<UserProfile | null>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}

const STORAGE_KEY = 'demoUser';
const isBrowser = typeof window !== 'undefined';

type DemoUser = UserProfile & { password: string };

const demoUsers: DemoUser[] = [
  {
    id: 1,
    email: 'byggeleder@example.dk',
    fullName: 'Betina Byggeleder',
    role: 'SITE_MANAGER',
    unitId: null,
    password: 'Test1234!',
  },
  {
    id: 2,
    email: 'beboer@example.dk',
    fullName: 'Bente Beboer',
    role: 'TENANT',
    unitId: 1,
    password: 'Test1234!',
  },
  {
    id: 3,
    email: 'raadgiver@example.dk',
    fullName: 'Rasmus Rådgiver',
    role: 'ADVISOR',
    unitId: null,
    password: 'Test1234!',
  },
];

const persistUser = (profile: UserProfile | null) => {
  if (!isBrowser) return;
  try {
    if (profile) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    /* Ignorer storage-problemer i demo */
  }
};

export const AuthContext = createContext<AuthContextValue>({
  user: null,
  setUser: () => undefined,
  login: async () => null,
  logout: () => undefined,
  loading: true,
  error: null,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isBrowser) {
      setLoading(false);
      return;
    }

    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as UserProfile;
        setUser(parsed);
      }
    } catch {
      if (isBrowser) {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const normalizedEmail = email.trim().toLowerCase();
      const normalizedPassword = password.trim();
      const match = demoUsers.find(
        (demo) => demo.email.toLowerCase() === normalizedEmail && demo.password === normalizedPassword,
      );

      if (match) {
        const profile: UserProfile = {
          id: match.id,
          email: match.email,
          fullName: match.fullName,
          role: match.role,
          unitId: match.unitId,
        };
        setUser(profile);
        persistUser(profile);
        return profile;
      }

      setUser(null);
      persistUser(null);
      setError('Forkert e-mail eller adgangskode');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setError(null);
    persistUser(null);
  };

  const value = useMemo(
    () => ({ user, setUser, login, logout, loading, error }),
    [user, loading, error],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
