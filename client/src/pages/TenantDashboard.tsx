import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../hooks/useAuth';

interface Document {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  fileUrl?: string | null;
}

const TenantDashboard = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selected, setSelected] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const { logout, user } = useAuth();

  useEffect(() => {
    api
      .get('/my/documents')
      .then((res) => setDocuments(res.data))
      .finally(() => setLoading(false));
  }, []);

  const handleOpen = async (doc: Document) => {
    setSelected(doc);
    await api.post(`/documents/${doc.id}/open`);
  };

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1>Mine dokumenter</h1>
          <p>Logget ind som {user?.fullName}</p>
        </div>
        <button onClick={logout}>Log ud</button>
      </header>
      {loading ? (
        <p>Henter dokumenter...</p>
      ) : documents.length === 0 ? (
        <p>Ingen dokumenter fundet.</p>
      ) : (
        <div className="grid">
          <ul className="card list">
            {documents.map((doc) => (
              <li key={doc.id}>
                <div>
                  <strong>{doc.title}</strong>
                  <small>{new Date(doc.createdAt).toLocaleDateString('da-DK')}</small>
                </div>
                <button onClick={() => handleOpen(doc)}>Åbn</button>
              </li>
            ))}
          </ul>
          {selected && (
            <article className="card">
              <h2>{selected.title}</h2>
              <p>{selected.content}</p>
              {selected.fileUrl && (
                <a href={selected.fileUrl} target="_blank" rel="noreferrer">
                  Åbn fil
                </a>
              )}
            </article>
          )}
        </div>
      )}
    </div>
  );
};

export default TenantDashboard;
