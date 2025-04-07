import React, { useRef, useEffect, useState } from 'react';

const Camara = ({ onClose, onCapture }) => {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [permisosConcedidos, setPermisosConcedidos] = useState(false);
  const [mostrarControles, setMostrarControles] = useState(false);

  // Función para ABRIR LA CÁMARA (similar a tu vanilla JS)
  const iniciarCamara = async () => {
    console.log("🔄 Intentando acceder a la cámara...");
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' },
        audio: false
      });

      if (mediaStream) {
        console.log("✅ Flujo de video recibido");
        setStream(mediaStream);
        videoRef.current.srcObject = mediaStream;

        // Esperar a que el video esté listo (como en tu código vanilla)
        videoRef.current.onloadedmetadata = () => {
          console.log("🎥 Metadatos de video cargados");
          videoRef.current.play();
          setPermisosConcedidos(true);
          setMostrarControles(true);
          console.log("✅ Cámara activada correctamente");
        };
      } else {
        console.error("⚠️ No se recibió flujo de video");
        alert("No se pudo acceder a la cámara");
        onClose();
      }
    } catch (error) {
      console.error("❌ Error al acceder a la cámara:", error);
      alert(`No se puede acceder a la cámara: ${error.message}`);
      onClose();
    }
  };


  // Función para CERRAR LA CÁMARA mejorada
  const detenerCamara = () => {
    console.log("⏹️ Iniciando proceso para detener cámara...");
    
    // Detener todas las pistas de video
    if (stream) {
      console.log("🔍 Encontrado stream, deteniendo pistas...");
      const tracks = stream.getTracks();
      tracks.forEach(track => {
        console.log(`🛑 Deteniendo pista: ${track.kind} (${track.label})`);
        track.stop();
        track.enabled = false;
      });
      
      // Limpiar la referencia del stream
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      
      setStream(null);
    }
    
    // Resetear estados
    setPermisosConcedidos(false);
    setMostrarControles(false);
    
    console.log("✅ Cámara detenida completamente");
    onClose(); // Notificar al componente padre
  };

  // Efecto para iniciar/limpiar la cámara
  useEffect(() => {
    iniciarCamara();
    
    return () => {
      console.log("🧹 Limpieza del componente");
      if (stream) {
        detenerCamara();
      }
    };
  }, []);

  const capturarFoto = () => {
    console.log("📸 Iniciando captura...");
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    
    canvas.toBlob(blob => {
      console.log("🖼️ Foto capturada como blob");
      onCapture(blob);
      detenerCamara();
    }, 'image/jpeg', 0.9);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center z-50">
      <video 
        ref={videoRef} 
        autoPlay 
        playsInline 
        muted
        className="max-w-full max-h-[70vh] border-2 border-white"
      />
      
      {mostrarControles && (
        <div className="mt-4 flex gap-4">
          <button
            onClick={capturarFoto}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            Capturar Foto
          </button>
          <button
            onClick={detenerCamara}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Cerrar Cámara
          </button>
        </div>
      )}
      
      {!permisosConcedidos && (
        <p className="text-white mt-4">Cargando cámara...</p>
      )}
    </div>
  );
};

export default Camara;