// src/screens/CreateEventScreen.js

import React, { useState, useContext, useCallback } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Switch
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import { EventContext } from '../context/EventContext';
import commonStyles from '../styles/commonStyles';
import eventStyles from '../styles/eventStyles';
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
    }, [])
  );

  const handleDateChange = (_, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate.toISOString().split('T')[0]);
    }
  };

  const handleSave = () => {
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
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={eventStyles.pageTitle}>Nuevo Evento</Text>

        {/* WhatsApp */}
        <View style={eventStyles.switchRow}>
          <Ionicons name="logo-whatsapp" size={20} color={colors.textPrimary} style={eventStyles.icon} />
          <Text style={eventStyles.switchLabel}>Envío por WhatsApp:</Text>
          <Switch
            value={whatsappEnvio}
            onValueChange={setWhatsappEnvio}
            thumbColor={whatsappEnvio ? colors.primary : colors.textPrimary}
            trackColor={{ true: colors.primary, false: colors.border }}
          />
        </View>

        {/* Inputs básicos */}
        {[
          { icon: 'text-outline', value: name, setter: setName, placeholder: 'Título' },
          { icon: 'calendar-number-outline', value: date, setter: setDate, placeholder: 'Fecha (YYYY-MM-DD)' },
          { icon: 'trail-sign-outline', value: address, setter: setAddress, placeholder: 'Dirección' },
          { icon: 'location-outline', value: mapUrl, setter: setMapUrl, placeholder: 'Mapa (URL)' },
        ].map((f, i) => (
          <View key={i} style={commonStyles.inputRow}>
            <Ionicons name={f.icon} size={20} color={colors.textPrimary} style={eventStyles.icon} />
            <TextInput
              placeholder={f.placeholder}
              placeholderTextColor={colors.textSecondary}
              style={eventStyles.input}
              value={f.value}
              onChangeText={f.setter}
            />
            {f.placeholder.startsWith('Fecha') && (
              <TouchableOpacity onPress={() => setShowDatePicker(true)} style={eventStyles.calIcon}>
                <Ionicons name="calendar-outline" size={24} color={colors.primary} />
              </TouchableOpacity>
            )}
          </View>
        ))}

        {showDatePicker && (
          <DateTimePicker
            value={date ? new Date(date) : new Date()}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}

        {/* Botones Cancelar / Guardar */}
        <View style={commonStyles.footer}>
          <TouchableOpacity style={[commonStyles.button, commonStyles.cancelBtn]} onPress={() => navigation.goBack()}>
            <Text style={commonStyles.buttonText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[commonStyles.button, commonStyles.saveBtn]} onPress={handleSave}>
            <Text style={commonStyles.buttonText}>Guardar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
