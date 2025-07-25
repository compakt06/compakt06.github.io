// src/routes/AppRouter.js
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../login/Login.jsx';
import Register from '../register/Register.jsx';
import OrdersList from '../orders/OrdersList.jsx';
import ProtectedRoute from '../auth/ProtectedRoute.jsx';

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <OrdersList />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/orders" replace />} />
      </Routes>
    </Router>
  );
}