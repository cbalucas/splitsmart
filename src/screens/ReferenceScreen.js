// src/screens/ReferenceScreen.js
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Modal, 
  TouchableOpacity, 
  Pressable
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import colors from '../styles/colors';

const ReferenceScreen = () => {
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [currentInfo, setCurrentInfo] = useState(null);

  // Datos de referencia sobre los íconos
  const iconsList = [
    { 
      name: 'home-outline', 
      title: 'Inicio', 
      description: 'Muestra la lista de eventos creados y te permite acceder a ellos.' 
    },
    { 
      name: 'add-circle-outline', 
      title: 'Crear Evento', 
      description: 'Permite crear un nuevo evento para dividir gastos.' 
    },
    { 
      name: 'people-outline', 
      title: 'Participantes', 
      description: 'Muestra y gestiona los participantes de un evento.' 
    },
    { 
      name: 'cash-outline', 
      title: 'Gastos', 
      description: 'Registra y visualiza los gastos de un evento.' 
    },
    { 
      name: 'calculator-outline', 
      title: 'Balance', 
      description: 'Calcula y muestra el balance de pagos entre los participantes.' 
    },
    { 
      name: 'settings-outline', 
      title: 'Configuración', 
      description: 'Permite personalizar la aplicación según tus preferencias.' 
    },
    {
      name: 'person-circle-outline',
      title: 'Perfil',
      description: 'Accede a tu información de usuario y opciones de cuenta.'
    }
  ];

  // Datos de referencia sobre colores
  const colorsList = [
    { 
      color: colors.primary, 
      colorName: 'Principal', 
      description: 'Color principal de la aplicación, usado en botones y elementos destacados.' 
    },
    { 
      color: colors.secondary, 
      colorName: 'Secundario', 
      description: 'Color secundario usado en elementos complementarios.' 
    },
    { 
      color: colors.success, 
      colorName: 'Éxito', 
      description: 'Indica operaciones exitosas o valores positivos.' 
    },
    { 
      color: colors.danger, 
      colorName: 'Peligro', 
      description: 'Indica errores, eliminación o valores negativos.' 
    },
    { 
      color: colors.warning, 
      colorName: 'Advertencia', 
      description: 'Indica precaución o estado pendiente.' 
    },
    { 
      color: colors.card, 
      colorName: 'Tarjeta', 
      description: 'Fondo de tarjetas y contenedores.' 
    }
  ];

  // Abrir modal con información detallada
  const showInfoModal = (item) => {
    setCurrentInfo(item);
    setInfoModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Referencia e Información</Text>
      
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Sección de íconos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Íconos de la Aplicación</Text>
          
          {iconsList.map((item, index) => (
            <TouchableOpacity
              key={`icon-${index}`}
              style={styles.infoItem}
              onPress={() => showInfoModal(item)}
            >
              <Ionicons name={item.name} size={24} color={colors.primary} style={styles.icon} />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoTitle}>{item.title}</Text>
                <Text style={styles.infoDescription} numberOfLines={1}>{item.description}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>
        
        {/* Sección de colores */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Códigos de Colores</Text>
          
          {colorsList.map((item, index) => (
            <TouchableOpacity
              key={`color-${index}`}
              style={styles.infoItem}
              onPress={() => showInfoModal(item)}
            >
              <View style={[styles.colorBox, { backgroundColor: item.color }]} />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoTitle}>{item.colorName}</Text>
                <Text style={styles.infoDescription} numberOfLines={1}>{item.description}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>
        
        {/* Sección de cómo usar la app */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cómo Usar SplitSmart</Text>
          
          <View style={styles.instructionItem}>
            <Text style={styles.instructionNumber}>1</Text>
            <Text style={styles.instructionText}>Crea un nuevo evento tocando el botón '+' en la pantalla de inicio</Text>
          </View>
          
          <View style={styles.instructionItem}>
            <Text style={styles.instructionNumber}>2</Text>
            <Text style={styles.instructionText}>Añade participantes al evento</Text>
          </View>
          
          <View style={styles.instructionItem}>
            <Text style={styles.instructionNumber}>3</Text>
            <Text style={styles.instructionText}>Registra los gastos realizados en el evento</Text>
          </View>
          
          <View style={styles.instructionItem}>
            <Text style={styles.instructionNumber}>4</Text>
            <Text style={styles.instructionText}>Revisa el balance para ver quién debe a quién</Text>
          </View>
          
          <View style={styles.instructionItem}>
            <Text style={styles.instructionNumber}>5</Text>
            <Text style={styles.instructionText}>Marca los pagos como completados una vez realizados</Text>
          </View>
        </View>
      </ScrollView>

      {/* Modal de información detallada */}
      <Modal
        visible={infoModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setInfoModalVisible(false)}
      >
        <Pressable 
          style={styles.modalOverlay} 
          onPress={() => setInfoModalVisible(false)}
        >
          <View 
            style={styles.modalContent}
            onStartShouldSetResponder={() => true}
            onTouchEnd={(e) => e.stopPropagation()}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {currentInfo?.title || currentInfo?.colorName || ''}
              </Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setInfoModalVisible(false)}
              >
                <Ionicons name="close" size={24} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalBody}>
              {currentInfo?.name && (
                <Ionicons 
                  name={currentInfo.name} 
                  size={60} 
                  color={colors.primary} 
                  style={styles.modalIcon} 
                />
              )}
              
              {currentInfo?.color && (
                <View style={[styles.modalColorBox, { backgroundColor: currentInfo.color }]} />
              )}
              
              <Text style={styles.modalDescription}>
                {currentInfo?.description || ''}
              </Text>
            </View>
            
            <TouchableOpacity 
              style={styles.closeModalButton}
              onPress={() => setInfoModalVisible(false)}
            >
              <Text style={styles.closeModalButtonText}>Entendido</Text>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginHorizontal: 20,
    marginTop: 15,
    marginBottom: 10,
  },
  scrollContainer: {
    padding: 20,
    paddingTop: 0,
  },
  section: {
    marginBottom: 20,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  icon: {
    marginRight: 12,
    width: 30,
    textAlign: 'center',
  },
  colorBox: {
    width: 30,
    height: 30,
    borderRadius: 8,
    marginRight: 12,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textPrimary,
    marginBottom: 3,
  },
  infoDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingVertical: 8,
  },
  instructionNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: 'bold',
    marginRight: 12,
  },
  instructionText: {
    flex: 1,
    fontSize: 15,
    color: colors.textPrimary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: colors.card,
    borderRadius: 12,
    width: '100%',
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  closeButton: {
    padding: 5,
  },
  modalBody: {
    alignItems: 'center',
    marginBottom: 20,
  },
  modalIcon: {
    marginBottom: 15,
  },
  modalColorBox: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginBottom: 15,
  },
  modalDescription: {
    fontSize: 16,
    lineHeight: 22,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  closeModalButton: {
    backgroundColor: colors.primary,
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  closeModalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ReferenceScreen;
