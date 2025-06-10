import React from 'react';
import { Navigate } from 'react-router-dom';

// Recibe children y verifica si el usuario está autenticado (token en localStorage)
const ProtectedRoute = ({ children }) => {
  const token = sessionStorage.getItem('token');
  if (!token) {
    // Si no hay token, redirige al home (o login)
    return <Navigate to="/" replace />;
  }
  return children;
};

// Utilidad para cerrar sesión (borrar token)
export function logout() {
  sessionStorage.removeItem('token');
}

export default ProtectedRoute;
