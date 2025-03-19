import React, { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Menu, Shield } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Novelties from './Novelties';
import UsuariosPage from './UsuariosPages';
import CargoPage from './cargoPages';
import AgregarCargoPage from './AgregarCargoPage';
import AgregarUsuarioPage from './usuarioAgregar';
import Reports from './Reports';
import Stats from './Stats';
import FacialScan from './FacialScan';
import Settings from './Settings';
import Profile from './Profile';

function Dashboard() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const currentDate = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const capitalizedDate = currentDate.charAt(0).toUpperCase() + currentDate.slice(1);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar 
        isMobileMenuOpen={isMobileMenuOpen} 
        setIsMobileMenuOpen={setIsMobileMenuOpen} 
      />
      
      <div className="flex-1">
        {/* Top Bar */}
        <div className="bg-white shadow">
          <div className="flex justify-between items-center px-4 md:px-8 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
              >
                <Menu className="h-6 w-6" />
              </button>
              <Link to="/" className="flex items-center gap-2 hover:text-blue-700 transition-colors">
                <Shield className="w-6 h-6 text-blue-600" />
                <span className="text-xl font-bold">COLPRYST</span>
              </Link>
            </div>
            <div className="text-gray-700 text-sm md:text-base">
              <span>{capitalizedDate}</span>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-4 md:p-8">
          <Routes>
            <Route index element={<Novelties />} />
            <Route path="/users" element={<UsuariosPage />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/cargos" element={<CargoPage />} />
            <Route path="/agregar-cargo" element={<AgregarCargoPage />} />
            <Route path="/agregar-users" element={<AgregarUsuarioPage />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/facial-scan" element={<FacialScan />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;