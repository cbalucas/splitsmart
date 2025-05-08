import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  StatusBar, 
  Animated, 
  Easing 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import colors from '../styles/colors';

const SplashScreen = () => {
  const navigation = useNavigation();
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);

  useEffect(() => {
    // Animación de entrada
    Animated.parallel([
      Animated.timing(
        fadeAnim,
        {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic)
        }
      ),
      Animated.timing(
        scaleAnim,
        {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic)
        }
      )
    ]).start();    // Timer para navegar a la siguiente pantalla después de 3 segundos
    const timer = setTimeout(() => {
      console.log("Navegando desde SplashScreen a Main");
      // Animación de salida
      Animated.parallel([
        Animated.timing(
          fadeAnim,
          {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
            easing: Easing.in(Easing.cubic)
          }
        ),
        Animated.timing(
          scaleAnim,
          {
            toValue: 1.2,
            duration: 800,
            useNativeDriver: true,
            easing: Easing.in(Easing.cubic)
          }
        )      ]).start(() => {
        // Navegamos primero a 'Main' para mostrar el sistema de autenticación
        console.log("Animación de salida completada, navegando a Main...");
        navigation.reset({
          index: 0,
          routes: [{ name: 'Main' }],
        });
      });
    }, 3000); // 3 segundos

    // Limpiar timer al desmontar el componente
    return () => clearTimeout(timer);
  }, [navigation, fadeAnim, scaleAnim]);

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      
      <Animated.View style={[
        styles.logoContainer,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }]
        }
      ]}>
        <Image 
          source={require('../assets/splitsmart-logo-transparent.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>
      
      <Animated.Text style={[
        styles.tagline,
        { opacity: fadeAnim }
      ]}>
        Divide gastos de manera inteligente
      </Animated.Text>
      
      <View style={styles.footerContainer}>
        <Animated.Text style={[
          styles.version,
          { opacity: fadeAnim }
        ]}>
          v1.0.0
        </Animated.Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: 40,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 350,
    height: 350,
    // tintColor: colors.white,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 10,
  },
  tagline: {
    fontSize: 16,
    color: colors.white,
    textAlign: 'center',
    opacity: 0.9,
  },
  footerContainer: {
    position: 'absolute',
    bottom: 40,
  },
  version: {
    fontSize: 14,
    color: colors.white,
    opacity: 0.7,
  },
});

export default SplashScreen;