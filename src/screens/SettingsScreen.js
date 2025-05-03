import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import colors from '../styles/colors';

const SettingsScreen = () => {
  const settingsOptions = [
    { 
      title: 'Perfil', 
      icon: 'person-outline',
      onPress: () => console.log('Perfil presionado') 
    },
    { 
      title: 'Tema', 
      icon: 'contrast-outline',
      onPress: () => console.log('Tema presionado') 
    },
    { 
      title: 'Idioma', 
      icon: 'language-outline',
      onPress: () => console.log('Idioma presionado') 
    },
    { 
      title: 'Notificaciones', 
      icon: 'notifications-outline',
      onPress: () => console.log('Notificaciones presionado') 
    },
    { 
      title: 'Acerca de', 
      icon: 'information-circle-outline',
      onPress: () => console.log('Acerca de presionado') 
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Configuración</Text>
        
        <View style={styles.optionsContainer}>
          {settingsOptions.map((item, index) => (
            <TouchableOpacity 
              key={index}
              style={styles.optionItem}
              onPress={item.onPress}
            >
              <Ionicons name={item.icon} size={24} color={colors.textPrimary} />
              <Text style={styles.optionText}>{item.title}</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>
        
        <TouchableOpacity style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={24} color={colors.danger} />
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 20,
  },
  optionsContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 30,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: colors.textPrimary,
    marginLeft: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
  },
  logoutText: {
    fontSize: 16,
    color: colors.danger,
    marginLeft: 8,
    fontWeight: '500',
  }
});

export default SettingsScreen;