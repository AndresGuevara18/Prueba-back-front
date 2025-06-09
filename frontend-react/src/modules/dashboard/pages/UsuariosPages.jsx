//src/modules/dashboard/pages/UsuariosPages.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../../../config/ConfigURL";
import Swal from 'sweetalert2';

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
    direccion_empleado: "", telefono_empleado: "", email_empleado: "", eps_empleado: "", usuarioadmin: "", 
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
    const result = await Swal.fire({
      title: '¿Estás seguro de que deseas eliminar este usuario?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
    });
    if (!result.isConfirmed) return;
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Error al eliminar el usuario");
      }
      Swal.fire({
        icon: 'success',
        title: 'Usuario eliminado',
        text: data.message || 'Usuario eliminado correctamente',
        timer: 1500,
        showConfirmButton: false
      });
      cargarTodosLosUsuarios();
    } catch (error) {
      console.error("Error eliminando usuario:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message
      });
    }
  };

  
  //Función para buscar un usuario por docuemnto
  const buscarUsuario = async () => {
    if (!idUsuarioBuscar.trim()) {
        Swal.fire({
          icon: 'warning',
          title: 'Campo requerido',
          text: '⚠️ Ingrese el número de documento.'
        });
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
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `❌ ${error.message}`
        });
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
      direccion_empleado: usuario.direccion_empleado,
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
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: `❌ ${data.message}`
          });
          return;
      }
      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: data.message || "✅ Usuario actualizado correctamente"
      });
      setModalEditarAbierto(false);
      cargarTodosLosUsuarios();
    } catch (error) {
        console.error("Error actualizando usuario:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `❌Error ${error.message}`
        });
    }
  };


  // 🔹 Función para cerrar el modal
  const cerrarModal = () => {
    setModalAbierto(false);
    setIdUsuarioBuscar("");
  };

  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  // Estado para búsqueda por nombre
  const [searchTerm, setSearchTerm] = useState("");

  // Filtrar usuarios por nombre
  const filteredUsuarios = usuarios.filter(usuario =>
    usuario.nombre_empleado?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calcular datos de paginación sobre los filtrados
  const totalPages = Math.ceil(filteredUsuarios.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsuarios.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    cargarTodosLosUsuarios();
    document.title = "COLPRYST | Usuarios";
    // eslint-disable-next-line
  }, []);

  return (
    <div className="ml-46 m-5 text-center font-sans">
      <h1 className="mb-4 text-3xl font-bold">Lista de Usuarios</h1>

      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        {/* Input: Buscar por nombre a la izquierda */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={searchTerm}
            onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Botones a la derecha */}
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => navigate("/dashboard/agregar-users")}
            className="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            ➕ Agregar Usuario
          </button>
          <div className="flex items-center gap-0">
            <input
              type="text"
              placeholder="Ingresar documento"
              value={idUsuarioBuscar}
              onChange={(e) => setIdUsuarioBuscar(e.target.value)}
              className="p-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={buscarUsuario}
              className="p-2 border border-gray-300 border-l-0 rounded-r bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              🔍 Buscar
            </button>
          </div>
          <button
            onClick={() => navigate("/dashboard/cargos")}
            className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            📌 Ver Cargos
          </button>
        </div>
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
            {currentItems.map((usuario) => (
              <tr key={usuario.id_usuario}>
                <td className="border border-black p-2">{usuario.id_usuario}</td>
                <td className="border border-black p-2">{usuario.numero_documento}</td>
                <td className="border border-black p-2">{usuario.nombre_empleado}</td>
                <td className="border border-black p-2">{usuario.telefono_empleado}</td>
                <td className="border border-black p-2">{usuario.email_empleado}</td>
                <td className="border border-black p-2">{usuario.usuarioadmin}</td>
                <td className="border border-black p-2">{usuario.id_cargo}</td>
                <td className="whitespace-nowrap border border-black p-2">
                  <div className="flex space-x-2">
                    <button className="rounded bg-yellow-500 px-2 py-1 text-white hover:bg-yellow-600"
                      onClick={() => abrirModalEditar(usuario)}
                    >
                      ✏️ Editar
                    </button>
                    <button className="rounded bg-red-500 px-2 py-1 text-white hover:bg-red-600"
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
          <div className="w-full max-w-md rounded bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-bold">Detalles del Usuario</h2>
            
            <div className="mb-4 space-y-2 text-left">
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
                className="rounded bg-yellow-500 px-3 py-1 text-white hover:bg-yellow-600"
                onClick={() => {
                  setModalAbierto(false);
                  abrirModalEditar(usuarioEncontrado);
                }}
              >
                ✏️ Editar
              </button>
              
              {/* Botón de eliminar (funcional) */}
              <button 
                className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600"
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
                className="rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600"
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
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-bold">Editar Usuario</h2>

            <div className="space-y-3">
              {/* Tipo de Documento */}
              <div>
                <label className="mb-1 block text-left">Tipo Documento:</label>
                <select
                  name="tipo_documento"
                  value={formData.tipo_documento}
                  onChange={handleChange}
                  className="w-full rounded border p-2"
                >
                  <option value="CC">Cédula de Ciudadanía</option>
                  <option value="CE">Cédula de Extranjería</option>
                  <option value="TI">Tarjeta de Identidad</option>
                  <option value="PA">Pasaporte</option>
                </select>
              </div>

              {/* Número de Documento */}
              <div>
                <label className="mb-1 block text-left">Número Documento:</label>
                <input
                  type="text"
                  name="numero_documento"
                  value={formData.numero_documento}
                  onChange={handleChange}
                  className="w-full rounded border p-2"
                />
              </div>

              {/* Nombre Completo */}
              <div>
                <label className="mb-1 block text-left">Nombre Completo:</label>
                <input
                  type="text"
                  name="nombre_empleado"
                  value={formData.nombre_empleado}
                  onChange={handleChange}
                  className="w-full rounded border p-2"
                />
              </div>

              {/* Dirección */}
              <div>
                <label className="mb-1 block text-left">Dirección:</label>
                <input
                  type="text"
                  name="direccion_empleado"
                  value={formData.direccion_empleado}
                  onChange={handleChange}
                  className="w-full rounded border p-2"
                />
              </div>

              {/* Teléfono */}
              <div>
                <label className="mb-1 block text-left">Teléfono:</label>
                <input
                  type="text"
                  name="telefono_empleado"
                  value={formData.telefono_empleado}
                  onChange={handleChange}
                  className="w-full rounded border p-2"
                />
              </div>

              {/* Email */}
              <div>
                <label className="mb-1 block text-left">Email:</label>
                <input
                  type="email"
                  name="email_empleado"
                  value={formData.email_empleado}
                  onChange={handleChange}
                  className="w-full rounded border p-2"
                />
              </div>

              {/* EPS */}
              <div>
                <label className="mb-1 block text-left">EPS:</label>
                <input
                  type="text"
                  name="eps_empleado"
                  value={formData.eps_empleado}
                  onChange={handleChange}
                  className="w-full rounded border p-2"
                />
              </div>

              {/* Nombre de Usuario */}
              <div>
                <label className="mb-1 block text-left">Usuario Admin:</label>
                <input
                  type="text"
                  name="usuarioadmin"
                  value={formData.usuarioadmin}
                  onChange={handleChange}
                  className="w-full rounded border p-2"
                />
              </div>

              {/* ID Cargo */}
              <div>
                <label className="mb-1 block text-left">ID Cargo:</label>
                <input
                  type="number"
                  name="id_cargo"
                  value={formData.id_cargo}
                  onChange={handleChange}
                  className="w-full rounded border p-2"
                />
              </div>

              {/* Contraseña */}
              <div>
                <label className="mb-1 block text-left">Contraseña (dejar vacío para no cambiar):</label>
                <input
                  type="password"
                  name="contrasenia"
                  value={formData.contrasenia}
                  onChange={handleChange}
                  className="w-full rounded border p-2"
                  placeholder="Nueva contraseña"
                />
              </div>
            </div>
      
            <div className="mt-6 flex justify-end space-x-2">
              <button
                onClick={() => setModalEditarAbierto(false)}
                className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
              >
                Cancelar
              </button>
              <button
                onClick={actualizarUsuario}
                className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Paginación sticky */}
      <div
        className="sticky left-0 right-0 z-10 mt-8 flex flex-col items-center justify-between gap-4 rounded border-t bg-white p-4 shadow sm:flex-row"
        style={{ bottom: 0 }}
      >
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600">
            Mostrando {filteredUsuarios.length === 0 ? 0 : indexOfFirstItem + 1} a {Math.min(indexOfLastItem, filteredUsuarios.length)} de {filteredUsuarios.length} usuarios
          </div>
          <div className="flex items-center gap-2">
            <select
              value={itemsPerPage}
              onChange={e => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
              className="rounded border border-gray-300 px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={5}>5</option>
              <option value={8}>8</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span className="text-sm text-gray-600">por página</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Primero
          </button>
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Anterior
          </button>
          {/* Números de página */}
          <div className="flex gap-1">
            {(() => {
              let pagesToShow = [];
              let start = Math.max(1, currentPage - 1);
              let end = Math.min(start + 2, totalPages);
              if (end === totalPages) {
                start = Math.max(1, end - 2);
              }
              for (let i = start; i <= end; i++) {
                pagesToShow.push(
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={`rounded-lg border px-3 py-2 text-sm ${currentPage === i ? 'border-blue-500 bg-blue-500 text-white' : 'border-gray-300 hover:bg-gray-50'}`}
                  >
                    {i}
                  </button>
                );
              }
              return pagesToShow;
            })()}
          </div>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Siguiente
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Último
          </button>
        </div>
      </div>

    </div>
  );
};

export default UsuariosPage;
