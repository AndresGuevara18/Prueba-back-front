import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Bell, FileText, User, LogOut } from 'lucide-react';

function MenuUsuario({ isMobileMenuOpen, setIsMobileMenuOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const [profile, setProfile] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  React.useEffect(() => {
    async function fetchProfile() {
      try {
        const token = sessionStorage.getItem('token');
        if (!token) throw new Error('No autenticado');
        const response = await fetch(`/api/auth/profile`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('No se pudo obtener el perfil');
        const data = await response.json();
        setProfile(data);
      } catch (err) {
        setProfile(null);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const menuItems = [
    { icon: <User className="h-5 w-5" />, label: 'Mi Asistencia', path: '/dashboard-usuario/asistencia' },
    { icon: <FileText className="h-5 w-5" />, label: 'Historial', path: '/dashboard-usuario/historial' },
    { icon: <Bell className="h-5 w-5" />, label: 'Incidencias', path: '/dashboard-usuario/incidencias' },
  ];

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const MobileSidebar = () => (
    <div className={`fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`} onClick={() => setIsMobileMenuOpen(false)}>
      <div className="fixed inset-y-0 left-0 w-64 bg-[#2D3748] text-white" onClick={e => e.stopPropagation()}>
        <SidebarContent />
      </div>
    </div>
  );

  const DesktopSidebar = () => (
    <div
      className={`hidden min-h-screen flex-col bg-[#2D3748] text-white md:flex transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-16'}`}
      onMouseEnter={() => setIsSidebarOpen(true)}
      onMouseLeave={() => setIsSidebarOpen(false)}
    >
      <SidebarContent isSidebarOpen={isSidebarOpen} />
    </div>
  );

  const SidebarContent = ({ isSidebarOpen }) => (
    <>
      <div className={`border-b border-gray-700 p-6 text-center transition-all duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 h-0 p-0 overflow-hidden'}`}>
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#3182CE] text-2xl font-semibold text-white">
          {profile && profile.nombre_empleado ? profile.nombre_empleado[0] : 'U'}
        </div>
        {isSidebarOpen && (
          <>
            <h2 className="text-lg font-semibold">
              {loading ? 'Cargando...' : (profile ? profile.nombre_empleado : 'Usuario')}
            </h2>
            <p className="text-sm text-gray-400">
              {loading ? 'Cargando...' : (profile ? profile.email_empleado || profile.usuarioadmin || 'correo@colpryst.com' : 'correo@colpryst.com')}
            </p>
            <p className="mt-1 text-xs text-gray-400">
              {loading ? '' : (profile ? (profile.cargo_user || 'Sin rol') : '')}
            </p>
          </>
        )}
      </div>
      <nav className={`flex-1 p-4 flex flex-col ${isSidebarOpen ? 'items-start' : 'items-center'}`}>
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={() => {
              navigate(item.path);
              setIsMobileMenuOpen && setIsMobileMenuOpen(false);
            }}
            className={`mb-2 flex items-center rounded-lg px-0 py-3 transition-all duration-300 w-full ${
              isSidebarOpen ? 'justify-start' : 'justify-center'
            } ${
              currentPath === item.path
                ? 'bg-[#3182CE] text-white'
                : 'text-gray-400 hover:bg-gray-700 hover:text-white'
            }`}
            style={{ minWidth: isSidebarOpen ? '100%' : 'auto' }}
          >
            <span className={`flex items-center justify-center ${isSidebarOpen ? 'w-12' : 'w-full'} transition-all duration-300`}>{item.icon}</span>
            <span className={`ml-1 transition-all duration-300 ${isSidebarOpen ? 'inline' : 'hidden'}`}>{item.label}</span>
          </button>
        ))}
      </nav>
      <div className={`border-t border-gray-700 p-4 transition-all duration-300 flex flex-col ${isSidebarOpen ? 'items-start' : 'items-center'}`}> 
        <button
          onClick={() => navigate('/dashboard-usuario/perfil')}
          className={`mb-2 flex items-center rounded-lg px-0 py-3 w-full ${isSidebarOpen ? 'justify-start' : 'justify-center'} text-gray-400 transition-colors hover:text-white`}
        >
          <span className={`flex items-center justify-center ${isSidebarOpen ? 'w-12' : 'w-full'} transition-all duration-300`}><User className="h-5 w-5" /></span>
          <span className={`${isSidebarOpen ? 'inline' : 'hidden'} ml-1`}>Mi Perfil</span>
        </button>
        <button
          onClick={handleLogout}
          className={`flex items-center rounded-lg px-0 py-3 w-full ${isSidebarOpen ? 'justify-start' : 'justify-center'} text-gray-400 transition-colors hover:text-white`}
        >
          <span className={`flex items-center justify-center ${isSidebarOpen ? 'w-12' : 'w-full'} transition-all duration-300`}><LogOut className="h-5 w-5" /></span>
          <span className={`${isSidebarOpen ? 'inline' : 'hidden'} ml-1`}>Cerrar Sesión</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      <MobileSidebar />
      <DesktopSidebar />
    </>
  );
}

export default MenuUsuario;
