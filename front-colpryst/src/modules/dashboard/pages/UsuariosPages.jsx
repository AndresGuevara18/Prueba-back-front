import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../../../config/ConfigURL";

const UsuariosPage = () => {
  const navigate = useNavigate(); //navegar
  //estados para mostrar
  const [usuarios, setUsuarios] = useState([]);//lista completa usuarios
  //estados para bsucar
  const [idUsuarioBuscar, setIdUsuarioBuscar] = useState("");
  const [usuarioEncontrado, setUsuarioEncontrado] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  //estados editar
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
  const [usuarioAEditar, setUsuarioAEditar] = useState(null);
  const [formData, setFormData] = useState({ tipo_documento: "", numero_documento: "", nombre_empleado: "", 
    direccion_empelado: "", telefono_empleado: "", email_empleado: "", eps_empleado: "", usuarioadmin: "", 
    contrasenia: "", id_cargo: ""});
  

  //contantes fuera del componente
  const API_URL = `${API_BASE_URL}/api/usuarios`; //API de usuarios
  
  // Cargar todos los usuarios al iniciar
  const cargarTodosLosUsuarios = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Error al obtener los usuarios");
      const data = await response.json();
      setUsuarios(data);
    } catch (error) {
      console.error("Error cargando usuarios:", error);
    }
  };

  // Función para eliminar usuario
  const eliminarUsuario = async (id) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al eliminar el usuario");
      }

      alert(data.message || "Usuario eliminado correctamente");
      cargarTodosLosUsuarios(); // Recargar la lista de usuarios
    } catch (error) {
      console.error("Error eliminando usuario:", error);
      alert(error.message);
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

  // Función para abrir modal de edición
  const abrirModalEditar = (usuario) => {
    setUsuarioAEditar(usuario);
    setFormData({
      tipo_documento: usuario.tipo_documento,
      numero_documento: usuario.numero_documento,
      nombre_empleado: usuario.nombre_empleado,
      direccion_empelado: usuario.direccion_empelado,
      telefono_empleado: usuario.telefono_empleado,
      email_empleado: usuario.email_empleado,
      eps_empleado: usuario.eps_empleado,
      usuarioadmin: usuario.usuarioadmin,
      contrasenia: "", 
      id_cargo: usuario.id_cargo
    });
    setModalEditarAbierto(true);
  };

  // Función para manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Función para enviar la actualización
  const actualizarUsuario = async () => {
    try {
        // Preparar datos para enviar (la contraseña va vacía si no se modificó)
        const datosActualizacion = {
            ...formData,
            contrasenia: formData.contrasenia || undefined // Envía undefined si está vacío
        };

        const response = await fetch(`${API_URL}/${usuarioAEditar.id_usuario}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(datosActualizacion)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Error al actualizar el usuario");
        }

        alert(data.message || "✅ Usuario actualizado correctamente");
        setModalEditarAbierto(false);
        cargarTodosLosUsuarios();
    } catch (error) {
        console.error("Error actualizando usuario:", error);
        alert(`❌ ${error.message}`);
    }
  };


  // 🔹 Función para cerrar el modal
  const cerrarModal = () => {
    setModalAbierto(false);
    setIdUsuarioBuscar("");
  };

  useEffect(() => {
    cargarTodosLosUsuarios();
  }, []);

  return (
    <div className="font-sans text-center m-5 ml-46">
      <h1 className="text-3xl font-bold mb-4">Lista de Usuarios</h1>

      <div className="flex justify-center space-x-4 mb-4">
        {/* Botón para agregar usuario */}
        <button
          onClick={() => navigate("/dashboard/agregar-users")}
          className="bg-green-500 text-white px-4 py-2 rounded mb-4 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          ➕ Agregar Usuario
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

        <button
          onClick={() => navigate("/dashboard/cargos")}
          className="bg-blue-500 text-white px-4 py-2 rounded mb-4 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          📌 Ver Cargos
        </button>
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
            {usuarios.map((usuario) => (
              <tr key={usuario.id_usuario}>
                <td className="p-2 border border-black">{usuario.id_usuario}</td>
                <td className="p-2 border border-black">{usuario.numero_documento}</td>
                <td className="p-2 border border-black">{usuario.nombre_empleado}</td>
                <td className="p-2 border border-black">{usuario.telefono_empleado}</td>
                <td className="p-2 border border-black">{usuario.email_empleado}</td>
                <td className="p-2 border border-black">{usuario.usuarioadmin}</td>
                <td className="p-2 border border-black">{usuario.id_cargo}</td>
                <td className="p-2 border border-black whitespace-nowrap">
                  <div className="flex space-x-2">
                    <button className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                      onClick={() => abrirModalEditar(usuario)}
                    >
                      ✏️ Editar
                    </button>
                    <button className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                      onClick={() => eliminarUsuario(usuario.id_usuario)}
                    >
                      🗑 Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal para mostrar detalles del usuario */}
      {modalAbierto && usuarioEncontrado && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Detalles del Usuario</h2>
            
            <div className="space-y-2 text-left mb-4">
              <p><strong>ID:</strong> {usuarioEncontrado.id_usuario}</p>
              <p><strong>Número Documento:</strong> {usuarioEncontrado.numero_documento}</p>
              <p><strong>Nombre:</strong> {usuarioEncontrado.nombre_empleado}</p>
              <p><strong>Teléfono:</strong> {usuarioEncontrado.telefono_empleado}</p>
              <p><strong>Email:</strong> {usuarioEncontrado.email_empleado}</p>
              <p><strong>Cargo:</strong> {usuarioEncontrado.nombre_cargo}</p>
            </div>

            {/* Botones de acciones en el modal */}
            <div className="flex justify-end space-x-2">
              {/* Botón de editar (sin funcionalidad) onClick={() => alert("Función de editar no implementada aún")}*/}
              <button 
                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                onClick={() => {
                  setModalAbierto(false);
                  abrirModalEditar(usuarioEncontrado);
                }}
              >
                ✏️ Editar
              </button>
              
              {/* Botón de eliminar (funcional) */}
              <button 
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                onClick={() => {
                  eliminarUsuario(usuarioEncontrado.id_usuario);
                  cerrarModal();
                }}
              >
                🗑 Eliminar
              </button>
              
              {/* Botón de cerrar */}
              <button
                onClick={cerrarModal}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Modal para editar usuario */}
      {modalEditarAbierto && usuarioAEditar && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Editar Usuario</h2>

            <div className="space-y-3">
              {/* Tipo de Documento */}
              <div>
                <label className="block text-left mb-1">Tipo Documento:</label>
                <select
                  name="tipo_documento"
                  value={formData.tipo_documento}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="CC">Cédula de Ciudadanía</option>
                  <option value="CE">Cédula de Extranjería</option>
                  <option value="TI">Tarjeta de Identidad</option>
                  <option value="PA">Pasaporte</option>
                </select>
              </div>

              {/* Número de Documento */}
              <div>
                <label className="block text-left mb-1">Número Documento:</label>
                <input
                  type="text"
                  name="numero_documento"
                  value={formData.numero_documento}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>

              {/* Nombre Completo */}
              <div>
                <label className="block text-left mb-1">Nombre Completo:</label>
                <input
                  type="text"
                  name="nombre_empleado"
                  value={formData.nombre_empleado}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>

              {/* Dirección */}
              <div>
                <label className="block text-left mb-1">Dirección:</label>
                <input
                  type="text"
                  name="direccion_empelado"
                  value={formData.direccion_empelado}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>

              {/* Teléfono */}
              <div>
                <label className="block text-left mb-1">Teléfono:</label>
                <input
                  type="text"
                  name="telefono_empleado"
                  value={formData.telefono_empleado}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-left mb-1">Email:</label>
                <input
                  type="email"
                  name="email_empleado"
                  value={formData.email_empleado}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>

              {/* EPS */}
              <div>
                <label className="block text-left mb-1">EPS:</label>
                <input
                  type="text"
                  name="eps_empleado"
                  value={formData.eps_empleado}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>

              {/* Nombre de Usuario */}
              <div>
                <label className="block text-left mb-1">Usuario Admin:</label>
                <input
                  type="text"
                  name="usuarioadmin"
                  value={formData.usuarioadmin}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>

              {/* ID Cargo */}
              <div>
                <label className="block text-left mb-1">ID Cargo:</label>
                <input
                  type="number"
                  name="id_cargo"
                  value={formData.id_cargo}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>

              {/* Contraseña */}
              <div>
                <label className="block text-left mb-1">Contraseña (dejar vacío para no cambiar):</label>
                <input
                  type="password"
                  name="contrasenia"
                  value={formData.contrasenia}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  placeholder="Nueva contraseña"
                />
              </div>
            </div>
      
            <div className="mt-6 flex justify-end space-x-2">
              <button
                onClick={() => setModalEditarAbierto(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancelar
              </button>
              <button
                onClick={actualizarUsuario}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default UsuariosPage;
