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

      <div className="bg-white rounded-lg shadow-sm mb-8">
        <div className="flex flex-col md:flex-row items-center p-4 gap-4">
          <div className="flex items-center w-full md:w-auto flex-1">
            <Search className="text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nombre o descripción..."
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

      <div className="bg-white rounded-lg shadow-sm p-6 min-h-[400px]">
        <div className="text-center text-gray-500 mt-8">
          No hay novedades para mostrar
        </div>
      </div>
    </div>
  );
}

export default Novelties;