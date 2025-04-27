// screens/LoginScreen.js
import React, { useState, useContext  } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';

export default function LoginScreen() {
  const navigation = useNavigation();
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleLogin = () => {
    if ((email === 'demo@splitsmart.com' && password === 'Demo123')||(email === 'demo@' && password === '123') ) {
      // login exitoso
      login({ id: 'demo', name: 'Demo User' });
    } else {
      Alert.alert(
        'Credenciales inválidas',
        'Por favor usa demo@splitsmart.com / Demo123'
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
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />

      <TouchableOpacity
        style={[styles.primaryButton, (!email || !password) && styles.disabled]}
        onPress={handleLogin}
        disabled={!email || !password}
      >
        <Text style={styles.primaryButtonText}>Sign In</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.socialButton} onPress={() => {/* Google login */}}>
        <Text style={styles.socialButtonText}>Login with Google</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => {/* Guest login */}}>
        <Text style={styles.linkOnly}>Invitado</Text>
      </TouchableOpacity>

      <View style={styles.footerLinks}>
        <TouchableOpacity onPress={() => {/* forgot password */}}>
          <Text style={styles.linkText}>Forgot Password?</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.linkText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 24,
    justifyContent: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginBottom: 32,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  primaryButton: {
    backgroundColor: '#FF6B6B',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  socialButton: {
    borderWidth: 1,
    borderColor: '#4285F4',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginBottom: 8,
  },
  socialButtonText: {
    color: '#4285F4',
    fontWeight: 'bold',
  },
  linkOnly: {
    alignSelf: 'center',
    color: '#000000',
    textDecorationLine: 'underline',
    marginBottom: 24,
  },
  footerLinks: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  linkText: {
    color: '#FF6B6B',
  },
  disabled: {
    backgroundColor: '#FFBABA',
  },
});