//src/modules/dashboard/components/Sidebar.jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Bell, 
  Users, 
  BarChart2, 
  Settings, 
  LogOut,
  Camera,
  FileText,
  User,
  Menu
} from 'lucide-react';
import Swal from 'sweetalert2';
import { logout } from '../../../components/ProtectedRoute';
import API_BASE_URL from '../../../config/ConfigURL';

function Sidebar({ isMobileMenuOpen, setIsMobileMenuOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  // Lógica de perfil de usuario (antes en useUserProfile)
  const [profile, setProfile] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

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
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const menuItems = [
    { icon: <Bell className="h-5 w-5" />, label: 'Novedades', path: '/dashboard' },
    { icon: <Users className="h-5 w-5" />, label: 'Usuarios', path: '/dashboard/users' },
    { icon: <FileText className="h-5 w-5" />, label: 'Reportes', path: '/dashboard/reports' },
    { icon: <BarChart2 className="h-5 w-5" />, label: 'Estadísticas', path: '/dashboard/stats' },
    { icon: <Camera className="h-5 w-5" />, label: 'Scanner Facial', path: '/dashboard/facial-scan' },
    { icon: <Settings className="h-5 w-5" />, label: 'Configuración', path: '/dashboard/settings' },
  ];

  const handleLogout = () => {
    Swal.fire({
      title: '¿Cerrar sesión?',
      text: '¿Está seguro que desea cerrar la sesión?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3B82F6',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        logout(); // Borra el token y cierra sesión correctamente
        navigate('/');
      }
    });
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
          {loading ? 'Cargando...' : (profile ? profile.email_empleado : 'correo@colpryst.com')}
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
              setIsMobileMenuOpen(false);
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
          onClick={() => navigate('/dashboard/profile')}
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

export default Sidebar;