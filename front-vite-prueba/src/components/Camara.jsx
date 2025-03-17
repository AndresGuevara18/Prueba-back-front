import React, { useRef, useEffect, useState } from 'react';

const Camara = ({ onClose }) => {
  const videoRef = useRef(null);
  const streamRef = useRef(null); // Referencia para almacenar el stream de la cámara
  const [errorCamara, setErrorCamara] = useState('');
  const timerRef = useRef(null); // Referencia para almacenar el temporizador

  // Iniciar la cámara
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = stream; // Guardar el stream para detenerlo después
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          console.log("Cámara abierta!!");
        }

        // Iniciar el temporizador para cerrar la cámara después de 5 segundos
        timerRef.current = setTimeout(() => {
          cerrarCamara();
          console.log("Cámara cerrada automáticamente después de 5 segundos");
        }, 10000); // 5000 ms = 5 segundos
      } catch (error) {
        setErrorCamara('❌ Error al acceder a la cámara');
        console.error('Error al acceder a la cámara:', error);
      }
    };

    startCamera();

    // Limpiar el stream y el temporizador cuando el componente se desmonte
    return () => {
      detenerCamara();
      if (timerRef.current) {
        clearTimeout(timerRef.current); // Limpiar el temporizador
        console.log("Cámara detenida con tempo");
      }
    };
  }, []);

  // Detener la cámara
  const detenerCamara = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop(); // Detener cada pista del stream
        console.log("Cámara detenida");
      });
      streamRef.current = null;
    }
  };

  // Cerrar la cámara manualmente
  const cerrarCamara = () => {
    detenerCamara(); // Detener la cámara
    if (timerRef.current) {
      clearTimeout(timerRef.current); // Limpiar el temporizador
    }
    onClose(); // Cerrar el componente (llamar a la función onClose del padre)
  };

  return (
    <div className="flex flex-col items-center bg-gray-100 p-4 rounded-lg shadow-lg">
      {errorCamara ? (
        <p className="text-red-500">{errorCamara}</p>
      ) : (
        <>
          <video ref={videoRef} autoPlay playsInline className="w-full max-w-md rounded-lg shadow-lg" />
          <button
            onClick={cerrarCamara}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Cerrar Cámara
          </button>
        </>
      )}
    </div>
  );
};

export default Camara;