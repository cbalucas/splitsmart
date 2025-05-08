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
import SettingsScreen from '../screens/SettingsScreen';
import SplashScreen from '../screens/SplashScreen';

import { AuthContext } from '../context/AuthContext';
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
    <>
      {user ? (
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
  // Configuración común para evitar parpadeos durante las transiciones
  const screenOptions = {
    headerShown: false,
    safeAreaInsets: { top: 0, right: 0, bottom: 0, left: 0 },
    cardStyle: { backgroundColor: colors.card },
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

  // Crear un tema personalizado extendiendo DefaultTheme
  const customTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
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
        <MainStack.Navigator screenOptions={{headerShown: false}}>
          <MainStack.Screen name="Splash" component={SplashScreen} />
          <MainStack.Screen name="Main" component={AuthenticatedStack} />
        </MainStack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
