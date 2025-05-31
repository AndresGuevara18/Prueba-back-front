import React, { useState } from 'react';
import { User, Mail, Phone, Building, Camera } from 'lucide-react';
import Swal from 'sweetalert2';

function Profile() {
  const [userData, setUserData] = useState({
    name: 'Usuario Administrador',
    email: 'admin@colpryst.com',
    phone: '+57 300 123 4567',
    department: 'Administración',
    role: 'Administrador'
  });

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

      <div className="rounded-lg bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-8 md:flex-row">
          <div className="w-full md:w-1/3">
            <div className="flex flex-col items-center">
              <div className="mb-4 flex h-32 w-32 items-center justify-center rounded-full bg-[#3182CE] text-4xl font-semibold text-white">
                AU
              </div>
              <button className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-200">
                <Camera className="h-5 w-5" />
                Cambiar foto
              </button>
            </div>
          </div>

          <div className="w-full md:w-2/3">
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