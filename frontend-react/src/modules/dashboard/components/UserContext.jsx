import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  // Permite actualizar el usuario globalmente
  const updateUser = (userData) => {
    setUser(userData);
    if (userData) {
      localStorage.setItem('user_profile', JSON.stringify(userData));
    } else {
      localStorage.removeItem('user_profile');
    }
  };

  // Al cargar, intenta restaurar el usuario desde localStorage
  React.useEffect(() => {
    const stored = localStorage.getItem('user_profile');
    if (stored) {
      setUser(JSON.parse(stored));
    }
    // Intentar sincronizar con el backend si hay token
    const token = sessionStorage.getItem('token');
    if (token) {
      fetch(`${import.meta.env.VITE_API_BASE_URL || '/api'}/auth/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data) {
            setUser(data);
            localStorage.setItem('user_profile', JSON.stringify(data));
          }
        })
        .catch(() => {});
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
