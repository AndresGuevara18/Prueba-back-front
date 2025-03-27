import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../../../config/ConfigURL'; 
//import Camara from '../components/Camara'; // Importar el componente de la cámara

//estado inicial
const AgregarUsuarioPage = () => {
  const [formData, setFormData] = useState({ //form guarda valores formulario
    tipo_documento: '',
    numero_documento: '',
    nombre_empleado: '',
    direccion_empelado: '', 
    telefono_empleado: '', 
    email_empleado: '',
    eps_empleado: '', 
    usuarioadmin: '', 
    contrasenia: '', 
    id_cargo: '',
    fotoBase64: '', 
  });
  const [mensaje, setMensaje] = useState('');
  const [mostrarCamara, setMostrarCamara] = useState(false);

  const navigate = useNavigate();

  // URL del backend
  const API_URL = `${API_BASE_URL}/api/usuarios`;

  const handleChange = (e) => {//evento el formulario
    const { id, value } = e.target;//obtener id, value contenido ingresado
    setFormData({ ...formData, [id]: value });//actualizar el estado form data
  };

  const handleAbrirCamara = () => {
    setMostrarCamara(true);
  };

  const handleCerrarCamara = () => {
    setMostrarCamara(false);
  };


  //enviar el formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verificar los datos antes de enviar
    console.log("Datos del formulario:", formData);

    //peticion post
    try {
      const response = await fetch(API_URL, {//solicitud por fetch
        method: "POST",
        headers: { "Content-Type": "application/json" }, //tipo de contenido
        body: JSON.stringify(formData), //formData a JSON
      });

      const data = await response.json(); // Parsear la respuesta JSON

      //error
      if (!response.ok) {
        // Si la respuesta no es exitosa, lanzar un error con el mensaje del backend
        throw new Error(data.message || "Error al agregar el usuario");
      }

      // Si la respuesta es exitosa, mostrar el mensaje de éxito en la interfaz
      setMensaje(data.message);

      // Limpiar el formulario
      setFormData({
        tipo_documento: '',
        numero_documento: '',
        nombre_empleado: '',
        direccion_empelado: '',
        telefono_empleado: '',
        email_empleado: '',
        eps_empleado: '',
        usuarioadmin: '',
        contrasenia: '',
        id_cargo: '',
        fotoBase64: '',
      });

      // Redirigir a la lista de usuarios después de 1 segundo
      setTimeout(() => {
        navigate("/dashboard/users");
      }, 800);
    } catch (error) {
      console.error("❌ Error en agregarUsuario:", error);

      // Mostrar el mensaje de error como una alerta
      if (error.message.includes("CARGO_NOT_FOUND")) {
        window.alert("❌ Error: El cargo especificado no existe.");
      } else if (error.message.includes("DOCUMENTO_EXISTS")) {
        window.alert("❌ Error: El número de documento ya está registrado.");
      } else if (error.message.includes("EMAIL_EXISTS")) {
        window.alert("❌ Error: El correo electrónico ya está registrado.");
      } else if (error.message.includes("USUARIO_EXISTS")) {
        window.alert("❌ Error: El nombre de usuario ya está en uso.");
      } else {
        window.alert(`❌ Error: ${error.message}`); // Mostrar el mensaje de error del backend
      }
    }
  };

  return (
    <div className="font-sans text-center m-5 ml-64">
      <h1 className="text-3xl font-bold mb-4">Agregar Nuevo Usuario</h1>
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
        <div className="grid grid-cols-2 gap-4">
          {/* Columna Izquierda */}
          <div className="space-y-4">
            {/* Tipo de Documento */}
            <div className="input-group">
              <label htmlFor="tipo_documento" className="block text-sm font-medium text-gray-700">
                Tipo de Documento
              </label>
              <select
                id="tipo_documento"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.tipo_documento}
                onChange={handleChange}
                required
              >
                <option value="" disabled>Seleccione Tipo de Documento</option>
                <option value="CC">Cédula de Ciudadanía</option>
                <option value="TI">Tarjeta de Identidad</option>
                <option value="CE">Cédula de Extranjería</option>
                <option value="NIT">NIT</option>
              </select>
            </div>

            {/* Número de Documento */}
            <div className="input-group">
              <label htmlFor="numero_documento" className="block text-sm font-medium text-gray-700">
                Número de Documento
              </label>
              <input
                type="text"
                id="numero_documento"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.numero_documento}
                onChange={handleChange}
                required
              />
            </div>

            {/* Nombre Completo */}
            <div className="input-group">
              <label htmlFor="nombre_empleado" className="block text-sm font-medium text-gray-700">
                Nombre Completo
              </label>
              <input
                type="text"
                id="nombre_empleado"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.nombre_empleado}
                onChange={handleChange}
                required
              />
            </div>

            {/* Dirección */}
            <div className="input-group">
              <label htmlFor="direccion_empelado" className="block text-sm font-medium text-gray-700">
                Dirección
              </label>
              <input
                type="text"
                id="direccion_empelado"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.direccion_empelado}
                onChange={handleChange}
                required
              />
            </div>

            {/* Teléfono */}
            <div className="input-group">
              <label htmlFor="telefono_empleado" className="block text-sm font-medium text-gray-700">
                Teléfono
              </label>
              <input
                type="text"
                id="telefono_empleado"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.telefono_empleado}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Columna Derecha */}
          <div className="space-y-4">
            {/* Correo Electrónico */}
            <div className="input-group">
              <label htmlFor="email_empleado" className="block text-sm font-medium text-gray-700">
                Correo Electrónico
              </label>
              <input
                type="email"
                id="email_empleado"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.email_empleado}
                onChange={handleChange}
                required
              />
            </div>

            {/* EPS */}
            <div className="input-group">
              <label htmlFor="eps_empleado" className="block text-sm font-medium text-gray-700">
                EPS
              </label>
              <input
                type="text"
                id="eps_empleado"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.eps_empleado}
                onChange={handleChange}
                required
              />
            </div>

            {/* Usuario */}
            <div className="input-group">
              <label htmlFor="usuarioadmin" className="block text-sm font-medium text-gray-700">
                Usuario
              </label>
              <input
                type="text"
                id="usuarioadmin"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.usuarioadmin}
                onChange={handleChange}
                required
              />
            </div>

            {/* Contraseña */}
            <div className="input-group">
              <label htmlFor="contrasenia" className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <input
                type="password"
                id="contrasenia"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.contrasenia}
                onChange={handleChange}
                required
              />
            </div>

            {/* ID Cargo */}
            <div className="input-group">
              <label htmlFor="id_cargo" className="block text-sm font-medium text-gray-700">
                ID Cargo
              </label>
              <input
                type="number"
                id="id_cargo"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.id_cargo}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        {/* Botón para abrir cámara */}
        <div className="flex justify-center mt-6">
          {!mostrarCamara && (
            <button
              type="button"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={handleAbrirCamara}
            >
              Abrir Cámara
            </button>
          )}
        </div>

        {/* Mostrar cámara si está activa */}
        {mostrarCamara && (
          <Camara
            onClose={handleCerrarCamara} // Pasamos la función de cierre
          />
        )}
        
        {/* Botón Registrar */}
        <button type="submit" className="w-full bg-green-500 text-white px-4 py-2 rounded mt-6 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500">
          Registrar
        </button>

        {/* Mostrar mensaje de éxito */}
        {mensaje && (
          <div className="mt-4 p-4 rounded bg-green-100 text-green-700">
            {mensaje}
          </div>
        )}
      </form>
    </div>
  );
};

export default AgregarUsuarioPage;