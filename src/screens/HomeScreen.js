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
  Modal,
  Switch,
  TextInput as RNTextInput,
  Linking,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';

import { AuthContext } from '../context/AuthContext';
import { EventContext } from '../context/EventContext';

export default function HomeScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { logout } = useContext(AuthContext);
  const {
    events,
    updateEvent,
    getParticipantsForEvent,
    getGastosForEvent,
  } = useContext(EventContext);

  // Reabrir modal si vienen de gastos
  const { openEventId } = route.params || {};
  useEffect(() => {
    if (openEventId) {
      const evt = events.find(e => e.id === openEventId);
      if (evt) openViewModal(evt);
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
    const dateColor = d >= yesterday ? '#00FF55' : '#FF6B6B';
    const whatsappClr = item.whatsappEnvio ? '#00FF55' : '#888';
    const mapClr = item.map ? '#4285F4' : '#888';
    const lockIcon = item.estadoEvento ? 'lock-open-outline' : 'lock-closed-outline';
    const lockClr = item.estadoEvento ? '#00FF55' : '#FF6B6B';
    const cnt = getParticipantsForEvent(item.id).length;
    const totalFmt = (item.total ?? 0).toLocaleString();
    const perFmt = (item.per ?? 0).toLocaleString(undefined, {
      minimumFractionDigits: 2, maximumFractionDigits: 2,
    });

    return (
      <TouchableOpacity style={styles.card} onPress={() => openViewModal(item)}>
        <View style={styles.cardContent}>
          <Ionicons name={dateIcon} size={40} color={dateColor} style={styles.eventIcon}/>
          <View style={styles.eventInfo}>
            <Text style={styles.eventName}>{item.name}</Text>
            <Text style={styles.eventDate}>{item.date}</Text>
            {item.address && <Text style={styles.eventAddress}>{item.address}</Text>}
          </View>
          <View style={styles.amounts}>
            <Text style={styles.amountText}>${totalFmt}</Text>
            <Text style={styles.amountSub}>c/u ${perFmt}</Text>
            <View style={styles.participantsRow}>
              <Ionicons name="people-outline" size={16} color="#AAA"/>
              <Text style={styles.eventParticipantsCount}>{cnt}</Text>
            </View>
          </View>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('CreateExpense', { eventId: item.id })}
          >
            <Ionicons name="cash-outline" size={20} color="#00FF55"/>
          </TouchableOpacity>
          <View style={styles.actionButton}>
            <Ionicons name="logo-whatsapp" size={20} color={whatsappClr}/>
          </View>
          <TouchableOpacity
            style={styles.actionButton}
            disabled={!item.map}
            onPress={() => item.map && Linking.openURL(item.map)}
          >
            <Ionicons name="map-outline" size={20} color={mapClr}/>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => closeEvent(item.id)}>
            <Ionicons name={lockIcon} size={20} color={lockClr}/>
          </TouchableOpacity>
          {modalMode==='view' && estadoEvento && (
            <TouchableOpacity style={styles.actionButton} onPress={()=>openEditModal(item)}>
              <Ionicons name="create-outline" size={20} color="#4285F4"/>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  // Render ítem de gasto en vista
  const renderGastoItem = ({ item }) => (
    <View style={styles.partRow}>
      <Ionicons name="document-text-outline" size={20} color="#FFF"/>
      <Text style={styles.partName}>{item.descripcion}</Text>
      <Text style={[styles.partName, { marginLeft: 12 }]}>
        ${item.monto.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </Text>
    </View>
  );

  // Modal de detalle / edición
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TextInput
          placeholder="Buscar evento"
          placeholderTextColor="#888"
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
        <TouchableOpacity onPress={()=>setFilterStateActive(!filterStateActive)} style={styles.filterButton}>
          <Ionicons name={filterStateActive?'lock-open-outline':'lock-closed-outline'} size={24} color={filterStateActive?'#00FF55':'#FFF'}/>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>setFilterDateActive(!filterDateActive)} style={styles.filterButton}>
          <Ionicons name={filterDateActive?'today-outline':'calendar-outline'} size={24} color={filterDateActive?'#00FF55':'#FFF'}/>
        </TouchableOpacity>
        <TouchableOpacity onPress={logout} style={{marginLeft:16}}>
          <Image source={require('../assets/avatar.png')} style={styles.avatar}/>
        </TouchableOpacity>
      </View>

      {/* Lista de eventos */}
      <FlatList
        data={filtered}
        keyExtractor={i=>i.id}
        renderItem={renderEvent}
        contentContainerStyle={{padding:16,paddingBottom:80}}
      />

      {/* Modal */}
      <Modal transparent visible={modalVisible} animationType="slide" onRequestClose={()=>setModalVisible(false)}>
        <View style={[styles.modalOverlay,{backgroundColor:'rgba(0,0,0,0.8)'}]}>
          <View style={styles.modalContent}>

            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {modalMode==='view'?'Detalle Evento':'Editar Evento'}
              </Text>
              {modalMode==='view' && estadoEvento && (
                <TouchableOpacity onPress={()=>setModalMode('edit')}>
                  <Text style={styles.modalEditLink}>Editar</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* WhatsApp */}
            <View style={styles.switchRow}>
              <Ionicons name="logo-whatsapp" size={20} color="#FFF" style={styles.modalIcon}/>
              <Text style={styles.switchLabel}>Envío por WhatsApp:</Text>
              <Switch
                value={whatsappEnvio}
                onValueChange={setWhatsappEnvio}
                disabled={modalMode==='view'}
                thumbColor={whatsappEnvio?'#00FF55':'#FFF'}
                trackColor={{true:'#55FF88',false:'#333'}}
              />
            </View>

            {/* Inputs básicos */}
            {[
              {icon:'text-outline', value:name,setter:setName,placeholder:'Nombre del evento'},
              {icon:'calendar-number-outline',value:date,setter:setDate,placeholder:'YYYY-MM-DD'},
              {icon:'trail-sign-outline',value:address,setter:setAddress,placeholder:'Dirección'},
              {icon:'location-outline',value:mapUrl,setter:setMapUrl,placeholder:'Mapa URL'},
            ].map((f,i)=>(
              <View key={i} style={styles.inputRow}>
                <Ionicons name={f.icon} size={20} color="#FFF" style={styles.modalIcon}/>
                <RNTextInput
                  placeholder={f.placeholder}
                  placeholderTextColor="#AAA"
                  style={styles.modalInput}
                  value={f.value}
                  onChangeText={f.setter}
                  editable={modalMode!=='view'}
                />
                {f.placeholder==='YYYY-MM-DD' && modalMode!=='view' && (
                  <TouchableOpacity onPress={()=>setShowDatePicker(true)} style={styles.calIcon}>
                    <Ionicons name="calendar-outline" size={24} color="#00FF55"/>
                  </TouchableOpacity>
                )}
              </View>
            ))}

            {showDatePicker && (
              <DateTimePicker
                value={date?new Date(date):new Date()}
                mode="date"
                display="default"
                onChange={(_,sel)=>{setShowDatePicker(false); if(sel)setDate(sel.toISOString().split('T')[0]);}}
              />
            )}

            {modalMode==='view' && (
              <>
                {/* Gastos total y c/u */}
                <View style={styles.inputRow}>
                  <Ionicons name="cash-outline" size={20} color="#FFF" style={styles.modalIcon}/>
                  <Text style={[styles.modalInput,{paddingVertical:0}]}>Total: ${parseFloat(total||0).toLocaleString()}</Text>
                </View>
                <View style={styles.inputRow}>
                  <Ionicons name="calculator-outline" size={20} color="#FFF" style={styles.modalIcon}/>
                  <Text style={[styles.modalInput,{paddingVertical:0}]}>c/u: ${per}</Text>
                </View>

                {/* Participantes */}
                <TouchableOpacity style={styles.partHeader} onPress={()=>setParticipantsCollapsed(!participantsCollapsed)}>
                  <Text style={styles.sectionTitle}>
                    Participantes ({getParticipantsForEvent(selectedId).length})
                  </Text>
                  <Ionicons name={participantsCollapsed?'chevron-down-outline':'chevron-up-outline'} size={20} color="#FFF"/>
                </TouchableOpacity>
                {!participantsCollapsed && (
                  <FlatList
                    data={getParticipantsForEvent(selectedId)}
                    keyExtractor={p=>p.id}
                    renderItem={({item})=>(
                      <View style={styles.partRow}>
                        <Ionicons name="person-outline" size={20} color="#FFF"/>
                        <Text style={styles.partName}>{item.name}</Text>
                      </View>
                    )}
                    style={{maxHeight:150,marginBottom:16}}
                  />
                )}

                {/* Gastos */}
                <TouchableOpacity style={styles.partHeader} onPress={()=>setExpensesCollapsed(!expensesCollapsed)}>
                  <Text style={styles.sectionTitle}>
                    Gastos ({getGastosForEvent(selectedId).length})
                  </Text>
                  <Ionicons name={expensesCollapsed?'chevron-down-outline':'chevron-up-outline'} size={20} color="#FFF"/>
                </TouchableOpacity>
                {!expensesCollapsed && (
                  <FlatList
                    data={getGastosForEvent(selectedId)}
                    keyExtractor={g=>g.id}
                    renderItem={renderGastoItem}
                    style={{maxHeight:200,marginBottom:16}}
                  />
                )}
              </>
            )}

            {/* En edición sólo inputs */}
            {modalMode==='edit' && <View style={{height:16}}/>}

            {/* Footer */}
            <View style={styles.modalFooter}>
              <TouchableOpacity style={[styles.button,styles.buttonDisabled]} onPress={()=>setModalVisible(false)}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              {modalMode==='edit' && (
                <TouchableOpacity style={[styles.button,styles.buttonPrimary]} onPress={handleSave}>
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
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#1F2230' },
  searchInput: { flex: 1, backgroundColor: '#0F1120', borderRadius: 12, paddingHorizontal: 12, color: '#FFF', fontSize: 16 },
  filterButton: { marginLeft: 12, padding: 4 },
  avatar: { width: 32, height: 32, borderRadius: 16, borderWidth: 1, borderColor: '#00FF55' },
  card: { backgroundColor: '#1F2230', borderRadius: 12, marginBottom: 12, overflow: 'hidden' },
  cardContent: { flexDirection: 'row', alignItems: 'center', padding: 12 },
  eventIcon: { marginRight: 12 },
  eventInfo: { flex: 2 },
  eventName: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  eventDate: { color: '#AAA', fontSize: 14, marginTop: 4 },
  eventAddress: { color: '#AAA', fontSize: 14, marginTop: 4 },
  amounts: { alignItems: 'flex-end', marginRight: 12 },
  amountText: { color: '#00FF55', fontWeight: 'bold' },
  amountSub: { color: '#AAA', fontSize: 12, marginTop: 2 },
  participantsRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  eventParticipantsCount: { color: '#AAA', fontSize: 14, marginLeft: 4 },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', padding: 8, backgroundColor: '#0F1120' },
  actionButton: { marginLeft: 16 },

  /* Modal */
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '90%', backgroundColor: '#1F2230', borderRadius: 12, padding: 16 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  modalTitle: { fontSize: 20, color: '#FFF', fontWeight: 'bold' },
  modalEditLink: { color: '#00FF55', fontSize: 16, textDecorationLine: 'underline' },
   modalActionsRight: { flexDirection: 'row', alignItems: 'center' },

  /* Switch WhatsApp */
  switchRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  modalIcon: { marginRight: 12 },
  switchLabel: { flex: 1, color: '#FFF', fontSize: 16 },

  /* Inputs */
  inputRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  modalInput: { flex: 1, backgroundColor: '#0F1120', borderRadius: 8, paddingHorizontal: 12, color: '#FFF' },
  calIcon: { marginLeft: 8 },
  dollarSign: { color: '#FFF', fontSize: 16, marginRight: 4 },

  /* Sección Participantes */
  partHeader: { flexDirection: 'row', alignItems: 'center', marginTop: 16 },
  sectionTitle: { color: '#FFF', fontSize: 16, fontWeight: 'bold', flex: 1 },
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

  /* Sub-modal Agregar Participante */
  addListOverlay: { flex: 1, justifyContent: 'center', padding: 16 },
  addListTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  addListClose: { backgroundColor: '#696969', borderRadius: 12, padding: 12, marginTop: 8, alignItems: 'center' },
  addListCloseText: { color: '#FFF', fontWeight: 'bold' },

  /* Footer modal */
  modalFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
  button: { flex: 1, borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  buttonPrimary: { backgroundColor: '#00FF55', marginLeft: 8 },
  buttonDisabled: { backgroundColor: '#696969', marginRight: 8 },
  buttonText: { color: '#0A0E1A', fontSize: 16, fontWeight: 'bold' },

  gastosButton: { flexDirection: 'row',    alignItems: 'center',    marginBottom: 12,  },
  gastosButtonText: {    color: '#FFF',    marginLeft: 8,    fontSize: 16,    fontWeight: 'bold',  },
  
});
