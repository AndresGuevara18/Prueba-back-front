import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config/ConfigURL';
import logoColpryst from '../assets/img/colpryst-icon.png'; // Asegúrate de tener el logo en esta ruta

function LoginModal({ isOpen, onClose, onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Redirección automática si ya hay token
  useEffect(() => {
    if (isOpen && sessionStorage.getItem('token')) {
      onClose && onClose();
      navigate('/dashboard', { replace: true });
    }
  }, [isOpen, onClose, navigate]);

  if (!isOpen) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuarioadmin: email, contrasenia: password })
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        setError(data.message || 'Credenciales incorrectas');
        setLoading(false);
        return;
      }
      // Guardar token en sessionStorage
      sessionStorage.setItem('token', data.token);
      // Pasar datos al padre (Layout)
      if (onLogin) {
        onLogin(data.user, data.token);
      }
      setLoading(false);
      setEmail('');
      setPassword('');
      onClose();
      navigate('/dashboard');
    } catch (err) {
      setError('Error de red o servidor');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-[400px] overflow-hidden rounded-lg bg-white">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 transition-colors hover:text-gray-700"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="p-8">
          <div className="mb-6 flex justify-center">
            {/* <span className="text-[#2D3748] text-2xl font-bold">COLPRYST</span> */}
            <img src={logoColpryst} alt="COLPRYST Logo" className="h-12" />
          </div>

          <h2 className="mb-8 text-center text-2xl font-medium text-[#2D3748]">
            Iniciar sesión
          </h2>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="mb-2 block text-[#4A5568]">Usuario</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-[#E2E8F0] px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ingrese su usuario"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-[#4A5568]">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border border-[#E2E8F0] px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ingrese su contraseña"
                required
              />
            </div>

            {error && (
              <div className="text-center text-sm text-red-600">{error}</div>
            )}

            <button 
              type="submit"
              className="w-full rounded-md bg-[#3182CE] py-3 text-white transition-colors hover:bg-[#2B6CB0] disabled:opacity-60"
              disabled={loading}
            >
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginModal;