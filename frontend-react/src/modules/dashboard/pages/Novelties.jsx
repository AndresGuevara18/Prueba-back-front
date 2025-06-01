import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

// Simulación de la función de API (reemplazar con la llamada real)
async function fetchNoveltiesAPI(searchTerm, selectedPeriod, currentPage = 1, itemsPerPage = 10) {
  const queryParams = new URLSearchParams();
  if (searchTerm) {
    queryParams.append('searchTerm', searchTerm);
  }
  if (selectedPeriod) {
    queryParams.append('periodo', selectedPeriod);
  }
  queryParams.append('page', currentPage);
  queryParams.append('limit', itemsPerPage);

  // Asegúrate de que la URL base sea correcta para tu backend
  const response = await fetch(`/api/novedades?${queryParams.toString()}`); // URL Original
  // const response = await fetch(`/api/novedades_test?${queryParams.toString()}`); // Cambio TEMPORAL a endpoint de prueba
  if (!response.ok) {
    throw new Error('Error al cargar las novedades');
  }
  return response.json();
}

function Novelties() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [novelties, setNovelties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalNovelties, setTotalNovelties] = useState(0);
  const itemsPerPage = 10; // O el valor que prefieras

  useEffect(() => {
    const loadNovelties = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchNoveltiesAPI(searchTerm, selectedPeriod, currentPage, itemsPerPage);
        setNovelties(data.novedades || []);
        setTotalPages(data.totalPaginas || 0);
        setTotalNovelties(data.totalNovedades || 0);
      } catch (err) {
        setError(err.message);
        setNovelties([]); // Limpiar novedades en caso de error
      }
      setLoading(false);
    };

    loadNovelties();
  }, [searchTerm, selectedPeriod, currentPage]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Novedades de Asistencia</h1>
        <p className="text-sm text-gray-600">Mostrando {novelties.length} de {totalNovelties} novedades. Página {currentPage} de {totalPages}.</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm mb-8">
        <div className="flex flex-col md:flex-row items-center p-4 gap-4">
          <div className="flex items-center w-full md:w-auto flex-1">
            <Search className="text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nombre, apellido o cargo..."
              className="flex-1 ml-3 outline-none w-full"
            />
          </div>
          <select 
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="w-full md:w-auto px-4 py-2 border border-gray-200 rounded-lg text-gray-600"
          >
            <option value="today">Hoy</option>
            <option value="yesterday">Ayer</option>
            <option value="week">Esta semana</option>
            <option value="month">Este mes</option>
            {/* Considera una opción para "Todos" o un rango de fechas personalizado */}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 min-h-[400px]">
        {loading && <div className="text-center text-gray-500">Cargando novedades...</div>}
        {error && <div className="text-center text-red-500">Error: {error}</div>}
        {!loading && !error && novelties.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            No hay novedades para mostrar según los filtros seleccionados.
          </div>
        )}
        {!loading && !error && novelties.length > 0 && (
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <th className="px-4 py-3">Tipo Novedad</th>
                <th className="px-4 py-3">Usuario</th>
                <th className="px-4 py-3">Cargo</th>
                <th className="px-4 py-3">Fecha y Hora</th>
                <th className="px-4 py-3">Detalle</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm">
              {novelties.map((novelty) => (
                <tr key={novelty.id_novedad + novelty.tipo_novedad} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${novelty.tipo_novedad === 'entrada_tarde' ? 'bg-yellow-200 text-yellow-800' : 'bg-orange-200 text-orange-800'}`}>
                      {novelty.tipo_novedad === 'entrada_tarde' ? 'Entrada Tarde' : 'Salida Temprana'}
                    </span>
                  </td>
                  {/* <td className="px-4 py-3">{novelty.nombre_usuario} {novelty.apellido_usuario}</td> */}
                  <td className="px-4 py-3">{novelty.nombre_usuario}</td> {/* Corregido para mostrar solo nombre_usuario */}
                  <td className="px-4 py-3">{novelty.cargo_usuario}</td>
                  <td className="px-4 py-3">{new Date(novelty.fecha_hora_evento).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    {novelty.detalle_novedad || (novelty.tipo_novedad === 'entrada_tarde' ? 'Llegada después de la hora' : 'Salida antes de la hora')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!loading && !error && totalPages > 1 && (
          <div className="mt-6 flex justify-center items-center space-x-2">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Anterior
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => (
              <button
                key={pageNumber}
                onClick={() => setCurrentPage(pageNumber)}
                className={`px-4 py-2 border rounded-md text-sm font-medium ${currentPage === pageNumber ? 'bg-blue-500 text-white border-blue-500' : 'text-gray-700 hover:bg-gray-50 border-gray-300'}`}
              >
                {pageNumber}
              </button>
            ))}
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Novelties;