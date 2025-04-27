import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';
import { Switch } from 'react-native'; // usa el Switch nativo
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { AuthContext } from '../context/AuthContext';

export default function SignUpScreen() {
  const navigation = useNavigation();
  const { login } = useContext(AuthContext);  // Opcional: puedes registrar y loguear directo
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accepted, setAccepted] = useState(false);


  const handleContinue = () => {
    if (!accepted) {
      Alert.alert('Debes aceptar los términos');
      return;
    }
    // Aquí iría tu lógica real de registro…
    login({ id: 'newuser', name: email });  
  };

  return (
    <View style={styles.container}>
    {/* Logo SplitSmart sin texto */}
     <Image
       source={require('../assets/splitsmart-logo-transparent-sin-letras.png')}
       style={styles.logo}
     />
      <Text style={styles.title}>Sign Up</Text>

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

      <View style={styles.termsRow}>
       <Switch
       value={accepted}
         onValueChange={setAccepted}
         thumbColor={accepted ? '#00FF55' : '#FFF'}
         trackColor={{ true: '#55FF88', false: '#333' }}
       />
       <Text style={styles.termsText}>
         Acepto{' '}
         <Text style={styles.linkText} onPress={() => Alert.alert('Términos')}>
           Términos de Servicio
         </Text>{' '}
         y la{' '}
         <Text style={styles.linkText} onPress={() => Alert.alert('Política')}>
           Política de Privacidad
         </Text>
       </Text>
     </View>


      <TouchableOpacity
        style={[styles.primaryButton, !accepted && styles.primaryButtonDisabled]}
        onPress={handleContinue}
        disabled={!accepted}
      >
        <Text style={styles.primaryButtonText}>Continue</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.footerLink}>Have an Account? Sign In</Text>
      </TouchableOpacity>
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
       width: 100,
       height: 100,
       alignSelf: 'center',
       marginBottom: 24,
     },
  title: {
    alignSelf: 'center',
    fontSize: 28,
    color: '#FFF',
    fontWeight: 'bold',
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
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  termsText: {
    flex: 1,
    color: '#DDD',
    marginLeft: 8,
  },
  linkText: {
    color: '#00FF55',
    textDecorationLine: 'underline',
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
  footerLink: {
    color: '#00FF55',
    textAlign: 'center',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});
