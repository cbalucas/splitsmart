import React, { useState, useContext, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  Keyboard,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { EventContext } from '../context/EventContext';

export default function CreateExpenseScreen() {
  const navigation = useNavigation();
  const { params } = useRoute();
  const { eventId } = params;

  const {
    events,
    participants,
    relations,
    getParticipantsForEvent,
    getGastosForEvent,
    addGasto,
    removeGasto,
  } = useContext(EventContext);

  const event = events.find(e => e.id === eventId);
  const evtParticipants = getParticipantsForEvent(eventId);
  const gastosList = getGastosForEvent(eventId);

  const [filterText, setFilterText] = useState('');
  const [formExpanded, setFormExpanded] = useState(false);

  const [descripcion, setDescripcion] = useState('');
  const [monto, setMonto] = useState('');
  // Inicializa la fecha por defecto con la del evento
  const [date, setDate] = useState(event?.date || '');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedPart, setSelectedPart] = useState(null);

  const [showPartModal, setShowPartModal] = useState(false);
  const [partSearch, setPartSearch] = useState('');

  const filteredGastos = gastosList.filter(item => {
    const rel = relations.find(r => r.id === item.eventsParticipantsId);
    const payer = participants.find(p => p.id === rel?.participantsId);
    const text = filterText.toLowerCase();
    return (
      item.descripcion.toLowerCase().includes(text) ||
      payer?.name.toLowerCase().includes(text)
    );
  });

  const handleDateChange = (_, sel) => {
    setShowDatePicker(false);
    if (sel) setDate(sel.toISOString().split('T')[0]);
  };

  const returnToEvent = () => {
    navigation.navigate('Tabs', { screen: 'Home', params: { openEventId: eventId } });
  };

  const handleCancel = () => returnToEvent();

  const handleSave = (reset = false) => {
    const rel = relations.find(
      r => r.eventsId === eventId && r.participantsId === selectedPart
    );
    addGasto({ descripcion, monto: parseFloat(monto) || 0, date, eventsParticipantsId: rel?.id });
    if (reset) {
      setDescripcion(''); setMonto(''); setDate(event?.date || ''); setSelectedPart(null);
      Keyboard.dismiss();
    } else {
      returnToEvent();
    }
  };

  const renderGasto = ({ item }) => {
    const [year, month, day] = item.date.split('-');
    const formattedDate = `${day}/${month}`;
    const rel = relations.find(r => r.id === item.eventsParticipantsId);
    const payer = participants.find(p => p.id === rel?.participantsId);
    const amountFmt = item.monto.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return (
      <View style={styles.gastoCard}>
        <View style={styles.iconColumn}>
          <Ionicons name="document-text-outline" size={40} color="#FFF" />
          <Text style={styles.eventDate}>{formattedDate}</Text>
        </View>
        <View style={styles.eventInfo}>
          <Text style={styles.eventName}>{item.descripcion}</Text>
          <Text style={styles.eventDetail}>{payer?.name}</Text>
          <Text style={styles.eventDetail}>${amountFmt}</Text>
        </View>
        <TouchableOpacity onPress={() => removeGasto(item.id)} style={styles.deleteBtn}>
          <Ionicons name="trash-outline" size={24} color="#FF6B6B" />
        </TouchableOpacity>
      </View>
    );
  };

  const renderParticipantItem = ({ item }) => (
    <TouchableOpacity style={styles.partRow} onPress={() => { setSelectedPart(item.id); setShowPartModal(false); }}>
      <Ionicons name="person-outline" size={20} color="#FFF" />
      <Text style={styles.partName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.listTitle}>Gastos del Evento - {event?.name}</Text>
      <TextInput
        placeholder="Filtrar gastos..."
        placeholderTextColor="#AAA"
        style={styles.filterInput}
        value={filterText}
        onChangeText={setFilterText}
      />
      <FlatList
        data={filteredGastos}
        keyExtractor={i => i.id}
        renderItem={renderGasto}
        contentContainerStyle={{ paddingBottom: 16 }}
      />

      <TouchableOpacity style={styles.toggleForm} onPress={() => setFormExpanded(!formExpanded)}>
        <Ionicons name={formExpanded ? 'chevron-down-outline' : 'chevron-up-outline'} size={20} color="#FFF" />
        <Text style={styles.toggleText}>{formExpanded ? 'Ocultar Formulario Carga Gasto' : 'Mostrar Formulario Carga Gasto'}</Text>
      </TouchableOpacity>

      {formExpanded && (
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Formulario Carga Gasto</Text>
          <View style={styles.inputRow}>
            <Ionicons name="document-text-outline" size={20} color="#FFF" style={styles.icon} />
            <TextInput
              placeholder="Descripción"
              placeholderTextColor="#AAA"
              style={styles.input}
              value={descripcion}
              onChangeText={setDescripcion}
              keyboardShouldPersistTaps="always"
            />
          </View>
          <View style={styles.inputRow}>
            <Ionicons name="cash-outline" size={20} color="#FFF" style={styles.icon} />
            <TextInput
              placeholder="Monto"
              placeholderTextColor="#AAA"
              style={styles.input}
              value={monto}
              onChangeText={setMonto}
              keyboardType="decimal-pad"
              keyboardShouldPersistTaps="always"
            />
          </View>
          <View style={styles.inputRow}>
            <Ionicons name="people-outline" size={20} color="#FFF" style={styles.icon} />
            <TouchableOpacity style={styles.participantSelect} onPress={() => setShowPartModal(true)}>
              <Text style={[styles.input, { margin:0, padding:0 }]}>  {selectedPart ? evtParticipants.find(p => p.id === selectedPart)?.name : 'Seleccionar participante'}</Text>
              <Ionicons name="chevron-down-outline" size={20} color="#FFF" />
            </TouchableOpacity>
          </View>
          <View style={styles.inputRow}>
            <Ionicons name="calendar-number-outline" size={20} color="#FFF" style={styles.icon} />
            <TextInput
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#AAA"
              style={styles.input}
              value={date}
              onChangeText={setDate}
              keyboardShouldPersistTaps="always"
            />
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
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
          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.button, styles.cancelBtn]} onPress={handleCancel}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.saveNewBtn]} onPress={() => handleSave(true)}>
              <Text style={styles.buttonText}>Guardar y Nuevo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.saveBtn]} onPress={() => handleSave(false)}>
              <Text style={styles.buttonText}>Guardar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <Modal transparent visible={showPartModal} animationType="slide">
        <View style={[styles.addListOverlay, { backgroundColor: 'rgba(0,0,0,0.8)' }]}>           
          <TextInput
            placeholder="Buscar participante"
            placeholderTextColor="#AAA"
            style={styles.addListSearchInput}
            value={partSearch}
            onChangeText={setPartSearch}
          />
          <FlatList
            data={evtParticipants.filter(p => p.name.toLowerCase().includes(partSearch.toLowerCase()))}
            keyExtractor={p => p.id}
            renderItem={renderParticipantItem}
            style={{maxHeight:250}}
            keyboardShouldPersistTaps="always"
          />
          <TouchableOpacity style={styles.addListClose} onPress={() => setShowPartModal(false)}>
            <Text style={styles.addListCloseText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:'#0A0E1A' },
  listTitle: { fontSize:24, fontWeight:'bold', color:'#FFF', padding:16 },
  filterInput: { marginHorizontal:16, backgroundColor:'#1F2230', borderRadius:8, padding:8, color:'#FFF', marginBottom:8 },
  gastoCard: { flexDirection:'row', alignItems:'flex-start', backgroundColor:'#1F2230', borderWidth:1, borderColor:'#555', borderRadius:8, padding:8, marginHorizontal:16, marginVertical:2 },
  iconColumn: { alignItems:'center', marginRight:12 },
  eventDate: { color:'#FFF', marginTop:8, marginBottom:12 },
  eventIcon: {},
  eventInfo: { flex:1 },
  eventName: { color:'#FFF', fontWeight:'bold', fontSize:16, marginBottom:4 },
  eventDetail: { color:'#FFF', fontSize:14, marginBottom:2 },
  deleteBtn: { padding:4, marginLeft:8, marginTop:4 },
  emptyText:{color:'#FFF', textAlign:'center', marginTop:32},
  toggleForm:{flexDirection:'row', alignItems:'center', padding:16},
  toggleText:{color:'#FFF', marginLeft:8},
  formContainer:{marginHorizontal:16, backgroundColor:'#1F2230', borderRadius:8, padding:16},
  formTitle:{fontSize:18, fontWeight:'bold', color:'#FFF', marginBottom:12},
  inputRow:{flexDirection:'row', alignItems:'center', marginBottom:12},
  icon:{marginRight:12},
  input:{flex:1, backgroundColor:'#333', borderRadius:8, paddingHorizontal:12, paddingVertical:10, color:'#FFF'},
  participantSelect:{flex:1, flexDirection:'row', alignItems:'center', justifyContent:'space-between', backgroundColor:'#333', borderRadius:8, paddingHorizontal:12, paddingVertical:10},
  buttonRow:{flexDirection:'row', justifyContent:'space-between', marginTop:16},
  button:{flex:1, borderRadius:8, paddingVertical:12, alignItems:'center', marginHorizontal:4},
  cancelBtn:{backgroundColor:'#696969'},
  saveNewBtn:{backgroundColor:'#4285F4'},
  saveBtn:{backgroundColor:'#00FF55'},
  buttonText:{color:'#0A0E1A', fontWeight:'bold'},
  addListOverlay:{flex:1, justifyContent:'center', padding:16},
  addListSearchInput:{backgroundColor:'#0F1120',borderRadius:8,paddingHorizontal:12,paddingVertical:8,color:'#FFF',marginBottom:8},
  partRow:{flexDirection:'row',alignItems:'center',paddingVertical:4},
  partName:{color:'#FFF',marginLeft:8,flex:1},
  addListClose:{backgroundColor:'#696969',borderRadius:12,padding:12,marginTop:8,alignItems:'center'},
  addListCloseText:{color:'#FFF',fontWeight:'bold'},
});
