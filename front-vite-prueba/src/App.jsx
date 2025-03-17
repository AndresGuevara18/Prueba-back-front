import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import UsuariosPage from "./pages/UsuariosPage";
import UsuarioAgregar from "./pages/UsuarioAgregar"
import CargoPage from "./pages/CargoPage";
import AgregarCargoPage from "./pages/AgregarCargo"; 
import Sidebar from "./components/Sidebar";

function App() {
  return (
    <Router>
      <div className="flex h-screen">
        <Sidebar /> {/* Asegura que el Sidebar se muestra siempre */}
        <div className="flex-1 p-4 overflow-y-auto">
          <Routes>
            {/* 🔹 Redirigir "/" a "/dashboard/usuarios" */}
            <Route path="/" element={<Navigate to="/dashboard/usuarios" />} />
            <Route path="/dashboard/usuarios" element={<UsuariosPage />} />
            <Route path="/dashboard/agregar-usuario" element={<UsuarioAgregar />} />
            <Route path="/dashboard/cargos" element={<CargoPage />} />
            <Route path="/dashboard/agregar-cargo" element={<AgregarCargoPage />} /> {/* Nueva ruta */}
            {/* 🔹 Manejo de rutas no encontradas */}
            <Route path="*" element={<h1 className="text-center text-3xl">404 - Página no encontrada</h1>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;