//src/modules/dashboard/pages/usuario/IncidenciasUsuario.jsx
import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../../../../config/ConfigURL';
import { Search } from 'lucide-react';

function IncidenciasUsuario() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [incidencias, setIncidencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  useEffect(() => {
    const fetchIncidencias = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = sessionStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/api/asistencia/incidencias?filtro=${selectedPeriod}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('No se pudo cargar las incidencias');
        const data = await response.json();
        setIncidencias(data);
        setCurrentPage(1);
      } catch (err) {
        setError('No se pudo cargar las incidencias');
        setIncidencias([]);
      } finally {
        setLoading(false);
      }
    };
    fetchIncidencias();
  }, [selectedPeriod]);

  const filteredIncidencias = incidencias.filter(a => {
    const term = searchTerm.toLowerCase();
    return (
      (a.tipo && a.tipo.toLowerCase().includes(term)) ||
      (a.fecha_hora && a.fecha_hora.toLowerCase().includes(term)) ||
      (a.detalle && a.detalle.toLowerCase().includes(term))
    );
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentIncidencias = filteredIncidencias.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredIncidencias.length / itemsPerPage);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Buscar incidencia..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        <div>
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
      </div>
      <div className="flex flex-col h-[calc(100vh-12rem)] bg-white rounded-lg shadow-sm">
        <div className="flex-1 p-6 overflow-auto min-h-0">
          {loading && <div className="text-center text-gray-500 mt-8">Cargando incidencias...</div>}
          {error && <div className="text-center text-red-500 mt-8">Error: {error}</div>}
          {!loading && !error && filteredIncidencias.length === 0 && (
            <div className="text-center text-gray-500 mt-8">No hay registros de incidencias.</div>
          )}
          {!loading && !error && filteredIncidencias.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hora</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Detalle</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentIncidencias.map((a, i) => {
                    const fecha = a.fecha_hora ? new Date(a.fecha_hora).toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' }) : '-';
                    const hora = a.fecha_hora ? new Date(a.fecha_hora).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : '-';
                    return (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm">
                          <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                            a.tipo === 'Entrada tarde'
                              ? 'bg-violet-600 text-white'
                              : a.tipo === 'Salida temprana'
                              ? 'bg-orange-500 text-white'
                              : a.tipo === 'Inasistencia'
                              ? 'bg-red-500 text-white'
                              : 'bg-blue-500 text-white'
                          }`}>
                            {a.tipo}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{fecha}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{hora}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{a.detalle || '-'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div className="border-t border-gray-200 p-4 bg-white">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-700">
              Mostrando {indexOfFirstItem + 1} a {Math.min(indexOfLastItem, filteredIncidencias.length)} de {filteredIncidencias.length} resultados
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

export default IncidenciasUsuario;
