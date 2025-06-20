import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import API_BASE_URL from '../../../../config/ConfigURL';

function HistorialUsuario() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [registros, setRegistros] = useState([]);
  const [diasConRegistros, setDiasConRegistros] = useState([]);
  const [loading, setLoading] = useState(false);

  // Cargar días con registros al cambiar de mes/año
  useEffect(() => {
    const fetchDiasConRegistros = async () => {
      setLoading(true);
      const mes = selectedDate.getMonth() + 1;
      const anio = selectedDate.getFullYear();
      const token = sessionStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/asistencia/historial?mes=${mes}&anio=${anio}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      // Extrae solo los días con registros
      const dias = data.map(r => new Date(r.fecha_hora).getDate());
      setDiasConRegistros([...new Set(dias)]);
      setLoading(false);
    };
    fetchDiasConRegistros();
  }, [selectedDate]);

  // Cargar registros del día seleccionado
  useEffect(() => {
    const fetchRegistros = async () => {
      setLoading(true);
      const fecha = selectedDate.toISOString().split('T')[0];
      const token = sessionStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/asistencia/historial?fecha=${fecha}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setRegistros(data);
      setLoading(false);
    };
    fetchRegistros();
  }, [selectedDate]);

  // Resalta los días con registros
  const tileClassName = ({ date, view }) => {
    if (view === 'month' && diasConRegistros.includes(date.getDate()) && date.getMonth() === selectedDate.getMonth()) {
      return 'bg-blue-200 rounded-full font-bold';
    }
    return '';
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Historial de Asistencia</h2>
      <div className="flex flex-col md:flex-row gap-8">
        <div>
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            tileClassName={tileClassName}
            prev2Label="«"
            next2Label="»"
            locale="es-ES"
          />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold mb-2">
            Registros del {selectedDate.toLocaleDateString()}
          </h3>
          {loading ? (
            <p>Cargando...</p>
          ) : registros.length === 0 ? (
            <p>No hay registros para este día.</p>
          ) : (
            <table className="min-w-full bg-white border rounded shadow text-center">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b text-center">Tipo</th>
                  <th className="py-2 px-4 border-b text-center">Fecha/Hora</th>
                  <th className="py-2 px-4 border-b text-center">Detalle</th>
                </tr>
              </thead>
              <tbody>
                {registros.map((r, i) => (
                  <tr key={i}>
                    <td className="py-2 px-4 border-b text-center">{r.tipo}</td>
                    <td className="py-2 px-4 border-b text-center">{new Date(r.fecha_hora).toLocaleString()}</td>
                    <td className="py-2 px-4 border-b text-center">{r.detalle}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default HistorialUsuario;
