import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// ✅ KFC imports
import OrdersList from '../orders/OrdersList.jsx';
import ManagerPanel from '../manager/ManagerPanel.jsx';
import CompletedOrders from '../orders/CompletedOrders.jsx';
import Archive from '../orders/Archive.jsx';

// ✅ Portfolio imports
import Home from '../pages/Home.jsx';
import About from '../pages/About.jsx';
import Contact from '../pages/Contact.jsx';
import Projects from '../pages/Projects.jsx';

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        {/* 🌸 Portfolio routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/projects" element={<Projects />} />

        {/* 🍗 KFC routes */}
        <Route path="/orders" element={<OrdersList />} />
        <Route path="/completed" element={<CompletedOrders />} />
        <Route path="/archive" element={<Archive />} />
        <Route path="/manager" element={<ManagerPanel />} />
      </Routes>
    </Router>
  );
}
