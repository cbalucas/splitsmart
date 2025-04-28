// src/screens/ParticipantsScreen.js
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
  TextInput as RNTextInput,
  Alert,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { AuthContext } from '../context/AuthContext';
import { sampleParticipants } from '../data/sampleData';

export default function ParticipantsScreen() {
  const { logout } = useContext(AuthContext);

  // Estado de participantes (mutable)
  const [participants, setParticipants] = useState(sampleParticipants);
  const [search, setSearch] = useState('');

  // Modal: modo ('add' | 'view' | 'edit')
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  // Campos del formulario / visualización
  const [selectedId, setSelectedId] = useState(null);
  const [newName, setNewName] = useState('');
  const [newAlias, setNewAlias] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');

  // Filtrado por búsqueda
  const filtered = participants.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  // Función de borrado real
  const handleDelete = (id) => {
    Alert.alert(
      'Eliminar participante',
      '¿Estás seguro?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            setParticipants(prev =>
              prev.filter(p => p.id !== id)
            );
          }
        }
      ]
    );
  };

  // Abre modal en modo View
  const openViewModal = (p) => {
    setModalMode('view');
    setSelectedId(p.id);
    setNewName(p.name);
    setNewAlias(p.aliasCBU);
    setNewPhone(p.phone);
    setNewEmail(p.email);
    setModalVisible(true);
  };

  // Abre modal en modo Edit
  const openEditModal = (p) => {
    setModalMode('edit');
    setSelectedId(p.id);
    setNewName(p.name);
    setNewAlias(p.aliasCBU);
    setNewPhone(p.phone);
    setNewEmail(p.email);
    setModalVisible(true);
  };

  // Abre modal en modo Add
  const openAddModal = () => {
    setModalMode('add');
    setSelectedId(null);
    setNewName('');
    setNewAlias('');
    setNewPhone('');
    setNewEmail('');
    setModalVisible(true);
  };

  // Guarda nuevos datos (add o edit)
  const handleSave = () => {
    if (modalMode === 'add') {
      const newId = (participants.length + 1).toString();
      setParticipants([
        ...participants,
        {
          id: newId,
          name: newName,
          aliasCBU: newAlias,
          phone: newPhone,
          email: newEmail,
        },
      ]);
    } else if (modalMode === 'edit') {
      setParticipants(participants.map(p =>
        p.id === selectedId
          ? { ...p, name: newName, aliasCBU: newAlias, phone: newPhone, email: newEmail }
          : p
      ));
    }
    setModalVisible(false);
  };

  const renderParticipant = ({ item }) => {
    const phoneColor = item.phone ? '#00FF55' : '#888';
    const emailColor = item.email ? '#00FF55' : '#888';

    return (
      <View style={styles.card}>
        <View style={styles.cardContent}>
          <Ionicons name="person-outline" size={40} color="#FFF" style={styles.eventIcon} />

          <View style={styles.eventInfo}>
            <Text style={styles.eventName}>{item.name}</Text>
            <Text style={styles.eventDate}>{item.aliasCBU}</Text>
          </View>

          <View style={styles.actions}>
            {/* Visualizar */}
            <TouchableOpacity onPress={() => openViewModal(item)}>
              <Ionicons name="eye-outline" size={20} color="#4285F4" />
            </TouchableOpacity>
            {/* Teléfono (visual) */}
            <View style={styles.actionButton}>
              <Ionicons name="phone-portrait-outline" size={20} color={phoneColor} />
            </View>
            {/* Email (visual) */}
            <View style={styles.actionButton}>
              <Ionicons name="at-outline" size={20} color={emailColor} />
            </View>
            {/* Editar */}
            <TouchableOpacity onPress={() => openEditModal(item)} style={styles.actionButton}>
              <Ionicons name="create-outline" size={20} color="#4285F4" />
            </TouchableOpacity>
            {/* Borrar */}
            <TouchableOpacity
              onPress={() => handleDelete(item.id)}
              style={styles.actionButton}
            >
              <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header: búsqueda + logout */}
      <View style={styles.header}>
        <TextInput
          placeholder="Buscar participante"
          placeholderTextColor="#888"
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
      </View>

      {/* Botón Agregar Participante */}
      <TouchableOpacity style={styles.primaryButton} onPress={openAddModal}>
        <Ionicons name="person-add-outline" size={20} color="#0A0E1A" />
        <Text style={styles.primaryButtonText}>Agregar Participante</Text>
      </TouchableOpacity>

      {/* Lista */}
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={renderParticipant}
        contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
      />

      {/* Modal */}
      <Modal
        transparent
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Header del modal */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {modalMode === 'add' ? 'Nuevo Participante' : 'Participante'}
              </Text>
              {modalMode === 'view' && (
                <TouchableOpacity onPress={() => setModalMode('edit')}>
                  <Text style={styles.modalEditLink}>Editar</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Campos */}
            {[ 
              { icon: 'person-outline',         value: newName,  setter: setNewName,  placeholder: 'Nombre' },
              { icon: 'wallet-outline',         value: newAlias, setter: setNewAlias, placeholder: 'Alias CBU' },
              { icon: 'phone-portrait-outline', value: newPhone, setter: setNewPhone, placeholder: 'Teléfono', keyboardType: 'phone-pad' },
              { icon: 'at-outline',             value: newEmail, setter: setNewEmail, placeholder: 'Email',     keyboardType: 'email-address', autoCapitalize: 'none' },
            ].map((fld, i) => (
              <View key={i} style={styles.inputRow}>
                <Ionicons name={fld.icon} size={20} color="#FFF" style={styles.modalIcon} />
                <RNTextInput
                  placeholder={fld.placeholder}
                  placeholderTextColor="#AAA"
                  style={styles.modalInput}
                  value={fld.value}
                  onChangeText={fld.setter}
                  keyboardType={fld.keyboardType}
                  autoCapitalize={fld.autoCapitalize}
                  editable={modalMode !== 'view'}
                />
              </View>
            ))}

            {/* Footer: Cancelar + Guardar */}
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.primaryButtonDisabled, { flex: 1, marginRight: 8 }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.primaryButtonText}>Cancelar</Text>
              </TouchableOpacity>
              {(modalMode === 'add' || modalMode === 'edit') && (
                <TouchableOpacity
                  style={[styles.primaryButton, { flex: 1 }]}
                  onPress={handleSave}
                >
                  <Text style={styles.primaryButtonText}>Guardar</Text>
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
  container:             { flex: 1, backgroundColor: '#0A0E1A' },
  header:                { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#1F2230' },
  searchInput:           { flex: 1, backgroundColor: '#0F1120', borderRadius: 12, paddingHorizontal: 12, color: '#FFF', fontSize: 16 },
  primaryButton:         { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#00FF55', margin: 16, borderRadius: 12, paddingVertical: 14 },
  primaryButtonText:     { marginLeft: 8, color: '#0A0E1A', fontSize: 16, fontWeight: 'bold' },
  primaryButtonDisabled: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#696969', margin: 16, borderRadius: 12, paddingVertical: 14 },
  card:                  { backgroundColor: '#1F2230', borderRadius: 12, marginBottom: 12, overflow: 'hidden' },
  cardContent:           { flexDirection: 'row', alignItems: 'center', padding: 12 },
  eventIcon:             { marginRight: 12 },
  eventInfo:             { flex: 2 },
  eventName:             { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  eventDate:             { color: '#AAA', fontSize: 14, marginTop: 4 },
  actions:               { flexDirection: 'row', alignItems: 'center' },
  actionButton:          { marginLeft: 16 },
  modalOverlay:          { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  modalContent:          { width: '80%', backgroundColor: '#1F2230', borderRadius: 12, padding: 16 },
  modalHeader:           { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  modalTitle:            { fontSize: 20, color: '#FFF', fontWeight: 'bold' },
  modalEditLink:         { color: '#00FF55', fontSize: 16, textDecorationLine: 'underline' },
  inputRow:              { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  modalIcon:             { marginRight: 8 },
  modalInput:            { flex: 1, backgroundColor: '#0F1120', borderRadius: 8, padding: 12, color: '#FFF' },
  modalFooter:           { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
});
