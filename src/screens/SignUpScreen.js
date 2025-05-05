import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
} from 'react-native';
import { Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { AuthContext } from '../context/AuthContext';
import { sampleUsers } from '../data/sampleData';

export default function SignUpScreen() {
  const navigation = useNavigation();
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [accepted, setAccepted] = useState(false);
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [isUsernameValid, setIsUsernameValid] = useState(true);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [isPasswordMatching, setIsPasswordMatching] = useState(true);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [usernameErrorMsg, setUsernameErrorMsg] = useState('');
  const [emailErrorMsg, setEmailErrorMsg] = useState('');

  const validateUsername = (value) => {
    if (!value.trim()) {
      setIsUsernameValid(false);
      setUsernameErrorMsg('El nombre de usuario es obligatorio');
      return false;
    }
    
    const userExists = sampleUsers.some(user => user.usuario.toLowerCase() === value.toLowerCase());
    if (userExists) {
      setIsUsernameValid(false);
      setUsernameErrorMsg('Este nombre de usuario ya está en uso');
      return false;
    }
    
    setIsUsernameValid(true);
    setUsernameErrorMsg('');
    return true;
  };

  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value.trim()) {
      setIsEmailValid(false);
      setEmailErrorMsg('El email es obligatorio');
      return false;
    }
    
    if (!emailRegex.test(value)) {
      setIsEmailValid(false);
      setEmailErrorMsg('Formato de email inválido');
      return false;
    }
    
    const emailExists = sampleUsers.some(user => user.email.toLowerCase() === value.toLowerCase());
    if (emailExists) {
      setIsEmailValid(false);
      setEmailErrorMsg('Este email ya está registrado');
      return false;
    }
    
    setIsEmailValid(true);
    setEmailErrorMsg('');
    return true;
  };

  const calculatePasswordStrength = (value) => {
    if (!value) {
      setPasswordStrength(0);
      return;
    }
    
    let score = 0;
    
    if (value.length >= 8) score += 1;
    if (/[A-Z]/.test(value)) score += 1;
    if (/[a-z]/.test(value)) score += 1;
    if (/[0-9]/.test(value)) score += 1;
    if (/[^A-Za-z0-9]/.test(value)) score += 1;
    
    score = Math.min(Math.floor(score / 1.7) + 1, 3);
    setPasswordStrength(score);
    setIsPasswordValid(score >= 2);
    
    if (confirmPassword) {
      setIsPasswordMatching(value === confirmPassword);
    }
  };

  const validatePasswordMatch = (value) => {
    setIsPasswordMatching(password === value);
  };

  useEffect(() => {
    if (password) {
      calculatePasswordStrength(password);
    }
  }, [password]);

  const handleContinue = () => {
    const isUserValid = validateUsername(username);
    const isMailValid = validateEmail(email);
    const isPwdValid = isPasswordValid && password.length >= 6;
    const isPwdMatch = password === confirmPassword;
    
    if (!isUserValid || !isMailValid || !isPwdValid || !isPwdMatch || !accepted) {
      let errorMsg = 'Por favor, corrige los siguientes errores:\n';
      if (!isUserValid) errorMsg += '- Nombre de usuario inválido\n';
      if (!isMailValid) errorMsg += '- Email inválido\n';
      if (!isPwdValid) errorMsg += '- La contraseña es demasiado débil\n';
      if (!isPwdMatch) errorMsg += '- Las contraseñas no coinciden\n';
      if (!accepted) errorMsg += '- Debes aceptar los términos y condiciones\n';
      
      Alert.alert('Error de registro', errorMsg);
      return;
    }

    const newUser = {
      id: (sampleUsers.length + 1).toString(),
      nombre: username,
      usuario: username,
      email: email,
      contraseña: password,
      celular: '',
      imagenProfile: null
    };
    
    Alert.alert(
      'Registro exitoso',
      '¡Tu cuenta ha sido creada con éxito!',
      [
        {
          text: 'OK',
          onPress: () => {
            login({
              id: newUser.id,
              nombre: newUser.nombre,
              userName: newUser.usuario,
              email: newUser.email,
              celular: newUser.celular,
              imagenProfile: newUser.imagenProfile
            });
          }
        }
      ]
    );
  };

  const renderPasswordStrengthIndicator = () => {
    if (password.length === 0) return null;
    
    const strengthLabels = ['', 'Débil', 'Media', 'Fuerte'];
    const strengthColors = ['', '#FF4040', '#FFA500', '#4CAF50'];
    
    return (
      <View style={styles.passwordStrengthContainer}>
        <View style={styles.strengthBarsContainer}>
          <View 
            style={[
              styles.strengthBar, 
              { 
                backgroundColor: passwordStrength >= 1 ? strengthColors[1] : '#333',
                flex: 1
              }
            ]} 
          />
          <View 
            style={[
              styles.strengthBar, 
              { 
                backgroundColor: passwordStrength >= 2 ? strengthColors[2] : '#333',
                flex: 1
              }
            ]} 
          />
          <View 
            style={[
              styles.strengthBar, 
              { 
                backgroundColor: passwordStrength >= 3 ? strengthColors[3] : '#333',
                flex: 1 
              }
            ]} 
          />
        </View>
        <Text style={[styles.strengthText, { color: strengthColors[passwordStrength] }]}>
          {strengthLabels[passwordStrength]}
        </Text>
      </View>
    );
  };

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        <Image
          source={require('../assets/splitsmart-logo-transparent-sin-letras.png')}
          style={styles.logo}
        />
        <Text style={styles.title}>Crear Cuenta</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Usuario <Text style={styles.requiredField}>*</Text></Text>
          <TextInput
            placeholder="Ingresa tu nombre de usuario"
            placeholderTextColor="#AAA"
            value={username}
            onChangeText={(text) => {
              setUsername(text);
              if (text) validateUsername(text);
            }}
            onBlur={() => validateUsername(username)}
            style={[styles.input, !isUsernameValid && styles.inputError]}
            autoCapitalize="none"
          />
          {!isUsernameValid && <Text style={styles.errorText}>{usernameErrorMsg}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Email <Text style={styles.requiredField}>*</Text></Text>
          <TextInput
            placeholder="Ingresa tu email"
            placeholderTextColor="#AAA"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (text) validateEmail(text);
            }}
            onBlur={() => validateEmail(email)}
            style={[styles.input, !isEmailValid && styles.inputError]}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {!isEmailValid && <Text style={styles.errorText}>{emailErrorMsg}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Contraseña <Text style={styles.requiredField}>*</Text></Text>
          <View style={styles.passwordContainer}>
            <TextInput
              placeholder="Crea una contraseña segura"
              placeholderTextColor="#AAA"
              value={password}
              onChangeText={setPassword}
              style={styles.passwordInput}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity 
              style={styles.eyeButton}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons 
                name={showPassword ? 'eye-off' : 'eye'} 
                size={22} 
                color="#AAA" 
              />
            </TouchableOpacity>
          </View>
          {renderPasswordStrengthIndicator()}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Confirmar Contraseña <Text style={styles.requiredField}>*</Text></Text>
          <View style={styles.passwordContainer}>
            <TextInput
              placeholder="Confirma tu contraseña"
              placeholderTextColor="#AAA"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                validatePasswordMatch(text);
              }}
              style={styles.passwordInput}
              secureTextEntry={!showConfirmPassword}
            />
            <TouchableOpacity 
              style={styles.eyeButton}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Ionicons 
                name={showConfirmPassword ? 'eye-off' : 'eye'} 
                size={22} 
                color="#AAA" 
              />
            </TouchableOpacity>
          </View>
          {!isPasswordMatching && confirmPassword && (
            <Text style={styles.errorText}>Las contraseñas no coinciden</Text>
          )}
        </View>

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
          style={[
            styles.primaryButton, 
            (!isUsernameValid || !isEmailValid || !password || !confirmPassword || !isPasswordMatching || !accepted) && 
            styles.primaryButtonDisabled
          ]}
          onPress={handleContinue}
          disabled={!isUsernameValid || !isEmailValid || !password || !confirmPassword || !isPasswordMatching || !accepted}
        >
          <Text style={styles.primaryButtonText}>Registrarme</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.footerLink}>¿Ya tienes cuenta? Inicia sesión</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#0A0E1A',
  },
  container: {
    flex: 1,
    backgroundColor: '#0A0E1A',
    padding: 32,
    paddingTop: 40,
    paddingBottom: 40,
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
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    color: '#FFF',
    fontSize: 16,
    marginBottom: 8,
  },
  requiredField: {
    color: '#FF4040',
  },
  input: {
    width: '100%',
    backgroundColor: '#1F2230',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    color: '#FFF',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#1F2230',
  },
  inputError: {
    borderColor: '#FF4040',
  },
  errorText: {
    color: '#FF4040',
    fontSize: 12,
    marginTop: 4,
  },
  passwordStrengthContainer: {
    marginTop: 8,
  },
  strengthBarsContainer: {
    flexDirection: 'row',
    height: 4,
    marginBottom: 4,
    gap: 4,
  },
  strengthBar: {
    height: 4,
    borderRadius: 2,
  },
  strengthText: {
    fontSize: 12,
    textAlign: 'right',
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 8,
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
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F2230',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1F2230',
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    color: '#FFF',
    fontSize: 16,
  },
  eyeButton: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
