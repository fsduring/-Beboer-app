import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../hooks/useAuth';

interface Document {
  id: number;
  title: string;
  content: string;
  createdAt: string;
}

interface Photo {
  id: number;
  url: string;
  note?: string | null;
  createdAt: string;
}

const AdvisorDashboard = () => {
  const { logout, user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);

  useEffect(() => {
    api.get('/documents').then((res) => setDocuments(res.data));
    api.get('/photos').then((res) => setPhotos(res.data));
  }, []);

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1>Rådgiver overblik</h1>
          <p>Logget ind som {user?.fullName}</p>
        </div>
        <button onClick={logout}>Log ud</button>
      </header>

      <section className="card">
        <h2>Udsendte dokumenter</h2>
        <ul className="list">
          {documents.map((doc) => (
            <li key={doc.id}>
              <div>
                <strong>{doc.title}</strong>
                <small>{new Date(doc.createdAt).toLocaleString('da-DK')}</small>
              </div>
              <p>{doc.content}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="card">
        <h2>Fotos</h2>
        <div className="photo-grid">
          {photos.map((photo) => (
            <figure key={photo.id}>
              <img src={photo.url} alt={photo.note || 'Byggefoto'} />
              <figcaption>
                {photo.note || 'Ingen note'} – {new Date(photo.createdAt).toLocaleDateString('da-DK')}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AdvisorDashboard;
