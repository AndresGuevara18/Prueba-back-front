//src/modules/dashboard/components/pages/AgregarCargoPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../../../config/ConfigURL'; 
import Swal from 'sweetalert2';

const AgregarCargoPage = () => {
    //Almacena el valor
    const [nombreCargo, setNombreCargo] = useState('');//nombre
    const [descripcion, setDescripcion] = useState('');//descripcion
    const [mensaje, setMensaje] = useState('');//mensajes de exito o error
    const [idHorario, setIdHorario] = useState(''); // Nuevo estado para el id_horario
  const navigate = useNavigate();
  // URL del backend
  const API_URL = `${API_BASE_URL}/api/cargos`;

  useEffect(() => {
    document.title = "COLPRYST | Agregar Cargo"; // Cambiar el título de la página
  }, []);

  const agregarCargo = async () => {
    try {
      // Validar campos
      if (!nombreCargo.trim() || !descripcion.trim() || !idHorario) {
        setMensaje('⚠️ Todos los campos son obligatorios.');
        return;
      }

      // petición POST al backend
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre_cargo: nombreCargo, descripcion, id_horario: idHorario }),
      });

      const data = await response.json(); // parsear respuesta a JSON

      if (!response.ok) {
        // Si el backend envía un error y alerta, mostrarlo como alerta
        if (data.alert) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: data.error
          });
        }
        setMensaje(data.error || '❌ Error al agregar el cargo.');
        return;
      }

      setMensaje(data.message); // respuesta exitosa

      // Limpiar
      setNombreCargo('');
      setDescripcion('');
      setIdHorario('');

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
    <div className="m-5 text-center font-sans">
      <h1 className="mb-4 text-3xl font-bold">Agregar Nuevo Cargo</h1>
      <form className="mx-auto max-w-md rounded-lg bg-white p-6 shadow-lg">
        <div className="mb-4">
          <input
            type="text"
            id="nombreCargo"
            placeholder="Nombre del Cargo"
            value={nombreCargo}
            onChange={(e) => setNombreCargo(e.target.value)}
            className="w-full rounded border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            id="descripcionCargo"
            placeholder="Descripción"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full rounded border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <input
            type="number"
            id="idHorario"
            placeholder="ID Horario"
            value={idHorario}
            onChange={(e) => setIdHorario(e.target.value)}
            className="w-full rounded border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="button"
          onClick={agregarCargo}
          className="w-full rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
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