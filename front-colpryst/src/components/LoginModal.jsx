import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function LoginModal({ isOpen, onClose, onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleLogin = (e) => {
    e.preventDefault();
    if (email === 'admin' && password === 'admin123') {
      navigate('/dashboard');
      onClose();
    } else {
      alert('Credenciales incorrectas. Usuario: admin, Contraseña: admin123');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-[400px] overflow-hidden relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-8">
          <div className="flex justify-center mb-6">
            <span className="text-[#2D3748] text-2xl font-bold">COLPRYST</span>
          </div>

          <h2 className="text-[#2D3748] text-2xl font-medium text-center mb-8">
            Iniciar sesión
          </h2>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-[#4A5568] mb-2">Usuario</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-[#E2E8F0] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ingrese su usuario"
                required
              />
            </div>

            <div>
              <label className="block text-[#4A5568] mb-2">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-[#E2E8F0] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ingrese su contraseña"
                required
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-[#3182CE] text-white py-3 rounded-md hover:bg-[#2B6CB0] transition-colors"
            >
              Ingresar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginModal;