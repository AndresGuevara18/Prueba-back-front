import React, { useRef, useEffect, useState } from 'react';

/**
 * Componente para mostrar y controlar la cámara web
 * @param {Function} onClose - Función proporcionada por el padre para cerrar el modal
 */
const Camara = ({ onClose }) => {
  // Referencia al elemento <video> del DOM
  const videoRef = useRef(null);
  
  // Estado para almacenar el stream de la cámara
  const [stream, setStream] = useState(null);

  /**
   * Función para detener completamente la cámara
   * 1. Detiene todas las pistas (tracks) del stream
   * 2. Libera los recursos
   * 3. Ejecuta la función onClose del padre
   */
  const detenerCamara = () => {
    // Verifica si existe un stream activo
    if (stream) {
      // Obtiene todas las pistas de video/audio
      const tracks = stream.getTracks();
      
      // Detiene cada pista individualmente
      tracks.forEach(track => {
        track.stop();  // Detiene la transmisión (apaga el LED físico en dispositivos que lo tienen)
        console.log(`Pista ${track.kind} detenida`); // Log para depuración
      });

      // Limpia la referencia del elemento video
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }

      // Resetea el estado del stream
      setStream(null);
    }

    // Cierra el modal llamando a la función del componente padre
    onClose();
  };

  /**
   * Efecto para manejar el ciclo de vida de la cámara
   * Se ejecuta al montar el componente
   */
  useEffect(() => {
    // Función asincrónica para iniciar la cámara
    const iniciarCamara = async () => {
      try {
        // Solicita acceso a la cámara del usuario
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { 
            width: 640,     // Ancho deseado del video
            height: 480,    // Alto deseado del video
            facingMode: 'user'  // Prioriza la cámara frontal
          },
          audio: false      // No requiere audio
        });

        // Si la referencia al video existe, asigna el stream
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          setStream(mediaStream);  // Guarda el stream en el estado
        }
      } catch (error) {
        console.error("Error al acceder a la cámara:", error);
        alert("No se pudo acceder a la cámara: " + error.message);
        detenerCamara();  // Limpia recursos si hay error
      }
    };

    // Inicia la cámara
    iniciarCamara();

    /**
     * Función de limpieza que se ejecuta al desmontar el componente
     * Importante para liberar recursos cuando el modal se cierra
     * sin usar el botón (ej: al hacer clic fuera del modal)
     */
    return () => {
      if (stream) {
        // Detiene todas las pistas activas
        stream.getTracks().forEach(track => {
          if (track.readyState === 'live') {  // Solo si la pista está activa
            track.stop();
          }
        });
      }
    };
  }, []);  // El array vacío [] significa que solo se ejecuta al montar el componente

  /**
   * Renderizado del componente:
   * - Modal oscuro semitransparente
   * - Vista previa de la cámara
   * - Botón para cerrar
   */
  return (
    // Fondo oscuro que cubre toda la pantalla
    <div className="fixed inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center z-50">
      {/* Elemento de video para mostrar la cámara */}
      <video 
        ref={videoRef}          // Asigna la referencia
        autoPlay={true}         // Autoreproduce el video
        playsInline={true}      // Necesario para Safari iOS
        muted={true}            // Silenciado (requerido para autoplay en algunos navegadores)
        className="max-w-full max-h-[70vh] border-2 border-white"
      />
      
      {/* Contenedor del botón de cerrar */}
      <div className="mt-4">
        <button
          onClick={detenerCamara}  // Al hacer clic ejecuta la función de detener
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Cerrar Cámara
        </button>
      </div>
    </div>
  );
};

// Exporta el componente como módulo por defecto
export default Camara;