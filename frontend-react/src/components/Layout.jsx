import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Shield, User, Search, Facebook, Instagram, Youtube, Menu, X } from 'lucide-react';
import LoginModal from './LoginModal';
import logoColpryst from '../assets/img/colpryst-icon.png';

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
      <div className="w-full bg-[#10374E] text-white">
        <div className="mx-auto h-[80px] max-w-7xl px-4">
          <div className="mr-2 flex h-full items-center justify-end gap-4 md:mr-8 md:gap-8">
            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-white/10 p-2">
                  <User className="h-5 w-5" />
                </div>
                <div className="text-sm">
                  <div className="font-medium">{userData.name}</div>
                  <div className="text-xs text-white/70">{userData.role}</div>
                </div>
              </div>
            ) : (
              <button 
                onClick={() => setIsLoginModalOpen(true)} 
                className="flex items-center gap-2 text-sm transition-colors hover:text-blue-200"
              >
                <div className="rounded-full bg-white/10 p-2">
                  <User className="h-5 w-5" />
                </div>
                <span className="hidden sm:inline">INGRESAR</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Header */}
      <nav className="w-full bg-white shadow-md">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2 transition-colors hover:text-blue-700">
                <img src={logoColpryst} alt="COLPRYST" className="h-10" />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden items-center space-x-8 md:flex">
              <Link to="/nosotros" className="font-medium text-gray-700 hover:text-blue-600">NOSOTROS</Link>
              <Link to="/clientes" className="font-medium text-gray-700 hover:text-blue-600">CLIENTES</Link>
              <Link to="/certificaciones" className="font-medium text-gray-700 hover:text-blue-600">CERTIFICACIONES</Link>
              <Link to="/contacto" className="font-medium text-gray-700 hover:text-blue-600">CONTACTO</Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="rounded-md p-2 text-gray-700 hover:text-blue-600 focus:outline-none md:hidden"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="animate-fade-in space-y-2 py-4 md:hidden">
              <Link 
                to="/nosotros" 
                className="block rounded-md px-4 py-2 text-gray-700 hover:bg-gray-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                NOSOTROS
              </Link>
              <Link 
                to="/clientes" 
                className="block rounded-md px-4 py-2 text-gray-700 hover:bg-gray-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                CLIENTES
              </Link>
              <Link 
                to="/certificaciones" 
                className="block rounded-md px-4 py-2 text-gray-700 hover:bg-gray-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                CERTIFICACIONES
              </Link>
              <Link 
                to="/contacto" 
                className="block rounded-md px-4 py-2 text-gray-700 hover:bg-gray-100"
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
      <footer className="w-full bg-[#424242] font-ledger text-white">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row">
            {/* Social Media Section */}
            <div className="flex w-full flex-col justify-center bg-[#424242] p-8 md:w-[536px]">
              <div className="flex w-full flex-col items-center">
                <div className="relative mb-6 w-full max-w-md">
                  <input
                    type="text"
                    placeholder="Buscar..."
                    className="h-12 w-full rounded-lg border border-white/20 bg-white/10 px-4 pr-12 text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                  />
                  <Search className="absolute right-4 top-1/2 -translate-y-1/2 transform text-white/50" />
                </div>
                <h3 className="mb-6 text-center font-semibold">Síguenos</h3>
                <div className="flex w-full justify-center space-x-8 md:space-x-12">
                  <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">
                    <Facebook className="h-6 w-6 md:h-8 md:w-8" />
                  </a>
                  <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">
                    <Instagram className="h-6 w-6 md:h-8 md:w-8" />
                  </a>
                  <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">
                    <Youtube className="h-6 w-6 md:h-8 md:w-8" />
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Section */}
            <div className="flex w-full flex-col justify-center bg-[#303030] p-8 md:w-[480px]">
              <div className="flex flex-col space-y-6">
                <div className="text-left text-base md:text-[18px]">
                  POLITICA DE PREVENCIÓN DEL RIESGO DE CORRUPCION Y SOBORNO
                </div>
                <div className="flex justify-center">
                  <div className="w-full max-w-[400px] border-b border-dotted border-white/50"></div>
                </div>
                <div className="text-left text-base md:text-[18px]">
                  PLATAFORMA VIRTUAL
                </div>
                <div className="flex justify-center">
                  <div className="w-full max-w-[400px] border-b border-dotted border-white/50"></div>
                </div>
                <div className="text-left text-base md:text-[18px]">
                  POLITICA DE SEGURIDAD
                </div>
              </div>
            </div>

            {/* Contact Information Section */}
            <div className="flex w-full flex-col justify-center bg-[#1D1D1D] p-8 md:w-[480px]">
              <div className="space-y-6">
                <h2 className="border-b border-white/20 pb-2 font-ledger text-base md:text-[18px]">Contacto</h2>
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