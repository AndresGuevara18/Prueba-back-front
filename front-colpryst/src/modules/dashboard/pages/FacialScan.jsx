import React, { useState, useRef, useEffect } from 'react';
import { Camera, X } from 'lucide-react';
import Swal from 'sweetalert2';

function FacialScan() {
  const [isScanning, setIsScanning] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const startScanning = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: 640,
          height: 480,
          facingMode: 'user'
        }
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      
      setIsScanning(true);
      
      // Simulación de escaneo exitoso
      setTimeout(() => {
        stopScanning();
        Swal.fire({
          icon: 'success',
          title: '¡Escaneo completado!',
          text: 'Identificación facial realizada con éxito',
          confirmButtonColor: '#3B82F6',
          timer: 3000,
          timerProgressBar: true
        });
      }, 5000);
    } catch (err) {
      console.error('Error accessing camera:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo acceder a la cámara',
        confirmButtonColor: '#3B82F6'
      });
    }
  };

  const stopScanning = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setIsScanning(false);
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Scanner Facial</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="max-w-2xl mx-auto">
          <div className="relative w-full aspect-video bg-gray-100 rounded-lg overflow-hidden mb-6">
            {isScanning ? (
              <>
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute w-full h-1 bg-blue-500 opacity-50 animate-scan" />
                  <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-blue-500" />
                  <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-blue-500" />
                  <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-blue-500" />
                  <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-blue-500" />
                </div>
                <button
                  onClick={stopScanning}
                  className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  onClick={startScanning}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Camera className="w-5 h-5" />
                  Iniciar escaneo
                </button>
              </div>
            )}
          </div>

          <div className="text-center text-sm text-gray-600">
            <p>Posicione su rostro frente a la cámara y manténgase quieto durante el escaneo.</p>
            <p>Asegúrese de tener buena iluminación y un fondo claro.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FacialScan;