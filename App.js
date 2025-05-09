import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'react-native';
import { AuthProvider } from './src/context/AuthContext';
import { EventProvider } from './src/context/EventContext';
import { ThemeProvider, ThemeContext } from './src/context/ThemeContext';
import AppNavigator from './src/navigation/AppNavigator';

// Componente que gestiona la barra de estado según el tema
function ThemedStatusBar() {
  const { isDarkMode } = React.useContext(ThemeContext);
  
  return (
    <StatusBar 
      barStyle={isDarkMode ? "light-content" : "dark-content"} 
      backgroundColor={isDarkMode ? "#121212" : "#FFFFFF"} 
    />
  );
}

// Componente que envuelve la aplicación para proporcionar todos los contextos
function AppWithProviders() {
  return (
    <>
      <ThemedStatusBar />
      <EventProvider>
        <AppNavigator />
      </EventProvider>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppWithProviders />
      </ThemeProvider>
    </AuthProvider>
  );
}
