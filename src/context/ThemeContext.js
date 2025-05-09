// src/context/ThemeContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { AuthContext } from './AuthContext';

// Crear el contexto del tema
export const ThemeContext = createContext({
  isDarkMode: false,
  toggleTheme: () => {},
  themeType: 'light', // 'light', 'dark', 'system'
  setThemeType: () => {},
});

// Proveedor del contexto del tema
export const ThemeProvider = ({ children }) => {
  const { userConfig, updateUserConfig } = useContext(AuthContext);
  const deviceTheme = useColorScheme(); // Obtener preferencia del sistema ('light' o 'dark')
  
  // Estado para controlar el tipo de tema (light, dark, system)
  const [themeType, setThemeType] = useState('light');
  
  // Calcular si estamos en modo oscuro basado en las preferencias 
  const isDarkMode = 
    themeType === 'dark' || (themeType === 'system' && deviceTheme === 'dark');

  // Al cargar el componente, establecer el tema según la configuración del usuario
  useEffect(() => {
    if (userConfig) {
      console.log('Aplicando tema del usuario:', userConfig.tema);
      setThemeType(userConfig.tema);
    }
  }, [userConfig]);

  // Función para cambiar entre modo claro y oscuro
  const toggleTheme = () => {
    const newThemeType = isDarkMode ? 'light' : 'dark';
    setThemeType(newThemeType);
    
    // Si hay configuración de usuario, guardarla
    if (userConfig && updateUserConfig) {
      updateUserConfig({ tema: newThemeType });
    }
  };
  
  // Función para cambiar el tipo de tema (light, dark, system)
  const handleSetThemeType = (type) => {
    setThemeType(type);
    
    // Si hay configuración de usuario, guardarla
    if (userConfig && updateUserConfig) {
      updateUserConfig({ tema: type });
    }
  };
  
  // Valor del contexto a proporcionar
  const contextValue = {
    isDarkMode,
    toggleTheme,
    themeType,
    setThemeType: handleSetThemeType,
  };
  
  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook personalizado para usar el tema
export const useTheme = () => useContext(ThemeContext);
