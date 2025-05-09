// src/context/AuthContext.js
import React, { createContext, useState } from 'react';
import { sampleUserConfigurations, sampleUsers } from '../data/sampleData';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userConfig, setUserConfig] = useState(null);

  // Función para obtener la configuración de un usuario por su ID
  const getUserConfig = (userId) => {
    return sampleUserConfigurations.find(config => config.userId === userId);
  };

  // Login mejorado que carga la configuración del usuario
  const login = (userData) => {
    console.log("Iniciando sesión para usuario:", userData.id);
    
    // Buscar la configuración del usuario
    const config = getUserConfig(userData.id);
    
    if (config) {
      console.log("Configuración encontrada para el usuario:", config.tema);
      setUserConfig(config);
    } else {
      console.log("No se encontró configuración para el usuario, usando valores predeterminados");
      // Configuración predeterminada si no existe
      setUserConfig({
        id: 'default',
        userId: userData.id,
        tema: 'light',
        idioma: 'es',
        notificaciones: {
          operacion: true,
          confirmacion: true,
          proximamente: true,
          error: true,
          estadoPagos: true
        },
        seguridad: {
          biometria: false,
          dobleFactorAuth: false,
          recordarSesion: true
        },
        visualizacion: {
          formatoMoneda: '$',
          separadorDecimal: ',',
          separadorMiles: '.',
          decimales: 2,
          colorPrimario: '#4CAF50',
          fuente: 'default'
        },
        privacidad: {
          perfilVisible: true,
          estadisticasCompartidas: false,
          historialBusquedas: true
        },
        ultimaActualizacion: new Date().toISOString()
      });
    }
    
    setUser(userData);
  };

  // Logout mejorado que también limpia la configuración
  const logout = () => {
    setUser(null);
    setUserConfig(null);
  };
  
  // Función para actualizar datos del perfil
  const updateProfile = (newData) => {
    // En una app real, aquí iría la lógica para actualizar los datos en el servidor
    setUser({
      ...user,
      ...newData,
    });
    return true; // Devuelve true si la actualización fue exitosa
  };
  
  // Función para actualizar configuración del usuario
  const updateUserConfig = (newConfig) => {
    console.log("Actualizando configuración de usuario:", newConfig);
    
    // Actualizar la configuración con los nuevos valores
    setUserConfig({
      ...userConfig,
      ...newConfig,
      ultimaActualizacion: new Date().toISOString()
    });
    
    return true; // Devuelve true si la actualización fue exitosa
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        login, 
        logout, 
        updateProfile,
        userConfig,
        updateUserConfig
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
