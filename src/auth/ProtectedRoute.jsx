// src/auth/ProtectedRoute.js
import { useAuth } from './authContext';
import { Navigate, useLocation } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner';

export default function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}