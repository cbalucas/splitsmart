// src/navigation/AppNavigator.js
import React, { useContext } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, StyleSheet } from 'react-native';

import AuthStack from './AuthStack';
import AppTabs from './AppTabs';
import CreateExpenseScreen from '../screens/CreateExpenseScreen';
import CreateEventScreen from '../screens/CreateEventScreen';
import ExpenseSummaryScreen from '../screens/ExpenseSummaryScreen';
import ParticipantsScreen from '../screens/ParticipantsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import SplashScreen from '../screens/SplashScreen';

import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import colors from '../styles/colors';

const Stack = createStackNavigator();
const MainStack = createStackNavigator();

// Componente que determina si mostrar AuthStack o la app principal
function AuthenticatedStack() {
  const { user } = useContext(AuthContext);
  
  // Aquí agregamos un console log para debug
  console.log("Estado de autenticación:", user ? "Autenticado" : "No autenticado");

  const authScreenOptions = {
    headerShown: false,
    safeAreaInsets: { top: 0, right: 0, bottom: 0, left: 0 },
    cardStyle: { backgroundColor: colors.card },
    cardOverlayEnabled: true,
    animationEnabled: true,
  };

  return (
    <>      {user ? (
        <Stack.Navigator screenOptions={authScreenOptions} initialRouteName="Tabs">
          {/* Tus tabs principales */}
          <Stack.Screen 
            name="Tabs" 
            component={AppTabs}
            options={{ 
              headerShown: false,
            }}
          />
          
          {/* La pantalla de gastos */}
          <Stack.Screen
            name="CreateExpense"
            component={CreateExpenseScreen}
            options={() => ({
              headerShown: true,
              headerTitle: 'Gastos del Evento',
              headerStyle: { 
                backgroundColor: colors.card,
                height: 60,
              },
              headerTintColor: colors.textPrimary,
              headerStatusBarHeight: 40,
            })}
          />
          
          {/* Pantalla de participantes */}
          <Stack.Screen
            name="Participants"
            component={ParticipantsScreen}
            options={() => ({
              headerShown: true,
              headerTitle: 'Participantes',
              headerStyle: { 
                backgroundColor: colors.card,
                height: 60,
              },
              headerTintColor: colors.textPrimary,
              headerStatusBarHeight: 40,
            })}
          />
          
          {/* Mantener la pantalla de eventos como ruta para casos específicos */}
          <Stack.Screen
            name="CreateEvent"
            component={CreateEventScreen}
            options={() => ({
              headerShown: true,
              headerTitle: 'Nuevo Evento',
              headerStyle: { 
                backgroundColor: colors.card,
                height: 60,
              },
              headerTintColor: colors.textPrimary,
              headerStatusBarHeight: 40,
            })}
          />
          
          {/* Pantalla de resumen de gastos y pagos */}
          <Stack.Screen
            name="ExpenseSummary"
            component={ExpenseSummaryScreen}
            options={() => ({
              headerShown: true,
              headerTitle: 'Resumen',
              headerStyle: { 
                backgroundColor: colors.card,
                height: 60,
              },
              headerTintColor: colors.textPrimary,
              headerStatusBarHeight: 40,
            })}
          />
          
          {/* Pantalla de configuración */}
          <Stack.Screen
            name="Settings"
            component={SettingsScreen}
            options={() => ({
              headerShown: true,
              headerTitle: 'Configuración',
              headerStyle: { 
                backgroundColor: colors.card,
                height: 60,
              },
              headerTintColor: colors.textPrimary,
              headerStatusBarHeight: 40,
            })}
          />
        </Stack.Navigator>
      ) : (
        <AuthStack />
      )}
    </>
  );
}

export default function AppNavigator() {
  const { userConfig } = useContext(AuthContext);
  const { isDarkMode } = useContext(ThemeContext);
  
  // Configuración común para evitar parpadeos durante las transiciones
  const screenOptions = {
    headerShown: false,
    safeAreaInsets: { top: 0, right: 0, bottom: 0, left: 0 },
    cardStyle: { backgroundColor: isDarkMode ? colors.cardDark : colors.cardLight },
    cardOverlayEnabled: true,
    animationEnabled: true,
    detachPreviousScreen: false,
    presentation: 'card',
    cardStyleInterpolator: ({ current: { progress } }) => ({
      cardStyle: {
        opacity: progress,
      }
    }),
  };

  // Aplicar colores según el tema seleccionado
  const themeColors = isDarkMode ? {
    primary: colors.primaryDark,
    background: colors.backgroundDark,
    card: colors.cardDark,
    text: colors.textPrimaryDark,
    border: colors.borderDark,
    notification: colors.primaryDark,
  } : {
    primary: colors.primary,
    background: colors.backgroundLight,
    card: colors.cardLight,
    text: colors.textPrimaryLight,
    border: colors.borderLight,
    notification: colors.primary,
  };

  // Crear un tema personalizado extendiendo el tema base según el modo
  const baseTheme = isDarkMode ? DarkTheme : DefaultTheme;
  const customTheme = {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      ...themeColors
    },
  };

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={customTheme}>
        <MainStack.Navigator screenOptions={{headerShown: false}}>
          <MainStack.Screen name="Splash" component={SplashScreen} />
          <MainStack.Screen name="Main" component={AuthenticatedStack} />
        </MainStack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
