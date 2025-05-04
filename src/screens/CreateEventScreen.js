// src/screens/CreateEventScreen.js

import React, { useState, useContext, useCallback } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  Alert
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import { EventContext } from '../context/EventContext';
import commonStyles from '../styles/commonStyles';
import eventStyles from '../styles/eventStyles';
import expenseStyles from '../styles/expenseStyles'; // Importamos los estilos de gastos para usar su diseño
import colors from '../styles/colors';

export default function CreateEventScreen({ navigation }) {
  const { logout } = useContext(AuthContext);
  const { addEvent } = useContext(EventContext);

  // Campos del formulario
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [address, setAddress] = useState('');
  const [mapUrl, setMapUrl] = useState('');
  const [whatsappEnvio, setWhatsappEnvio] = useState(false);

  // Estado para validaciones
  const [errors, setErrors] = useState({
    name: false,
    date: false
  });

  // Picker de fecha
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Al enfocar la pantalla, resetea
  useFocusEffect(
    useCallback(() => {
      setName('');
      setDate('');
      setAddress('');
      setMapUrl('');
      setWhatsappEnvio(false);
      setErrors({
        name: false,
        date: false
      });
    }, [])
  );

  const handleDateChange = (_, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate.toISOString().split('T')[0]);
      if (errors.date) {
        setErrors(prev => ({...prev, date: false}));
      }
    }
  };

  const handleSave = () => {
    // Validar campos obligatorios
    const newErrors = {
      name: !name.trim(),
      date: !date.trim()
    };
    
    setErrors(newErrors);
    
    // Si hay errores, detener la operación
    if (Object.values(newErrors).some(error => error)) {
      return Alert.alert('Error', 'Por favor, completa el título y la fecha del evento.');
    }

    addEvent({
      name,
      date,
      address,
      map: mapUrl,
      whatsappEnvio,
      estadoEvento: true,
    });
    navigation.goBack();
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      {/* Usamos el estilo del modal en lugar de un ScrollView */}
      <View style={commonStyles.modalOverlay}>
        <View style={commonStyles.modalContent}>
          <View style={commonStyles.modalHeader}>
            <Text style={commonStyles.modalTitle}>Nuevo Evento</Text>
          </View>

          {/* WhatsApp - ajustado para usar el diseño de input row */}
          <View style={commonStyles.inputRow}>
            <Ionicons 
              name="logo-whatsapp" 
              size={20} 
              color={whatsappEnvio ? colors.primary : colors.textPrimary} 
              style={expenseStyles.icon} 
            />
            <Text style={{...eventStyles.switchLabel, paddingVertical: 8}}>Envío por WhatsApp:</Text>
            <Switch
              value={whatsappEnvio}
              onValueChange={setWhatsappEnvio}
              thumbColor={whatsappEnvio ? colors.primary : colors.textPrimary}
              trackColor={{ true: colors.primary, false: colors.border }}
            />
          </View>

          {/* Campo de Título */}
          <View style={commonStyles.inputRow}>
            <Ionicons 
              name="text-outline" 
              size={20} 
              color={name ? colors.primary : (errors.name ? colors.danger : colors.textPrimary)} 
              style={expenseStyles.icon} 
            />
            <TextInput
              style={[
                expenseStyles.input,
                errors.name && expenseStyles.inputError
              ]}
              placeholder="Título *"
              placeholderTextColor={errors.name ? colors.danger : colors.textSecondary}
              value={name}
              onChangeText={(text) => {
                setName(text);
                if (text.trim()) {
                  setErrors(prev => ({...prev, name: false}));
                }
              }}
            />
          </View>
          
          {/* Campo de Fecha */}
          <View style={commonStyles.inputRow}>
            <Ionicons 
              name="calendar-number-outline" 
              size={20} 
              color={date ? colors.primary : (errors.date ? colors.danger : colors.textPrimary)} 
              style={expenseStyles.icon} 
            />
            <TextInput
              style={[
                expenseStyles.input,
                errors.date && expenseStyles.inputError
              ]}
              placeholder="Fecha (YYYY-MM-DD) *"
              placeholderTextColor={errors.date ? colors.danger : colors.textSecondary}
              value={date}
              onChangeText={(text) => {
                setDate(text);
                if (text.trim()) {
                  setErrors(prev => ({...prev, date: false}));
                }
              }}
            />
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <Ionicons name="calendar-outline" size={24} color={colors.primary} />
            </TouchableOpacity>
          </View>

          {/* Campo de Dirección */}
          <View style={commonStyles.inputRow}>
            <Ionicons 
              name="trail-sign-outline" 
              size={20} 
              color={address ? colors.primary : colors.textPrimary} 
              style={expenseStyles.icon} 
            />
            <TextInput
              style={expenseStyles.input}
              placeholder="Dirección"
              placeholderTextColor={colors.textSecondary}
              value={address}
              onChangeText={setAddress}
            />
          </View>
          
          {/* Campo de URL del Mapa */}
          <View style={commonStyles.inputRow}>
            <Ionicons 
              name="location-outline" 
              size={20} 
              color={mapUrl ? colors.primary : colors.textPrimary} 
              style={expenseStyles.icon} 
            />
            <TextInput
              style={expenseStyles.input}
              placeholder="Mapa (URL)"
              placeholderTextColor={colors.textSecondary}
              value={mapUrl}
              onChangeText={setMapUrl}
            />
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={date ? new Date(date) : new Date()}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}

          {/* Botones Cancelar / Guardar con estilo del modal de gastos */}
          <View style={expenseStyles.buttonRow}>
            <TouchableOpacity
              style={[commonStyles.button, commonStyles.cancelBtn]}
              onPress={() => navigation.goBack()}
            >
              <Text style={commonStyles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[commonStyles.button, commonStyles.saveBtn]}
              onPress={handleSave}
            >
              <Text style={commonStyles.buttonText}>Guardar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
