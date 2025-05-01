import React, { useState, useRef,useEffect  } from 'react';//{manejar estados, referencia elementos del dom,efecetos secundarios llamado apis}
import { useNavigate } from 'react-router-dom';//hook para navegacion
import API_BASE_URL from '../../../config/ConfigURL';//importacion url peticiones al back puerto 3000
//reconocimiento
import * as faceapi from 'face-api.js';//npm install react-webcam face-api.js

//componete funcional en arrow function
const AgregarUsuarioPage = () => {
  //estado para el formulario
  const [formData, setFormData] = useState({//[obejto almacena campos, actualziar el estado]
    tipo_documento: '',
    numero_documento: '',
    nombre_empleado: '',
    direccion_empleado: '', 
    telefono_empleado: '', 
    email_empleado: '',
    eps_empleado: '', 
    usuarioadmin: '', 
    contrasenia: '', 
    id_cargo: '',
    fotoBlob: null // Campo mantenido pero inactivo
  });

  const [mensaje, setMensaje] = useState('');//mensajes exito o error 
  //deteccion
  const [modelsLoaded, setModelsLoaded] = useState(false);// carga de modelos
  const [faceDetected, setFaceDetected] = useState(false);// deteccion rostro
  const [detectionInterval, setDetectionInterval] = useState(null);//almacenar id de intervalo para detteccion
  //navegacion
  const navigate = useNavigate();//cambiar ruta
  //camara estados
  const [showCameraModal, setShowCameraModal] = useState(false);// Control modal si es visible
  const [hasCameraAccess, setHasCameraAccess] = useState(false); // Indica si hay permisos
  //referencias
  const videoRef = useRef(null);// Referencia al elemento <video>
  const streamRef = useRef(null);// Guarda el stream de la cámara
  const canvasRef = useRef(null); //ref para el <canvas> oculto
  const faceCanvasRef = useRef(null); //canvas dibujar cuadro reconocimiento

  const [isCaptureEnabled, setIsCaptureEnabled] = useState(false);//control capturar foto 

  const API_URL = `${API_BASE_URL}/api/usuarios`;//url completa de api

  //reconocimiento 
  // Cargar modelos al montar el componente
  useEffect(() => {
    //funcion cargar modelos
    const loadModels = async () => {
      try {
        //const urlModels = '../../../../public/models';
        console.log("cargando modelos....")
        await faceapi.nets.tinyFaceDetector.loadFromUri('/models');//Modelo liviano para detección de rostros
        await faceapi.nets.faceLandmark68Net.loadFromUri('/models');//Para identificar 68 puntos clave del rostro
        await faceapi.nets.faceRecognitionNet.loadFromUri('/models');//Para reconocimiento facial
        setModelsLoaded(true);//si se cargan actualizar estado
        console.log('Modelos cargados correctamente');
      } catch (error) {
        console.error('Error cargando modelos:', error);
      }
    };

    loadModels();//llamdo funcion 

    //ejecutar la carga
    return () => {
      // Limpiar al desmontar
      if (detectionInterval) clearInterval(detectionInterval);
      if (streamRef.current) {//verificar sie xiste
        streamRef.current.getTracks().forEach(track => track.stop());//cierra tracks del video
      }
    };
  }, []);//rray vacion efecto solo se ejecuta al montar el componente

  //fucnion iniciar deteccion facial
  const startFaceDetection = () => {
    if (!videoRef.current || !faceCanvasRef.current) return;//verificar referencia de video y canvas
  
    //funcion detectar rostro
    const detectFaces = async () => {

      const options = new faceapi.TinyFaceDetectorOptions({
        inputSize: 512, // Tamaño mayor para mejor precisión
        scoreThreshold: 0.5 // Umbral más alto para descartar falsos positivos
      });

      //
      const detections = await faceapi.detectAllFaces(
        videoRef.current,//video como entrada
        new faceapi.TinyFaceDetectorOptions()
      ).withFaceLandmarks();//añadir deteccion puntos faciales
      
      // Limpiar el canvas antes de dibujar
      const faceCtx = faceCanvasRef.current.getContext('2d');
      faceCtx.clearRect(0, 0, faceCanvasRef.current.width, faceCanvasRef.current.height);//borra cnavas antes de dibujar otro
      
      // Ajustar el tamaño del canvas al video
      faceapi.matchDimensions(faceCanvasRef.current, {
        width: videoRef.current.videoWidth,
        height: videoRef.current.videoHeight
      });
      
      // Dibujar detecciones
      const resizedDetections = faceapi.resizeResults(detections, {//ajustar cordenadas
        width: videoRef.current.videoWidth,
        height: videoRef.current.videoHeight
      });
      
      faceapi.draw.drawDetections(faceCanvasRef.current, resizedDetections);// Dibujar cuadro alrededor de cada rostro detectado   
      faceapi.draw.drawFaceLandmarks(faceCanvasRef.current, resizedDetections);// dibujar puntos de referencia faciales
      
      //activa boton caprurar si solo hay un rostro
      if (detections.length === 1) {
        setIsCaptureEnabled(true);
        setFaceDetected(true);
      } else {
        setIsCaptureEnabled(false);
        setFaceDetected(false);
      }
    };
  
    const intervalId = setInterval(detectFaces, 300); // Ejecuta detectFaces cada 100ms
    setDetectionInterval(intervalId);// Guarda el ID del intervalo para poder limpiarlo después
  };

  //apertura camara
  const openCamera = async () => {
    try {
      console.log("Abriendo camara!!")
      setShowCameraModal(true);//hace visible el modal de la cámara
      await new Promise(resolve => setTimeout(resolve, 100));//deleay asegurar que el modal esté visible antes de acceder a la cámara
      //acceso a la camara
      const stream = await navigator.mediaDevices.getUserMedia({ //solicitar permiso acceder a  camara
        video: { facingMode: "user" } //acceder  a camara
      });
      //si existe referencia video
      if (videoRef.current) {
        videoRef.current.srcObject = stream;//asignar stream video a el elemento mostrado
        streamRef.current = stream;//para cerrarlo despues
      }

      startFaceDetection(); //llama duncion detectar rostros después de mostrar la cámara
    } catch (err) {
      console.error("Error al acceder a la cámara:", err);
      alert("No se pudo acceder a la cámara. Por favor verifica los permisos.");
      setShowCameraModal(false);//cierra modal
    }
  };

  //cierra camara
  const closeCamera = () => {
    if (detectionInterval) {//detener deteccion facial
      clearInterval(detectionInterval);//limpiar
      setDetectionInterval(null);//resetea estado
    }

    //si hay stream activo
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());//detener todas pistas
      streamRef.current = null;//limpia referencias
    }

    setIsCaptureEnabled(false);//desabilitar boton captura
    setFaceDetected(false);//no rostro detectado
    console.log("Cerrando camara!")
    setShowCameraModal(false);//ocultar modal
  };



  // capturar la imagen
  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return;//si no hay referencias validas  de vido o canvas
    
    // Obtener dimensiones del video
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Dibujar el frame actual del video en el canvas
    const ctx = canvas.getContext('2d');//obtiene contexto 2d del canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);//dibuja el frame actual del video
    
    // Convertir a Blob
    canvas.toBlob((blob) => {//Convierte el canvas a imagen JPEG con 95% de calidad
      if (blob) {//recibe el blob
        console.log("Imagen capturada como Blob:", blob);
        setFormData({...formData, fotoBlob: blob});//Guarda el blob en el estado del formulario
        alert("Imagen capturada correctamente!");
        closeCamera();
      } else {
        console.error("Error al convertir a Blob");
        closeCamera();
      }
    }, 'image/jpeg', 0.95); // Calidad del 95%
  };

  //manejo formulario
  const handleChange = (e) => {//handleChange: Función que maneja cambios en los inputs
    const { id, value } = e.target;//Desestructura el evento obtine id y el nuevo valor
    setFormData({ ...formData, [id]: value });
    /*Copia todo el estado anterior (...formData)
    Actualiza  la propiedad cuyo nombre coincide con el id del input*/ 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // Crear FormData para enviar datos binarios
      const formDataToSend = new FormData();
      
      // Agregar todos los campos del formulario
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'fotoBlob' && value !== null) {
          formDataToSend.append(key, value);
        }
      });
  
      // Agregar la imagen si existe
      if (formData.fotoBlob) {
        formDataToSend.append('foto', formData.fotoBlob, 'foto_usuario.jpg');
      }
  
      const response = await fetch(API_URL, {
        method: "POST",
        body: formDataToSend // No necesitamos headers Content-Type con FormData
      });
  
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Error al agregar el usuario");
  
      setMensaje("✅ Usuario registrado exitosamente");
      
      // Resetear formulario
      setFormData({
        tipo_documento: '',
        numero_documento: '',
        nombre_empleado: '',
        direccion_empleado: '',
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
              <label htmlFor="direccion_empleado" className="block text-sm font-medium text-gray-700">
                Dirección
              </label>
              <input
                type="text"
                id="direccion_empleado"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.direccion_empleado}
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
            
            <div className="relative">
              <video 
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-auto border border-gray-300"
              />
              <canvas
                ref={faceCanvasRef}
                className="absolute top-0 left-0 w-full h-full pointer-events-none"
                style={{ zIndex: 10 }}
              />
            </div>
            
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={captureImage}
                className={`px-4 py-2 rounded ${
                  isCaptureEnabled
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-400 cursor-not-allowed text-white'
                }`}
              >
                Capturar
              </button>
              <button
                onClick={closeCamera}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Cerrar Cámara
              </button>
            </div>

            {showCameraModal && !isCaptureEnabled && (
              <p className="text-red-600 mt-2 text-center">
                Debe haber exactamente un solo rostro en pantalla.
              </p>
            )}
          </div>
        </div>
      )}
    
      {/* Canvas oculto para la captura */}
      <canvas ref={canvasRef} style={{display: 'none'}} />
    </div>
  );
};

export default AgregarUsuarioPage;