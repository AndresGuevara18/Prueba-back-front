import React, { useState, useRef  } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../../../config/ConfigURL';
//reconocimiento
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';//npm install react-webcam face-api.js

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
    fotoBlob: null // Campo mantenido pero inactivo
  });

  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();
  //camara estados
  const [showCameraModal, setShowCameraModal] = useState(false);// Control modal si es visible
  const [hasCameraAccess, setHasCameraAccess] = useState(false); // Indica si tenemos permisos
  //referencias
  const videoRef = useRef(null);// Referencia al elemento <video>
  const streamRef = useRef(null);// Guarda el stream de la cámara

  const API_URL = `${API_BASE_URL}/api/usuarios`;

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  // abrir la cámara
  const openCamera = async () => {
    try {
      console.log("Abriendo camara!!")
      setShowCameraModal(true);//1 Mostrar el modal
      await new Promise(resolve => setTimeout(resolve, 100));//2 Espera modal esté montado en el DOM
      
      // 3. Solicitar acceso a la cámara getUserMedia
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user" } 
      });


      // 4. Asignar el stream al elemento video
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
    } catch (err) {
      console.error("Error al acceder a la cámara:", err);
      alert("No se pudo acceder a la cámara. Por favor verifica los permisos.");
      setShowCameraModal(false);
    }
  };

  //cerrar la cámara
  const closeCamera = () => {
    // 1. Detener todas las pistas del stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());//// Detener cada pista
      streamRef.current = null;// Limpiar referencia
    }
    console.log("Cerrando camara!")
    setShowCameraModal(false);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          fotoBlob: null // Envía null como valor
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Error al agregar el usuario");

      setMensaje("✅ Usuario registrado exitosamente");
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
        fotoBlob: null
      });

      setTimeout(() => navigate("/dashboard/users"), 800);
    } catch (error) {
      console.error("Error:", error);
      alert(`❌ Error: ${error.message}`);
    }
  };

  return (
    <div className="font-sans text-center m-5">
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

        {/* Botón de cámara visible pero inactivo */}
        <div className="flex flex-col items-center mt-6">
          <button
            type="button"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
            //onClick={() => alert("Función de cámara no implementada aún")}
            onClick={openCamera}
          >
            Abrir Cámara
          </button>
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

      {/* Modal de la cámara */}
      {showCameraModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg max-w-lg w-full">
            <h2 className="text-xl font-bold mb-2">Cámara</h2>
            
            <video 
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-auto border border-gray-300"
            />
            
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={closeCamera}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Cerrar Cámara
              </button>
            </div>
          </div>
        </div>
      )}
    

    </div>
  );
};

export default AgregarUsuarioPage;