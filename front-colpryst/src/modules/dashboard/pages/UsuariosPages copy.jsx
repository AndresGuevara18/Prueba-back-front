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
    return <div className="mt-4 text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="ml-46 m-5 text-center font-sans">
      <h1 className="mb-4 text-3xl font-bold">Lista de Usuarios</h1>

      <div className="mb-4 flex justify-center space-x-4">
        {/* Botón para agregar usuario */}
        <button onClick={() => navigate('/dashboard/agregar-users')} 
          className="mb-4 rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
          >➕ Agregar Usuario
        </button>
        
        {/* Buscar usuario por ID */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Ingresar documento"
            value={idUsuarioBuscar}
            onChange={(e) => setIdUsuarioBuscar(e.target.value)}
            className="rounded border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={buscarUsuario}
            className="ml-2 rounded bg-blue-500 p-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            🔍 Buscar 
          </button>
        </div>
        
        <button onClick={() => navigate('/dashboard/cargos')} 
        className="mb-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"    
        >
          📌 Ver Cargos</button>
      </div>

      <div className="table-container overflow-x-auto">
        <table className="w-full bg-white shadow-lg">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-black p-2">ID</th>
              <th className="border border-black p-2">Número Documento</th>
              <th className="border border-black p-2">Nombre</th>
              <th className="border border-black p-2">Teléfono</th>
              <th className="border border-black p-2">Email</th>
              <th className="border border-black p-2">Usuario</th>
              <th className="border border-black p-2">Cargo</th>
              <th className="border border-black p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsuarios.map((usuario, index) => (
              <tr key={usuario.id_usuario} className={`${index % 2 === 0 ? "bg-white" : "bg-gray-100"} border-b`}>
                <td className="border border-black p-2">{usuario.id_usuario}</td>
                <td className="border border-black p-2">{usuario.numero_documento}</td>
                <td className="border border-black p-2">{usuario.nombre_empleado}</td>
                <td className="border border-black p-2">{usuario.telefono_empleado}</td>
                <td className="border border-black p-2">{usuario.email_empleado}</td>
                <td className="border border-black p-2">{usuario.usuarioadmin}</td>
                <td className="border border-black p-2">{usuario.nombre_cargo}</td>
                <td className="border border-black p-2">
                  <button className="mr-2 rounded bg-yellow-500 px-2 py-1 text-white hover:bg-yellow-600">✏️ Editar</button>
                  <button onClick={() => eliminarUsuario(usuario.id_usuario)} className="rounded bg-red-500 px-2 py-1 text-white hover:bg-red-600">🗑 Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal para mostrar detalles del usuario */}
      {modalAbierto && usuarioEncontrado && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="rounded bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-bold">Detalles del Usuario</h2>
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
              className="mt-4 rounded bg-blue-500 p-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
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