import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Bell, FileText, User, LogOut } from 'lucide-react';

function MenuUsuario({ isMobileMenuOpen, setIsMobileMenuOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const [profile, setProfile] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

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
    { icon: <Bell className="h-5 w-5" />, label: 'Incidencias', path: '/dashboard-usuario/incidencias' },
    { icon: <FileText className="h-5 w-5" />, label: 'Historial', path: '/dashboard-usuario/historial' },
    
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
    <div className="hidden min-h-screen w-64 flex-col bg-[#2D3748] text-white md:flex">
      <SidebarContent />
    </div>
  );

  const SidebarContent = () => (
    <>
      <div className="border-b border-gray-700 p-6 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#3182CE] text-2xl font-semibold text-white">
          {profile && profile.nombre_empleado ? profile.nombre_empleado[0] : 'U'}
        </div>
        <h2 className="text-lg font-semibold">
          {loading ? 'Cargando...' : (profile ? profile.nombre_empleado : 'Usuario')}
        </h2>
        <p className="text-sm text-gray-400">
          {loading ? 'Cargando...' : (profile ? profile.email_empleado || profile.usuarioadmin || 'correo@colpryst.com' : 'correo@colpryst.com')}
        </p>
        <p className="mt-1 text-xs text-gray-400">
          {loading ? '' : (profile ? (profile.cargo_user || 'Sin rol') : '')}
        </p>
      </div>
      <nav className="flex-1 p-4">
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={() => {
              navigate(item.path);
              setIsMobileMenuOpen && setIsMobileMenuOpen(false);
            }}
            className={`mb-2 flex w-full items-center gap-3 rounded-lg px-4 py-3 ${
              currentPath === item.path
                ? 'bg-[#3182CE] text-white'
                : 'text-gray-400 hover:bg-gray-700 hover:text-white'
            } transition-colors`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>
      <div className="border-t border-gray-700 p-4">
        <button
          onClick={() => navigate('/dashboard-usuario/perfil')}
          className="mb-2 flex w-full items-center gap-3 px-4 py-3 text-gray-400 transition-colors hover:text-white"
        >
          <User className="h-5 w-5" />
          Mi Perfil
        </button>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-4 py-3 text-gray-400 transition-colors hover:text-white"
        >
          <LogOut className="h-5 w-5" />
          Cerrar Sesión
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
