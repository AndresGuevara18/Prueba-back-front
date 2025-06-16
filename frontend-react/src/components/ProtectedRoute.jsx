import React from 'react';
import { Navigate } from 'react-router-dom';

// Recibe children y verifica si el usuario está autenticado (token en localStorage)
// Ahora también permite validación personalizada por cargo
const ProtectedRoute = ({ children, validate }) => {
  const token = sessionStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  if (!token) {
    // Si no hay token, redirige al home (o login)
    return <Navigate to="/" replace />;
  }
  if (validate && (!user || !validate(user))) {
    // Si no cumple la validación, redirige a dashboard-usuario
    return <Navigate to="/dashboard-usuario" replace />;
  }
  return children;
};

// Utilidad para cerrar sesión (borrar token)
export function logout() {
  sessionStorage.removeItem('token');
}

export default ProtectedRoute;
