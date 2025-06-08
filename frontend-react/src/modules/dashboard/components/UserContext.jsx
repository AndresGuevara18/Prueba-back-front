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
