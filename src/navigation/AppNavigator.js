// src/navigation/AppNavigator.js
import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

import AuthStack from './AuthStack';
import AppTabs from './AppTabs';
import CreateExpenseScreen from '../screens/CreateExpenseScreen';
import CreateEventScreen from '../screens/CreateEventScreen';
import ExpenseSummaryScreen from '../screens/ExpenseSummaryScreen';

import { AuthContext } from '../context/AuthContext';

const Stack = createStackNavigator();

export default function AppNavigator() {
  const { user } = useContext(AuthContext);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        {user ? (
          <Stack.Navigator 
            screenOptions={{ 
              headerShown: false,
              safeAreaInsets: { top: 0, right: 0, bottom: 0, left: 0 },
            }}
          >
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
                  backgroundColor: '#1F2230',
                  height: 60, // Altura fija simplificada
                },
                headerTintColor: '#FFF',
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
                  backgroundColor: '#1F2230',
                  height: 60,
                },
                headerTintColor: '#FFF',
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
                  backgroundColor: '#1F2230',
                  height: 60,
                },
                headerTintColor: '#FFF',
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
