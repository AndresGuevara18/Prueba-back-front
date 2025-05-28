import React, { useState, useEffect } from 'react';
import { Bell, Search, Mail, Users, BarChart2, Settings, LogOut, Plus, Pencil, Trash2, X, Check, Camera, Menu, Shield } from 'lucide-react';
import { Link, useNavigate, useLocation, Routes, Route } from 'react-router-dom';
import Stats from './Stats';
import SettingsPage from './Settings';
import Swal from 'sweetalert2';

// Componente Modal de Nuevo Usuario
function NewUserModal({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: 'ÉL',
    documentType: 'DNI',
    documentNumber: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      id: Date.now(),
      document: `${formData.documentType} ${formData.documentNumber}`
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-[500px] mx-4">
        <h2 className="text-2xl font-bold mb-6">Nuevo usuario</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Nombre:</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Correo electrónico:</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Teléfono:</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Departamento:</label>
            <select
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ÉL">ÉL</option>
              <option value="RRHH">RRHH</option>
              <option value="Ventas">Ventas</option>
              <option value="Marketing">Marketing</option>
              <option value="IT">IT</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Tipo de documento:</label>
            <select
              value={formData.documentType}
              onChange={(e) => setFormData({ ...formData, documentType: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="DNI">DNI</option>
              <option value="CE">CE</option>
              <option value="Pasaporte">Pasaporte</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Número de documento:</label>
            <input
              type="text"
              value={formData.documentNumber}
              onChange={(e) => setFormData({ ...formData, documentNumber: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="button"
            className="w-full bg-emerald-500 text-white py-3 rounded-lg hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2 mb-4"
          >
            <Camera className="w-5 h-5" />
            Iniciar Escaneo Facial
          </button>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Componente Modal de Edición
function EditUserModal({ isOpen, onClose, user, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: 'ÉL'
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        department: user.department || 'ÉL'
      });
    }
  }, [user]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...user,
      ...formData
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-[500px] mx-4 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold mb-6">Editar usuario</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre:</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico:</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono:</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Departamento:</label>
            <select 
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ÉL">ÉL</option>
              <option value="RRHH">RRHH</option>
              <option value="Ventas">Ventas</option>
              <option value="Marketing">Marketing</option>
              <option value="IT">IT</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function NovedadesContent() {
  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Novedades de Asistencia</h1>
      </div>

      {/* Barra de búsqueda */}
      <div className="bg-white rounded-lg shadow-sm mb-8">
        <div className="flex flex-col md:flex-row items-center p-4 gap-4">
          <div className="flex items-center w-full md:w-auto flex-1">
            <Search className="text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por nombre o descripción..."
              className="flex-1 ml-3 outline-none w-full"
            />
          </div>
          <select className="w-full md:w-auto px-4 py-2 border border-gray-200 rounded-lg text-gray-600">
            <option>Hoy</option>
            <option>Ayer</option>
            <option>Esta semana</option>
            <option>Este mes</option>
          </select>
        </div>
      </div>

      {/* Área de contenido */}
      <div className="bg-white rounded-lg shadow-sm p-6 min-h-[400px]">
        <div className="text-center text-gray-500 mt-8">
          No hay novedades para mostrar
        </div>
      </div>
    </div>
  );
}

// Componente UsersContent
function UsersContent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);
  const [isNewUserModalOpen, setIsNewUserModalOpen] = useState(false);
  
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'Juan Pérez',
      email: 'juan@ejemplo.com',
      phone: '+1234567890',
      department: 'ÉL',
      document: 'DNI 12345678'
    },
    {
      id: 2,
      name: 'María García',
      email: 'maria@ejemplo.com',
      phone: '+1234567891',
      department: 'RRHH',
      document: 'CE87654321'
    },
    {
      id: 3,
      name: 'Carlos López',
      email: 'carlos@ejemplo.com',
      phone: '+1234567892',
      department: 'Ventas',
      document: 'DNI 98765432'
    }
  ]);

  const handleSaveUser = (updatedUser) => {
    setUsers(users.map(user => 
      user.id === updatedUser.id ? updatedUser : user
    ));
    
    // Mostrar alerta de éxito con SweetAlert2
    Swal.fire({
      icon: 'success',
      title: '¡Usuario actualizado!',
      text: `El usuario ${updatedUser.name} ha sido actualizado exitosamente`,
      confirmButtonColor: '#3B82F6',
      timer: 3000,
      timerProgressBar: true
    });
  };

  const confirmDeleteUser = (user) => {
    Swal.fire({
      title: '¿Está seguro?',
      text: `¿Desea eliminar al usuario ${user.name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Eliminar el usuario
        setUsers(users.filter(u => u.id !== user.id));
        
        // Mostrar mensaje de éxito
        Swal.fire({
          icon: 'success',
          title: '¡Eliminado!',
          text: `El usuario ${user.name} ha sido eliminado exitosamente`,
          confirmButtonColor: '#3B82F6',
          timer: 2000,
          timerProgressBar: true
        });
      }
    });
  };

  const handleAddUser = (newUser) => {
    setUsers([...users, newUser]);
    
    // Mostrar alerta de éxito con SweetAlert2
    Swal.fire({
      icon: 'success',
      title: '¡Usuario agregado!',
      text: `El usuario ${newUser.name} ha sido agregado exitosamente`,
      confirmButtonColor: '#3B82F6',
      timer: 3000,
      timerProgressBar: true,
      toast: true,
      position: 'top-end'
    });
  };

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Usuarios</h1>
      </div>

      {/* Barra de búsqueda y filtros */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="flex-1 relative w-full">
            <input
              type="text"
              placeholder="Buscar por nombre, correo electrónico o documento..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <select className="w-full md:w-auto px-4 py-2 border border-gray-200 rounded-lg text-gray-600">
              <option>Todas las áreas</option>
            </select>
            <select className="w-full md:w-auto px-4 py-2 border border-gray-200 rounded-lg text-gray-600">
              <option>Todos los documentos</option>
            </select>
            <button 
              onClick={() => setIsNewUserModalOpen(true)}
              className="w-full md:w-auto bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Tabla de usuarios */}
      <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                IDENTIFICACIÓN
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Correo electrónico
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Teléfono
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Departamento
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Documento
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.phone}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.department}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.document}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setEditingUser(user)}
                      className="p-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => confirmDeleteUser(user)}
                      className="p-1.5 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de nuevo usuario */}
      <NewUserModal
        isOpen={isNewUserModalOpen}
        onClose={() => setIsNewUserModalOpen(false)}
        onSave={handleAddUser}
      />

      {/* Modal de edición */}
      <EditUserModal
        isOpen={editingUser !== null}
        onClose={() => setEditingUser(null)}
        user={editingUser}
        onSave={handleSaveUser}
      />
    </div>
  );
}

// Componente de la barra lateral
function Sidebar({ isMobileMenuOpen, setIsMobileMenuOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const menuItems = [
    { icon: <Mail className="w-5 h-5" />, label: 'Novedades', path: '/dashboard' },
    { icon: <Users className="w-5 h-5" />, label: 'Usuarios', path: '/dashboard/users' },
    { icon: <BarChart2 className="w-5 h-5" />, label: 'Estadísticas', path: '/dashboard/stats' },
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
        navigate('/');
      }
    });
  };

  // Versión móvil del sidebar
  const MobileSidebar = () => (
    <div className={`fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`} onClick={() => setIsMobileMenuOpen(false)}>
      <div className="fixed inset-y-0 left-0 w-64 bg-[#2D3748] text-white" onClick={e => e.stopPropagation()}>
        <div className="p-6 text-center border-b border-gray-700">
          <div className="w-16 h-16 rounded-full bg-[#3182CE] text-white text-2xl font-semibold flex items-center justify-center mx-auto mb-4">
            AU
          </div>
          <h2 className="text-lg font-semibold">Usuario administrador</h2>
          <p className="text-sm text-gray-400">asdf@fs</p>
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
            onClick={handleLogout}
            className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors w-full px-4 py-3"
          >
            <LogOut className="w-5 h-5" />
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );

  // Versión desktop del sidebar
  const DesktopSidebar = () => (
    <div className="hidden md:flex w-64 bg-[#2D3748] text-white min-h-screen flex-col">
      <div className="p-6 text-center border-b border-gray-700">
        <div className="w-16 h-16 rounded-full bg-[#3182CE] text-white text-2xl font-semibold flex items-center justify-center mx-auto mb-4">
          AU
        </div>
        <h2 className="text-lg font-semibold">Usuario administrador</h2>
        <p className="text-sm text-gray-400">asdf@fs</p>
      </div>

      <nav className="flex-1 p-4">
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={() => navigate(item.path)}
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
          onClick={handleLogout}
          className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors w-full px-4 py-3"
        >
          <LogOut className="w-5 h-5" />
          Cerrar Sesión
        </button>
      </div>
    </div>
  );

  return (
    <>
      <MobileSidebar />
      <DesktopSidebar />
    </>
  );
}

// Componente principal del Dashboard
function Dashboard() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const formattedDate = currentDate.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />
      
      <div className="flex-1">
        {/* Barra superior */}
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

        {/* Contenido principal */}
        <div className="p-4 md:p-8">
          <Routes>
            <Route path="/" element={<NovedadesContent />} />
            <Route path="/users" element={<UsersContent />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;