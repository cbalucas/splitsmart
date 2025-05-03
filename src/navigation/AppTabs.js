// src/navigation/AppTabs.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import CreateEventScreen from '../screens/CreateEventScreen';
import ParticipantsScreen from '../screens/ParticipantsScreen';
import Ionicons from '@expo/vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

export default function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = 'home-outline';
          if (route.name === 'CreateEvent') iconName = 'add-circle-outline';
          if (route.name === 'Participants') iconName = 'people-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#008000',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="CreateEvent" component={CreateEventScreen} options={{ title: 'Nuevo Evento' }} />
      <Tab.Screen 
        name="Participants" 
        component={ParticipantsScreen}
        options={{ title: 'Participantes' }}
        initialParams={{ fromTabBar: true }} 
      />
    </Tab.Navigator>
  );
}
