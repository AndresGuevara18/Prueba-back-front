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
  const { value: documento } = await Swal.fire({
    title: 'Registro de Salida',
    text: 'Ingrese el número de documento:',
    input: 'text',
    inputPlaceholder: 'Ej. 123456789',
    confirmButtonText: 'Verificar',
    showCancelButton: true,
    confirmButtonColor: '#3B82F6',
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

      const response = await fetch("http://localhost:8000/api/registro-salida", {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Error en la respuesta del servidor");
      }

      const data = await response.json();
      console.log("📥 Respuesta del backend (salida):", data);

      Swal.fire({
        icon: 'success',
        title: 'Usuario encontrado, POR FAVOR ESPERE UN MOMENTO, mientras inicia la cámara para salida.',
        text: `ID usuario: ${data.id_usuario}`,
        confirmButtonColor: '#3B82F6'
      });

    } catch (error) {
      console.error("❌ Error de conexión (salida):", error);
      Swal.fire({
        icon: 'error',
        title: 'Error del servidor',
        text: error.message || 'No se pudo verificar el documento para salida.',
        confirmButtonColor: '#EF4444'
      });
    }
  }
};

  return (
    <div className="flex flex-col items-center p-10">
      <h1 className="mb-10 text-3xl font-bold text-gray-800">Scanner Facial</h1>

      <div className="flex gap-16">
        {/* Botón Registro Entrada */}
        <button
          onClick={handleEntrada}
          className="flex h-[20rem] w-[20rem] flex-col items-center justify-center rounded-2xl bg-green-500 text-white shadow-xl transition duration-300 hover:bg-green-600"
        >
          <Camera className="mb-8 h-32 w-32" />
          <span className="text-2xl font-bold">Registro Entrada</span>
        </button>

        {/* Botón Registro Salida */}
        <button
          onClick={handleSalida}
          className="flex h-[20rem] w-[20rem] flex-col items-center justify-center rounded-2xl bg-blue-500 text-white shadow-xl transition duration-300 hover:bg-blue-600"
        >
          <Camera className="mb-8 h-32 w-32" />
          <span className="text-2xl font-bold">Registro Salida</span>
        </button>
      </div>

      <div className="mt-10 text-center text-base text-gray-600">
        <p>Al hacer clic en una opción, se activará la cámara desde el servidor.</p>
        <p>Mantén tu rostro visible, centrado y con buena iluminación.</p>
      </div>
    </div>
  );
}

export default FacialScan;
