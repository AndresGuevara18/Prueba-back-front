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
  const [itemsPerPage, setItemsPerPage] = useState(8);

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

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentNovelties = filteredNovelties.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredNovelties.length / itemsPerPage);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Buscar novedades..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="today">Hoy</option>
          <option value="yesterday">Ayer</option>
          <option value="week">Esta semana</option>
          <option value="month">Este mes</option>
        </select>
      </div>

      <div className="flex flex-col h-[calc(100vh-12rem)] bg-white rounded-lg shadow-sm">
        {/* Contenido principal - Área scrollable */}
        <div className="flex-1 p-6 overflow-auto min-h-0">
          {loading && <div className="text-center text-gray-500 mt-8">Cargando novedades...</div>}
          
          {error && <div className="text-center text-red-500 mt-8">Error: {error}</div>}
          
          {!loading && !error && noveltiesData.length === 0 && (
            <div className="text-center text-gray-500 mt-8">
              No hay novedades para mostrar.
            </div>
          )}

          {!loading && !error && noveltiesData.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Empleado</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha/Hora</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Detalle</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentNovelties.map((novedad, index) => (
                    <tr key={`${novedad.id_usuario}-${novedad.fecha_hora}-${index}`} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{novedad.nombre_usuario}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                          novedad.tipo_novedad === 'Entrada Tarde' ? 'bg-yellow-100 text-yellow-800' :
                          novedad.tipo_novedad === 'Salida Temprana' ? 'bg-orange-100 text-orange-800' :
                          novedad.tipo_novedad === 'Inasistencia' ? 'bg-red-100 text-red-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {novedad.tipo_novedad}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {new Date(novedad.fecha_hora).toLocaleString('es-ES', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{novedad.detalle || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Paginación - Fija en la parte inferior */}
        <div className="border-t border-gray-200 p-4 bg-white">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-700">
              Mostrando {indexOfFirstItem + 1} a {Math.min(indexOfLastItem, filteredNovelties.length)} de {filteredNovelties.length} resultados
            </div>
            <div className="flex gap-2 items-center">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Primero
              </button>
              
              <div className="flex gap-1 min-w-[120px] justify-center">
                {(() => {
                  let pagesToShow = [];
                  let start = Math.max(1, currentPage - 1);
                  let end = Math.min(start + 2, totalPages);
                  
                  // Ajustar el inicio si estamos al final
                  if (end === totalPages) {
                    start = Math.max(1, end - 2);
                  }
                  
                  for (let i = start; i <= end; i++) {
                    pagesToShow.push(
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i)}
                        className={`px-3 py-2 text-sm border rounded-lg ${
                          currentPage === i
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {i}
                      </button>
                    );
                  }
                  return pagesToShow;
                })()}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Último
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Novelties;