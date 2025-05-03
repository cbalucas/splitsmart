// src/screens/CreateExpenseScreen.js
import React, { useState, useContext, useEffect, useLayoutEffect, useCallback } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  Keyboard,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRoute, useNavigation } from '@react-navigation/native';
import { EventContext } from '../context/EventContext';
import colors from '../styles/colors';
import commonStyles from '../styles/commonStyles';
import expenseStyles from '../styles/expenseStyles';

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

  /** Navega de vuelta al home sin abrir el modal del evento **/
  const returnToEvent = useCallback(() => {
    navigation.navigate('Tabs', {
      screen: 'Home',
      // Ya no pasamos openEventId para evitar que se abra automáticamente
    });
  }, [navigation]);

  // Botón de volver en el header
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={returnToEvent} style={{ marginLeft: 16 }}>
          <Ionicons name="arrow-back-outline" size={24} color={colors.textPrimary} />
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
      <TouchableOpacity style={expenseStyles.card} onPress={() => openModal(item)}>
        <View style={expenseStyles.iconColumn}>
          <Ionicons name="document-text-outline" size={32} color={colors.textPrimary} />
        </View>
        <View style={expenseStyles.infoColumn}>
          <Text style={expenseStyles.descText}>{item.descripcion}</Text>
          <Text style={expenseStyles.payerText}>{payer?.name}</Text>
          <Text style={expenseStyles.dateText}>{item.date}</Text>
        </View>
        <View style={expenseStyles.actionsColumn}>
          <Text style={expenseStyles.amountText}>${amountFmt}</Text>
          <TouchableOpacity onPress={() => removeGasto(item.id)} style={expenseStyles.deleteBtn}>
            <Ionicons name="trash-outline" size={24} color={colors.danger} />
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
    <SafeAreaView style={commonStyles.container}>
      <View style={commonStyles.content}>
        {/* Filtro */}
        <TextInput
          placeholder="Filtrar por descripción o participante..."
          placeholderTextColor={colors.textSecondary}
          style={commonStyles.filterInput}
          value={filterText}
          onChangeText={setFilterText}
        />

        {/* Lista de gastos */}
        <FlatList
          data={filteredGastos}
          keyExtractor={item => item.id}
          renderItem={renderGasto}
          contentContainerStyle={{ paddingBottom: 120 }} // Espacio para el botón de abajo
          ListEmptyComponent={<Text style={expenseStyles.empty}>No hay gastos.</Text>}
        />
        
        {/* Botón flotante para agregar gasto */}
        <TouchableOpacity 
          style={commonStyles.floatingButton}
          onPress={() => setFormExpanded(!formExpanded)}
        >
          <Ionicons 
            name={formExpanded ? "close-outline" : "add-outline"} 
            size={30} 
            color={colors.textPrimary} 
          />
        </TouchableOpacity>
      </View>

      {/* Modal del formulario (en lugar de sección fija) */}
      <Modal
        visible={formExpanded}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setFormExpanded(false)}
      >
        <View style={commonStyles.modalOverlay}>
          <View style={commonStyles.modalContent}>
            <View style={commonStyles.modalHeader}>
              <Text style={commonStyles.modalTitle}>Formulario Carga Gasto</Text>
              <TouchableOpacity onPress={() => setFormExpanded(false)}>
                <Ionicons name="close-outline" size={24} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <View style={commonStyles.inputRow}>
              <Ionicons
                name="document-text-outline"
                size={20}
                color={colors.textPrimary}
                style={expenseStyles.icon}
              />
              <TextInput
                style={expenseStyles.input}
                placeholder="Descripción"
                placeholderTextColor={colors.textSecondary}
                value={descripcion}
                onChangeText={setDescripcion}
              />
            </View>

            <View style={commonStyles.inputRow}>
              <Ionicons name="cash-outline" size={20} color={colors.textPrimary} style={expenseStyles.icon} />
              <TextInput
                style={expenseStyles.input}
                placeholder="Monto"
                placeholderTextColor={colors.textSecondary}
                value={monto}
                onChangeText={setMonto}
                keyboardType="decimal-pad"
              />
            </View>

            <View style={commonStyles.inputRow}>
              <Ionicons
                name="people-outline"
                size={20}
                color={colors.textPrimary}
                style={expenseStyles.icon}
              />
              <TouchableOpacity
                style={expenseStyles.input}
                onPress={() => setShowPartModal(true)}
              >
                <Text style={{ color: selectedPart ? colors.textPrimary : colors.textSecondary, paddingVertical: 8 }}>
                  {selectedPart
                    ? evtParticipants.find(p => p.id === selectedPart)?.name
                    : 'Seleccionar participante'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={commonStyles.inputRow}>
              <Ionicons
                name="calendar-number-outline"
                size={20}
                color={colors.textPrimary}
                style={expenseStyles.icon}
              />
              <TextInput
                style={expenseStyles.input}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={colors.textSecondary}
                value={date}
                onChangeText={setDate}
              />
              <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                <Ionicons name="calendar-outline" size={24} color={colors.primary} />
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

            <TouchableOpacity
              style={commonStyles.saveButton}
              onPress={saveNew}
            >
              <Text style={commonStyles.saveButtonText}>Guardar Gasto</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Picker de participante */}
      <Modal transparent visible={showPartModal} animationType="slide">
        <View style={commonStyles.modalOverlay}>
          <View style={commonStyles.modalContent}>
            <Text style={commonStyles.modalTitle}>Seleccionar Participante</Text>
            <TextInput
              style={expenseStyles.modalSearch}
              placeholder="Buscar participante..."
              placeholderTextColor={colors.textSecondary}
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
                  style={expenseStyles.partRow}
                  onPress={() => {
                    setSelectedPart(item.id);
                    setShowPartModal(false);
                  }}
                >
                  <Ionicons name="person-outline" size={20} color={colors.textPrimary} />
                  <Text style={expenseStyles.partName}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={commonStyles.closeButton}
              onPress={() => setShowPartModal(false)}
            >
              <Text style={commonStyles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal detalle/edición */}
      {currentExpense && (
        <Modal transparent visible={modalVisible} animationType="slide">
          <View style={commonStyles.modalOverlay}>
            <View style={commonStyles.modalContent}>
              <View style={commonStyles.modalHeader}>
                <Text style={commonStyles.modalTitle}>
                  {modalMode === 'view' ? 'Detalle Gasto' : 'Editar Gasto'}
                </Text>
                {modalMode === 'view' && (
                  <TouchableOpacity onPress={() => setModalMode('edit')}>
                    <Ionicons name="create-outline" size={24} color={colors.primary}/>
                  </TouchableOpacity>
                )}
              </View>

              {/* Detalle / Edición */}
              <View style={commonStyles.inputRow}>
                <Ionicons
                  name="document-text-outline"
                  size={20}
                  color={colors.textPrimary}
                  style={expenseStyles.icon}
                />
                <TextInput
                  style={expenseStyles.input}
                  value={descripcion}
                  editable={modalMode === 'edit'}
                  onChangeText={setDescripcion}
                />
              </View>
              <View style={commonStyles.inputRow}>
                <Ionicons
                  name="cash-outline"
                  size={20}
                  color={colors.textPrimary}
                  style={expenseStyles.icon}
                />
                <TextInput
                  style={expenseStyles.input}
                  value={monto}
                  editable={modalMode === 'edit'}
                  onChangeText={setMonto}
                  keyboardType="decimal-pad"
                />
              </View>
              <View style={commonStyles.inputRow}>
                <Ionicons
                  name="people-outline"
                  size={20}
                  color={colors.textPrimary}
                  style={expenseStyles.icon}
                />
                <TouchableOpacity
                  style={expenseStyles.input}
                  disabled={modalMode === 'view'}
                  onPress={() => modalMode === 'edit' && setShowPartModal(true)}
                >
                  <Text style={{ color: colors.textPrimary, paddingVertical: 8 }}>
                    {evtParticipants.find(p => p.id === selectedPart)?.name}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={commonStyles.inputRow}>
                <Ionicons
                  name="calendar-number-outline"
                  size={20}
                  color={colors.textPrimary}
                  style={expenseStyles.icon}
                />
                <TextInput
                  style={expenseStyles.input}
                  value={date}
                  editable={modalMode === 'edit'}
                  onChangeText={setDate}
                />
                <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                  <Ionicons name="calendar-outline" size={24} color={colors.primary} />
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
              <View style={expenseStyles.buttonRow}>
                <TouchableOpacity
                  style={[commonStyles.button, commonStyles.cancelBtn]}
                  onPress={closeModal}
                >
                  <Text style={commonStyles.buttonText}>Cerrar</Text>
                </TouchableOpacity>
                {modalMode === 'edit' && (
                  <TouchableOpacity
                    style={[commonStyles.button, commonStyles.saveBtn]}
                    onPress={saveEdit}
                  >
                    <Text style={commonStyles.buttonText}>Guardar</Text>
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
