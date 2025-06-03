import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Clients from './pages/Clients';
import Certifications from './pages/Certifications';
import Contact from './pages/Contact';
import Dashboard from './modules/dashboard/pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="nosotros" element={<About />} />
          <Route path="clientes" element={<Clients />} />
          <Route path="certificaciones" element={<Certifications />} />
          <Route path="contacto" element={<Contact />} />
        </Route>
        <Route path="/dashboard/*" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);