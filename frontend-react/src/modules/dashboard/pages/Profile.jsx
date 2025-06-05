//src/modules/dashboard/pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Building } from 'lucide-react';
import Swal from 'sweetalert2';
import API_BASE_URL from '../../../config/ConfigURL';
import { useUser } from '../components/UserContext';


async function getProfileData() {
  console.log("en getProfileData");
  console.log("API_BASE_URL:", API_BASE_URL);
  console.log("token:", localStorage.getItem('token'));
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No autenticado');
  const response = await fetch(`${API_BASE_URL}/api/usuarios/profile`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!response.ok) throw new Error('No se pudo obtener el perfil');
  return await response.json();
}

function Profile() {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    role: ''
  });
  const { updateUser } = useUser();

  useEffect(() => {
    async function fetchProfile() {
      try {
        const data = await getProfileData();
        const profile = {
          name: data.nombre_empleado || data.usuarioadmin || '',
          email: data.email_empleado || '',
          phone: data.telefono_empleado || '',
          department: data.cargo_user || '',
          role: data.id_cargo === 1 ? 'Administrador' : data.id_cargo === 2 ? 'Supervisor' : 'Empleado',
        };
        setUserData(profile);
        updateUser(profile); // Guardar en contexto y localStorage
      } catch (err) {
        Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo cargar el perfil' });
      }
    }
    fetchProfile();
  }, [updateUser]);

  const handleSave = (e) => {
    e.preventDefault();
    Swal.fire({
      icon: 'success',
      title: '¡Perfil actualizado!',
      text: 'Los cambios han sido guardados exitosamente',
      confirmButtonColor: '#3B82F6',
      timer: 3000,
      timerProgressBar: true
    });
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Mi Perfil</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full">
            <form onSubmit={handleSave} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre completo
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={userData.name}
                    onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Correo electrónico
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={userData.email}
                    onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={userData.phone}
                    onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Departamento
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={userData.department}
                    onChange={(e) => setUserData({ ...userData, department: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Guardar cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;