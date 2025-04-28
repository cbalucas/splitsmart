import 'react-native-gesture-handler';
import React from 'react';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import { EventProvider } from './src/context/EventContext';

export default function App() {
  return (
    <AuthProvider>
      <EventProvider>
        <AppNavigator />
      </EventProvider>
    </AuthProvider>
  );
}
