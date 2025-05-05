// src/screens/HomeScreen.js
import React, { useState, useContext, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
  Switch,
  TextInput as RNTextInput,
  Linking,
  Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';

import { AuthContext } from '../context/AuthContext';
import { EventContext } from '../context/EventContext';
import commonStyles from '../styles/commonStyles';
import homeStyles from '../styles/homeStyles';
import expenseStyles from '../styles/expenseStyles';
import colors from '../styles/colors';
import AvatarMenu from '../components/AvatarMenu';

export default function HomeScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { logout } = useContext(AuthContext);
  const {
    events,
    updateEvent,
    addEvent,
    getParticipantsForEvent,
    getGastosForEvent,
  } = useContext(EventContext);

  // Reabrir modal si vienen de gastos
  const { openEventId } = route.params || {};
  useEffect(() => {
    if (openEventId) {
      const evt = events.find(e => e.id === openEventId);
      if (evt) {
        // Poner el nombre del evento en el buscador para filtrar
        setSearch(evt.name);
        // Abrir el modal
        openViewModal(evt);
      }
    }
  }, [openEventId, events]);

  // Filtros y búsqueda
  const [search, setSearch] = useState('');
  const [filterStateActive, setFilterStateActive] = useState(false);
  const [filterDateActive, setFilterDateActive] = useState(false);

  // Estado del modal
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState('view'); // 'view'|"edit"
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Estado para modal de nuevo evento
  const [newEventModalVisible, setNewEventModalVisible] = useState(false);
  const [newEventDatePicker, setNewEventDatePicker] = useState(false);
  const [newEventName, setNewEventName] = useState('');
  const [newEventDate, setNewEventDate] = useState('');
  const [newEventAddress, setNewEventAddress] = useState('');
  const [newEventMapUrl, setNewEventMapUrl] = useState('');
  const [newEventWhatsapp, setNewEventWhatsapp] = useState(false);
  const [newEventErrors, setNewEventErrors] = useState({
    name: false,
    date: false,
  });

  // Collapse toggles
  const [participantsCollapsed, setParticipantsCollapsed] = useState(true);
  const [expensesCollapsed, setExpensesCollapsed] = useState(true);

  // Campos del modal
  const [selectedId, setSelectedId] = useState(null);
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [address, setAddress] = useState('');
  const [mapUrl, setMapUrl] = useState('');
  const [whatsappEnvio, setWhatsappEnvio] = useState(false);
  const [total, setTotal] = useState('');
  const [per, setPer] = useState('0.00');
  const [estadoEvento, setEstadoEvento] = useState(true);

  // “Ayer” para filtros
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Filtrado de lista principal
  const filtered = events.filter(e => {
    const mSearch = e.name.toLowerCase().includes(search.toLowerCase());
    const mState = !filterStateActive || e.estadoEvento;
    const d = new Date(e.date);
    const mDate = !filterDateActive || d >= yesterday;
    return mSearch && mState && mDate;
  });

  // Resetear formulario de nuevo evento
  const resetNewEventForm = () => {
    setNewEventName('');
    setNewEventDate('');
    setNewEventAddress('');
    setNewEventMapUrl('');
    setNewEventWhatsapp(false);
    setNewEventErrors({
      name: false,
      date: false,
    });
  };

  // Abrir modal de nuevo evento
  const openNewEventModal = () => {
    resetNewEventForm();
    setNewEventModalVisible(true);
  };

  // Manejar cambio de fecha en nuevo evento
  const handleNewEventDateChange = (_, selectedDate) => {
    setNewEventDatePicker(false);
    if (selectedDate) {
      setNewEventDate(selectedDate.toISOString().split('T')[0]);
      if (newEventErrors.date) {
        setNewEventErrors(prev => ({ ...prev, date: false }));
      }
    }
  };

  // Guardar nuevo evento
  const saveNewEvent = () => {
    // Validar campos obligatorios
    const newErrors = {
      name: !newEventName.trim(),
      date: !newEventDate.trim(),
    };

    setNewEventErrors(newErrors);

    // Si hay errores, detener la operación
    if (Object.values(newErrors).some(error => error)) {
      return Alert.alert('Error', 'Por favor, completa el título y la fecha del evento.');
    }

    addEvent({
      name: newEventName,
      date: newEventDate,
      address: newEventAddress,
      map: newEventMapUrl,
      whatsappEnvio: newEventWhatsapp,
      estadoEvento: true,
    });

    setNewEventModalVisible(false);
    resetNewEventForm();
  };

  // Funciones para abrir modal
  const closeEvent = id => updateEvent(id, { estadoEvento: false });

  const openViewModal = item => {
    setModalMode('view');
    setSelectedId(item.id);
    setName(item.name);
    setDate(item.date);
    setAddress(item.address || '');
    setMapUrl(item.map || '');
    setWhatsappEnvio(item.whatsappEnvio);
    setTotal((item.total ?? '').toString());
    setPer((item.per ?? 0).toFixed(2));
    setEstadoEvento(item.estadoEvento);
    setParticipantsCollapsed(true);
    setExpensesCollapsed(true);
    setModalVisible(true);
  };
  const openEditModal = item => {
    openViewModal(item);
    setModalMode('edit');
  };

  // Guardar edición
  const handleSave = () => {
    const t = parseFloat(total) || 0;
    const cnt = getParticipantsForEvent(selectedId).length || 1;
    const newPer = parseFloat((t / cnt).toFixed(2));
    updateEvent(selectedId, {
      name,
      date,
      address,
      map: mapUrl,
      whatsappEnvio,
      total: t,
      per: newPer,
      participants: cnt,
    });
    setModalVisible(false);
  };

  // Recalcular c/u al cambiar total o participantes
  useEffect(() => {
    if (!selectedId) return;
    const t = parseFloat(total) || 0;
    const cnt = getParticipantsForEvent(selectedId).length || 1;
    setPer((t / cnt).toFixed(2));
  }, [total, selectedId]);

  // Render de la card de evento
  const renderEvent = ({ item }) => {
    const d = new Date(item.date);
    const dateIcon = d >= yesterday ? 'today-outline' : 'calendar-outline';
    const dateColor = d >= yesterday ? colors.primary : colors.danger;
    const whatsappClr = item.whatsappEnvio ? colors.primary : colors.textDisabled;
    const mapClr = item.map ? colors.secondary : colors.textDisabled;
    const lockIcon = item.estadoEvento ? 'lock-open-outline' : 'lock-closed-outline';
    const lockClr = item.estadoEvento ? colors.primary : colors.danger;
    const participantes = getParticipantsForEvent(item.id);
    const cnt = participantes.length;
    const gastos = getGastosForEvent(item.id);
    const tieneGastos = gastos.length > 0;
    const totalFmt = (item.total ?? 0).toLocaleString();
    const perFmt = (item.per ?? 0).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    // Colores para los iconos de participantes y gastos
    const participantesClr = cnt > 0 ? colors.secondary : colors.textDisabled; // Mismo color que el mapa
    const gastosClr = tieneGastos ? colors.primary : colors.textDisabled; // Verde si tiene gastos, gris si no

    return (
      <View style={homeStyles.cardContainer}>
        <TouchableOpacity style={homeStyles.card} onPress={() => openViewModal(item)}>
          <View style={homeStyles.cardContent}>
            <Ionicons name={dateIcon} size={40} color={dateColor} style={homeStyles.eventIcon} />
            <View style={homeStyles.eventInfo}>
              <Text style={homeStyles.eventName}>{item.name}</Text>
              <Text style={homeStyles.eventDate}>{item.date}</Text>
              {item.address && <Text style={homeStyles.eventAddress}>{item.address}</Text>}
            </View>
            <View style={homeStyles.amounts}>
              <Text style={homeStyles.amountText}>${totalFmt}</Text>
              <Text style={homeStyles.amountSub}>c/u ${perFmt}</Text>
              <View style={homeStyles.participantsRow}>
                <Ionicons name="people-outline" size={16} color={participantesClr} />
                <Text style={homeStyles.eventParticipantsCount}>{cnt}</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
        <View style={homeStyles.actions}>
          <TouchableOpacity
            style={homeStyles.actionButton}
            onPress={() => navigation.navigate('CreateExpense', { eventId: item.id })}
            disabled={!item.estadoEvento}
          >
            <Ionicons name="cash-outline" size={20} color={item.estadoEvento ? gastosClr : colors.textDisabled} />
          </TouchableOpacity>
          <TouchableOpacity
            style={homeStyles.actionButton}
            onPress={() => navigation.navigate('Participants', { eventId: item.id })}
            disabled={!item.estadoEvento}
          >
            <Ionicons name="people-outline" size={20} color={item.estadoEvento ? participantesClr : colors.textDisabled} />
          </TouchableOpacity>
          <TouchableOpacity
            style={homeStyles.actionButton}
            onPress={() => navigation.navigate('ExpenseSummary', { eventId: item.id })}
          >
            <Ionicons name="document-text-outline" size={20} color={tieneGastos ? colors.secondary : colors.textDisabled} />
          </TouchableOpacity>
          <View style={homeStyles.actionButton}>
            <Ionicons name="logo-whatsapp" size={20} color={whatsappClr} />
          </View>
          <TouchableOpacity
            style={homeStyles.actionButton}
            disabled={!item.map}
            onPress={() => item.map && Linking.openURL(item.map)}
          >
            <Ionicons name="map-outline" size={20} color={mapClr} />
          </TouchableOpacity>
          <TouchableOpacity
            style={homeStyles.actionButton}
            onPress={() => {
              // Cerrar evento sin abrir el modal
              closeEvent(item.id);
              // Forzar la actualización de la interfaz
              setSearch(prev => {
                setTimeout(() => setSearch(prev), 50);
                return prev;
              });
            }}
          >
            <Ionicons name={lockIcon} size={20} color={lockClr} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Render ítem de gasto en vista
  const renderGastoItem = ({ item }) => {
    // Convertir el monto de string a número, reemplazando comas por puntos
    const montoNum =
      typeof item.monto === 'string'
        ? parseFloat(item.monto.replace(',', '.'))
        : item.monto;

    return (
      <View style={homeStyles.partRow}>
        <Ionicons name="document-text-outline" size={20} color={colors.textPrimary} />
        <Text style={homeStyles.partName}>{item.descripcion}</Text>
        <Text style={[homeStyles.partName, { marginLeft: 12 }]}>
          ${montoNum.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </Text>
      </View>
    );
  };

  // Modal de detalle / edición
  return (
    <SafeAreaView style={commonStyles.container}>
      {/* Header */}
      <View style={commonStyles.header}>
        <TextInput
          placeholder="Buscar evento"
          placeholderTextColor={colors.textSecondary}
          value={search}
          onChangeText={setSearch}
          style={commonStyles.searchInput}
        />
        {search !== '' && (
          <TouchableOpacity onPress={() => setSearch('')} style={commonStyles.clearButton}>
            <Ionicons name="close-circle" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={() => setFilterStateActive(!filterStateActive)}
          style={commonStyles.filterButton}
        >
          <Ionicons
            name={filterStateActive ? 'lock-open-outline' : 'lock-closed-outline'}
            size={24}
            color={filterStateActive ? colors.primary : colors.textPrimary}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setFilterDateActive(!filterDateActive)}
          style={commonStyles.filterButton}
        >
          <Ionicons
            name={filterDateActive ? 'today-outline' : 'calendar-outline'}
            size={24}
            color={filterDateActive ? colors.primary : colors.textPrimary}
          />
        </TouchableOpacity>

        {/* Avatar con menú desplegable */}
        <View style={{ marginLeft: 16 }}>
          <AvatarMenu logout={logout} />
        </View>
      </View>

      {/* Lista de eventos */}
      <FlatList
        data={filtered}
        keyExtractor={i => i.id}
        renderItem={renderEvent}
        contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
      />

      {/* Botón flotante para nuevo evento */}
      <TouchableOpacity style={commonStyles.floatingButton} onPress={openNewEventModal}>
        <Ionicons name="add-outline" size={30} color={colors.textPrimary} />
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        transparent
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={commonStyles.modalOverlay}>
          <View style={commonStyles.modalContent}>
            {/* Header */}
            <View style={commonStyles.modalHeader}>
              <Text style={commonStyles.modalTitle}>
                {modalMode === 'view' ? 'Detalle Evento' : 'Editar Evento'}
              </Text>
              {modalMode === 'view' && estadoEvento && (
                <TouchableOpacity onPress={() => setModalMode('edit')}>
                  <Ionicons name="create-outline" size={24} color={colors.primary} />
                </TouchableOpacity>
              )}
            </View>

            {/* WhatsApp */}
            <View style={homeStyles.switchRow}>
              <Ionicons
                name="logo-whatsapp"
                size={20}
                color={colors.textPrimary}
                style={homeStyles.modalIcon}
              />
              <Text style={homeStyles.switchLabel}>Envío por WhatsApp:</Text>
              <Switch
                value={whatsappEnvio}
                onValueChange={setWhatsappEnvio}
                disabled={modalMode === 'view'}
                thumbColor={whatsappEnvio ? colors.primary : colors.textPrimary}
                trackColor={{ true: colors.primary, false: colors.border }}
              />
            </View>

            {/* Inputs básicos */}
            {[
              { icon: 'text-outline', value: name, setter: setName, placeholder: 'Nombre del evento' },
              { icon: 'calendar-number-outline', value: date, setter: setDate, placeholder: 'YYYY-MM-DD' },
              { icon: 'trail-sign-outline', value: address, setter: setAddress, placeholder: 'Dirección' },
              { icon: 'location-outline', value: mapUrl, setter: setMapUrl, placeholder: 'Mapa URL' },
            ].map((f, i) => (
              <View key={i} style={commonStyles.inputRow}>
                <Ionicons
                  name={f.icon}
                  size={20}
                  color={colors.textPrimary}
                  style={homeStyles.modalIcon}
                />
                <RNTextInput
                  placeholder={f.placeholder}
                  placeholderTextColor={colors.textSecondary}
                  style={homeStyles.modalInput}
                  value={f.value}
                  onChangeText={f.setter}
                  editable={modalMode !== 'view'}
                />
                {f.placeholder === 'YYYY-MM-DD' && modalMode !== 'view' && (
                  <TouchableOpacity
                    onPress={() => setShowDatePicker(true)}
                    style={homeStyles.calIcon}
                  >
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
                onChange={(_, sel) => {
                  setShowDatePicker(false);
                  if (sel) setDate(sel.toISOString().split('T')[0]);
                }}
              />
            )}

            {modalMode === 'view' && (
              <>
                {/* Gastos total y c/u */}
                <View style={commonStyles.inputRow}>
                  <Ionicons
                    name="cash-outline"
                    size={20}
                    color={colors.textPrimary}
                    style={homeStyles.modalIcon}
                  />
                  <Text style={[homeStyles.modalInput, { paddingVertical: 0 }]}>
                    Total: ${parseFloat(total || 0).toLocaleString()}
                  </Text>
                </View>
                <View style={commonStyles.inputRow}>
                  <Ionicons
                    name="calculator-outline"
                    size={20}
                    color={colors.textPrimary}
                    style={homeStyles.modalIcon}
                  />
                  <Text style={[homeStyles.modalInput, { paddingVertical: 0 }]}>c/u: ${per}</Text>
                </View>

                {/* Participantes */}
                <TouchableOpacity
                  style={homeStyles.partHeader}
                  onPress={() => setParticipantsCollapsed(!participantsCollapsed)}
                >
                  <Text style={commonStyles.sectionTitle}>
                    Participantes ({getParticipantsForEvent(selectedId).length})
                  </Text>
                  <Ionicons
                    name={participantsCollapsed ? 'chevron-down-outline' : 'chevron-up-outline'}
                    size={20}
                    color={colors.textPrimary}
                  />
                </TouchableOpacity>
                {!participantsCollapsed && (
                  <FlatList
                    data={getParticipantsForEvent(selectedId)}
                    keyExtractor={p => p.id}
                    renderItem={({ item }) => (
                      <View style={homeStyles.partRow}>
                        <Ionicons name="person-outline" size={20} color={colors.textPrimary} />
                        <Text style={homeStyles.partName}>{item.name}</Text>
                      </View>
                    )}
                    style={{ maxHeight: 150, marginBottom: 16 }}
                  />
                )}

                {/* Gastos */}
                <TouchableOpacity
                  style={homeStyles.partHeader}
                  onPress={() => setExpensesCollapsed(!expensesCollapsed)}
                >
                  <Text style={commonStyles.sectionTitle}>
                    Gastos ({getGastosForEvent(selectedId).length})
                  </Text>
                  <Ionicons
                    name={expensesCollapsed ? 'chevron-down-outline' : 'chevron-up-outline'}
                    size={20}
                    color={colors.textPrimary}
                  />
                </TouchableOpacity>
                {!expensesCollapsed && (
                  <FlatList
                    data={getGastosForEvent(selectedId)}
                    keyExtractor={g => g.id}
                    renderItem={renderGastoItem}
                    style={{ maxHeight: 200, marginBottom: 16 }}
                  />
                )}
              </>
            )}

            {/* En edición sólo inputs */}
            {modalMode === 'edit' && <View style={{ height: 16 }} />}

            {/* Footer */}
            <View style={homeStyles.modalFooter}>
              <TouchableOpacity
                style={[commonStyles.button, commonStyles.cancelBtn]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={commonStyles.buttonText}>Cerrar</Text>
              </TouchableOpacity>
              {modalMode === 'edit' && (
                <TouchableOpacity
                  style={[commonStyles.button, commonStyles.saveBtn]}
                  onPress={handleSave}
                >
                  <Text style={commonStyles.buttonText}>Guardar</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal para nuevo evento */}
      <Modal
        visible={newEventModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setNewEventModalVisible(false)}
      >
        <View style={commonStyles.modalOverlay}>
          <View style={commonStyles.modalContent}>
            <View style={commonStyles.modalHeader}>
              <Text style={commonStyles.modalTitle}>Nuevo Evento</Text>
            </View>

            {/* WhatsApp */}
            <View style={commonStyles.inputRow}>
              <Ionicons
                name="logo-whatsapp"
                size={20}
                color={newEventWhatsapp ? colors.primary : colors.textPrimary}
                style={expenseStyles.icon}
              />
              <Text style={{ flex: 1, color: colors.textPrimary, paddingVertical: 8 }}>
                Envío por WhatsApp:
              </Text>
              <Switch
                value={newEventWhatsapp}
                onValueChange={setNewEventWhatsapp}
                thumbColor={newEventWhatsapp ? colors.primary : colors.textPrimary}
                trackColor={{ true: colors.primary, false: colors.border }}
              />
            </View>

            {/* Campo de Título */}
            <View style={commonStyles.inputRow}>
              <Ionicons
                name="text-outline"
                size={20}
                color={
                  newEventName
                    ? colors.primary
                    : newEventErrors.name
                    ? colors.danger
                    : colors.textPrimary
                }
                style={expenseStyles.icon}
              />
              <TextInput
                style={[
                  expenseStyles.input,
                  newEventErrors.name && expenseStyles.inputError,
                ]}
                placeholder="Título *"
                placeholderTextColor={
                  newEventErrors.name ? colors.danger : colors.textSecondary
                }
                value={newEventName}
                onChangeText={text => {
                  setNewEventName(text);
                  if (text.trim()) {
                    setNewEventErrors(prev => ({ ...prev, name: false }));
                  }
                }}
              />
            </View>

            {/* Campo de Fecha */}
            <View style={commonStyles.inputRow}>
              <Ionicons
                name="calendar-number-outline"
                size={20}
                color={
                  newEventDate
                    ? colors.primary
                    : newEventErrors.date
                    ? colors.danger
                    : colors.textPrimary
                }
                style={expenseStyles.icon}
              />
              <TextInput
                style={[
                  expenseStyles.input,
                  newEventErrors.date && expenseStyles.inputError,
                ]}
                placeholder="Fecha (YYYY-MM-DD) *"
                placeholderTextColor={
                  newEventErrors.date ? colors.danger : colors.textSecondary
                }
                value={newEventDate}
                onChangeText={text => {
                  setNewEventDate(text);
                  if (text.trim()) {
                    setNewEventErrors(prev => ({ ...prev, date: false }));
                  }
                }}
              />
              <TouchableOpacity onPress={() => setNewEventDatePicker(true)}>
                <Ionicons name="calendar-outline" size={24} color={colors.primary} />
              </TouchableOpacity>
            </View>

            {/* Campo de Dirección */}
            <View style={commonStyles.inputRow}>
              <Ionicons
                name="trail-sign-outline"
                size={20}
                color={newEventAddress ? colors.primary : colors.textPrimary}
                style={expenseStyles.icon}
              />
              <TextInput
                style={expenseStyles.input}
                placeholder="Dirección"
                placeholderTextColor={colors.textSecondary}
                value={newEventAddress}
                onChangeText={setNewEventAddress}
              />
            </View>

            {/* Campo de URL del Mapa */}
            <View style={commonStyles.inputRow}>
              <Ionicons
                name="location-outline"
                size={20}
                color={newEventMapUrl ? colors.primary : colors.textPrimary}
                style={expenseStyles.icon}
              />
              <TextInput
                style={expenseStyles.input}
                placeholder="Mapa (URL)"
                placeholderTextColor={colors.textSecondary}
                value={newEventMapUrl}
                onChangeText={setNewEventMapUrl}
              />
            </View>

            {newEventDatePicker && (
              <DateTimePicker
                value={newEventDate ? new Date(newEventDate) : new Date()}
                mode="date"
                display="default"
                onChange={handleNewEventDateChange}
              />
            )}

            <View style={expenseStyles.buttonRow}>
              <TouchableOpacity
                style={[commonStyles.button, commonStyles.cancelBtn]}
                onPress={() => setNewEventModalVisible(false)}
              >
                <Text style={commonStyles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[commonStyles.button, commonStyles.saveBtn]}
                onPress={saveNewEvent}
              >
                <Text style={commonStyles.buttonText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
