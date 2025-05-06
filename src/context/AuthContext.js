// src/context/AuthContext.js
import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Simula login/logout; en el futuro aquí iría tu lógica real
  const login = (userData) => setUser(userData);
  const logout = () => setUser(null);
  
  // Función para actualizar datos del perfil
  const updateProfile = (newData) => {
    // En una app real, aquí iría la lógica para actualizar los datos en el servidor
    setUser({
      ...user,
      ...newData,
    });
    return true; // Devuelve true si la actualización fue exitosa
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}
