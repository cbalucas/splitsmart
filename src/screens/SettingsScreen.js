import React, { useState, useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Modal, 
  TextInput,
  Alert, 
  Switch
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import colors from '../styles/colors';
import { AuthContext } from '../context/AuthContext';

const SettingsScreen = () => {
  const { user, logout, updateProfile } = useContext(AuthContext);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState(user?.phone || '');
  const [showPassword, setShowPassword] = useState(false);

  const [notificationsModalVisible, setNotificationsModalVisible] = useState(false);
  const [operationNotifications, setOperationNotifications] = useState(true);
  const [confirmationNotifications, setConfirmationNotifications] = useState(true);
  const [comingSoonNotifications, setComingSoonNotifications] = useState(true);
  const [errorNotifications, setErrorNotifications] = useState(true);
  const [paymentNotifications, setPaymentNotifications] = useState(true);

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

  const settingsOptions = [
    { 
      title: 'Perfil', 
      icon: 'person-outline',
      onPress: handleOpenProfileModal
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
      onPress: handleOpenNotificationsModal
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
});

export default SettingsScreen;