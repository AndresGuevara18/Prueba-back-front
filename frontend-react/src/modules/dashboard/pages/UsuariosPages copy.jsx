import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../../../config/ConfigURL';

const UsuariosPage = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [cargos, setCargos] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [idUsuarioBuscar, setIdUsuarioBuscar] = useState("");
  const [usuarioEncontrado, setUsuarioEncontrado] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const navigate = useNavigate();

  //Definir constantes fuera del componente
  const API_URL = `${API_BASE_URL}/api/usuarios`;
  const API_CARGOS = `${API_BASE_URL}/api/cargos`;

  const cargarUsuarios = async (setUsuarios, setCargos, setError) => {
    try {
      const [usuariosResponse, cargosResponse] = await Promise.all([
        fetch(API_URL),
        fetch(API_CARGOS)
      ]);
      if (!usuariosResponse.ok || !cargosResponse.ok) {
        throw new Error('Error al obtener datos del servidor');
      }
      const [usuariosData, cargosData] = await Promise.all([
        usuariosResponse.json(),
        cargosResponse.json()
      ]);

      // 🔹 Unir usuarios con cargos
      const usuariosConCargos = usuariosData.map((usuario) => {
        const cargo = cargosData.find((c) => c.id_cargo === usuario.id_cargo);
        return { ...usuario, nombre_cargo: cargo ? cargo.nombre_cargo : 'Sin cargo' };
      });

      setUsuarios(usuariosConCargos);
      setCargos(cargosData);
    } catch (error) {
      console.error('❌ Error fetching data:', error);
      setError(error.message);
    }
  };

  // 🔹 Cargar usuarios al montar el componente
  useEffect(() => {
    cargarUsuarios(setUsuarios, setCargos, setError);
  }, []);

  // 🔹 Función para eliminar un usuario
  const eliminarUsuario = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar este usuario?")) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      const data = await response.json(); // Parsear la respuesta JSON

      if (!response.ok) {
        // Si hay un error, mostrar el mensaje de error del backend
        throw new Error(data.error || "Error al eliminar el usuario");
      }

      // Si la eliminación es exitosa, mostrar el mensaje de éxito
      alert(data.message || "✅ Usuario eliminado correctamente.");

      // Recargar la lista de usuarios
      cargarUsuarios(setUsuarios, setCargos, setError); // Recargar la lista después de eliminar
    } catch (error) {
      console.error("Error eliminando usuario:", error);
      alert(error.message); // Mostrar el mensaje de error
    }
  };

  //Función para buscar un usuario por docuemnto
  const buscarUsuario = async () => {
    if (!idUsuarioBuscar.trim()) {
        alert("⚠️ Ingrese el número de documento.");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${idUsuarioBuscar}`);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Usuario no encontrado");
        }

        const usuario = await response.json();
        
        
        setUsuarioEncontrado({
            ...usuario,
            nombre_cargo: usuario.cargo_user || 'Sin cargo' // Mapeo a la propiedad 
        });
        
        setModalAbierto(true);
    } catch (error) {
        console.error("Error buscando usuario:", error);
        alert(`❌ ${error.message}`);
        setIdUsuarioBuscar(""); // Limpiar el input
    }
};

  // 🔹 Función para cerrar el modal
  const cerrarModal = () => {
    setModalAbierto(false);
    setIdUsuarioBuscar("");
  };

  // 🔹 Filtrar usuarios según el término de búsqueda
  const filteredUsuarios = usuarios.filter((usuario) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      //usuario.nombre_empleado.toLowerCase().includes(searchLower) ||
      usuario.numero_documento.toLowerCase().includes(searchLower) 
      //usuario.email_empleado.toLowerCase().includes(searchLower)
    );
  });

  if (error) {
    return <div className="text-red-500 text-center mt-4">Error: {error}</div>;
  }

  return (
    <div className="font-sans text-center m-5 ml-46">
      <h1 className="text-3xl font-bold mb-4">Lista de Usuarios</h1>

      <div className="flex justify-center space-x-4 mb-4">
        {/* Botón para agregar usuario */}
        <button onClick={() => navigate('/dashboard/agregar-users')} 
          className="bg-green-500 text-white px-4 py-2 rounded mb-4 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
          >➕ Agregar Usuario
        </button>
        
        {/* Buscar usuario por ID */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Ingresar documento"
            value={idUsuarioBuscar}
            onChange={(e) => setIdUsuarioBuscar(e.target.value)}
            className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={buscarUsuario}
            className="ml-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            🔍 Buscar 
          </button>
        </div>
        
        <button onClick={() => navigate('/dashboard/cargos')} 
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"    
        >
          📌 Ver Cargos</button>
      </div>

      <div className="table-container overflow-x-auto">
        <table className="w-full bg-white shadow-lg">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border border-black">ID</th>
              <th className="p-2 border border-black">Número Documento</th>
              <th className="p-2 border border-black">Nombre</th>
              <th className="p-2 border border-black">Teléfono</th>
              <th className="p-2 border border-black">Email</th>
              <th className="p-2 border border-black">Usuario</th>
              <th className="p-2 border border-black">Cargo</th>
              <th className="p-2 border border-black">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsuarios.map((usuario, index) => (
              <tr key={usuario.id_usuario} className={`${index % 2 === 0 ? "bg-white" : "bg-gray-100"} border-b`}>
                <td className="p-2 border border-black">{usuario.id_usuario}</td>
                <td className="p-2 border border-black">{usuario.numero_documento}</td>
                <td className="p-2 border border-black">{usuario.nombre_empleado}</td>
                <td className="p-2 border border-black">{usuario.telefono_empleado}</td>
                <td className="p-2 border border-black">{usuario.email_empleado}</td>
                <td className="p-2 border border-black">{usuario.usuarioadmin}</td>
                <td className="p-2 border border-black">{usuario.nombre_cargo}</td>
                <td className="p-2 border border-black">
                  <button className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600">✏️ Editar</button>
                  <button onClick={() => eliminarUsuario(usuario.id_usuario)} className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">🗑 Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal para mostrar detalles del usuario */}
      {modalAbierto && usuarioEncontrado && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-xl font-bold mb-4">Detalles del Usuario</h2>
            <p>
              <strong>ID:</strong> {usuarioEncontrado.id_usuario}
            </p>
            <p>
              <strong>Número Documento:</strong> {usuarioEncontrado.numero_documento}
            </p>
            <p>
              <strong>Nombre:</strong> {usuarioEncontrado.nombre_empleado}
            </p>
            <p>
              <strong>Teléfono:</strong> {usuarioEncontrado.telefono_empleado}
            </p>
            <p>
              <strong>Email:</strong> {usuarioEncontrado.email_empleado}
            </p>
            <p>
              <strong>Cargo:</strong> {usuarioEncontrado.cargo_user}
            </p>
            <button
              onClick={cerrarModal}
              className="mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsuariosPage;