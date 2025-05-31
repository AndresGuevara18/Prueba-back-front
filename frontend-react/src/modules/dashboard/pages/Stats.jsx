import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    title: {
      display: false
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      max: 100,
      ticks: {
        callback: function(value) {
          return value + '%';
        }
      }
    }
  }
};

const mockData = {
  today: {
    labels: ['09:00', '11:00', '13:00', '15:00', '17:00'],
    data: [95, 88, 92, 85, 90]
  },
  yesterday: {
    labels: ['09:00', '11:00', '13:00', '15:00', '17:00'],
    data: [88, 85, 90, 82, 87]
  },
  week: {
    labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'],
    data: [92, 88, 85, 90, 87]
  },
  month: {
    labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
    data: [89, 91, 87, 90]
  }
};

function Stats() {
  const [selectedPeriod, setSelectedPeriod] = useState('today');

  const data = {
    labels: mockData[selectedPeriod].labels,
    datasets: [
      {
        data: mockData[selectedPeriod].data,
        backgroundColor: '#3B82F6',
        borderRadius: 6,
      }
    ]
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Estadísticas</h1>
      </div>

      {/* Period Selector */}
      <div className="mb-6 rounded-lg bg-white p-4 shadow-sm">
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="rounded-lg border border-gray-200 px-4 py-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="today">Hoy</option>
          <option value="yesterday">Ayer</option>
          <option value="week">Esta semana</option>
          <option value="month">Este mes</option>
        </select>
      </div>

      {/* Chart Section */}
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-700">
          Asistencia del día (%)
        </h2>
        <div className="h-[400px]">
          <Bar options={options} data={data} />
        </div>
      </div>
    </div>
  );
}

export default Stats;