import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../../../config/ConfigURL'; 

const AgregarCargoPage = () => {
    //Almacena el valor
    const [nombreCargo, setNombreCargo] = useState('');//nombre
    const [descripcion, setDescripcion] = useState('');//descripcion
    const [mensaje, setMensaje] = useState('');//mensajes de exito o error
  const navigate = useNavigate();
  // URL del backend
  const API_URL = `${API_BASE_URL}/api/cargos`;

  const agregarCargo = async () => {
    try {
      // Validar campos
      if (!nombreCargo.trim() || !descripcion.trim()) {
        setMensaje('⚠️ Todos los campos son obligatorios.');
        return;
      }

      // petición POST al backend
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre_cargo: nombreCargo, descripcion }),
      });


      //error
      if (!response.ok) throw new Error('Error al agregar el cargo');

      const data = await response.json();//parsear respuesta a JSON
      setMensaje(data.message);//respuesta exitosa

      // Limpiar
      setNombreCargo('');
      setDescripcion('');

      // Redirigir a la lista de cargos después de 1 segundo
      setTimeout(() => {
        navigate('/dashboard/cargos');
      }, 1000);
    } catch (error) {
      console.error('❌ Error en agregarCargo:', error);
      setMensaje('❌ Error al agregar el cargo.');
    }
  };

  return (
    <div className="font-sans text-center m-5 ml-64">
      <h1 className="text-3xl font-bold mb-4">Agregar Nuevo Cargo</h1>
      <form className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg">
        <div className="mb-4">
          <input
            type="text"
            id="nombreCargo"
            placeholder="Nombre del Cargo"
            value={nombreCargo}
            onChange={(e) => setNombreCargo(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            id="descripcionCargo"
            placeholder="Descripción"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="button"
          onClick={agregarCargo}
          className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Agregar Cargo
        </button>
        {mensaje && (
          <p className={`mt-4 ${mensaje.includes('❌') ? 'text-red-500' : 'text-green-500'}`}>
            {mensaje}
          </p>
        )}
      </form>
    </div>
  );
};

export default AgregarCargoPage;