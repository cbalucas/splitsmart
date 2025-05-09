import React, { useState, useContext, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Modal, 
  TextInput,
  Alert, 
  Switch,
  Image,
  Linking,
  Pressable
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import colors from '../styles/colors';
import modalStyles from '../styles/modalStyles';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';

const SettingsScreen = () => {
  const { user, logout, updateProfile, userConfig, updateUserConfig } = useContext(AuthContext);
  const navigation = useNavigation();
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState(user?.celular || '');
  const [showPassword, setShowPassword] = useState(false);

  const [notificationsModalVisible, setNotificationsModalVisible] = useState(false);
  const [operationNotifications, setOperationNotifications] = useState(
    userConfig?.notificaciones?.operacion ?? true
  );
  const [confirmationNotifications, setConfirmationNotifications] = useState(
    userConfig?.notificaciones?.confirmacion ?? true
  );
  const [comingSoonNotifications, setComingSoonNotifications] = useState(
    userConfig?.notificaciones?.proximamente ?? true
  );
  const [errorNotifications, setErrorNotifications] = useState(
    userConfig?.notificaciones?.error ?? true
  );
  const [paymentNotifications, setPaymentNotifications] = useState(
    userConfig?.notificaciones?.estadoPagos ?? true
  );

  const [themeModalVisible, setThemeModalVisible] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(
    userConfig?.tema ?? 'light'
  ); // 'light', 'dark' o 'system'

  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(
    userConfig?.idioma ?? 'es'
  ); // 'es', 'en', etc.
  
  // Actualizar estados locales cuando cambia la configuración del usuario
  useEffect(() => {
    if (userConfig) {
      console.log("Cargando preferencias del usuario desde la configuración");
      setOperationNotifications(userConfig.notificaciones?.operacion ?? true);
      setConfirmationNotifications(userConfig.notificaciones?.confirmacion ?? true);
      setComingSoonNotifications(userConfig.notificaciones?.proximamente ?? true);
      setErrorNotifications(userConfig.notificaciones?.error ?? true);
      setPaymentNotifications(userConfig.notificaciones?.estadoPagos ?? true);
      setSelectedTheme(userConfig.tema ?? 'light');
      setSelectedLanguage(userConfig.idioma ?? 'es');
    }
  }, [userConfig]);

  // Verificar si el usuario es invitado y mostrar advertencia
  useEffect(() => {
    if (user?.isGuest) {
      setGuestWarningVisible(true);
    }
  }, [user]);

  const [aboutModalVisible, setAboutModalVisible] = useState(false);
  
  // Estado para el modal de advertencia de usuario invitado
  const [guestWarningVisible, setGuestWarningVisible] = useState(false);

  const resetForm = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPhoneNumber(user?.phone || '');
  };

  const handleOpenProfileModal = () => {
    resetForm();
    setProfileModalVisible(true);
  };

  const handleOpenNotificationsModal = () => {
    setNotificationsModalVisible(true);
  };
  const handleSaveNotifications = () => {
    // Actualizar configuración de notificaciones en el contexto
    updateUserConfig({
      notificaciones: {
        operacion: operationNotifications,
        confirmacion: confirmationNotifications,
        proximamente: comingSoonNotifications,
        error: errorNotifications,
        estadoPagos: paymentNotifications
      }
    });
    
    Alert.alert('Éxito', 'Configuración de notificaciones guardada correctamente');
    setNotificationsModalVisible(false);
  };

  const handleSaveProfile = () => {
    if (newPassword && newPassword !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    const updates = {};
    
    if (phoneNumber !== user?.phone) {
      updates.phone = phoneNumber;
    }
    
    if (newPassword) {
      updates.password = newPassword;
    }
    
    if (Object.keys(updates).length === 0) {
      setProfileModalVisible(false);
      return;
    }
    
    const success = updateProfile(updates);
    
    if (success) {
      Alert.alert('Éxito', 'Perfil actualizado correctamente');
      setProfileModalVisible(false);
    } else {
      Alert.alert('Error', 'No se pudo actualizar el perfil');
    }
  };

  const handleOpenThemeModal = () => {
    setThemeModalVisible(true);
  };  const { setThemeType } = useContext(ThemeContext);

  const handleSaveTheme = () => {
    // Actualizar tema en la configuración del usuario
    updateUserConfig({
      tema: selectedTheme
    });
    
    // También actualizar directamente en el contexto de tema
    setThemeType(selectedTheme);
    
    Alert.alert('Éxito', 'Tema actualizado correctamente');
    setThemeModalVisible(false);
  };

  const handleOpenLanguageModal = () => {
    setLanguageModalVisible(true);
  };
  const handleSaveLanguage = () => {
    // Actualizar idioma en la configuración del usuario
    updateUserConfig({
      idioma: selectedLanguage
    });
    
    Alert.alert('Éxito', 'Idioma actualizado correctamente');
    setLanguageModalVisible(false);
  };

  const handleOpenAboutModal = () => {
    setAboutModalVisible(true);
  };

  const settingsOptions = [
    { 
      title: 'Perfil', 
      icon: 'person-outline',
      onPress: handleOpenProfileModal
    },
    { 
      title: 'Tema', 
      icon: 'contrast-outline',
      onPress: handleOpenThemeModal 
    },
    { 
      title: 'Idioma', 
      icon: 'language-outline',
      onPress: handleOpenLanguageModal
    },
    { 
      title: 'Notificaciones', 
      icon: 'notifications-outline',
      onPress: handleOpenNotificationsModal
    },
    { 
      title: 'Acerca de', 
      icon: 'information-circle-outline',
      onPress: handleOpenAboutModal
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Configuración</Text>
        
        <View style={styles.userInfoContainer}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person-circle-outline" size={70} color={colors.primary} />
          </View>
          <Text style={styles.userName}>{user?.name || 'Usuario'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'usuario@ejemplo.com'}</Text>
        </View>
        
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
        
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={logout}
        >
          <Ionicons name="log-out-outline" size={24} color={colors.danger} />
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>
        
        <Modal
          visible={profileModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setProfileModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Editar Perfil</Text>
                <TouchableOpacity 
                  onPress={() => setProfileModalVisible(false)}
                  style={styles.closeButton}
                >
                  <Ionicons name="close-outline" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
              </View>
              
              <Text style={styles.sectionTitle}>Cambiar Número de Teléfono</Text>
              
              <View style={styles.inputContainer}>
                <Ionicons name="call-outline" size={22} color={colors.textPrimary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Número de teléfono"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="phone-pad"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                />
              </View>
              
              <Text style={styles.sectionTitle}>Cambiar Contraseña</Text>
              
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={22} color={colors.textPrimary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Contraseña actual"
                  placeholderTextColor={colors.textSecondary}
                  secureTextEntry={!showPassword}
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                  <Ionicons 
                    name={showPassword ? "eye-off-outline" : "eye-outline"} 
                    size={22} 
                    color={colors.textSecondary} 
                  />
                </TouchableOpacity>
              </View>
              
              <View style={styles.inputContainer}>
                <Ionicons name="key-outline" size={22} color={colors.textPrimary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Nueva contraseña"
                  placeholderTextColor={colors.textSecondary}
                  secureTextEntry={!showPassword}
                  value={newPassword}
                  onChangeText={setNewPassword}
                />
              </View>
              
              <View style={styles.inputContainer}>
                <Ionicons name="checkmark-circle-outline" size={22} color={colors.textPrimary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Confirmar nueva contraseña"
                  placeholderTextColor={colors.textSecondary}
                  secureTextEntry={!showPassword}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
              </View>
              
              <View style={styles.buttonRow}>
                <TouchableOpacity 
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => setProfileModalVisible(false)}
                >
                  <Text style={styles.buttonText}>Cancelar</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.button, styles.saveButton]}
                  onPress={handleSaveProfile}
                >
                  <Text style={styles.buttonText}>Guardar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Modal
          visible={notificationsModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setNotificationsModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Configurar Notificaciones</Text>
                <TouchableOpacity 
                  onPress={() => setNotificationsModalVisible(false)}
                  style={styles.closeButton}
                >
                  <Ionicons name="close-outline" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
              </View>
              
              <ScrollView>
                <View style={styles.notificationItem}>
                  <View style={styles.notificationTextContainer}>
                    <Text style={styles.notificationTitle}>Notificaciones de operación</Text>
                    <Text style={styles.notificationDescription}>
                      Por ejemplo: "Se eliminó correctamente el gasto"
                    </Text>
                  </View>
                  <Switch
                    value={operationNotifications}
                    onValueChange={setOperationNotifications}
                    thumbColor={operationNotifications ? colors.primary : colors.textPrimary}
                    trackColor={{ true: colors.primary, false: colors.border }}
                  />
                </View>
                
                <View style={styles.notificationItem}>
                  <View style={styles.notificationTextContainer}>
                    <Text style={styles.notificationTitle}>Confirmación de acciones</Text>
                    <Text style={styles.notificationDescription}>
                      Por ejemplo: "¿Seguro que desea eliminar el participante?"
                    </Text>
                  </View>
                  <Switch
                    value={confirmationNotifications}
                    onValueChange={setConfirmationNotifications}
                    thumbColor={confirmationNotifications ? colors.primary : colors.textPrimary}
                    trackColor={{ true: colors.primary, false: colors.border }}
                  />
                </View>
                
                <View style={styles.notificationItem}>
                  <View style={styles.notificationTextContainer}>
                    <Text style={styles.notificationTitle}>Notificaciones "Próximamente"</Text>
                    <Text style={styles.notificationDescription}>
                      Avisos sobre funcionalidades que estarán disponibles en el futuro
                    </Text>
                  </View>
                  <Switch
                    value={comingSoonNotifications}
                    onValueChange={setComingSoonNotifications}
                    thumbColor={comingSoonNotifications ? colors.primary : colors.textPrimary}
                    trackColor={{ true: colors.primary, false: colors.border }}
                  />
                </View>
                
                <View style={styles.notificationItem}>
                  <View style={styles.notificationTextContainer}>
                    <Text style={styles.notificationTitle}>Mensajes de error</Text>
                    <Text style={styles.notificationDescription}>
                      Alertas de validación y errores en formularios
                    </Text>
                  </View>
                  <Switch
                    value={errorNotifications}
                    onValueChange={setErrorNotifications}
                    thumbColor={errorNotifications ? colors.primary : colors.textPrimary}
                    trackColor={{ true: colors.primary, false: colors.border }}
                  />
                </View>
                
                <View style={styles.notificationItem}>
                  <View style={styles.notificationTextContainer}>
                    <Text style={styles.notificationTitle}>Estado de pagos</Text>
                    <Text style={styles.notificationDescription}>
                      Notificaciones sobre cambios en el estado de los pagos
                    </Text>
                  </View>
                  <Switch
                    value={paymentNotifications}
                    onValueChange={setPaymentNotifications}
                    thumbColor={paymentNotifications ? colors.primary : colors.textPrimary}
                    trackColor={{ true: colors.primary, false: colors.border }}
                  />
                </View>
              </ScrollView>
              
              <View style={styles.buttonRow}>
                <TouchableOpacity 
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => setNotificationsModalVisible(false)}
                >
                  <Text style={styles.buttonText}>Cancelar</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.button, styles.saveButton]}
                  onPress={handleSaveNotifications}
                >
                  <Text style={styles.buttonText}>Guardar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Modal para cambio de tema */}
        <Modal
          visible={themeModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setThemeModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Seleccionar tema</Text>
                <TouchableOpacity 
                  onPress={() => setThemeModalVisible(false)}
                  style={styles.closeButton}
                >
                  <Ionicons name="close-outline" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
              </View>
                <View style={styles.themeOptionsContainer}>
                <TouchableOpacity
                  style={[
                    styles.themeOption,
                    selectedTheme === 'system' && styles.selectedThemeOption
                  ]}
                  onPress={() => setSelectedTheme('system')}
                >
                  <View style={styles.themePreview}>
                    <View style={styles.themePreviewSystem}>
                      <View style={styles.themePreviewSystemHalf1} />
                      <View style={styles.themePreviewSystemHalf2} />
                    </View>
                  </View>
                  <View style={styles.themeTextContainer}>
                    <Text style={styles.notificationTitle}>Automático (Sistema)</Text>
                    <Text style={styles.notificationDescription}>
                      Sigue la configuración de tu dispositivo
                    </Text>
                  </View>
                  {selectedTheme === 'system' && (
                    <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
                  )}
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.themeOption,
                    selectedTheme === 'light' && styles.selectedThemeOption
                  ]}
                  onPress={() => setSelectedTheme('light')}
                >
                  <View style={styles.themePreview}>
                    <View style={styles.themePreviewLight} />
                  </View>
                  <View style={styles.themeTextContainer}>
                    <Text style={styles.notificationTitle}>Tema claro</Text>
                    <Text style={styles.notificationDescription}>
                      Fondo blanco con texto oscuro
                    </Text>
                  </View>
                  {selectedTheme === 'light' && (
                    <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.themeOption,
                    selectedTheme === 'dark' && styles.selectedThemeOption
                  ]}
                  onPress={() => setSelectedTheme('dark')}
                >
                  <View style={styles.themePreview}>
                    <View style={styles.themePreviewDark} />
                  </View>
                  <View style={styles.themeTextContainer}>
                    <Text style={styles.notificationTitle}>Tema oscuro</Text>
                    <Text style={styles.notificationDescription}>
                      Fondo oscuro con texto claro
                    </Text>
                  </View>
                  {selectedTheme === 'dark' && (
                    <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
                  )}
                </TouchableOpacity>

                <View style={styles.noteContainer}>
                  <Ionicons name="information-circle-outline" size={20} color={colors.textSecondary} />
                  <Text style={styles.noteText}>
                    El tema se aplicará a toda la aplicación y se guardará para futuros inicios.
                  </Text>
                </View>
              </View>
              
              <View style={styles.buttonRow}>
                <TouchableOpacity 
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => setThemeModalVisible(false)}
                >
                  <Text style={styles.buttonText}>Cancelar</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.button, styles.saveButton]}
                  onPress={handleSaveTheme}
                >
                  <Text style={styles.buttonText}>Guardar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Modal para cambio de idioma */}
        <Modal
          visible={languageModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setLanguageModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Seleccionar idioma</Text>
                <TouchableOpacity 
                  onPress={() => setLanguageModalVisible(false)}
                  style={styles.closeButton}
                >
                  <Ionicons name="close-outline" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
              </View>
              
              <ScrollView style={styles.languageOptionsContainer}>
                {['es', 'en', 'fr', 'de', 'it', 'pt'].map((language, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.languageOption,
                      selectedLanguage === language && styles.selectedLanguageOption
                    ]}
                    onPress={() => setSelectedLanguage(language)}
                  >
                    <Text style={styles.languageFlag}>{language === 'es' ? '🇪🇸' : language === 'en' ? '🇺🇸' : language === 'fr' ? '🇫🇷' : language === 'de' ? '🇩🇪' : language === 'it' ? '🇮🇹' : '🇵🇹'}</Text>
                    <Text style={styles.languageName}>{language === 'es' ? 'Español' : language === 'en' ? 'English' : language === 'fr' ? 'Français' : language === 'de' ? 'Deutsch' : language === 'it' ? 'Italiano' : 'Português'}</Text>
                    {selectedLanguage === language && (
                      <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <View style={styles.noteContainer}>
                <Ionicons name="information-circle-outline" size={20} color={colors.textSecondary} />
                <Text style={styles.noteText}>
                  El cambio de idioma se aplicará inmediatamente a toda la aplicación.
                </Text>
              </View>
              
              <View style={styles.buttonRow}>
                <TouchableOpacity 
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => setLanguageModalVisible(false)}
                >
                  <Text style={styles.buttonText}>Cancelar</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.button, styles.saveButton]}
                  onPress={handleSaveLanguage}
                >
                  <Text style={styles.buttonText}>Guardar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Modal Acerca de */}
        <Modal
          visible={aboutModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setAboutModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Acerca de SplitSmart</Text>
                <TouchableOpacity 
                  onPress={() => setAboutModalVisible(false)}
                  style={styles.closeButton}
                >
                  <Ionicons name="close-outline" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
              </View>
              
              <ScrollView>
                <View style={styles.aboutLogoContainer}>
                  <Image
                    source={require('../assets/splitsmart-logo-transparent.png')}
                    style={styles.aboutLogo}
                    resizeMode="contain"
                  />
                </View>
                
                <View style={styles.aboutSection}>
                  <Text style={styles.aboutVersionText}>Versión 1.0.0</Text>
                  <Text style={styles.aboutDescription}>
                    SplitSmart es una aplicación que te permite dividir gastos entre amigos, 
                    familiares o compañeros de manera fácil y rápida. Ideal para viajes, 
                    eventos o cualquier situación donde se compartan gastos.
                  </Text>
                </View>

                <View style={styles.aboutSection}>
                  <Text style={styles.aboutSectionTitle}>Características</Text>
                  <View style={styles.featureItem}>
                    <Ionicons name="checkmark-circle" size={20} color={colors.primary} style={styles.featureIcon} />
                    <Text style={styles.featureText}>Creación de eventos para organizar gastos</Text>
                  </View>
                  <View style={styles.featureItem}>
                    <Ionicons name="checkmark-circle" size={20} color={colors.primary} style={styles.featureIcon} />
                    <Text style={styles.featureText}>División equitativa o personalizada de gastos</Text>
                  </View>
                  <View style={styles.featureItem}>
                    <Ionicons name="checkmark-circle" size={20} color={colors.primary} style={styles.featureIcon} />
                    <Text style={styles.featureText}>Resumen de balances y deudas</Text>
                  </View>
                  <View style={styles.featureItem}>
                    <Ionicons name="checkmark-circle" size={20} color={colors.primary} style={styles.featureIcon} />
                    <Text style={styles.featureText}>Historial de eventos y gastos</Text>
                  </View>
                </View>

                <View style={styles.aboutSection}>
                  <Text style={styles.aboutSectionTitle}>Desarrolladores</Text>
                  <Text style={styles.aboutText}>
                    Aplicación desarrollada por el equipo de SplitSmart.
                  </Text>
                </View>

                <View style={styles.aboutSection}>
                  <Text style={styles.aboutSectionTitle}>Contáctanos</Text>
                  <TouchableOpacity 
                    style={styles.contactItem}
                    onPress={() => Linking.openURL('mailto:support@splitsmart.com')}
                  >
                    <Ionicons name="mail-outline" size={20} color={colors.primary} style={styles.contactIcon} />
                    <Text style={styles.contactText}>support@splitsmart.com</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.contactItem}
                    onPress={() => Linking.openURL('https://www.splitsmart.com')}
                  >
                    <Ionicons name="globe-outline" size={20} color={colors.primary} style={styles.contactIcon} />
                    <Text style={styles.contactText}>www.splitsmart.com</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.aboutSection}>
                  <Text style={styles.aboutSectionTitle}>Términos y Políticas</Text>
                  <TouchableOpacity 
                    style={styles.legalItem}
                    onPress={() => console.log('Términos de servicio')}
                  >
                    <Text style={styles.legalText}>Términos de servicio</Text>
                    <Ionicons name="chevron-forward" size={16} color={colors.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.legalItem}
                    onPress={() => console.log('Política de privacidad')}
                  >
                    <Text style={styles.legalText}>Política de privacidad</Text>
                    <Ionicons name="chevron-forward" size={16} color={colors.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.legalItem}
                    onPress={() => console.log('Licencias')}
                  >
                    <Text style={styles.legalText}>Licencias de terceros</Text>
                    <Ionicons name="chevron-forward" size={16} color={colors.primary} />
                  </TouchableOpacity>
                </View>
              </ScrollView>
              
              <View style={[styles.buttonRow, {justifyContent: 'center'}]}>
                <TouchableOpacity 
                  style={[styles.button, styles.saveButton, {flex: 0.5}]}
                  onPress={() => setAboutModalVisible(false)}
                >
                  <Text style={[styles.buttonText, {color: colors.white}]}>Cerrar</Text>                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
      
      {/* Modal de advertencia para usuario invitado */}
      <Modal
        transparent={true}
        visible={guestWarningVisible}
        animationType="fade"
        onRequestClose={() => {
          navigation.goBack();
          setGuestWarningVisible(false);
        }}
      >
        <Pressable 
          style={modalStyles.guestWarningModalOverlay} 
          onPress={() => {
            navigation.goBack();
            setGuestWarningVisible(false);
          }}
        >
          <View 
            style={modalStyles.guestWarningModalContent}
            onStartShouldSetResponder={() => true}
            onTouchEnd={(e) => e.stopPropagation()}
          >            <Ionicons 
              name="lock-closed-outline" 
              size={60} 
              color={colors.primary} 
              style={modalStyles.guestWarningIcon}
            />
            <Text style={modalStyles.guestWarningTitle}>Acceso restringido</Text>
            <Text style={modalStyles.guestWarningMessage}>
              No se puede acceder por haberse logeado como invitado.
            </Text>
            <TouchableOpacity 
              style={modalStyles.guestWarningButton}
              onPress={() => {
                navigation.goBack();
                setGuestWarningVisible(false);
              }}
            >
              <Text style={modalStyles.guestWarningButtonText}>Entendido</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
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
  userInfoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: colors.textSecondary,
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
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  closeButton: {
    padding: 5,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 10,
    marginTop: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    color: colors.textPrimary,
    fontSize: 16,
  },
  eyeIcon: {
    padding: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  saveButton: {
    backgroundColor: colors.primary,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  notificationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  notificationTextContainer: {
    flex: 1,
    marginRight: 10,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  notificationDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  themeOptionsContainer: {
    marginBottom: 20,
  },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    marginBottom: 10,
  },
  selectedThemeOption: {
    borderColor: colors.primary,
    backgroundColor: colors.background,
  },
  themePreview: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },  themePreviewSystem: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  themePreviewSystemHalf1: {
    width: 20,
    height: 40,
    backgroundColor: '#FFFFFF',
  },
  themePreviewSystemHalf2: {
    width: 20,
    height: 40,
    backgroundColor: '#121212',
  },
  themePreviewLight: {
    width: 40,
    height: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  themePreviewDark: {
    width: 40,
    height: 40,
    backgroundColor: '#121212',
    borderRadius: 20,
  },
  themeTextContainer: {
    flex: 1,
  },
  noteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    padding: 12,
    borderRadius: 8,
  },
  noteText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 5,
    flex: 1,
  },
  languageOptionsContainer: {
    maxHeight: 300,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    marginBottom: 10,
  },
  selectedLanguageOption: {
    borderColor: colors.primary,
    backgroundColor: colors.background,
  },
  languageFlag: {
    fontSize: 24,
    marginRight: 15,
  },
  languageName: {
    flex: 1,
    fontSize: 16,
    color: colors.textPrimary,
  },
  aboutLogoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  aboutLogo: {
    width: 100,
    height: 100,
  },
  aboutSection: {
    marginBottom: 20,
  },
  aboutVersionText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 10,
  },
  aboutDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  aboutSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 10,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  featureIcon: {
    marginRight: 10,
  },
  featureText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  aboutText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  contactIcon: {
    marginRight: 10,
  },
  contactText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  legalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  legalText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});

export default SettingsScreen;