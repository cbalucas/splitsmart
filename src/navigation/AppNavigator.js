// src/navigation/AppNavigator.js
import React, { useContext } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, StyleSheet } from 'react-native';

import AuthStack from './AuthStack';
import AppTabs from './AppTabs';
import CreateExpenseScreen from '../screens/CreateExpenseScreen';
import CreateEventScreen from '../screens/CreateEventScreen';
import ExpenseSummaryScreen from '../screens/ExpenseSummaryScreen';

import { AuthContext } from '../context/AuthContext';
import colors from '../styles/colors';

const Stack = createStackNavigator();

export default function AppNavigator() {
  const { user } = useContext(AuthContext);

  // Configuración común para evitar parpadeos durante las transiciones
  const screenOptions = {
    headerShown: false,
    safeAreaInsets: { top: 0, right: 0, bottom: 0, left: 0 },
    cardStyle: { backgroundColor: colors.card },  // Fondo consistente para evitar parpadeos
    cardOverlayEnabled: true,                     // Mantiene la pantalla anterior visible durante la transición
    animationEnabled: true,                       // Asegura que las animaciones estén habilitadas
    detachPreviousScreen: false,                  // Mantiene la pantalla anterior montada durante la transición  
    presentation: 'card',                         // Modo de presentación más fluido
    cardStyleInterpolator: ({ current: { progress } }) => ({
      cardStyle: {
        opacity: progress,                        // Transición de opacidad suave
      }
    }),
  };

  // Crear un tema personalizado extendiendo DefaultTheme
  const customTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      // Sobrescribir colores específicos del tema
      primary: colors.primary,
      background: colors.background,
      card: colors.card,
      text: colors.textPrimary,
      border: colors.border,
      notification: colors.primary,
    },
  };

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={customTheme}>
        {user ? (
          <Stack.Navigator screenOptions={screenOptions}>
            {/* Tus tabs principales */}
            <Stack.Screen name="Tabs" component={AppTabs} />

            {/* La pantalla de gastos */}
            <Stack.Screen
              name="CreateExpense"
              component={CreateExpenseScreen}
              options={() => ({
                headerShown: true,
                headerTitle: 'Gastos del Evento',
                headerStyle: { 
                  backgroundColor: colors.card,
                  height: 60, // Altura fija simplificada
                },
                headerTintColor: colors.textPrimary,
                headerStatusBarHeight: 40, // Espacio adicional para la barra de estado
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
          </Stack.Navigator>
        ) : (
          <AuthStack />
        )}
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
