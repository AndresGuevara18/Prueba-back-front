import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../../../config/ConfigURL';
import Camara from '../components/Camara';

const AgregarUsuarioPage = () => {
  const [formData, setFormData] = useState({
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
    fotoBlob: null,  // Cambiado de fotoBase64 a fotoBlob
  });
  const [mensaje, setMensaje] = useState('');
  const [mostrarCamara, setMostrarCamara] = useState(false);
  const [fotoPreview, setFotoPreview] = useState(null);
  const navigate = useNavigate();

  const API_URL = `${API_BASE_URL}/api/usuarios`;

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleAbrirCamara = () => {
    console.log("🔘 Botón 'Abrir Cámara' clickeado");
    setMostrarCamara(true);
  };

  const handleCerrarCamara = () => {
    console.log("🔘 Botón 'Cerrar Cámara' clickeado");
    setMostrarCamara(false);

    setTimeout(() => {
      setMostrarCamara(false);
    }, 100);

  };

  const handleFotoCapturada = (blob) => {
    console.log("📸 Foto capturada (Blob):", blob);
    
    // Crear URL para la vista previa
    const previewUrl = URL.createObjectURL(blob);
    setFotoPreview(previewUrl);
    
    // Guardar el Blob directamente en el estado
    setFormData({
      ...formData,
      fotoBlob: blob
    });
    
    setMostrarCamara(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fotoBlob) {
      alert("Por favor capture una foto antes de registrar");
      return;
    }

    // Crear FormData para enviar el Blob
    const formDataToSend = new FormData();
    for (const key in formData) {
      if (key === 'fotoBlob') {
        formDataToSend.append('foto', formData.fotoBlob, 'foto_usuario.jpg');
      } else {
        formDataToSend.append(key, formData[key]);
      }
    }

    console.log("📋 Datos del formulario a enviar:", Object.fromEntries(formDataToSend));

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        body: formDataToSend,  // No necesitamos headers para FormData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al agregar el usuario");
      }

      setMensaje(data.message);
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
        fotoBlob: null,
      });
      setFotoPreview(null);

      setTimeout(() => {
        navigate("/dashboard/users");
      }, 800);
    } catch (error) {
      console.error("❌ Error en agregarUsuario:", error);
      if (error.message.includes("CARGO_NOT_FOUND")) {
        window.alert("❌ Error: El cargo especificado no existe.");
      } else if (error.message.includes("DOCUMENTO_EXISTS")) {
        window.alert("❌ Error: El número de documento ya está registrado.");
      } else if (error.message.includes("EMAIL_EXISTS")) {
        window.alert("❌ Error: El correo electrónico ya está registrado.");
      } else if (error.message.includes("USUARIO_EXISTS")) {
        window.alert("❌ Error: El nombre de usuario ya está en uso.");
      } else {
        window.alert(`❌ Error: ${error.message}`);
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

        {/* Botón para abrir cámara y vista previa */}
        <div className="flex flex-col items-center mt-6">
          {!mostrarCamara && !fotoPreview && (
            <button
              type="button"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
              onClick={handleAbrirCamara}
            >
              Abrir Cámara
            </button>
          )}

          {/* Vista previa de la foto capturada */}
          {fotoPreview && (
            <div className="mb-4 text-center">
              <h3 className="text-lg font-medium mb-2">Vista previa:</h3>
              <img 
                src={fotoPreview} 
                alt="Foto capturada" 
                className="max-w-xs mx-auto rounded-lg border border-gray-300"
              />
              <button
                type="button"
                onClick={() => {
                  setFotoPreview(null);
                  setFormData({...formData, fotoBlob: null});
                  console.log("🔄 Foto descartada");
                }}
                className="mt-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Eliminar Foto
              </button>
            </div>
          )}

          {/* Mostrar cámara si está activa */}
          {mostrarCamara && (
            <Camara
              onClose={handleCerrarCamara}
              onCapture={handleFotoCapturada}
            />
          )}
        </div>

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