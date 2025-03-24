import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../../../config/ConfigURL';

const UsuariosPage = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [cargos, setCargos] = useState([]); // Estado para almacenar los cargos
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); // Estado para el término de búsqueda
  const navigate = useNavigate();

  // URL del backend
  const API_URL = `${API_BASE_URL}/api/usuarios`;
  const API_CARGOS = `${API_BASE_URL}/api/cargos`;

  // Obtener usuarios y cargos desde el backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener usuarios
        const usuariosResponse = await fetch(API_URL);
        if (!usuariosResponse.ok) {
          throw new Error(`Error ${usuariosResponse.status}: ${usuariosResponse.statusText}`);
        }
        const usuariosData = await usuariosResponse.json();

        // Obtener cargos
        const cargosResponse = await fetch(API_CARGOS);
        if (!cargosResponse.ok) {
          throw new Error(`Error ${cargosResponse.status}: ${cargosResponse.statusText}`);
        }
        const cargosData = await cargosResponse.json();

        // Combinar usuarios con sus cargos
        const usuariosConCargos = usuariosData.map((usuario) => {
          const cargo = cargosData.find((c) => c.id_cargo === usuario.id_cargo);
          return {
            ...usuario,
            nombre_cargo: cargo ? cargo.nombre_cargo : 'Sin cargo',
          };
        });

        setUsuarios(usuariosConCargos);
        setCargos(cargosData);
      } catch (error) {
        console.error('❌ Error fetching data:', error);
        setError(error.message);
      }
    };

    fetchData();
  }, [API_URL, API_CARGOS]);

  // 🔹 Función para eliminar un usuario
  const handleDelete = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar este usuario?')) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('❌ Error al eliminar el usuario');
      setUsuarios(usuarios.filter((user) => user.id_usuario !== id)); // Actualizar estado
      alert('✅ Usuario eliminado correctamente.');
    } catch (error) {
      console.error('❌ Error al eliminar usuario:', error);
      alert('❌ No se pudo eliminar el usuario.');
    }
  };

  // 🔹 Función para buscar usuarios
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // 🔹 Filtrar usuarios según el término de búsqueda
  const filteredUsuarios = usuarios.filter((usuario) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      usuario.nombre_empleado.toLowerCase().includes(searchLower) ||
      usuario.numero_documento.toLowerCase().includes(searchLower) ||
      usuario.email_empleado.toLowerCase().includes(searchLower)
    );
  });

  // 🔹 Manejo de errores
  if (error) {
    return <div className="text-red-500 text-center mt-4">Error: {error}</div>;
  }

  return (
    <div className="font-sans text-center m-5 ml-46">
      <h1 className="text-3xl font-bold mb-4">Lista de Usuarios</h1>

      {/* 🔹 Contenedor para los botones */}
      <div className="flex justify-center space-x-4 mb-4">
        {/* Botón para agregar usuario */}
        <button
          onClick={() => navigate('/dashboard/agregar-users')}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          ➕ Agregar Usuario
        </button>

        {/* Campo de búsqueda */}
        <input
          type="text"
          placeholder="Buscar usuario..."
          className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={handleSearch}
        />

        {/* Botón para ir a CargoPage */}
        <button
          onClick={() => navigate('/dashboard/cargos')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          📌 Ver Cargos
        </button>
      </div>

      {/* 🔹 Tabla de usuarios */}
      <div className="table-container overflow-x-auto">
        <table className="w-full bg-white shadow-lg">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border border-black">ID</th>
              <th className="p-2 border border-black">Tipo Documento</th>
              <th className="p-2 border border-black">Número Documento</th>
              <th className="p-2 border border-black">Nombre</th>
              <th className="p-2 border border-black">Dirección</th>
              <th className="p-2 border border-black">Teléfono</th>
              <th className="p-2 border border-black">Email</th>
              <th className="p-2 border border-black">EPS</th>
              <th className="p-2 border border-black">Cargo</th>
              <th className="p-2 border border-black">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsuarios.map((usuario, index) => (
              <tr
                key={usuario.id_usuario}
                className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'} border-b`}
              >
                <td className="p-2 border border-black">{usuario.id_usuario}</td>
                <td className="p-2 border border-black">{usuario.tipo_documento}</td>
                <td className="p-2 border border-black">{usuario.numero_documento}</td>
                <td className="p-2 border border-black">{usuario.nombre_empleado}</td>
                <td className="p-2 border border-black">{usuario.direccion_empelado}</td>
                <td className="p-2 border border-black">{usuario.telefono_empleado}</td>
                <td className="p-2 border border-black">{usuario.email_empleado}</td>
                <td className="p-2 border border-black">{usuario.eps_empleado}</td>
                <td className="p-2 border border-black">{usuario.nombre_cargo}</td>
                <td className="p-2 border border-black">
                  <button
                    className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  >
                    ✏️ Editar
                  </button>
                  <button
                    onClick={() => handleDelete(usuario.id_usuario)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    🗑 Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsuariosPage;