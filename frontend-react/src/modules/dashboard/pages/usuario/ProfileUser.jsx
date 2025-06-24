//src/modules/dashboard/pages/usuario/ProfileUser.jsx
import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Building } from 'lucide-react';
import Swal from 'sweetalert2';
import API_BASE_URL from '../../../../config/ConfigURL';

async function getProfileData() {
  const token = sessionStorage.getItem('token');
  if (!token) throw new Error('No autenticado');
  const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!response.ok) throw new Error('No se pudo obtener el perfil');
  return await response.json();
}

function ProfileUser() {
  const [userData, setUserData] = useState({
    tipo_documento: '',
    numero_documento: '',
    nombre_empleado: '',
    direccion_empleado: '',
    telefono_empleado: '',
    email_empleado: '',
    usuarioadmin: '',
    cargo_user: '', // solo visualización
  });
  const [password, setPassword] = useState('');

  useEffect(() => {
    async function fetchProfile() {
      try {
        const data = await getProfileData();
        setUserData({
          tipo_documento: data.tipo_documento || '',
          numero_documento: data.numero_documento || '',
          nombre_empleado: data.nombre_empleado || data.usuarioadmin || '',
          direccion_empleado: data.direccion_empleado || '',
          telefono_empleado: data.telefono_empleado || '',
          email_empleado: data.email_empleado || '',
          usuarioadmin: data.usuarioadmin || '',
          cargo_user: data.cargo_user || '',
        });
      } catch (err) {
        Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo cargar el perfil' });
      }
    }
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem('token');
    try {
      const payload = { ...userData };
      if (password) payload.nueva_contrasena = password;
      const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        // Intentar extraer el mensaje de error específico del backend
        let errorMsg = 'No se pudo actualizar el perfil';
        try {
          const errorData = await response.json();
          if (errorData && (errorData.message || errorData.error)) {
            errorMsg = errorData.message || errorData.error;
          }
        } catch (jsonErr) {
          // Si no es JSON, mantener el mensaje genérico
        }
        Swal.fire({ icon: 'error', title: 'Error', text: errorMsg });
        return;
      }
      Swal.fire({
        icon: 'success',
        title: '¡Perfil actualizado!',
        text: 'Los cambios han sido guardados exitosamente',
        confirmButtonColor: '#3B82F6',
        timer: 3000,
        timerProgressBar: true
      });
      setPassword('');
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo actualizar el perfil' });
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Mi Perfil</h1>
      </div>
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <form onSubmit={handleSave} className="gap-6 grid grid-cols-1 md:grid-cols-2">
          {/* Nombre completo */}
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-gray-700">Nombre completo</label>
            <input
              type="text"
              name="nombre_empleado"
              value={userData.nombre_empleado}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* Dirección */}
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-gray-700">Dirección</label>
            <input
              type="text"
              name="direccion_empleado"
              value={userData.direccion_empleado}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* Correo electrónico */}
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-gray-700">Correo electrónico</label>
            <input
              type="email"
              name="email_empleado"
              value={userData.email_empleado}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* Usuario */}
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-gray-700">Usuario</label>
            <input
              type="text"
              name="usuarioadmin"
              value={userData.usuarioadmin}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* Nueva contraseña */}
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-gray-700">Nueva contraseña</label>
            <input
              type="password"
              name="nueva_contrasena"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Dejar en blanco para no cambiar"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoComplete="new-password"
            />
          </div>
          <div className="mt-4 flex justify-end md:col-span-2">
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-blue-500 text-white transition-colors hover:bg-blue-600"
            >
              Guardar cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProfileUser;
