import React, { useState, useEffect, useContext } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Modal,
  FlatList,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Ionicons from '@expo/vector-icons/Ionicons';
import { AuthContext } from '../context/AuthContext';
import { EventContext } from '../context/EventContext';

export default function CreateEventScreen({ navigation }) {
  const { logout } = useContext(AuthContext);
  const { addEvent, participants: allParticipants } = useContext(
    EventContext
  );

  // Campos del formulario
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [address, setAddress] = useState('');
  const [mapUrl, setMapUrl] = useState('');
  const [whatsappEnvio, setWhatsappEnvio] = useState(false);
  const [total, setTotal] = useState('');
  const [per, setPer] = useState('0.00');

  // Participantes
  const [selectedParticipants, setSelectedParticipants] = useState(
    []
  );
  const [participantsCollapsed, setParticipantsCollapsed] = useState(
    true
  );
  const [showAddList, setShowAddList] = useState(false);
  const [addListSearch, setAddListSearch] = useState('');

  // Selector de fecha
  const [showDatePicker, setShowDatePicker] = useState(false);

  // recalcula c/u
  useEffect(() => {
    const t = parseFloat(total) || 0;
    const p = selectedParticipants.length;
    setPer(p > 0 ? (t / p).toFixed(2) : '0.00');
  }, [total, selectedParticipants]);

  const handleDateChange = (_, sel) => {
    setShowDatePicker(false);
    if (sel) setDate(sel.toISOString().split('T')[0]);
  };

  const handleSave = () => {
    // construye el objeto conforme espera EventContext.addEvent
    addEvent({
      name,
      date,
      address,
      map: mapUrl,
      whatsappEnvio,
      total: parseFloat(total) || 0,
      per: parseFloat(per) || 0,
      estadoEvento: true,
      participantsIds: selectedParticipants,
    });
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={styles.pageTitle}>Nuevo Evento</Text>

        {/* WhatsApp */}
        <View style={styles.switchRow}>
          <Ionicons
            name="logo-whatsapp"
            size={20}
            color="#FFF"
            style={styles.icon}
          />
          <Text style={styles.switchLabel}>
            Envío por WhatsApp:
          </Text>
          <Switch
            value={whatsappEnvio}
            onValueChange={setWhatsappEnvio}
            thumbColor={
              whatsappEnvio ? '#00FF55' : '#FFF'
            }
            trackColor={{ true: '#55FF88', false: '#333' }}
          />
        </View>

        {/* Inputs básicos */}
        {[
          {
            icon: 'text-outline',
            value: name,
            setter: setName,
            placeholder: 'Título',
          },
          {
            icon: 'calendar-number-outline',
            value: date,
            setter: setDate,
            placeholder: 'Fecha (YYYY-MM-DD)',
          },
          {
            icon: 'trail-sign-outline',
            value: address,
            setter: setAddress,
            placeholder: 'Dirección',
          },
          {
            icon: 'location-outline',
            value: mapUrl,
            setter: setMapUrl,
            placeholder: 'Mapa (URL)',
          },
        ].map((f, i) => (
          <View key={i} style={styles.inputRow}>
            <Ionicons
              name={f.icon}
              size={20}
              color="#FFF"
              style={styles.icon}
            />
            <TextInput
              placeholder={f.placeholder}
              placeholderTextColor="#AAA"
              style={styles.input}
              value={f.value}
              onChangeText={f.setter}
            />
            {f.placeholder.startsWith('Fecha') && (
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                style={styles.calIcon}
              >
                <Ionicons
                  name="calendar-outline"
                  size={24}
                  color="#00FF55"
                />
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

        {/* Gasto Total */}
        <View style={styles.inputRow}>
          <Ionicons
            name="cash-outline"
            size={20}
            color="#FFF"
            style={styles.icon}
          />
          <TextInput
            placeholder="Gasto Total"
            placeholderTextColor="#AAA"
            style={styles.input}
            value={total}
            onChangeText={setTotal}
            keyboardType="decimal-pad"
          />
        </View>

        {/* Sección Participantes */}
        <View style={styles.partHeader}>
          <Text style={styles.sectionTitle}>
            Participantes ({selectedParticipants.length})
          </Text>
          <TouchableOpacity
            onPress={() =>
              setParticipantsCollapsed((v) => !v)
            }
            style={styles.toggleListButton}
          >
            <Ionicons
              name={
                participantsCollapsed
                  ? 'chevron-down-outline'
                  : 'chevron-up-outline'
              }
              size={20}
              color="#FFF"
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setShowAddList(true)}
            style={styles.addIconButton}
          >
            <Ionicons
              name="person-add-outline"
              size={20}
              color="#00FF55"
            />
          </TouchableOpacity>
        </View>

        {!participantsCollapsed && (
          <>
            <TextInput
              placeholder="Buscar participante"
              placeholderTextColor="#AAA"
              value={addListSearch}
              onChangeText={setAddListSearch}
              style={styles.addListSearchInput}
            />
            <FlatList
              data={selectedParticipants
                .map((id) =>
                  allParticipants.find((p) => p.id === id)
                )
                .filter(Boolean)}
              keyExtractor={(p) => p.id}
              renderItem={({ item }) => (
                <View style={styles.partRow}>
                  <Ionicons
                    name="person-outline"
                    size={20}
                    color="#FFF"
                  />
                  <Text style={styles.partName}>
                    {item.name}
                  </Text>
                  <TouchableOpacity
                    onPress={() =>
                      setSelectedParticipants((prev) =>
                        prev.filter((pid) => pid !== item.id)
                      )
                    }
                    style={styles.partRemove}
                  >
                    <Ionicons
                      name="trash-outline"
                      size={20}
                      color="#FF6B6B"
                    />
                  </TouchableOpacity>
                </View>
              )}
            />
          </>
        )}

        {/* Sub-modal Agregar Participante */}
        <Modal
          transparent
          visible={showAddList}
          animationType="slide"
        >
          <View
            style={[
              styles.addListOverlay,
              { backgroundColor: 'rgba(0,0,0,0.8)' },
            ]}
          >
            <Text style={styles.addListTitle}>
              Participantes
            </Text>
            <TextInput
              placeholder="Buscar participante"
              placeholderTextColor="#AAA"
              value={addListSearch}
              onChangeText={setAddListSearch}
              style={styles.addListSearchInput}
            />
            <FlatList
              data={allParticipants
                .filter(
                  (p) =>
                    !selectedParticipants.includes(p.id)
                )
                .filter((p) =>
                  p.name
                    .toLowerCase()
                    .includes(addListSearch.toLowerCase())
                )}
              keyExtractor={(p) => p.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.partRow}
                  onPress={() => {
                    setSelectedParticipants((prev) => [
                      ...prev,
                      item.id,
                    ]);
                  }}
                >
                  <Ionicons
                    name="person-outline"
                    size={20}
                    color="#FFF"
                  />
                  <Text style={styles.partName}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={styles.addListClose}
              onPress={() => setShowAddList(false)}
            >
              <Text style={styles.addListCloseText}>
                Cerrar
              </Text>
            </TouchableOpacity>
          </View>
        </Modal>

        {/* Gasto por persona */}
        <View style={styles.inputRow}>
          <Ionicons
            name="calculator-outline"
            size={20}
            color="#FFF"
            style={styles.icon}
          />
          <Text style={styles.input}>${per}</Text>
        </View>

        {/* Botones Cancelar / Guardar */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.button, styles.buttonDisabled]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.buttonPrimary]}
            onPress={handleSave}
          >
            <Text style={styles.buttonText}>Guardar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}




const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0E1A' },
  pageTitle: { fontSize: 24, fontWeight: 'bold', color: '#FFF', alignSelf: 'center', marginBottom: 16 },
  inputRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  switchRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  icon: { marginRight: 12 },
  input: { flex: 1, backgroundColor: '#1F2230', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, color: '#FFF' },
  switchLabel: { flex: 1, color: '#FFF', fontSize: 16 },
  calIcon: { marginLeft: 8 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 24 },
  button: { flex: 1, borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  buttonPrimary: { backgroundColor: '#00FF55', marginLeft: 8 },
  buttonDisabled: { backgroundColor: '#696969', marginRight: 8 },
  buttonText: { color: '#0A0E1A', fontSize: 16, fontWeight: 'bold' },

  /* Participantes */
  partHeader: { flexDirection: 'row', alignItems: 'center', marginTop: 16, marginBottom: 8 },
  sectionTitle: { color: '#FFF', fontSize: 16, fontWeight: 'bold', flex: 1 },
  toggleListButton: { padding: 4 },
  addIconButton: { padding: 4, marginLeft: 8 },
  addListSearchInput: { backgroundColor: '#0F1120', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, color: '#FFF', marginBottom: 8 },
  partRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 4 },
  partName: { color: '#FFF', marginLeft: 8, flex: 1 },
  partRemove: { padding: 4 },

  /* Modal Agregar Participante */
  addListOverlay: { flex: 1, justifyContent: 'center', padding: 16 },
  addListTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  addListClose: { backgroundColor: '#696969', borderRadius: 12, padding: 12, marginTop: 8, alignItems: 'center' },
  addListCloseText: { color: '#FFF', fontWeight: 'bold' },
});
