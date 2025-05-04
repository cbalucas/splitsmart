// src/navigation/AppTabs.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HomeScreen from '../screens/HomeScreen';
import ParticipantsScreen from '../screens/ParticipantsScreen';
import Ionicons from '@expo/vector-icons/Ionicons';
import colors from '../styles/colors';

const Tab = createBottomTabNavigator();

export default function AppTabs() {
  const insets = useSafeAreaInsets();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        headerStyle: {
          backgroundColor: '#1F2230',
          height: 60 + insets.top, // Ajustar altura considerando el inset superior
        },
        headerStatusBarHeight: insets.top, // Usar esta propiedad en lugar de paddingTop
        headerTitleStyle: {
          color: '#FFF',
        },
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = 'home-outline';
          if (route.name === 'Participants') iconName = 'people-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#008000',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: '#1F2230',
          paddingBottom: insets.bottom > 0 ? insets.bottom : 8, // Ajustar padding inferior
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ title: 'Eventos' }}
      />
      <Tab.Screen 
        name="Participants" 
        component={ParticipantsScreen}
        options={{ title: 'Participantes' }}
        initialParams={{ fromTabBar: true }} 
      />
    </Tab.Navigator>
  );
}
