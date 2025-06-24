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
    tipo_documento: '',
    numero_documento: '',
    nombre_empleado: '',
    direccion_empleado: '',
    telefono_empleado: '',
    email_empleado: '',
    usuarioadmin: '',
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
      if (!response.ok) throw new Error('Error al actualizar el perfil');
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
          {/* Tipo de Documento */}
          <div className="input-group">
            <label htmlFor="tipo_documento" className="block text-sm font-medium text-gray-700">
              Tipo de Documento
            </label>
            <select
              id="tipo_documento"
              name="tipo_documento"
              className="w-full rounded border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={userData.tipo_documento}
              onChange={handleChange}
              required
            >
              <option value="" disabled>Seleccione Tipo de Documento</option>
              <option value="CC">Cédula de Ciudadanía</option>
              <option value="TI">Tarjeta de Identidad</option>
              <option value="CE">Cédula de Extranjería</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Número de documento</label>
            <input
              type="text"
              name="numero_documento"
              value={userData.numero_documento}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Nombre completo</label>
            <input
              type="text"
              name="nombre_empleado"
              value={userData.nombre_empleado}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Dirección</label>
            <input
              type="text"
              name="direccion_empleado"
              value={userData.direccion_empleado}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Teléfono</label>
            <input
              type="tel"
              name="telefono_empleado"
              value={userData.telefono_empleado}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Correo electrónico</label>
            <input
              type="email"
              name="email_empleado"
              value={userData.email_empleado}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
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

export default Profile;