// src/screens/CreateEventScreen.js
import React, { useState, useEffect, useContext } from 'react';
import { EventContext } from '../context/EventContext';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Switch,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function CreateEventScreen({ navigation }) {
  const { addEvent } = useContext(EventContext);
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [address, setAddress] = useState('');
  const [map, setMap] = useState('');
  const [whatsappEnvio, setWhatsappEnvio] = useState(false);
  const [gastoTotal, setGastoTotal] = useState('');
  const [participantesNro, setParticipantesNro] = useState(0);
  const [gastoCU, setGastoCU] = useState('0.00');
  const [estadoEvento] = useState(true);

  // recalcula gastoCU
  useEffect(() => {
    const total = parseFloat(gastoTotal) || 0;
    const nro   = participantesNro;
    setGastoCU(nro > 0 ? (total / nro).toFixed(2) : '0.00');
  }, [gastoTotal, participantesNro]);

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const iso = selectedDate.toISOString().split('T')[0];
      setDate(iso);
    }
  };

  const handleSave = () => {
    // construimos el objeto con los mismos nombres que espera HomeScreen
    addEvent({
      name,
      date,
      address,
      map,
      whatsappEnvio,
      gastoTotal:    parseFloat(gastoTotal),
      gastoCU:       parseFloat(gastoCU),
      estadoEvento,
      participantesNro,
    });
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={styles.pageTitle}>Nuevo Evento</Text>

        <View style={styles.switchRow}>
          <Ionicons name="logo-whatsapp" size={20} color="#FFF" style={styles.icon} />
          <Text style={styles.switchLabel}>Envio por WhatsApp:</Text>
          <Switch
            value={whatsappEnvio}
            onValueChange={setWhatsappEnvio}
            thumbColor={whatsappEnvio ? '#00FF55' : '#FFF'}
            trackColor={{ true: '#55FF88', false: '#333' }}
          />
        </View>

        {/* Fecha: TextInput + icono que abre el DatePicker */}
        <View style={styles.inputRow}>
          <Ionicons name="calendar-number-outline" size={20} color="#FFF" style={styles.icon} />
          <TextInput
            placeholder="YYYY-MM-DD"
            placeholderTextColor="#AAA"
            style={[styles.input, styles.dateInput]}
            value={date}
            onChangeText={setDate}
          />
          <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.calIcon}>
            <Ionicons name="calendar-outline" size={24} color="#00FF55" />
          </TouchableOpacity>
        </View>
        {showDatePicker && (
          <DateTimePicker
            value={date ? new Date(date) : new Date()}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}

        {/* Otros campos */}
        {[
          { icon: 'text-outline',         value: name,  setter: setName,         placeholder: 'Título' },
          { icon: 'trail-sign-outline',   value: address, setter: setAddress,      placeholder: 'Dirección' },
          { icon: 'location-outline',     value: map,     setter: setMap,          placeholder: 'Mapa (URL)' },
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
          </View>
        ))}

        <View style={styles.inputRow}>
          <Ionicons name="cash-outline" size={20} color="#FFF" style={styles.icon} />
          <TextInput
            placeholder="Gasto Total"
            placeholderTextColor="#AAA"
            style={styles.input}
            value={gastoTotal}
            onChangeText={setGastoTotal}
            keyboardType="decimal-pad"
          />
        </View>

        <View style={styles.inputRow}>
          <Ionicons name="people-outline" size={20} color="#FFF" style={styles.icon} />
          <View style={styles.counter}>
            <TouchableOpacity onPress={() => setParticipantesNro(n => Math.max(0, n - 1))}>
              <Ionicons name="remove-circle-outline" size={24} color="#FF6B6B" />
            </TouchableOpacity>
            <Text style={styles.counterText}>{participantesNro}</Text>
            <TouchableOpacity onPress={() => setParticipantesNro(n => n + 1)}>
              <Ionicons name="add-circle-outline" size={24} color="#00FF55" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputRow}>
          <Ionicons name="calculator-outline" size={20} color="#FFF" style={styles.icon} />
          <Text style={styles.input}>${gastoCU}</Text>
        </View>

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
  container:       { flex: 1, backgroundColor: '#0A0E1A' },
  pageTitle:       { fontSize: 24, fontWeight: 'bold', color: '#FFF', alignSelf: 'center', marginBottom: 16 },
  inputRow:        { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  switchRow:       { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  icon:            { marginRight: 12 },
  input:           { flex: 1, backgroundColor: '#1F2230', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, color: '#FFF' },
  dateInput:       { marginRight: 8 },
  calIcon:         { padding: 4 },
  switchLabel:     { flex: 1, color: '#FFF', fontSize: 16 },
  counter:         { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16 },
  counterText:     { color: '#FFF', fontSize: 18, marginHorizontal: 8 },
  footer:          { flexDirection: 'row', justifyContent: 'space-between', marginTop: 24 },
  button:          { flex: 1, borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  buttonPrimary:   { backgroundColor: '#00FF55', marginLeft: 8 },
  buttonDisabled:  { backgroundColor: '#696969', marginRight: 8 },
  buttonText:      { color: '#0A0E1A', fontSize: 16, fontWeight: 'bold' },
});
