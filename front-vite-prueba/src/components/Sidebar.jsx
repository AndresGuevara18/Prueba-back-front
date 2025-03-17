import { Link, useLocation } from 'react-router-dom';

function Sidebar() {
  const location = useLocation();

  const menuItems = [
    { icon: '👤', label: 'Usuarios', path: '/dashboard/usuarios' },
    { icon: '📄', label: 'Reportes', path: '/dashboard/reportes' },
    { icon: '📊', label: 'Estadísticas', path: '/dashboard/estadisticas' },
    { icon: '📷', label: 'Scanner Facial', path: '/dashboard/scanner-facial' },
  ];

  return (
    <div className="w-64 h-screen bg-gray-900 text-white p-5 fixed top-0 left-0">
      <h2 className="text-xl font-bold mb-6">📌 Menú</h2>
      <nav>
        <ul>
          {menuItems.map((item, index) => (
            <li key={index} className="mb-2">
              <Link
                to={item.path}
                className={`flex items-center p-3 rounded transition-colors ${
                  location.pathname === item.path ? 'bg-gray-700' : 'hover:bg-gray-800'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;
