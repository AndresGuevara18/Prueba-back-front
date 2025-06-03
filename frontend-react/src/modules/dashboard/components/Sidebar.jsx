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

function Sidebar({ isMobileMenuOpen, setIsMobileMenuOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const menuItems = [
    { icon: <Bell className="w-5 h-5" />, label: 'Novedades', path: '/dashboard' },
    { icon: <Users className="w-5 h-5" />, label: 'Usuarios', path: '/dashboard/users' },
    { icon: <FileText className="w-5 h-5" />, label: 'Reportes', path: '/dashboard/reports' },
    { icon: <BarChart2 className="w-5 h-5" />, label: 'Estadísticas', path: '/dashboard/stats' },
    { icon: <Camera className="w-5 h-5" />, label: 'Scanner Facial', path: '/dashboard/facial-scan' },
    { icon: <Settings className="w-5 h-5" />, label: 'Configuración', path: '/dashboard/settings' },
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
        logout(); // Borra el token
        navigate('/');
      }
    });
  };

  const MobileSidebar = () => (
    <div className={`fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`} onClick={() => setIsMobileMenuOpen(false)}>
      <div className="fixed inset-y-0 left-0 w-64 bg-[#2D3748] text-white" onClick={e => e.stopPropagation()}>
        <SidebarContent />
      </div>
    </div>
  );

  const DesktopSidebar = () => (
    <div className="hidden md:flex w-64 bg-[#2D3748] text-white min-h-screen flex-col">
      <SidebarContent />
    </div>
  );

  const SidebarContent = () => (
    <>
      <div className="p-6 text-center border-b border-gray-700">
        <div className="w-16 h-16 rounded-full bg-[#3182CE] text-white text-2xl font-semibold flex items-center justify-center mx-auto mb-4">
          AU
        </div>
        <h2 className="text-lg font-semibold">Usuario administrador</h2>
        <p className="text-sm text-gray-400">admin@colpryst.com</p>
      </div>

      <nav className="flex-1 p-4">
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={() => {
              navigate(item.path);
              setIsMobileMenuOpen(false);
            }}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-2 w-full ${
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

      <div className="p-4 border-t border-gray-700">
        <button 
          onClick={() => navigate('/dashboard/profile')}
          className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors w-full px-4 py-3 mb-2"
        >
          <User className="w-5 h-5" />
          Mi Perfil
        </button>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors w-full px-4 py-3"
        >
          <LogOut className="w-5 h-5" />
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