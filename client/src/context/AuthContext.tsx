import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

type Role = "TENANT" | "ADVISOR" | "SITE_MANAGER";

export interface User {
  id: string;
  fullName: string;
  role: Role;
}

interface AuthContextValue {
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fake login – ingen backend, vi bestemmer rolle ud fra e-mail
  const login = async (email: string, _password: string) => {
    setLoading(true);
    setError(null);

    const lower = email.trim().toLowerCase();
    if (!lower) {
      setError("Skriv din e-mail for at logge ind");
      setLoading(false);
      return;
    }

    let role: Role = "TENANT";
    if (lower.startsWith("byg")) {
      role = "SITE_MANAGER";
    } else if (lower.startsWith("raad")) {
      role = "ADVISOR";
    }

    setUser({
      id: "demo-user",
      fullName: "Demobruger",
      role,
    });

    setLoading(false);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, loading, error, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("AuthContext er ikke tilgængelig");
  }
  return ctx;
};

export { AuthCont

