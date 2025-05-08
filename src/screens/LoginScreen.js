// src/screens/LoginScreen.js
import React, { useState, useContext } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Text,
  Alert,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { AuthContext } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native'; 
import { sampleUsers } from '../data/sampleData';

export default function LoginScreen() {
  const navigation = useNavigation();
  const { login } = useContext(AuthContext);
  const [identifier, setIdentifier] = useState(''); // Puede ser email o nombre de usuario
  const [password, setPassword] = useState('');
  const handleLogin = () => {
    console.log("Intentando iniciar sesión con:", identifier);
    
    // Buscar el usuario por email o nombre de usuario
    const user = sampleUsers.find(
      u => (u.email === identifier || u.usuario === identifier) && u.contraseña === password
    );

    if (user) {
      console.log("Usuario encontrado, iniciando sesión");
      // Pasar toda la información del usuario al contexto de autenticación
      try {
        login({
          id: user.id,
          nombre: user.nombre,
          userName: user.usuario,
          email: user.email,
          celular: user.celular,
          imagenProfile: user.imagenProfile
        });
        console.log("Login exitoso");
      } catch (error) {
        console.error("Error durante el login:", error);
        Alert.alert(
          'Error',
          'Ocurrió un error al iniciar sesión. Por favor, intenta nuevamente.'
        );
      }
    } else {
      console.log("Credenciales inválidas");
      Alert.alert(
        'Credenciales inválidas',
        'El usuario o la contraseña no son correctos'
      );
    }
  };

  const handleGuestLogin = () => {
    // Crear un usuario invitado con valores predeterminados
    login({
      id: 'guest',
      nombre: 'Invitado',
      userName: 'INVITADO',
      email: '',
      celular: '',
      imagenProfile: null,
      isGuest: true
    });
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/splitsmart-logo-transparent.png')}
        style={styles.logo}
      />

      <TextInput
        placeholder="Email o Usuario"
        placeholderTextColor="#AAA"
        value={identifier}
        onChangeText={setIdentifier}
        style={styles.input}
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Contraseña"
        placeholderTextColor="#AAA"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />

      <TouchableOpacity
        style={[styles.primaryButton, (!identifier || !password) && styles.primaryButtonDisabled]}
        onPress={handleLogin}
        disabled={!identifier || !password}
      >
        <Text style={styles.primaryButtonText}>Iniciar Sesión</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.socialButton} onPress={() => Alert.alert('Google Login')}>
        <Ionicons name="logo-google" size={20} />
        <Text style={styles.socialButtonText}>Continuar con Google</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleGuestLogin}>
        <Text style={styles.linkText}>Invitado</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={[styles.footerLink, { color: '#888' }]}>¿Olvidaste tu contraseña?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.footerLink}>Registrarse</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0E1A',
    padding: 32,
    justifyContent: 'center',
  },
  logo: {
    width: 140,
    height: 140,
    alignSelf: 'center',
    marginBottom: 32,
  },
  input: {
    width: '100%',
    backgroundColor: '#1F2230',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    color: '#FFF',
    marginBottom: 16,
    fontSize: 16,
  },
  primaryButton: {
    width: '100%',
    backgroundColor: '#00FF55',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  primaryButtonDisabled: {
    backgroundColor: '#2A2D3F',
  },
  primaryButtonText: {
    fontSize: 18,
    color: '#0A0E1A',
    fontWeight: 'bold',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingVertical: 14,
    marginBottom: 16,
  },
  socialButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#4285F4',
    fontWeight: '600',
  },
  linkText: {
    color: '#FFF',
    textAlign: 'center',
    textDecorationLine: 'underline',
    marginBottom: 24,
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerLink: {
    color: '#00FF55',
    fontSize: 14,
  },
});
