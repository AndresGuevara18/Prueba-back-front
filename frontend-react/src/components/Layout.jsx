import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Shield, User, Search, Facebook, Instagram, Youtube, Menu, X } from 'lucide-react';
import LoginModal from './LoginModal';

function Layout() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userData, setUserData] = useState({
    name: 'Usuario administrador',
    role: 'Administrador',
    email: 'asdf@fs'
  });
  const navigate = useNavigate();

  const handleLogin = (user, token) => {
    setIsLoggedIn(true);
    setUserData({
      name: user.nombre_empleado || user.usuarioadmin || 'Usuario',
      role: user.id_cargo === 1 ? 'Administrador' : user.id_cargo === 2 ? 'Supervisor' : 'Empleado',
      email: user.email_empleado || ''
    });
    setIsLoginModalOpen(false);
    // El token ya se guarda en localStorage en LoginModal
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen w-full bg-gray-50">
      {/* Top Bar */}
      <div className="bg-[#10374E] text-white w-full">
        <div className="max-w-7xl h-[80px] mx-auto px-4">
          <div className="flex justify-end h-full items-center gap-4 md:gap-8 mr-2 md:mr-8">
            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <div className="bg-white/10 p-2 rounded-full">
                  <User className="w-5 h-5" />
                </div>
                <div className="text-sm">
                  <div className="font-medium">{userData.name}</div>
                  <div className="text-white/70 text-xs">{userData.role}</div>
                </div>
              </div>
            ) : (
              <button 
                onClick={() => setIsLoginModalOpen(true)} 
                className="flex items-center gap-2 text-sm hover:text-blue-200 transition-colors"
              >
                <div className="bg-white/10 p-2 rounded-full">
                  <User className="w-5 h-5" />
                </div>
                <span className="hidden sm:inline">INGRESAR</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Header */}
      <nav className="bg-white shadow-md w-full">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2 hover:text-blue-700 transition-colors">
                <img src="../../public/img/colpryst-icon.png" alt="COLPRYST" className="h-10" />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/nosotros" className="text-gray-700 hover:text-blue-600 font-medium">NOSOTROS</Link>
              <Link to="/clientes" className="text-gray-700 hover:text-blue-600 font-medium">CLIENTES</Link>
              <Link to="/certificaciones" className="text-gray-700 hover:text-blue-600 font-medium">CERTIFICACIONES</Link>
              <Link to="/contacto" className="text-gray-700 hover:text-blue-600 font-medium">CONTACTO</Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-700 hover:text-blue-600 focus:outline-none"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 space-y-2 animate-fade-in">
              <Link 
                to="/nosotros" 
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                NOSOTROS
              </Link>
              <Link 
                to="/clientes" 
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                CLIENTES
              </Link>
              <Link 
                to="/certificaciones" 
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                CERTIFICACIONES
              </Link>
              <Link 
                to="/contacto" 
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                CONTACTO
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <Outlet />

      {/* Footer */}
      <footer className="bg-[#424242] text-white w-full font-ledger">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row">
            {/* Social Media Section */}
            <div className="w-full md:w-[536px] p-8 flex flex-col justify-center bg-[#424242]">
              <div className="flex flex-col items-center w-full">
                <div className="relative mb-6 w-full max-w-md">
                  <input
                    type="text"
                    placeholder="Buscar..."
                    className="w-full h-12 px-4 pr-12 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/40"
                  />
                  <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50" />
                </div>
                <h3 className="font-semibold mb-6 text-center">Síguenos</h3>
                <div className="flex justify-center w-full space-x-8 md:space-x-12">
                  <a href="#" className="hover:text-blue-400">
                    <Facebook className="w-6 h-6 md:w-8 md:h-8" />
                  </a>
                  <a href="#" className="hover:text-blue-400">
                    <Instagram className="w-6 h-6 md:w-8 md:h-8" />
                  </a>
                  <a href="#" className="hover:text-blue-400">
                    <Youtube className="w-6 h-6 md:w-8 md:h-8" />
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Section */}
            <div className="w-full md:w-[480px] p-8 flex flex-col justify-center bg-[#303030]">
              <div className="flex flex-col space-y-6">
                <div className="text-base md:text-[18px] text-left">
                  POLITICA DE PREVENCIÓN DEL RIESGO DE CORRUPCION Y SOBORNO
                </div>
                <div className="flex justify-center">
                  <div className="w-full max-w-[400px] border-b border-dotted border-white/50"></div>
                </div>
                <div className="text-base md:text-[18px] text-left">
                  PLATAFORMA VIRTUAL
                </div>
                <div className="flex justify-center">
                  <div className="w-full max-w-[400px] border-b border-dotted border-white/50"></div>
                </div>
                <div className="text-base md:text-[18px] text-left">
                  POLITICA DE SEGURIDAD
                </div>
              </div>
            </div>

            {/* Contact Information Section */}
            <div className="w-full md:w-[480px] p-8 flex flex-col justify-center bg-[#1D1D1D]">
              <div className="space-y-6">
                <h2 className="text-base md:text-[18px] font-ledger border-b border-white/20 pb-2">Contacto</h2>
                <p className="text-xs md:text-[14px]">Carrera 1 # 1A-11 Bogotá</p>
                <p className="text-xs md:text-[14px]">Teléfono: (60-1) 1111117 (57) 1111111110</p>
                <p className="text-xs md:text-[14px]">
                  E-mail: <a href="mailto:info@colpryst.com" className="underline">info@colpryst.com</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      <LoginModal 
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
      />
    </div>
  );
}

export default Layout;