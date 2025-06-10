import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
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
  const location = useLocation();
  const navigate = useNavigate();

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

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  // Guardar la ruta interna actual del dashboard en localStorage
  useEffect(() => {
    if (location.pathname.startsWith('/dashboard')) {
      localStorage.setItem('dashboardLastPath', location.pathname + location.search);
    }
    // Limpiar la ruta guardada si el usuario sale del dashboard
    else {
      localStorage.removeItem('dashboardLastPath');
    }
  }, [location]);

  // Al montar, restaurar la última ruta interna si existe y es diferente a la actual
  useEffect(() => {
    const lastPath = localStorage.getItem('dashboardLastPath');
    // Solo redirige si estamos exactamente en /dashboard (sin subruta)
    if (
      lastPath &&
      lastPath !== location.pathname &&
      lastPath.startsWith('/dashboard') &&
      (location.pathname === '/dashboard' || location.pathname === '/dashboard/')
    ) {
      navigate(lastPath, { replace: true });
    }
    // eslint-disable-next-line
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
          <div className="flex items-center justify-between px-4 py-4 md:px-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="rounded-md p-2 text-gray-700 hover:bg-gray-100 md:hidden"
              >
                <Menu className="h-6 w-6" />
              </button>
              <Link to="/" className="flex items-center gap-2 transition-colors hover:text-blue-700">
                {/* <Shield className="w-6 h-6 text-blue-600" /> */}
                {/* <span className="text-xl font-bold">COLPRYST</span> */}
                <img src={logoColpryst} alt="COLPRYST Logo" className="h-8" />
              </Link>
            </div>
            <div className="text-sm text-gray-700 md:text-base">
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