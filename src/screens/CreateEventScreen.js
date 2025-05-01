// src/screens/CreateEventScreen.js

import React, { useState, useContext, useCallback } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Switch
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import { EventContext } from '../context/EventContext';

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
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={styles.pageTitle}>Nuevo Evento</Text>

        {/* WhatsApp */}
        <View style={styles.switchRow}>
          <Ionicons name="logo-whatsapp" size={20} color="#FFF" style={styles.icon} />
          <Text style={styles.switchLabel}>Envío por WhatsApp:</Text>
          <Switch
            value={whatsappEnvio}
            onValueChange={setWhatsappEnvio}
            thumbColor={whatsappEnvio ? '#00FF55' : '#FFF'}
            trackColor={{ true: '#55FF88', false: '#333' }}
          />
        </View>

        {/* Inputs básicos */}
        {[
          { icon: 'text-outline', value: name, setter: setName, placeholder: 'Título' },
          { icon: 'calendar-number-outline', value: date, setter: setDate, placeholder: 'Fecha (YYYY-MM-DD)' },
          { icon: 'trail-sign-outline', value: address, setter: setAddress, placeholder: 'Dirección' },
          { icon: 'location-outline', value: mapUrl, setter: setMapUrl, placeholder: 'Mapa (URL)' },
        ].map((f, i) => (
          <View key={i} style={styles.inputRow}>
            <Ionicons name={f.icon} size={20} color="#FFF" style={styles.icon} />
            <TextInput
              placeholder={f.placeholder}
              placeholderTextColor="#AAA"
              style={styles.input}
              value={f.value}
              onChangeText={f.setter}
            />
            {f.placeholder.startsWith('Fecha') && (
              <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.calIcon}>
                <Ionicons name="calendar-outline" size={24} color="#00FF55" />
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
        <View style={styles.footer}>
          <TouchableOpacity style={[styles.button, styles.buttonDisabled]} onPress={() => navigation.goBack()}>
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.buttonPrimary]} onPress={handleSave}>
            <Text style={styles.buttonText}>Guardar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:      { flex: 1, backgroundColor: '#0A0E1A' },
  pageTitle:      { fontSize: 24, fontWeight: 'bold', color: '#FFF', alignSelf: 'center', marginBottom: 16 },
  switchRow:      { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  icon:           { marginRight: 12 },
  switchLabel:    { flex: 1, color: '#FFF', fontSize: 16 },
  inputRow:       { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  input:          { flex: 1, backgroundColor: '#1F2230', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, color: '#FFF' },
  calIcon:        { marginLeft: 8 },
  footer:         { flexDirection: 'row', justifyContent: 'space-between', marginTop: 24 },
  button:         { flex: 1, borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  buttonPrimary:  { backgroundColor: '#00FF55', marginLeft: 8 },
  buttonDisabled: { backgroundColor: '#696969', marginRight: 8 },
  buttonText:     { color: '#0A0E1A', fontSize: 16, fontWeight: 'bold' },
});
