import React, { useState } from 'react';
import { Search } from 'lucide-react';

function Novelties() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('today');

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Novedades de Asistencia</h1>
      </div>

      <div className="mb-8 rounded-lg bg-white shadow-sm">
        <div className="flex flex-col items-center gap-4 p-4 md:flex-row">
          <div className="flex w-full flex-1 items-center md:w-auto">
            <Search className="h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nombre o descripción..."
              className="ml-3 w-full flex-1 outline-none"
            />
          </div>
          <select 
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-4 py-2 text-gray-600 md:w-auto"
          >
            <option value="today">Hoy</option>
            <option value="yesterday">Ayer</option>
            <option value="week">Esta semana</option>
            <option value="month">Este mes</option>
          </select>
        </div>
      </div>

      <div className="min-h-[400px] rounded-lg bg-white p-6 shadow-sm">
        <div className="mt-8 text-center text-gray-500">
          No hay novedades para mostrar
        </div>
      </div>
    </div>
  );
}

export default Novelties;