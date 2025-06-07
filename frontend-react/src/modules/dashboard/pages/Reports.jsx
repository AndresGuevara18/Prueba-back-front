import React, { useState, useEffect, useMemo } from 'react';
import { Search, Download } from 'lucide-react';
import API_BASE_URL from '../../../config/ConfigURL';

function Reports() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('attendance');
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  }); const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Mapeo de tipos de reporte a endpoints
  const reportEndpoints = {
    attendance: 'asistencia',
    lateArrivals: 'llegadas-tarde',
    earlyDepartures: 'salidas-temprano',
    absences: 'ausencias'
  };

  // Función para obtener reportes
  const fetchReport = async () => {
    if (!dateRange.start || !dateRange.end) {
      setError('Por favor, selecciona las fechas de inicio y fin');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const endpoint = reportEndpoints[selectedType];
      const apiUrl = `${API_BASE_URL}/api/reportes/${endpoint}?fechaInicio=${dateRange.start}&fechaFin=${dateRange.end}`;

      console.log('Fetching report from:', apiUrl);
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data = await response.json();
      console.log('Report data received:', data);
      setReportData(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching report:', err);
      setError(err.message);
      setReportData([]);
    } finally {
      setLoading(false);
    }
  };
  // Función para normalizar texto (eliminar tildes y convertir a minúsculas)
  const normalizeText = (text) => {
    if (!text) return '';
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Eliminar tildes y acentos
      .replace(/[^\w\s]/g, '') // Eliminar caracteres especiales excepto espacios
      .trim();
  };

  // Filtrar datos basado en el término de búsqueda
  const filteredData = useMemo(() => {
    if (!reportData.length) return [];

    const normalizedSearchTerm = normalizeText(searchTerm);
    if (!normalizedSearchTerm) return reportData;

    return reportData.filter(item => {
      const searchableFields = [
        item.nombre_completo,
        item.comentarios,
        item.motivo
      ];

      return searchableFields.some(field =>
        normalizeText(field).includes(normalizedSearchTerm)
      );
    });
  }, [reportData, searchTerm]);

  // Calcular datos de paginación
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  // Resetear página cuando cambian los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedType, dateRange.start, dateRange.end]);

  // Obtener reporte automáticamente cuando cambian las fechas o el tipo
  useEffect(() => {
    if (dateRange.start && dateRange.end) {
      fetchReport();
    }
  }, [selectedType, dateRange.start, dateRange.end]);

  // Función para renderizar las columnas según el tipo de reporte
  const renderTableHeaders = () => {
    switch (selectedType) {
      case 'attendance':
        return (
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Entrada</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hora Entrada</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Salida</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hora Salida</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
          </tr>
        );
      case 'lateArrivals':
        return (
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hora Entrada</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hora Notificación</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comentarios</th>
          </tr>
        );
      case 'earlyDepartures':
        return (
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hora Salida</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hora Notificación</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comentarios</th>
          </tr>
        );
      case 'absences':
        return (
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Motivo</th>
          </tr>
        );
      default:
        return null;
    }
  };

  // Función para renderizar las filas según el tipo de reporte
  const renderTableRows = () => {
    if (loading) {
      const colSpan = selectedType === 'absences' ? 3 : selectedType === 'attendance' ? 6 : 5;
      return (
        <tr>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center" colSpan={colSpan}>
            Cargando datos del reporte...
          </td>
        </tr>
      );
    }

    if (error) {
      const colSpan = selectedType === 'absences' ? 3 : selectedType === 'attendance' ? 6 : 5;
      return (
        <tr>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-red-500 text-center" colSpan={colSpan}>
            Error: {error}
          </td>
        </tr>
      );
    }

    if (!filteredData.length) {
      const colSpan = selectedType === 'absences' ? 3 : selectedType === 'attendance' ? 6 : 5;
      return (
        <tr>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center" colSpan={colSpan}>
            No hay datos para mostrar
          </td>
        </tr>
      );
    }

    return currentData.map((item, index) => {
      switch (selectedType) {
        case 'attendance':
          return (
            <tr key={`${item.id_usuario}-${index}`} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {item.nombre_completo}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {item.fecha_hora_entrada ? new Date(item.fecha_hora_entrada).toLocaleDateString('es-ES') : '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {item.fecha_hora_entrada ? new Date(item.fecha_hora_entrada).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {item.fecha_hora_salida ? new Date(item.fecha_hora_salida).toLocaleDateString('es-ES') : '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {item.fecha_hora_salida ? new Date(item.fecha_hora_salida).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${item.fecha_hora_entrada && item.fecha_hora_salida ? 'bg-green-100 text-green-800' :
                    item.fecha_hora_entrada ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                  }`}>
                  {item.fecha_hora_entrada && item.fecha_hora_salida ? 'Completa' :
                    item.fecha_hora_entrada ? 'Entrada Registrada' : 'Sin Registro'}
                </span>
              </td>
            </tr>
          );

        case 'lateArrivals':
          return (
            <tr key={`${item.id_notificacion}-${index}`} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {item.nombre_completo}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(item.fecha_hora_entrada_registrada).toLocaleDateString('es-ES')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(item.fecha_hora_entrada_registrada).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(item.fecha_hora_notificacion).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {item.comentarios || '-'}
              </td>
            </tr>
          );

        case 'earlyDepartures':
          return (
            <tr key={`${item.id_notificacion}-${index}`} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {item.nombre_completo}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(item.fecha_hora_salida_registrada).toLocaleDateString('es-ES')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(item.fecha_hora_salida_registrada).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(item.fecha_hora_notificacion).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {item.comentarios || '-'}
              </td>
            </tr>
          );

        case 'absences':
          return (
            <tr key={`${item.id_inasistencia}-${index}`} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {item.nombre_completo}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(item.fecha).toLocaleDateString('es-ES')}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {item.motivo || '-'}
              </td>
            </tr>
          );

        default:
          return null;
      }
    });
  };

  // Función para exportar a CSV
  const exportToCSV = () => {
    if (!filteredData.length) return;

    let headers = [];
    let filename = '';

    // Definir headers y filename según el tipo de reporte
    switch (selectedType) {
      case 'attendance':
        headers = ['Nombre', 'Fecha Entrada', 'Hora Entrada', 'Fecha Salida', 'Hora Salida', 'Estado'];
        filename = 'reporte_asistencia.csv';
        break;
      case 'lateArrivals':
        headers = ['Nombre', 'Fecha', 'Hora Entrada', 'Hora Notificación', 'Comentarios'];
        filename = 'reporte_llegadas_tarde.csv';
        break;
      case 'earlyDepartures':
        headers = ['Nombre', 'Fecha', 'Hora Salida', 'Hora Notificación', 'Comentarios'];
        filename = 'reporte_salidas_temprano.csv';
        break;
      case 'absences':
        headers = ['Nombre', 'Fecha', 'Motivo'];
        filename = 'reporte_ausencias.csv';
        break;
      default:
        return;
    }

    // Crear contenido CSV
    const csvContent = [
      headers.join(','),
      ...filteredData.map(item => {
        switch (selectedType) {
          case 'attendance':
            return [
              `"${item.nombre_completo || ''}"`,
              `"${item.fecha_hora_entrada ? new Date(item.fecha_hora_entrada).toLocaleDateString('es-ES') : ''}"`,
              `"${item.fecha_hora_entrada ? new Date(item.fecha_hora_entrada).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : ''}"`,
              `"${item.fecha_hora_salida ? new Date(item.fecha_hora_salida).toLocaleDateString('es-ES') : ''}"`,
              `"${item.fecha_hora_salida ? new Date(item.fecha_hora_salida).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : ''}"`,
              `"${item.fecha_hora_entrada && item.fecha_hora_salida ? 'Completa' : item.fecha_hora_entrada ? 'Entrada Registrada' : 'Sin Registro'}"`
            ].join(',');
          case 'lateArrivals':
            return [
              `"${item.nombre_completo || ''}"`,
              `"${new Date(item.fecha_hora_entrada_registrada).toLocaleDateString('es-ES')}"`,
              `"${new Date(item.fecha_hora_entrada_registrada).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}"`,
              `"${new Date(item.fecha_hora_notificacion).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}"`,
              `"${item.comentarios || ''}"`
            ].join(',');
          case 'earlyDepartures':
            return [
              `"${item.nombre_completo || ''}"`,
              `"${new Date(item.fecha_hora_salida_registrada).toLocaleDateString('es-ES')}"`,
              `"${new Date(item.fecha_hora_salida_registrada).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}"`,
              `"${new Date(item.fecha_hora_notificacion).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}"`,
              `"${item.comentarios || ''}"`
            ].join(',');
          case 'absences':
            return [
              `"${item.nombre_completo || ''}"`,
              `"${new Date(item.fecha).toLocaleDateString('es-ES')}"`,
              `"${item.motivo || ''}"`
            ].join(',');
          default:
            return '';
        }
      })
    ].join('\n');

    // Descargar archivo
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Reportes</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de reporte
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="attendance">Asistencia</option>
              <option value="lateArrivals">Llegadas tarde</option>
              <option value="earlyDepartures">Salidas temprano</option>
              <option value="absences">Ausencias</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha inicio
            </label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha fin
            </label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar
            </label>
            <div className="relative">              <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nombre, comentarios, motivo..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>
        </div>        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              {filteredData.length > 0 && (
                <span>
                  Mostrando {startIndex + 1}-{Math.min(endIndex, filteredData.length)} de {filteredData.length} registro(s)
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Mostrar:</label>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span className="text-sm text-gray-600">por página</span>
            </div>
          </div>
          <button
            onClick={exportToCSV}
            disabled={filteredData.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <Download className="w-5 h-5" />
            Exportar CSV
          </button>
        </div>        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              {renderTableHeaders()}
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {renderTableRows()}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {filteredData.length > 0 && totalPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
            <div className="text-sm text-gray-600">
              Página {currentPage} de {totalPages}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Primero
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>

              {/* Números de página */}
              <div className="flex gap-1">
                {(() => {
                  const pages = [];
                  const showPages = 5;
                  let startPage = Math.max(1, currentPage - Math.floor(showPages / 2));
                  let endPage = Math.min(totalPages, startPage + showPages - 1);

                  if (endPage - startPage + 1 < showPages) {
                    startPage = Math.max(1, endPage - showPages + 1);
                  }

                  for (let i = startPage; i <= endPage; i++) {
                    pages.push(
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i)}
                        className={`px-3 py-2 text-sm border rounded-lg ${currentPage === i
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'border-gray-300 hover:bg-gray-50'
                          }`}
                      >
                        {i}
                      </button>
                    );
                  }
                  return pages;
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
        )}
      </div>
    </div>
  );
}

export default Reports;