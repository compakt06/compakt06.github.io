// src/AppRouter.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import OrdersList from '../orders/OrdersList.jsx';
import ManagerPanel from '../manager/ManagerPanel.jsx';
import CompletedOrders from '../orders/CompletedOrders.jsx';
import Archive from '../orders/Archive.jsx';

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<OrdersList />} />
        <Route path="/completed" element={<CompletedOrders />} />
        <Route path="/archive" element={<Archive />} />
        <Route path="/manager" element={<ManagerPanel />} />
      </Routes>
    </Router>
  );
}