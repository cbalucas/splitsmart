// src/navigation/AppTabs.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HomeScreen from '../screens/HomeScreen';
import ReferenceScreen from '../screens/ReferenceScreen';
import Ionicons from '@expo/vector-icons/Ionicons';
import colors from '../styles/colors';

const Tab = createBottomTabNavigator();

export default function AppTabs() {
  const insets = useSafeAreaInsets();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => {
        return {
          headerShown: true,
          headerStyle: {
            backgroundColor: '#1F2230',
            height: 60 + insets.top,
          },
          headerStatusBarHeight: insets.top,
          headerTitleStyle: {
            color: '#FFF',
          },
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === 'Home') iconName = 'home-outline';
            if (route.name === 'Reference') iconName = 'information-circle-outline';
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#008000',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: {
            backgroundColor: '#1F2230',
            paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
          },
        };
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ title: 'Eventos' }}
      />
      <Tab.Screen 
        name="Reference" 
        component={ReferenceScreen}
        options={{ title: 'Información' }}
      />
    </Tab.Navigator>
  );
}
