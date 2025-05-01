// src/screens/CreateExpenseScreen.js
import React, { useState, useContext, useEffect, useLayoutEffect, useCallback } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  Keyboard,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRoute, useNavigation } from '@react-navigation/native';
import { EventContext } from '../context/EventContext';

export default function CreateExpenseScreen() {
  const { params } = useRoute();
  const navigation = useNavigation();
  const { eventId } = params;

  const {
    events,
    participants,
    relations,
    getParticipantsForEvent,
    getGastosForEvent,
    addGasto,
    updateGasto,
    removeGasto,
  } = useContext(EventContext);

  // Evento, participantes y gastos asociados
  const event = events.find(e => e.id === eventId) || {};
  const evtParticipants = getParticipantsForEvent(eventId);
  const gastosList = getGastosForEvent(eventId);

  // Filtro de lista
  const [filterText, setFilterText] = useState('');
  const filteredGastos = gastosList.filter(g => {
    const rel = relations.find(r => r.id === g.eventsParticipantsId);
    const payer = participants.find(p => p.id === rel?.participantsId);
    const txt = filterText.toLowerCase();
    return (
      g.descripcion.toLowerCase().includes(txt) ||
      payer?.name.toLowerCase().includes(txt)
    );
  });

  // Estado del formulario retractil
  const [formExpanded, setFormExpanded] = useState(false);
  // Campos del formulario (fecha por defecto hoy)
  const todayStr = new Date().toISOString().split('T')[0];
  const [descripcion, setDescripcion] = useState('');
  const [monto, setMonto] = useState('');
  const [selectedPart, setSelectedPart] = useState(null);
  const [date, setDate] = useState(todayStr);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Modal picker de participante
  const [showPartModal, setShowPartModal] = useState(false);
  const [partSearch, setPartSearch] = useState('');

  // Modal detalle/edición
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState('view'); // 'view' | 'edit'
  const [currentExpense, setCurrentExpense] = useState(null);

  /** Navega de vuelta al modal del evento **/
  const returnToEvent = useCallback(() => {
    navigation.navigate('Tabs', {
      screen: 'Home',
      params: { openEventId: eventId },
    });
  }, [navigation, eventId]);

  // Botón de volver en el header
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={returnToEvent} style={{ marginLeft: 16 }}>
          <Ionicons name="arrow-back-outline" size={24} color="#FFF" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, returnToEvent]);

  // Intercepta hardware back
  useEffect(() => {
    const unsub = navigation.addListener('beforeRemove', e => {
      e.preventDefault();
      returnToEvent();
    });
    return unsub;
  }, [navigation, returnToEvent]);

  // Abre detalle/edición
  const openModal = expense => {
    setCurrentExpense(expense);
    // Precarga campos
    const rel = relations.find(r => r.id === expense.eventsParticipantsId);
    setDescripcion(expense.descripcion);
    setMonto(expense.monto.toString());
    setDate(expense.date);
    setSelectedPart(rel?.participantsId || null);
    setModalMode('view');
    setModalVisible(true);
  };

  // Cierra detalle
  const closeModal = () => {
    setModalVisible(false);
    setModalMode('view');
    setCurrentExpense(null);
  };

  // Handler fecha
  const onChangeDate = (_, sel) => {
    setShowDatePicker(false);
    if (sel) setDate(sel.toISOString().split('T')[0]);
  };

  // Guardar edición
  const saveEdit = () => {
    if (!currentExpense) return;
    updateGasto(currentExpense.id, {
      descripcion,
      monto: parseFloat(monto) || 0,
      date,
      eventsParticipantsId: relations.find(
        r => r.eventsId === eventId && r.participantsId === selectedPart
      )?.id,
    });
    closeModal();
  };

  // Render cada gasto
  const renderGasto = ({ item }) => {
    const rel = relations.find(r => r.id === item.eventsParticipantsId);
    const payer = participants.find(p => p.id === rel?.participantsId);
    const amountFmt = item.monto.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return (
      <TouchableOpacity style={styles.card} onPress={() => openModal(item)}>
        <View style={styles.iconColumn}>
          <Ionicons name="document-text-outline" size={32} color="#FFF" />
        </View>
        <View style={styles.infoColumn}>
          <Text style={styles.descText}>{item.descripcion}</Text>
          <Text style={styles.payerText}>{payer?.name}</Text>
          <Text style={styles.dateText}>{item.date}</Text>
        </View>
        <View style={styles.actionsColumn}>
          <Text style={styles.amountText}>${amountFmt}</Text>
          <TouchableOpacity onPress={() => removeGasto(item.id)} style={styles.deleteBtn}>
            <Ionicons name="trash-outline" size={24} color="#FF6B6B" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  // Agregar nuevo gasto
  const saveNew = () => {
       const relId = relations.find(
         (r) => r.eventsId === eventId && r.participantsId === selectedPart
       )?.id;
       addGasto({
        descripcion,
         monto: parseFloat(monto) || 0,
         date,
         eventsParticipantsId: relId,
       });
    // Reset formulario
    setDescripcion('');
    setMonto('');
    setDate(todayStr);
    setSelectedPart(null);
    Keyboard.dismiss();
    setFormExpanded(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Gastos del Evento – {event.name}</Text>

      <TextInput
        placeholder="Filtrar por descripción o participante..."
        placeholderTextColor="#AAA"
        style={styles.filterInput}
        value={filterText}
        onChangeText={setFilterText}
      />

      <FlatList
        data={filteredGastos}
        keyExtractor={item => item.id}
        renderItem={renderGasto}
        contentContainerStyle={{ paddingBottom: 16 }}
        ListEmptyComponent={<Text style={styles.empty}>No hay gastos.</Text>}
      />

      <TouchableOpacity
        style={styles.toggleForm}
        onPress={() => setFormExpanded(!formExpanded)}
      >
        <Ionicons
          name={formExpanded ? 'chevron-down-outline' : 'chevron-up-outline'}
          size={20}
          color="#FFF"
        />
        <Text style={styles.toggleText}>
          {formExpanded
            ? 'Ocultar Formulario Carga Gasto'
            : 'Mostrar Formulario Carga Gasto'}
        </Text>
      </TouchableOpacity>

      {formExpanded && (
        <View style={styles.form}>
          <Text style={styles.formTitle}>Formulario Carga Gasto</Text>

          <View style={styles.inputRow}>
            <Ionicons
              name="document-text-outline"
              size={20}
              color="#FFF"
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              placeholder="Descripción"
              placeholderTextColor="#AAA"
              value={descripcion}
              onChangeText={setDescripcion}
            />
          </View>

          <View style={styles.inputRow}>
            <Ionicons name="cash-outline" size={20} color="#FFF" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Monto"
              placeholderTextColor="#AAA"
              value={monto}
              onChangeText={setMonto}
              keyboardType="decimal-pad"
            />
          </View>

          <View style={styles.inputRow}>
            <Ionicons
              name="people-outline"
              size={20}
              color="#FFF"
              style={styles.icon}
            />
            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowPartModal(true)}
            >
              <Text style={{ color: selectedPart ? '#FFF' : '#AAA' }}>
                {selectedPart
                  ? evtParticipants.find(p => p.id === selectedPart)?.name
                  : 'Seleccionar participante'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputRow}>
            <Ionicons
              name="calendar-number-outline"
              size={20}
              color="#FFF"
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#AAA"
              value={date}
              onChangeText={setDate}
            />
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <Ionicons name="calendar-outline" size={24} color="#00FF55" />
            </TouchableOpacity>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={new Date(date)}
              mode="date"
              display="default"
              onChange={onChangeDate}
            />
          )}

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.saveBtn]}
              onPress={saveNew}
            >
              <Text style={styles.buttonText}>Guardar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Picker de participante */}
      <Modal transparent visible={showPartModal} animationType="slide">
        <View style={styles.modalOverlay}>
          <TextInput
            style={styles.modalSearch}
            placeholder="Buscar participante..."
            placeholderTextColor="#AAA"
            value={partSearch}
            onChangeText={setPartSearch}
          />
          <FlatList
            data={evtParticipants.filter(p =>
              p.name.toLowerCase().includes(partSearch.toLowerCase())
            )}
            keyExtractor={p => p.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.partRow}
                onPress={() => {
                  setSelectedPart(item.id);
                  setShowPartModal(false);
                }}
              >
                <Ionicons name="person-outline" size={20} color="#FFF" />
                <Text style={styles.partName}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity
            style={styles.modalClose}
            onPress={() => setShowPartModal(false)}
          >
            <Text style={styles.modalCloseText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Modal detalle/edición */}
      {currentExpense && (
        <Modal transparent visible={modalVisible} animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {modalMode === 'view' ? 'Detalle Gasto' : 'Editar Gasto'}
                </Text>
                {modalMode === 'view' && (
                  <TouchableOpacity onPress={() => setModalMode('edit')}>
                    <Text style={styles.modalEdit}>Editar</Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Detalle / Edición */}
              <View style={styles.inputRow}>
                <Ionicons
                  name="document-text-outline"
                  size={20}
                  color="#FFF"
                  style={styles.icon}
                />
                <TextInput
                  style={styles.input}
                  value={descripcion}
                  editable={modalMode === 'edit'}
                  onChangeText={setDescripcion}
                />
              </View>
              <View style={styles.inputRow}>
                <Ionicons
                  name="cash-outline"
                  size={20}
                  color="#FFF"
                  style={styles.icon}
                />
                <TextInput
                  style={styles.input}
                  value={monto}
                  editable={modalMode === 'edit'}
                  onChangeText={setMonto}
                  keyboardType="decimal-pad"
                />
              </View>
              <View style={styles.inputRow}>
                <Ionicons
                  name="people-outline"
                  size={20}
                  color="#FFF"
                  style={styles.icon}
                />
                <TouchableOpacity
                  style={styles.input}
                  disabled={modalMode === 'view'}
                  onPress={() => modalMode === 'edit' && setShowPartModal(true)}
                >
                  <Text style={{ color: '#FFF' }}>
                    {evtParticipants.find(p => p.id === selectedPart)?.name}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.inputRow}>
                <Ionicons
                  name="calendar-number-outline"
                  size={20}
                  color="#FFF"
                  style={styles.icon}
                />
                <TextInput
                  style={styles.input}
                  value={date}
                  editable={modalMode === 'edit'}
                  onChangeText={setDate}
                />
                <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                  <Ionicons name="calendar-outline" size={24} color="#00FF55" />
                </TouchableOpacity>
              </View>
              {showDatePicker && modalMode === 'edit' && (
                <DateTimePicker
                  value={new Date(date)}
                  mode="date"
                  display="default"
                  onChange={onChangeDate}
                />
              )}
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelBtn]}
                  onPress={closeModal}
                >
                  <Text style={styles.buttonText}>Cancelar</Text>
                </TouchableOpacity>
                {modalMode === 'edit' && (
                  <TouchableOpacity
                    style={[styles.button, styles.saveBtn]}
                    onPress={saveEdit}
                  >
                    <Text style={styles.buttonText}>Guardar</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0E1A' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#FFF', padding: 16 },
  filterInput: {
    marginHorizontal: 16,
    backgroundColor: '#1F2230',
    borderRadius: 8,
    padding: 8,
    color: '#FFF',
    marginBottom: 8,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F2230',
    marginHorizontal: 16,
    marginVertical: 4,
    padding: 12,
    borderRadius: 8,
  },
  iconColumn: { marginRight: 12 },
  infoColumn: { flex: 2 },
  descText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  payerText: { color: '#FFF', fontSize: 14, marginTop: 4 },
  dateText: { color: '#AAA', fontSize: 12, marginTop: 2 },
  actionsColumn: { flexDirection: 'row', alignItems: 'center' },
  amountText: { color: '#00FF55', fontWeight: 'bold', marginRight: 8 },
  deleteBtn: { padding: 4 },
  empty: { color: '#FFF', textAlign: 'center', marginTop: 32 },

  toggleForm: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  toggleText: { color: '#FFF', marginLeft: 8 },
  form: {
    backgroundColor: '#1F2230',
    marginHorizontal: 16,
    borderRadius: 8,
    padding: 16,
  },
  formTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  inputRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  icon: { marginRight: 12 },
  input: {
    flex: 1,
    backgroundColor: '#333',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: '#FFF',
  },
  buttonRow: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16 },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginLeft: 8,
  },
  saveBtn: { backgroundColor: '#00FF55' },
  cancelBtn: { backgroundColor: '#696969' },
  buttonText: { color: '#0A0E1A', fontWeight: 'bold' },

  // Modal picker de participante
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    padding: 16,
  },
  modalSearch: {
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 8,
    color: '#FFF',
    marginBottom: 8,
  },
  partRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  partName: { color: '#FFF', marginLeft: 8, flex: 1 },
  modalClose: {
    backgroundColor: '#696969',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  modalCloseText: { color: '#FFF', fontWeight: 'bold' },

  // Modal detalle/edición
  modalContent: {
    backgroundColor: '#1F2230',
    borderRadius: 8,
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalTitle: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
  modalEdit: { color: '#00FF55', fontSize: 16 },
});
