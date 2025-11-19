import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmed = email.trim().toLowerCase();
    if (!trimmed) {
      setError("Skriv din e-mail for at logge ind");
      return;
    }

    // Bestem rolle ud fra e-mail
    // byg@...  => byggeleder
    // raad@... => rådgiver
    // alt andet => beboer
    let role: "TENANT" | "ADVISOR" | "SITE_MANAGER" = "TENANT";

    if (trimmed.startsWith("byg")) {
      role = "SITE_MANAGER";
    } else if (trimmed.startsWith("raad")) {
      role = "ADVISOR";
    } else {
      role = "TENANT";
    }

    // Sæt en demo-bruger i auth-context
    setUser({
      id: "demo-user",
      fullName: "Demobruger",
      role,
    });

    // Navigér videre til den rigtige side
    if (role === "TENANT") {
      navigate("/beboer");
    } else if (role === "SITE_MANAGER") {
      navigate("/byggeleder");
    } else {
      navigate("/raadgiver");
    }
  };

  return (
    <div className="auth-layout">
      <form className="card" onSubmit={handleSubmit}>
        <h1>Log ind</h1>
        <label>E-mail</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          required
          placeholder="fx byg@test.dk, raad@test.dk eller beboer@test.dk"
        />
        <label>Adgangskode</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          required
          placeholder="Skriv hvad som helst (ignoreres i demo)"
        />
        {error && <p className="error-text">{error}</p>}
        <button type="submit">Log ind</button>
      </form>
    </div>
  );
};

export default LoginPage;

