// src/screens/HomeScreen.js
import React, { useState, useContext, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  Linking,
  Modal,
  Switch,
  TextInput as RNTextInput,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Ionicons from '@expo/vector-icons/Ionicons';
import { AuthContext } from '../context/AuthContext';
import { EventContext } from '../context/EventContext';

export default function HomeScreen() {
  const { logout } = useContext(AuthContext);
  const {
    events,
    updateEvent,
    getParticipantsForEvent,
    addParticipantToEvent,
    removeParticipantFromEvent,
    participants: allParticipants,
  } = useContext(EventContext);

  const [search, setSearch] = useState('');
  const [filterStateActive, setFilterStateActive] = useState(false);
  const [filterDateActive, setFilterDateActive] = useState(false);

  // Modal Ver/Editar Evento
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState('view'); // 'view' | 'edit'
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Mini-modal Agregar Participante
  const [showAddList, setShowAddList] = useState(false);
  const [addListSearch, setAddListSearch] = useState('');

  // Sección participantes colapsada por defecto
  const [participantsCollapsed, setParticipantsCollapsed] = useState(true);

  // Campos del evento en modal
  const [selectedId, setSelectedId] = useState(null);
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [address, setAddress] = useState('');
  const [mapUrl, setMapUrl] = useState('');
  const [whatsappEnvio, setWhatsappEnvio] = useState(false);
  const [total, setTotal] = useState('');
  const [per, setPer] = useState('0.00');

  // “ayer” para filtros
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Filtrar eventos
  const filtered = events.filter(e => {
    const matchesSearch = e.name.toLowerCase().includes(search.toLowerCase());
    const matchesState = !filterStateActive || e.estadoEvento;
    const evDate = new Date(e.date);
    const matchesDate = !filterDateActive || evDate >= yesterday;
    return matchesSearch && matchesState && matchesDate;
  });

  // Cerrar evento
  const closeEvent = id => updateEvent(id, { estadoEvento: false });

  // Abrir modal en modo View
  const openViewModal = item => {
    setModalMode('view');
    setSelectedId(item.id);
    setName(item.name);
    setDate(item.date);
    setAddress(item.address || '');
    setMapUrl(item.map || '');
    setWhatsappEnvio(item.whatsappEnvio);
    setTotal(item.total?.toString() || '');
    // recalc per immediately
    const p0 = getParticipantsForEvent(item.id).length;
    const t0 = parseFloat(item.total) || 0;
    setPer(p0 > 0 ? (t0 / p0).toFixed(2) : '0.00');
    setModalVisible(true);
    setParticipantsCollapsed(true);
  };
  const openEditModal = item => {
    openViewModal(item);
    setModalMode('edit');
  };

  // Manejar cambio de fecha
  const handleDateChange = (_, sel) => {
    setShowDatePicker(false);
    if (sel) setDate(sel.toISOString().split('T')[0]);
  };

  // Recalcular "por persona" al cambiar total o evento
  useEffect(() => {
    if (!selectedId) return;
    const t = parseFloat(total) || 0;
    const p = getParticipantsForEvent(selectedId).length;
    setPer(p > 0 ? (t / p).toFixed(2) : '0.00');
  }, [total, selectedId]);

  // Guardar cambios
  const handleSave = () => {
    const currentCount = getParticipantsForEvent(selectedId).length;
    updateEvent(selectedId, {
      name,
      date,
      address,
      map: mapUrl,
      whatsappEnvio,
      total: parseFloat(total) || 0,
      per: parseFloat(per) || 0,
      participants: currentCount,
    });
    setModalVisible(false);
  };

  // Render de cada tarjeta de evento
  const renderEvent = ({ item }) => {
    const evDate = new Date(item.date);
    const dateIconName = evDate >= yesterday ? 'today-outline' : 'calendar-outline';
    const dateIconColor = evDate >= yesterday ? '#00FF55' : '#FF6B6B';
    const whatsappColor = item.whatsappEnvio ? '#00FF55' : '#888';
    const mapColor = item.map ? '#4285F4' : '#888';
    const viewColor = '#4285F4';
    const lockIconName = item.estadoEvento ? 'lock-open-outline' : 'lock-closed-outline';
    const lockColor = item.estadoEvento ? '#00FF55' : '#FF6B6B';
    const editColor = item.estadoEvento ? '#4285F4' : '#888';

    const count = getParticipantsForEvent(item.id).length;
    const totalFmt = Number(item.total).toLocaleString();
    const perFmt = Number(item.total / (count || 1)).toLocaleString();

    return (
      <View style={styles.card}>
        <View style={styles.cardContent}>
          <Ionicons
            name={dateIconName}
            size={40}
            color={dateIconColor}
            style={styles.eventIcon}
          />
          <View style={styles.eventInfo}>
            <Text style={styles.eventName}>{item.name}</Text>
            <Text style={styles.eventDate}>{item.date}</Text>
            {item.address && <Text style={styles.eventAddress}>{item.address}</Text>}
          </View>
          <View style={styles.amounts}>
            <Text style={styles.amountText}>${totalFmt}</Text>
            <Text style={styles.amountSub}>c/u ${perFmt}</Text>
            <View style={styles.participantsRow}>
              <Ionicons name="people-outline" size={16} color="#AAA" />
              <Text style={styles.eventParticipantsCount}>{count}</Text>
            </View>
          </View>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity onPress={() => openViewModal(item)}>
            <Ionicons name="eye-outline" size={20} color={viewColor} />
          </TouchableOpacity>
          <View style={styles.actionButton}>
            <Ionicons name="logo-whatsapp" size={20} color={whatsappColor} />
          </View>
          <TouchableOpacity
            style={styles.actionButton}
            disabled={!item.map}
            onPress={() => item.map && Linking.openURL(item.map)}
          >
            <Ionicons name="map-outline" size={20} color={mapColor} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => closeEvent(item.id)}>
            <Ionicons name={lockIconName} size={20} color={lockColor} />
          </TouchableOpacity>
          <TouchableOpacity
            disabled={!item.estadoEvento}
            style={styles.actionButton}
            onPress={() => openEditModal(item)}
          >
            <Ionicons name="create-outline" size={20} color={editColor} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header principal */}
      <View style={styles.header}>
        <TextInput
          placeholder="Buscar evento"
          placeholderTextColor="#888"
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
        <TouchableOpacity
          onPress={() => setFilterStateActive(!filterStateActive)}
          style={styles.filterButton}
        >
          <Ionicons
            name={filterStateActive ? 'lock-open-outline' : 'lock-closed-outline'}
            size={24}
            color={filterStateActive ? '#00FF55' : '#FFF'}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setFilterDateActive(!filterDateActive)}
          style={styles.filterButton}
        >
          <Ionicons
            name={filterDateActive ? 'today-outline' : 'calendar-outline'}
            size={24}
            color={filterDateActive ? '#00FF55' : '#FFF'}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={logout} style={{ marginLeft: 16 }}>
          <Image source={require('../assets/avatar.png')} style={styles.avatar} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={i => i.id}
        renderItem={renderEvent}
        contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
      />

      {/* Modal Ver/Editar Evento */}
      <Modal
        transparent
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.8)' }]}>
          <View style={styles.modalContent}>
            {/* Header del modal */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {modalMode === 'view' ? 'Detalle Evento' : 'Editar Evento'}
              </Text>
              {modalMode === 'view' && (
                <TouchableOpacity onPress={() => setModalMode('edit')}>
                  <Text style={styles.modalEditLink}>Editar</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Switch Whatsapp */}
            <View style={styles.switchRow}>
              <Ionicons name="logo-whatsapp" size={20} color="#FFF" style={styles.modalIcon} />
              <Text style={styles.switchLabel}>Envio por Whatsapp:</Text>
              <Switch
                value={whatsappEnvio}
                onValueChange={setWhatsappEnvio}
                disabled={modalMode === 'view'}
                thumbColor={whatsappEnvio ? '#00FF55' : '#FFF'}
                trackColor={{ true: '#55FF88', false: '#333' }}
              />
            </View>

            {/* Inputs texto */}
            {[
              { icon: 'text-outline', value: name, setter: setName, placeholder: 'Nombre del evento' },
              {
                icon: 'calendar-number-outline',
                value: date,
                setter: setDate,
                placeholder: 'YYYY-MM-DD',
              },
              { icon: 'trail-sign-outline', value: address, setter: setAddress, placeholder: 'Dirección' },
              { icon: 'location-outline', value: mapUrl, setter: setMapUrl, placeholder: 'Mapa URL' },
            ].map((f, i) => (
              <View key={i} style={styles.inputRow}>
                <Ionicons name={f.icon} size={20} color="#FFF" style={styles.modalIcon} />
                <RNTextInput
                  placeholder={f.placeholder}
                  placeholderTextColor="#AAA"
                  style={styles.modalInput}
                  value={f.value}
                  onChangeText={f.setter}
                  editable={modalMode !== 'view'}
                />
                {f.placeholder === 'YYYY-MM-DD' && modalMode !== 'view' && (
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

            {/* Gasto Total */}
            <View style={styles.inputRow}>
              <Ionicons name="cash-outline" size={20} color="#FFF" style={styles.modalIcon} />
              <Text style={styles.dollarSign}>$</Text>
              <RNTextInput
                placeholder="Gasto Total"
                placeholderTextColor="#AAA"
                style={styles.modalInput}
                value={total}
                onChangeText={setTotal}
                keyboardType="decimal-pad"
                editable={modalMode !== 'view'}
              />
            </View>

            {/* Sección Participantes */}
            <View style={styles.partHeader}>
              {(() => {
                const count = selectedId
                  ? getParticipantsForEvent(selectedId).length
                  : 0;
                return (
                  <Text style={styles.sectionTitle}>
                    Participantes ({count})
                  </Text>
                );
              })()}
              <TouchableOpacity
                onPress={() => setParticipantsCollapsed(!participantsCollapsed)}
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
              {modalMode === 'edit' && (
                <TouchableOpacity
                  onPress={() => setShowAddList(true)}
                  style={styles.addIconButton}
                >
                  <Ionicons name="person-add-outline" size={20} color="#00FF55" />
                </TouchableOpacity>
              )}
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
                  data={getParticipantsForEvent(selectedId).filter(p =>
                    p.name.toLowerCase().includes(addListSearch.toLowerCase())
                  )}
                  keyExtractor={p => p.id}
                  renderItem={({ item }) => (
                    <View style={styles.partRow}>
                      <Ionicons name="person-outline" size={20} color="#FFF" />
                      <Text style={styles.partName}>{item.name}</Text>
                      {modalMode === 'edit' && (
                        <TouchableOpacity
                          onPress={() => removeParticipantFromEvent(selectedId, item.id)}
                          style={styles.partRemove}
                        >
                          <Ionicons
                            name="trash-outline"
                            size={20}
                            color="#FF6B6B"
                          />
                        </TouchableOpacity>
                      )}
                    </View>
                  )}
                  style={{ maxHeight: 200 }}
                />
              </>
            )}

            {/* Mini-modal Agregar Participante */}
            {showAddList && (
              <Modal transparent animationType="slide">
                <View
                  style={[
                    styles.addListOverlay,
                    { backgroundColor: 'rgba(0,0,0,0.8)' },
                  ]}
                >
                  <Text style={styles.addListTitle}>Participantes</Text>
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
                        p =>
                          !getParticipantsForEvent(selectedId).some(
                            x => x.id === p.id
                          )
                      )
                      .filter(p =>
                        p.name
                          .toLowerCase()
                          .includes(addListSearch.toLowerCase())
                      )}
                    keyExtractor={p => p.id}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={styles.partRow}
                        onPress={() => {
                          addParticipantToEvent(selectedId, item.id);
                          setShowAddList(false);
                        }}
                      >
                        <Ionicons
                          name="person-outline"
                          size={20}
                          color="#FFF"
                        />
                        <Text style={styles.partName}>{item.name}</Text>
                      </TouchableOpacity>
                    )}
                    style={{ maxHeight: 250 }}
                  />
                  <TouchableOpacity
                    style={styles.addListClose}
                    onPress={() => setShowAddList(false)}
                  >
                    <Text style={styles.addListCloseText}>Cerrar</Text>
                  </TouchableOpacity>
                </View>
              </Modal>
            )}

            {/* Footer */}
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.button, styles.buttonDisabled]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              {modalMode !== 'view' && (
                <TouchableOpacity
                  style={[styles.button, styles.buttonPrimary]}
                  onPress={handleSave}
                >
                  <Text style={styles.buttonText}>Guardar</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  /* Pantalla principal */
  container: { flex: 1, backgroundColor: '#0A0E1A' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#1F2230',
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#0F1120',
    borderRadius: 12,
    paddingHorizontal: 12,
    color: '#FFF',
    fontSize: 16,
  },
  filterButton: { marginLeft: 12, padding: 4 },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#00FF55',
  },
  card: {
    backgroundColor: '#1F2230',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  eventIcon: { marginRight: 12 },
  eventInfo: { flex: 2 },
  eventName: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  eventDate: { color: '#AAA', fontSize: 14, marginTop: 4 },
  eventAddress: { color: '#AAA', fontSize: 14, marginTop: 4 },
  amounts: { alignItems: 'flex-end', marginRight: 12 },
  amountText: { color: '#00FF55', fontWeight: 'bold' },
  amountSub: { color: '#AAA', fontSize: 12, marginTop: 2 },
  participantsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  eventParticipantsCount: { color: '#AAA', fontSize: 14, marginLeft: 4 },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 8,
    backgroundColor: '#0F1120',
  },
  actionButton: { marginLeft: 16 },

  /* Modal principal */
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  modalContent: {
    width: '90%',
    backgroundColor: '#1F2230',
    borderRadius: 12,
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalTitle: { fontSize: 20, color: '#FFF', fontWeight: 'bold' },
  modalEditLink: {
    color: '#00FF55',
    fontSize: 16,
    textDecorationLine: 'underline',
  },

  /* Switch Whatsapp */
  switchRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  modalIcon: { marginRight: 12 },
  switchLabel: { flex: 1, color: '#FFF', fontSize: 16 },

  /* Inputs */
  inputRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  modalInput: {
    flex: 1,
    backgroundColor: '#0F1120',
    borderRadius: 8,
    paddingHorizontal: 12,
    color: '#FFF',
  },
  calIcon: { marginLeft: 8 },
  dollarSign: { color: '#FFF', fontSize: 16, marginRight: 4 },

  /* Sección Participantes */
  partHeader: { flexDirection: 'row', alignItems: 'center', marginTop: 16 },
  sectionTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  toggleListButton: { padding: 4 },
  addIconButton: { padding: 4, marginLeft: 8 },
  addListSearchInput: {
    backgroundColor: '#0F1120',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: '#FFF',
    marginVertical: 8,
  },

  partRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 4 },
  partName: { color: '#FFF', marginLeft: 8, flex: 1 },
  partRemove: { padding: 4 },

  /* Mini-modal Agregar Participante */
  addListOverlay: { flex: 1, justifyContent: 'center', padding: 16 },
  addListTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  addListClose: {
    backgroundColor: '#696969',
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
    alignItems: 'center',
  },
  addListCloseText: { color: '#FFF', fontWeight: 'bold' },

  /* Footer modal */
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: { flex: 1, borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  buttonPrimary: { backgroundColor: '#00FF55', marginLeft: 8 },
  buttonDisabled: { backgroundColor: '#696969', marginRight: 8 },
  buttonText: { color: '#0A0E1A', fontSize: 16, fontWeight: 'bold' },
});
