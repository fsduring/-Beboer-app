import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

type Role = "TENANT" | "ADVISOR" | "SITE_MANAGER";

interface User {
  id: string;
  fullName: string;
  role: Role;
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error] = useState<string | null>(null);

  // FAKE login: ingen backend – vi bestemmer rolle ud fra e-mail
  const login = async (email: string, _password: string) => {
    setLoading(true);

    let role: Role = "TENANT";

    const lower = email.toLowerCase();
    if (lower.startsWith("byg")) {
      role = "SITE_MANAGER"; // byggeleder
    } else if (lower.startsWith("raad")) {
      role = "ADVISOR"; // rådgiver
    } else {
      role = "TENANT"; // beboer
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
      value={{ user, loading, error, login, logout }}
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

export { AuthContext };
