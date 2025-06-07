import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Menu, Shield } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Novelties from './Novelties';
import UsuariosPage from './UsuariosPages';
import CargoPage from './cargoPages';
import AgregarCargoPage from './AgregarCargoPage';
import AgregarUsuarioPage from './UsuarioAgregar';
import Reports from './Reports';
import Stats from './Stats';
import FacialScan from './FacialScan';
import Settings from './Settings';
import Profile from './Profile';
import logoColpryst from '../../../assets/img/colpryst-icon.png'; // Asegúrate de tener esta imagen en la ruta correcta

function Dashboard() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [capitalizedDate, setCapitalizedDate] = useState('');

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();

      const date = now.toLocaleDateString('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });

      const time = now.toLocaleTimeString('es-ES', {
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit', // <-- Aquí agregamos los segundos
        hour12: true,
      });

      const fullDate = `${date} - ${time}`;
      setCapitalizedDate(fullDate.charAt(0).toUpperCase() + fullDate.slice(1));
    };

    updateDateTime(); // Llamado inmediato
    const intervalId = setInterval(updateDateTime, 1000); // <-- Actualiza cada segundo

    return () => clearInterval(intervalId); // Limpieza
  }, []);

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
                {/* <Shield className="w-6 h-6 text-blue-600" /> */}
                {/* <span className="text-xl font-bold">COLPRYST</span> */}
                <img src={logoColpryst} alt="COLPRYST Logo" className="h-8" />
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