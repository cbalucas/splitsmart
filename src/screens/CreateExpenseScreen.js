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
  Alert,
  BackHandler, // Importar BackHandler
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

  // Estado para validaciones
  const [errors, setErrors] = useState({
    descripcion: false,
    monto: false,
    participant: false
  });

  // Resetear el formulario y limpiar errores
  const resetForm = () => {
    setDescripcion('');
    setMonto('');
    setSelectedPart(null);
    setDate(new Date().toISOString().split('T')[0]); // Fecha actual
    setErrors({
      descripcion: false,
      monto: false,
      participant: false
    });
  };

  // Preparar nuevo formulario al abrir el modal
  useEffect(() => {
    if (formExpanded) {
      resetForm();
    }
  }, [formExpanded]);

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
    // Maneja el botón físico de retroceso
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      // Si hay algún modal abierto, ciérralo en lugar de navegar
      if (modalVisible) {
        closeModal();
        return true; // Evita el comportamiento predeterminado
      }
      if (formExpanded) {
        setFormExpanded(false);
        return true; // Evita el comportamiento predeterminado
      }
      if (showPartModal) {
        setShowPartModal(false);
        return true; // Evita el comportamiento predeterminado
      }
      
      // Si no hay modales abiertos, navega al Home
      returnToEvent();
      return true; // Evita el comportamiento predeterminado
    });

    // Limpiar el listener cuando el componente se desmonta
    return () => backHandler.remove();
  }, [navigation, returnToEvent, modalVisible, formExpanded, showPartModal]);

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
      <View style={expenseStyles.cardContainer}>
        <TouchableOpacity style={expenseStyles.card} onPress={() => openModal(item)}>
          <View style={expenseStyles.cardContent}>
            <Ionicons name="document-text-outline" size={40} color={colors.textPrimary} style={expenseStyles.eventIcon} />
            <View style={expenseStyles.eventInfo}>
              <Text style={expenseStyles.eventName}>{item.descripcion}</Text>
              <Text style={expenseStyles.eventPayerName}>{payer?.name || 'Sin asignar'}</Text>
            </View>
            <View style={expenseStyles.amounts}>
              <View style={expenseStyles.amountRow}>
                <Text style={expenseStyles.amountText}>${amountFmt}</Text>
                <TouchableOpacity onPress={(e) => {
                    e.stopPropagation();
                    removeGasto(item.id);
                  }} 
                >
                  <Ionicons name="trash-outline" size={20} color={colors.danger} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  // Agregar nuevo gasto con validación
  const saveNew = () => {
    // Validar campos obligatorios
    const newErrors = {
      descripcion: !descripcion.trim(),
      monto: !monto.trim() || isNaN(parseFloat(monto)) || parseFloat(monto) <= 0,
      participant: !selectedPart
    };

    setErrors(newErrors);

    // Si hay errores, detener la operación
    if (Object.values(newErrors).some(error => error)) {
      return Alert.alert('Error', 'Por favor, completa los campos obligatorios correctamente.');
    }

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
    resetForm();
    Keyboard.dismiss();
    setFormExpanded(false);
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      {/* Header con búsqueda */}
      <View style={commonStyles.header}>
        <TextInput
          placeholder="Buscar gasto"
          placeholderTextColor={colors.textSecondary}
          value={filterText}
          onChangeText={setFilterText}
          style={commonStyles.searchInput}
        />
        {filterText !== "" && (
          <TouchableOpacity onPress={() => setFilterText("")} style={commonStyles.clearButton}>
            <Ionicons name="close-circle" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        )}
      </View>

      <View style={commonStyles.content}>
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
              <Text style={commonStyles.modalTitle}>Carga de Gasto</Text>
            </View>

            <View style={commonStyles.inputRow}>
              <Ionicons
                name="document-text-outline"
                size={20}
                color={descripcion ? colors.primary : (errors.descripcion ? colors.danger : colors.textPrimary)}
                style={expenseStyles.icon}
              />
              <TextInput
                style={[
                  expenseStyles.input,
                  errors.descripcion && expenseStyles.inputError
                ]}
                placeholder="Descripción *"
                placeholderTextColor={errors.descripcion ? colors.danger : colors.textSecondary}
                value={descripcion}
                onChangeText={(text) => {
                  setDescripcion(text);
                  if (text.trim()) {
                    setErrors(prev => ({...prev, descripcion: false}));
                  }
                }}
              />
            </View>

            <View style={commonStyles.inputRow}>
              <Ionicons 
                name="cash-outline" 
                size={20} 
                color={monto ? colors.primary : (errors.monto ? colors.danger : colors.textPrimary)} 
                style={expenseStyles.icon} 
              />
              <TextInput
                style={[
                  expenseStyles.input,
                  errors.monto && expenseStyles.inputError
                ]}
                placeholder="Monto *"
                placeholderTextColor={errors.monto ? colors.danger : colors.textSecondary}
                value={monto}
                onChangeText={(text) => {
                  setMonto(text);
                  if (text.trim() && !isNaN(parseFloat(text)) && parseFloat(text) > 0) {
                    setErrors(prev => ({...prev, monto: false}));
                  }
                }}
                keyboardType="decimal-pad"
              />
            </View>

            <View style={commonStyles.inputRow}>
              <Ionicons
                name="people-outline"
                size={20}
                color={selectedPart ? colors.primary : (errors.participant ? colors.danger : colors.textPrimary)}
                style={expenseStyles.icon}
              />
              <TouchableOpacity
                style={[
                  expenseStyles.input,
                  errors.participant && expenseStyles.inputError
                ]}
                onPress={() => setShowPartModal(true)}
              >
                <Text 
                  style={{ 
                    color: selectedPart 
                      ? colors.textPrimary 
                      : (errors.participant ? colors.danger : colors.textSecondary), 
                    paddingVertical: 8 
                  }}
                >
                  {selectedPart
                    ? evtParticipants.find(p => p.id === selectedPart)?.name
                    : 'Seleccionar participante *'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={commonStyles.inputRow}>
              <Ionicons
                name="calendar-number-outline"
                size={20}
                color={colors.primary}
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
                <Ionicons 
                  name="calendar-outline" 
                  size={24} 
                  color={colors.primary} 
                />
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

            <View style={expenseStyles.buttonRow}>
              <TouchableOpacity
                style={[commonStyles.button, commonStyles.cancelBtn]}
                onPress={() => setFormExpanded(false)}
              >
                <Text style={commonStyles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[commonStyles.button, commonStyles.saveBtn]}
                onPress={saveNew}
              >
                <Text style={commonStyles.buttonText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Picker de participante */}
      <Modal transparent visible={showPartModal} animationType="slide">
        <View style={commonStyles.modalOverlay}>
          <View style={commonStyles.modalContent}>
            <View style={commonStyles.modalHeader}>
              <Text style={commonStyles.modalTitle}>Seleccionar Participante</Text>
            </View>
            
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
                    // Si había un error, limpiarlo cuando se selecciona un participante
                    if (errors.participant) {
                      setErrors(prev => ({...prev, participant: false}));
                    }
                  }}
                >
                  <Ionicons name="person-outline" size={20} color={colors.textPrimary} />
                  <Text style={expenseStyles.partName}>{item.name}</Text>
                </TouchableOpacity>
              )}
              style={{ maxHeight: 250 }}
            />
            <View style={expenseStyles.buttonRow}>
              <TouchableOpacity
                style={[commonStyles.button, commonStyles.cancelBtn, {flex: 1}]}
                onPress={() => setShowPartModal(false)}
              >
                <Text style={commonStyles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
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

