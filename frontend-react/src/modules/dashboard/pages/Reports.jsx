import React, { useState, useEffect, useMemo } from 'react';
import { Search, Download } from 'lucide-react';
import API_BASE_URL from '../../../config/ConfigURL';

function Reports() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('attendance');
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  // Mapeo de tipos de reporte a endpoints
  const reportEndpoints = {
    attendance: 'asistencia',
    lateArrivals: 'llegadas-tarde',
    earlyDepartures: 'salidas-temprano',
    absences: 'ausencias'
  };

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
      
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data = await response.json();
      setReportData(Array.isArray(data) ? data : []);
      setCurrentPage(1);
    } catch (err) {
      setError(err.message);
      setReportData([]);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar datos según el término de búsqueda
  const filteredData = useMemo(() => {
    return reportData.filter(item => {
      const searchStr = searchTerm.toLowerCase();
      switch (selectedType) {
        case 'attendance':
          return item.nombre_completo?.toLowerCase().includes(searchStr);
        case 'lateArrivals':
        case 'earlyDepartures':
          return (
            item.nombre_completo?.toLowerCase().includes(searchStr) ||
            item.comentarios?.toLowerCase().includes(searchStr)
          );
        case 'absences':
          return (
            item.nombre_completo?.toLowerCase().includes(searchStr) ||
            item.motivo?.toLowerCase().includes(searchStr)
          );
        default:
          return true;
      }
    });
  }, [reportData, searchTerm, selectedType]);

  // Calcular datos de paginación
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const renderTableHeaders = () => {
    switch (selectedType) {
      case 'attendance':
        return (
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Nombre</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Fecha Entrada</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Hora Entrada</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Fecha Salida</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Hora Salida</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Estado</th>
          </tr>
        );
      case 'lateArrivals':
        return (
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Nombre</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Fecha</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Hora Entrada</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Hora Esperada</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Comentarios</th>
          </tr>
        );
      case 'earlyDepartures':
        return (
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Nombre</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Fecha</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Hora Salida</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Hora Esperada</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Comentarios</th>
          </tr>
        );
      case 'absences':
        return (
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Nombre</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Fecha</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Motivo</th>
          </tr>
        );
      default:
        return null;
    }
  };

  const renderTableRows = () => {
    if (loading) {
      const colSpan = selectedType === 'absences' ? 3 : selectedType === 'attendance' ? 6 : 5;
      return (
        <tr>
          <td colSpan={colSpan} className="px-6 py-4 text-center text-sm text-gray-500">
            Cargando datos del reporte...
          </td>
        </tr>
      );
    }

    if (error) {
      const colSpan = selectedType === 'absences' ? 3 : selectedType === 'attendance' ? 6 : 5;
      return (
        <tr>
          <td colSpan={colSpan} className="px-6 py-4 text-center text-sm text-red-500">
            Error: {error}
          </td>
        </tr>
      );
    }

    if (!currentItems.length) {
      const colSpan = selectedType === 'absences' ? 3 : selectedType === 'attendance' ? 6 : 5;
      return (
        <tr>
          <td colSpan={colSpan} className="px-6 py-4 text-center text-sm text-gray-500">
            No hay datos para mostrar
          </td>
        </tr>
      );
    }

    return currentItems.map((item, index) => {
      switch (selectedType) {
        case 'attendance':
          return (
            <tr key={`${item.id_usuario}-${index}`} className="hover:bg-gray-50">
              <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                {item.nombre_completo}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                {item.fecha_hora_entrada ? new Date(item.fecha_hora_entrada).toLocaleDateString('es-ES') : '-'}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                {item.fecha_hora_entrada ? new Date(item.fecha_hora_entrada).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : '-'}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                {item.fecha_hora_salida ? new Date(item.fecha_hora_salida).toLocaleDateString('es-ES') : '-'}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                {item.fecha_hora_salida ? new Date(item.fecha_hora_salida).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : '-'}
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                  item.fecha_hora_entrada && item.fecha_hora_salida 
                    ? 'bg-green-100 text-green-800'
                    : item.fecha_hora_entrada 
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {item.fecha_hora_entrada && item.fecha_hora_salida 
                    ? 'Completa'
                    : item.fecha_hora_entrada 
                    ? 'Entrada Registrada'
                    : 'Sin Registro'}
                </span>
              </td>
            </tr>
          );
        case 'lateArrivals':
          return (
            <tr key={`${item.id_notificacion}-${index}`} className="hover:bg-gray-50">
              <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                {item.nombre_completo}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                {new Date(item.fecha_hora_entrada_registrada).toLocaleDateString('es-ES')}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                {new Date(item.fecha_hora_entrada_registrada).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
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
              <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                {item.nombre_completo}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                {new Date(item.fecha_hora_salida_registrada).toLocaleDateString('es-ES')}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                {new Date(item.fecha_hora_salida_registrada).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
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
              <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                {item.nombre_completo}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
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

  const exportToCSV = () => {
    const filename = `reporte-${selectedType}-${new Date().toISOString().slice(0,10)}.csv`;
    const headers = {
      attendance: ['Nombre', 'Fecha Entrada', 'Hora Entrada', 'Fecha Salida', 'Hora Salida', 'Estado'],
      lateArrivals: ['Nombre', 'Fecha', 'Hora Entrada', 'Hora Esperada', 'Comentarios'],
      earlyDepartures: ['Nombre', 'Fecha', 'Hora Salida', 'Hora Esperada', 'Comentarios'],
      absences: ['Nombre', 'Fecha', 'Motivo']
    };

    const csvContent = [
      // BOM for Excel to reconocer UTF-8
      '\ufeff' + headers[selectedType].join(','),
      // Filas de datos
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
      </div>      <div className="flex flex-col h-[calc(100vh-12rem)] bg-white rounded-lg shadow-sm">
        {/* Header y Filtros - Fijo en la parte superior */}
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Tipo de reporte
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="attendance">Asistencia</option>
                <option value="lateArrivals">Llegadas tarde</option>
                <option value="earlyDepartures">Salidas temprano</option>
                <option value="absences">Ausencias</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Fecha inicio
              </label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Fecha fin
              </label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Buscar
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por nombre..."
                  className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
            <button
              onClick={fetchReport}
              className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!dateRange.start || !dateRange.end}
            >
              Generar Reporte
            </button>
            
            <button
              onClick={exportToCSV}
              disabled={filteredData.length === 0}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-white transition-colors hover:bg-green-600 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              <Download className="h-5 w-5" />
              Exportar CSV
            </button>
          </div>
        </div>

        {/* Contenido principal - Área scrollable */}
        <div className="flex-1 p-6 overflow-auto min-h-0">
          {loading && (
            <div className="text-center text-gray-500 mt-8">
              Cargando datos del reporte...
            </div>
          )}
          
          {error && (
            <div className="text-center text-red-500 mt-8">
              Error: {error}
            </div>
          )}
          
          {!loading && !error && reportData.length === 0 && (
            <div className="text-center text-gray-500 mt-8">
              No hay datos para mostrar.
            </div>
          )}

          {!loading && !error && reportData.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  {renderTableHeaders()}
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {renderTableRows()}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Paginación - Fija en la parte inferior */}
        {filteredData.length > 0 && (
          <div className="border-t border-gray-200 p-4 bg-white">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-600">
                  Mostrando {indexOfFirstItem + 1} a {Math.min(indexOfLastItem, filteredData.length)} de {filteredData.length} resultados
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="rounded border border-gray-300 px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={5}>5</option>
                    <option value={8}>8</option>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                  </select>
                  <span className="text-sm text-gray-600">por página</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Primero
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Anterior
                </button>

                {/* Números de página */}
                <div className="flex gap-1">
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
                          className={`rounded-lg border px-3 py-2 text-sm ${
                            currentPage === i
                              ? 'border-blue-500 bg-blue-500 text-white'
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
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Siguiente
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Último
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Reports;