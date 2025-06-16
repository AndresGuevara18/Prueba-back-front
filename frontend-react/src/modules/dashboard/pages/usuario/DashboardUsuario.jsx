//src/modules/dashboard/pages/usuario/DashboardUsuario.jsx
import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import MenuUsuario from '../../components/MenuUsuario';
import logoColpryst from '../../../../assets/img/colpryst-icon.png';

import PerfilUsuario from './ProfileUser';
import HistorialUsuario from './HistorialUsuario';
import IncidenciasUsuario from './IncidenciasUsuario';
import AsistenciaUsuario from './AsistenciaUsuario';

function DashboardUsuario() {
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
        second: '2-digit',
        hour12: true,
      });
      const fullDate = `${date} - ${time}`;
      setCapitalizedDate(fullDate.charAt(0).toUpperCase() + fullDate.slice(1));
    };
    updateDateTime();
    const intervalId = setInterval(updateDateTime, 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    if (location.pathname.startsWith('/dashboard-usuario')) {
      localStorage.setItem('dashboardUsuarioLastPath', location.pathname + location.search);
    } else {
      localStorage.removeItem('dashboardUsuarioLastPath');
    }
  }, [location]);

  useEffect(() => {
    const lastPath = localStorage.getItem('dashboardUsuarioLastPath');
    if (
      lastPath &&
      lastPath !== location.pathname &&
      lastPath.startsWith('/dashboard-usuario') &&
      (location.pathname === '/dashboard-usuario' || location.pathname === '/dashboard-usuario/')
    ) {
      navigate(lastPath, { replace: true });
    }
  }, []);

  useEffect(() => {
    // Redirigir automáticamente al perfil al ingresar al dashboard de usuario
    if (location.pathname === '/dashboard-usuario' || location.pathname === '/dashboard-usuario/') {
      navigate('/dashboard-usuario/perfil', { replace: true });
    }
  }, [location, navigate]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <MenuUsuario isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />
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
            <Route path="asistencia" element={<AsistenciaUsuario />} />
            <Route path="historial" element={<HistorialUsuario />} />
            <Route path="incidencias" element={<IncidenciasUsuario />} />
            <Route path="perfil" element={<PerfilUsuario />} />
            <Route index element={<PerfilUsuario />} />
            <Route path="*" element={<PerfilUsuario />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default DashboardUsuario;
