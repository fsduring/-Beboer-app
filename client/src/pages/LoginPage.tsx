import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../hooks/useAuth';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      const profile = await api.get('/me');
      setUser(profile.data);
      if (profile.data.role === 'TENANT') {
        navigate('/beboer');
      } else if (profile.data.role === 'SITE_MANAGER') {
        navigate('/byggeleder');
      } else {
        navigate('/raadgiver');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Kunne ikke logge ind');
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
        {error && <p className="error-text">{error}</p>}
        <button type="submit">Log ind</button>
      </form>
    </div>
  );
};

export default LoginPage;
