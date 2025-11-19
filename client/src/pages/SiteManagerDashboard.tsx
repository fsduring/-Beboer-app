import { FormEvent, useEffect, useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../hooks/useAuth';

interface Property {
  id: number;
  name: string;
}

interface Department {
  id: number;
  name: string;
  propertyId: number;
}

interface Unit {
  id: number;
  unitNumber: string;
  departmentId: number;
}

interface Document {
  id: number;
  title: string;
  createdAt: string;
}

const SiteManagerDashboard = () => {
  const { logout, user } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [form, setForm] = useState({
    title: '',
    content: '',
    scope: 'PROPERTY',
    propertyId: '',
    departmentId: '',
    unitId: '',
  });
  const [message, setMessage] = useState('');

  const fetchDocuments = () => {
    api.get('/documents').then((res) => setDocuments(res.data));
  };

  useEffect(() => {
    api.get('/properties').then((res) => setProperties(res.data));
    fetchDocuments();
  }, []);

  useEffect(() => {
    if (form.propertyId) {
      api.get(`/departments?propertyId=${form.propertyId}`).then((res) => setDepartments(res.data));
    }
  }, [form.propertyId]);

  useEffect(() => {
    if (form.departmentId) {
      api.get(`/units?departmentId=${form.departmentId}`).then((res) => setUnits(res.data));
    }
  }, [form.departmentId]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage('');
    try {
      await api.post('/documents', {
        title: form.title,
        content: form.content,
        scope: form.scope,
        propertyId: form.scope !== 'UNIT' ? Number(form.propertyId) || undefined : undefined,
        departmentId: form.scope !== 'PROPERTY' ? Number(form.departmentId) || undefined : undefined,
        unitId: form.scope === 'UNIT' ? Number(form.unitId) || undefined : undefined,
      });
      setForm({ title: '', content: '', scope: 'PROPERTY', propertyId: '', departmentId: '', unitId: '' });
      setMessage('Dokument oprettet');
      fetchDocuments();
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Kunne ikke oprette dokument');
    }
  };

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1>Byggeleder</h1>
          <p>Logget ind som {user?.fullName}</p>
        </div>
        <button onClick={logout}>Log ud</button>
      </header>

      <section className="card">
        <h2>Opret dokument</h2>
        <form className="form-grid" onSubmit={handleSubmit}>
          <label>Titel</label>
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />

          <label>Indhold</label>
          <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required />

          <label>Omfang</label>
          <select value={form.scope} onChange={(e) => setForm({ ...form, scope: e.target.value })}>
            <option value="PROPERTY">Ejendom</option>
            <option value="DEPARTMENT">Afdeling</option>
            <option value="UNIT">Lejemål</option>
          </select>

          {(form.scope === 'PROPERTY' || form.scope === 'DEPARTMENT' || form.scope === 'UNIT') && (
            <>
              <label>Ejendom</label>
              <select
                value={form.propertyId}
                onChange={(e) => setForm({ ...form, propertyId: e.target.value, departmentId: '', unitId: '' })}
                required={form.scope !== 'UNIT'}
              >
                <option value="">Vælg ejendom</option>
                {properties.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </>
          )}

          {(form.scope === 'DEPARTMENT' || form.scope === 'UNIT') && (
            <>
              <label>Afdeling</label>
              <select
                value={form.departmentId}
                onChange={(e) => setForm({ ...form, departmentId: e.target.value, unitId: '' })}
                required
              >
                <option value="">Vælg afdeling</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </>
          )}

          {form.scope === 'UNIT' && (
            <>
              <label>Lejemål</label>
              <select value={form.unitId} onChange={(e) => setForm({ ...form, unitId: e.target.value })} required>
                <option value="">Vælg lejemål</option>
                {units.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.unitNumber}
                  </option>
                ))}
              </select>
            </>
          )}

          <button type="submit">Gem dokument</button>
        </form>
        {message && <p>{message}</p>}
      </section>

      <section className="card">
        <h2>Seneste dokumenter</h2>
        <ul className="list">
          {documents.map((doc) => (
            <li key={doc.id}>
              <span>{doc.title}</span>
              <small>{new Date(doc.createdAt).toLocaleString('da-DK')}</small>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default SiteManagerDashboard;
