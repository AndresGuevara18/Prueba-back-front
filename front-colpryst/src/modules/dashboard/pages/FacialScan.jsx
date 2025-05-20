import React from 'react';
import { Camera } from 'lucide-react';
import Swal from 'sweetalert2';

function FacialScan() {
  
  const handleEntrada = async () => {
  const { value: documento } = await Swal.fire({
    title: 'Registro de Entrada',
    text: 'Ingrese el número de documento:',
    input: 'text',
    inputPlaceholder: 'Ej. 123456789',
    confirmButtonText: 'Verificar',
    showCancelButton: true,
    confirmButtonColor: '#10B981',
    cancelButtonColor: '#EF4444',
    inputValidator: (value) => {
      if (!value) {
        return 'Debes ingresar un número de documento';
      }
      return null;
    }
  });

  

  if (documento) {
    try {
    const formData = new FormData();
    formData.append("numero_documento", documento);

    const response = await fetch("http://localhost:8000/api/registro-entrada", {
      method: "POST",
      body: formData
    });

    // Si no hay respuesta válida, no intentes convertirla a JSON
    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.message || "Error en la respuesta del servidor");
    }

    const data = await response.json();
    console.log("📥 Respuesta del backend:", data);

    Swal.fire({
      icon: 'success',
      title: 'Usuario encontrado, POR FAVOR ESPERE UN MOMENTO, mientras inicia la camara.',
      text: `ID usuario: ${data.id_usuario}`,
      confirmButtonColor: '#10B981'
    });

    }   catch (error) {
        console.error("❌ Error de conexión:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error del servidor',
          text: error.message || 'No se pudo verificar el documento.',
          confirmButtonColor: '#EF4444'
      });
    }
  }
};

  const handleSalida = async () => {
    Swal.fire({
      icon: 'info',
      title: 'Registro de Salida',
      text: 'Se ha iniciado el proceso de escaneo para registrar la salida.',
      confirmButtonColor: '#3B82F6',
      timer: 2500,
      timerProgressBar: true
    });

    // Aquí se hará la petición al backend
  };

  return (
    <div className="flex flex-col items-center p-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-10">Scanner Facial</h1>

      <div className="flex gap-16">
        {/* Botón Registro Entrada */}
        <button
          onClick={handleEntrada}
          className="flex flex-col items-center justify-center w-[20rem] h-[20rem] bg-green-500 hover:bg-green-600 text-white rounded-2xl shadow-xl transition duration-300"
        >
          <Camera className="w-32 h-32 mb-8" />
          <span className="text-2xl font-bold">Registro Entrada</span>
        </button>

        {/* Botón Registro Salida */}
        <button
          onClick={handleSalida}
          className="flex flex-col items-center justify-center w-[20rem] h-[20rem] bg-blue-500 hover:bg-blue-600 text-white rounded-2xl shadow-xl transition duration-300"
        >
          <Camera className="w-32 h-32 mb-8" />
          <span className="text-2xl font-bold">Registro Salida</span>
        </button>
      </div>

      <div className="text-center text-base text-gray-600 mt-10">
        <p>Al hacer clic en una opción, se activará la cámara desde el servidor.</p>
        <p>Mantén tu rostro visible, centrado y con buena iluminación.</p>
      </div>
    </div>
  );
}

export default FacialScan;
