import { Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import TenantDashboard from './pages/TenantDashboard';
import SiteManagerDashboard from './pages/SiteManagerDashboard';
import AdvisorDashboard from './pages/AdvisorDashboard';
import { useAuth } from './hooks/useAuth';

const ProtectedRoute = ({ children, roles }: { children: JSX.Element; roles?: string[] }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/beboer"
        element={
          <ProtectedRoute roles={['TENANT']}>
            <TenantDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/byggeleder"
        element={
          <ProtectedRoute roles={['SITE_MANAGER']}>
            <SiteManagerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/raadgiver"
        element={
          <ProtectedRoute roles={['ADVISOR']}>
            <AdvisorDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
