import { FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login, user, error, loading } = useAuth();

  useEffect(() => {
    if (user?.role === 'TENANT') {
      navigate('/beboer');
    } else if (user?.role === 'SITE_MANAGER') {
      navigate('/byggeleder');
    } else if (user?.role === 'ADVISOR') {
      navigate('/raadgiver');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const profile = await login(email, password);
    if (!profile) {
      return;
    }

    if (profile.role === 'TENANT') {
      navigate('/beboer');
    } else if (profile.role === 'SITE_MANAGER') {
      navigate('/byggeleder');
    } else {
      navigate('/raadgiver');
    }
  };

  return (
    <div className="auth-layout">
      <form className="card" onSubmit={handleSubmit}>
        <h1>Log ind</h1>
        <label>E-mail</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
        <label>Adgangskode</label>
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
        <p className="muted">Brug demo-konti: byggeleder@, beboer@ eller raadgiver@ med adgangskoden Test1234!</p>
        {error && <p className="error-text">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Logger ind...' : 'Log ind'}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
