// src/navigation/AppNavigator.js
import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AuthStack from './AuthStack';
import AppTabs from './AppTabs';
import CreateExpenseScreen from '../screens/CreateExpenseScreen';
import { AuthContext } from '../context/AuthContext';

const Stack = createStackNavigator();

export default function AppNavigator() {
  const { user } = useContext(AuthContext);

  return (
    <NavigationContainer>
      {user ? (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {/* Tus tabs habituales */}
          <Stack.Screen name="Tabs" component={AppTabs} />
          {/* Nueva pantalla de Gastos */}
          <Stack.Screen name="CreateExpense" component={CreateExpenseScreen} />
        </Stack.Navigator>
      ) : (
        <AuthStack />
      )}
    </NavigationContainer>
  );
}
