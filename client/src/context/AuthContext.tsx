import { createContext, type ReactNode, useEffect, useState } from 'react';

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

const demoUsers: Array<UserProfile & { password: string }> = [
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

export const AuthContext = createContext<AuthContextValue>({
  user: null,
  setUser: () => undefined,
  login: async () => null,
  logout: () => undefined,
  loading: false,
  error: null,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as UserProfile;
        setUser(parsed);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    const normalizedEmail = email.trim().toLowerCase();
    const match = demoUsers.find((demo) => demo.email === normalizedEmail && demo.password === password);

    if (match) {
      const profile: UserProfile = {
        id: match.id,
        email: match.email,
        fullName: match.fullName,
        role: match.role,
        unitId: match.unitId,
      };
      setUser(profile);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
      setLoading(false);
      return profile;
    }

    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    setError('Forkert e-mail eller adgangskode');
    setLoading(false);
    return null;
  };

  const logout = () => {
    setUser(null);
    setError(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};
