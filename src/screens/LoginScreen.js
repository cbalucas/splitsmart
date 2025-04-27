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

export default function LoginScreen() {
  const navigation = useNavigation();
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (email === 'demo@splitsmart.com' && password === 'Demo123') {
      login({ id: 'demo', name: 'Demo User' });
    } else {
      Alert.alert(
        'Credenciales inválidas',
        'Usa demo@splitsmart.com / Demo123'
      );
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/splitsmart-logo-transparent.png')}
        style={styles.logo}
      />

      <TextInput
        placeholder="Email"
        placeholderTextColor="#AAA"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Password"
        placeholderTextColor="#AAA"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />

      <TouchableOpacity
        style={[styles.primaryButton, (!email || !password) && styles.primaryButtonDisabled]}
        onPress={handleLogin}
        disabled={!email || !password}
      >
        <Text style={styles.primaryButtonText}>Sign In</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.socialButton} onPress={() => Alert.alert('Google Login')}>
        <Ionicons name="logo-google" size={20} />
        <Text style={styles.socialButtonText}>Continue with Google</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => login({ id: 'guest', name: 'Invitado' })}>
        <Text style={styles.linkText}>Invitado</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={[styles.footerLink, { color: '#888' }]}>Forgot Password?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.footerLink}>Sign Up</Text>
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
