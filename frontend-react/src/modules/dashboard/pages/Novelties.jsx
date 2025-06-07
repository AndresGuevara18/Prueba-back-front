import React, { useState, useEffect, useMemo } from 'react';
import API_BASE_URL from '../../../config/ConfigURL';
import { Search } from 'lucide-react';

function Novelties() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [noveltiesData, setNoveltiesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8); // Puedes ajustar este valor
  useEffect(() => {
    const fetchNovelties = async () => {
      setLoading(true);
      setError(null);
      try {
        // Map frontend period values to backend filter values
        const periodMapping = {
          'today': 'hoy',
          'yesterday': 'ayer',
          'week': 'esta_semana',
          'month': 'este_mes'
        };

        const backendFilter = periodMapping[selectedPeriod];
        const apiUrl = `${API_BASE_URL}/api/novedades${backendFilter ? `?filtro=${backendFilter}` : ''}`;
        console.log('Fetching novelties from:', apiUrl);
        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        console.log('Data received from API:', data);
        setNoveltiesData(Array.isArray(data) ? data : []);
        setCurrentPage(1); // Reset page when new data is loaded
      } catch (err) {
        console.error('Error fetching novelties:', err);
        setError(err.message);
        setNoveltiesData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNovelties();
  }, [selectedPeriod]); // Re-fetch when period changes  // Client-side filtering logic for search term only (period filtering is now done server-side)
  const filteredNovelties = useMemo(() => {
    if (!noveltiesData || noveltiesData.length === 0) return [];

    const trimmedSearchTerm = searchTerm.toLowerCase().trim();
    if (!trimmedSearchTerm) {
      return noveltiesData;
    }

    // Función para normalizar texto (quitar comas, espacios extra, acentos)
    const normalizeText = (text) => {
      if (!text) return '';
      return text
        .toLowerCase()
        .trim()
        // Reemplazar múltiples espacios por uno solo
        .replace(/\s+/g, ' ')
        // Quitar comas y otros signos de puntuación
        .replace(/[,;:.!?]/g, ' ')
        // Normalizar acentos
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        // Limpiar espacios extra nuevamente
        .replace(/\s+/g, ' ')
        .trim();
    };

    // Normalizar el término de búsqueda
    const normalizedSearchTerm = normalizeText(trimmedSearchTerm);

    // Dividir el término de búsqueda en palabras individuales
    const searchWords = normalizedSearchTerm.split(' ').filter(word => word.length > 0);

    return noveltiesData.filter(novedad => {
      // Normalizar todos los campos de búsqueda
      const normalizedName = normalizeText(novedad.nombre_usuario);
      const normalizedType = normalizeText(novedad.tipo_novedad);
      const normalizedDetail = normalizeText(novedad.detalle);

      // Combinar todos los campos de búsqueda en un solo texto
      const combinedText = `${normalizedName} ${normalizedType} ${normalizedDetail}`;

      // Verificar si todas las palabras de búsqueda están presentes
      return searchWords.every(word =>
        combinedText.includes(word)
      );
    });
  }, [noveltiesData, searchTerm]);
  // Effect to reset page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Paginación del lado del cliente (uses filteredNovelties)
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentNovelties = filteredNovelties.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredNovelties.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Novedades de Asistencia</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm mb-8">
        <div className="flex flex-col md:flex-row items-center p-4 gap-4">
          <div className="flex items-center w-full md:w-auto flex-1">
            <Search className="text-gray-400 w-5 h-5" />            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nombre, tipo de novedad o detalle..."
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
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 min-h-[400px]">        {loading && <div className="text-center text-gray-500 mt-8">Cargando novedades...</div>}
        {error && <div className="text-center text-red-500 mt-8">Error al cargar novedades: {error}</div>}
        {!loading && !error && filteredNovelties.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            No hay novedades para mostrar con los filtros actuales.
          </div>
        )}
        {!loading && !error && filteredNovelties.length > 0 && (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo Novedad</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha y Hora</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Detalle</th>
              </tr>
            </thead>            <tbody className="bg-white divide-y divide-gray-200">
              {currentNovelties.map((novedad, index) => (
                <tr key={`${novedad.id_usuario}-${novedad.fecha_hora}-${index}`} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {novedad.nombre_usuario}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${novedad.tipo_novedad === 'Entrada Tarde' ? 'bg-yellow-100 text-yellow-800' :
                        novedad.tipo_novedad === 'Salida Temprana' ? 'bg-orange-100 text-orange-800' :
                          novedad.tipo_novedad === 'Inasistencia' ? 'bg-red-100 text-red-800' :
                            'bg-green-100 text-green-800'
                      }`}>
                      {novedad.tipo_novedad}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(novedad.fecha_hora).toLocaleString('es-ES', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {novedad.detalle || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>)}
        {!loading && !error && filteredNovelties.length > itemsPerPage && (
          <div className="mt-4 flex justify-center">
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                Anterior
              </button>
              {[...Array(totalPages).keys()].map(number => (
                <button
                  key={number + 1}
                  onClick={() => paginate(number + 1)}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${currentPage === number + 1 ? 'text-indigo-600 bg-indigo-50' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  {number + 1}
                </button>
              ))}
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                Siguiente
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}

export default Novelties;