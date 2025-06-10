//src/modules/dashboard/pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Building } from 'lucide-react';
import Swal from 'sweetalert2';
import API_BASE_URL from '../../../config/ConfigURL';


async function getProfileData() {
  console.log("en getProfileData");
  console.log("API_BASE_URL:", API_BASE_URL);
  console.log("token:", sessionStorage.getItem('token'));
  const token = sessionStorage.getItem('token');
  if (!token) throw new Error('No autenticado');
  const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
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

  useEffect(() => {
    async function fetchProfile() {
      try {
        const data = await getProfileData();
        setUserData({
          name: data.nombre_empleado || data.usuarioadmin || '',
          email: data.email_empleado || '',
          phone: data.telefono_empleado || '',
          department: data.cargo_user || '',
          role: data.id_cargo === 1 ? 'Administrador' : data.id_cargo === 2 ? 'Supervisor' : 'Empleado',
        });
      } catch (err) {
        Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo cargar el perfil' });
      }
    }
    fetchProfile();
  }, []);

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
        <h1 className="text-2xl font-bold text-gray-800">Mi Perfil!</h1>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-8 md:flex-row">
          <div className="w-full">
            <form onSubmit={handleSave} className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Nombre completo
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={userData.name}
                    onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Correo electrónico
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={userData.email}
                    onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Teléfono
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={userData.phone}
                    onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Phone className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Departamento
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={userData.department}
                    onChange={(e) => setUserData({ ...userData, department: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Building className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="rounded-lg bg-blue-500 px-6 py-2 text-white transition-colors hover:bg-blue-600"
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