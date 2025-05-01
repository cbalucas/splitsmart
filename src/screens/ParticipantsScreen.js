import React, { useState, useContext } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { AuthContext } from '../context/AuthContext';
import { sampleParticipants } from '../data/sampleData';

export default function ParticipantsScreen() {
  const { logout } = useContext(AuthContext);

  // Estado de participantes y búsqueda
  const [participants, setParticipants] = useState(sampleParticipants);
  const [search, setSearch] = useState('');

  // Modal ver/editar participante
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [name, setName] = useState('');
  const [alias, setAlias] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  // Formulario colapsable para agregar nuevo
  const [formExpanded, setFormExpanded] = useState(false);
  const [newName, setNewName] = useState('');
  const [newAlias, setNewAlias] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');

  // Filtrar lista
  const filtered = participants.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  // Colapsar formulario y resetear campos
  const collapseForm = () => {
    setFormExpanded(false);
    setNewName('');
    setNewAlias('');
    setNewPhone('');
    setNewEmail('');
  };

  // Abrir modal en modo ver
  const openView = p => {
    setSelectedId(p.id);
    setName(p.name);
    setAlias(p.aliasCBU);
    setPhone(p.phone);
    setEmail(p.email);
    setIsEditing(false);
    setModalVisible(true);
  };

  // Abrir modal en modo edición
  const openEdit = () => {
    setIsEditing(true);
  };

  // Guardar en modal (editar)
  const saveModal = () => {
    if (!name.trim()) {
      Alert.alert('El nombre es obligatorio');
      return;
    }
    setParticipants(prev =>
      prev.map(p =>
        p.id === selectedId ? { ...p, name, aliasCBU: alias, phone, email } : p
      )
    );
    setModalVisible(false);
  };

  // Eliminar participante
  const deleteParticipant = id => {
    Alert.alert('Eliminar participante', '¿Seguro?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar', style: 'destructive', onPress: () =>
          setParticipants(prev => prev.filter(p => p.id !== id))
      }
    ]);
  };

  // Agregar nuevo participante
  const addNew = () => {
    if (!newName.trim()) {
      Alert.alert('El nombre es obligatorio');
      return;
    }
    // Generar ID único basado en el mayor existente
    const maxId = participants.reduce((max, p) => {
      const num = parseInt(p.id, 10);
      return num > max ? num : max;
    }, 0);
    const id = (maxId + 1).toString();

    setParticipants(prev => [
      ...prev,
      { id, name: newName, aliasCBU: newAlias, phone: newPhone, email: newEmail },
    ]);
    collapseForm();
  };

  // Render de cada participante
  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => openView(item)}>
      <Ionicons name="person-outline" size={40} color="#FFF" style={styles.icon} />
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.alias}>{item.aliasCBU}</Text>
      </View>
      <View style={styles.actions}>
        <Ionicons
          name="phone-portrait-outline"
          size={20}
          color={item.phone ? '#00FF55' : '#888'}
          style={styles.actionIcon}
        />
        <Ionicons
          name="at-outline"
          size={20}
          color={item.email ? '#00FF55' : '#888'}
          style={styles.actionIcon}
        />
        <TouchableOpacity
          onPress={() => deleteParticipant(item.id)}
          style={styles.actionBtn}
        >
          <Ionicons name="trash-outline" size={24} color="#FF6B6B" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header con búsqueda y logout */}
      <View style={styles.header}>
        <TextInput
          placeholder="Buscar participante"
          placeholderTextColor="#888"
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
        />
        <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
          <Ionicons name="log-out-outline" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Lista de participantes */}
      <FlatList
        data={filtered}
        keyExtractor={p => p.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
      />

      {/* Formulario colapsable para agregar */}
      <TouchableOpacity
        style={styles.toggle}
        onPress={() => setFormExpanded(v => !v)}
      >
        <Ionicons
          name={formExpanded ? 'chevron-down-outline' : 'chevron-up-outline'}
          size={20}
          color="#FFF"
        />
        <Text style={styles.toggleText}>
          {formExpanded ? 'Ocultar Formulario' : 'Agregar Participante'}
        </Text>
      </TouchableOpacity>
      {formExpanded && (
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Formulario Carga Participante</Text>
          {[
            { icon: 'person-outline', value: newName, setter: setNewName, placeholder: 'Nombre' },
            { icon: 'wallet-outline', value: newAlias, setter: setNewAlias, placeholder: 'Alias CBU' },
            { icon: 'phone-portrait-outline', value: newPhone, setter: setNewPhone, placeholder: 'Teléfono', keyboardType: 'phone-pad' },
            { icon: 'at-outline', value: newEmail, setter: setNewEmail, placeholder: 'Email', keyboardType: 'email-address', autoCapitalize: 'none' },
          ].map((f, i) => (
            <View key={i} style={styles.inputRow}>
              <Ionicons name={f.icon} size={20} color="#FFF" style={styles.icon} />
              <TextInput
                placeholder={f.placeholder}
                placeholderTextColor="#AAA"
                style={styles.input}
                value={f.value}
                onChangeText={f.setter}
                keyboardType={f.keyboardType}
                autoCapitalize={f.autoCapitalize}
              />
            </View>
          ))}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.cancelBtn]}
              onPress={() => setFormExpanded(false)}
            >
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.saveBtn]}
              onPress={addNew}
            >
              <Text style={styles.buttonText}>Guardar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Modal ver/editar participante */}
      <Modal
        transparent
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {isEditing ? 'Editar Participante' : 'Participante'}
              </Text>
              {!isEditing && (
                <TouchableOpacity onPress={openEdit}>
                  <Text style={styles.modalEditLink}>Editar</Text>
                </TouchableOpacity>
              )}
            </View>
            {[
              { icon: 'person-outline', value: name, setter: setName, placeholder: 'Nombre' },
              { icon: 'wallet-outline', value: alias, setter: setAlias, placeholder: 'Alias CBU' },
              { icon: 'phone-portrait-outline', value: phone, setter: setPhone, placeholder: 'Teléfono', keyboardType: 'phone-pad' },
              { icon: 'at-outline', value: email, setter: setEmail, placeholder: 'Email', keyboardType: 'email-address', autoCapitalize: 'none' },
            ].map((f, i) => (
              <View key={i} style={styles.inputRow}>
                <Ionicons name={f.icon} size={20} color="#FFF" style={styles.icon} />
                <TextInput
                  placeholder={f.placeholder}
                  placeholderTextColor="#AAA"
                  style={styles.input}
                  value={f.value}
                  onChangeText={f.setter}
                  editable={isEditing}
                  keyboardType={f.keyboardType}
                  autoCapitalize={f.autoCapitalize}
                />
              </View>
            ))}
            {isEditing && (
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelBtn]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.buttonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.saveBtn]}
                  onPress={saveModal}
                >
                  <Text style={styles.buttonText}>Guardar</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0E1A' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#1F2230' },
  searchInput: { flex: 1, backgroundColor: '#0F1120', borderRadius: 12, paddingHorizontal: 12, color: '#FFF' },
  logoutBtn: { marginLeft: 16 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1F2230', borderRadius: 12, padding: 12, marginBottom: 12 },
  icon: { marginRight: 12 },
  info: { flex: 1 },
  name: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  alias: { color: '#AAA', fontSize: 14 },
  actions: { flexDirection: 'row', alignItems: 'center' },
  actionIcon: { marginHorizontal: 8 },
  actionBtn: { padding: 4 },
  toggle: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  toggleText: { color: '#FFF', marginLeft: 8 },
  formContainer: { marginHorizontal: 16, backgroundColor: '#1F2230', borderRadius: 8, padding: 16 },
  formTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFF', marginBottom: 12 },
  inputRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  input: { flex: 1, backgroundColor: '#333', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, color: '#FFF' },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
  button: { flex: 1, borderRadius: 8, paddingVertical: 12, alignItems: 'center', marginHorizontal: 4 },
  cancelBtn: { backgroundColor: '#696969' },
  saveBtn: { backgroundColor: '#00FF55' },
  buttonText: { color: '#0A0E1A', fontWeight: 'bold' },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)' },
  modalContent: { width: '90%', backgroundColor: '#1F2230', borderRadius: 12, padding: 16 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  modalTitle: { fontSize: 20, color: '#FFF', fontWeight: 'bold' },
  modalEditLink: { color: '#00FF55', fontSize: 16, textDecorationLine: 'underline' },
});
