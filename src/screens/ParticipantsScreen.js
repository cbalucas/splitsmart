import React, { useState, useContext, useEffect, useLayoutEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { AuthContext } from '../context/AuthContext';
import { EventContext } from '../context/EventContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import colors from '../styles/colors';
import commonStyles from '../styles/commonStyles';
import participantStyles from '../styles/participantStyles';

export default function ParticipantsScreen() {
  const { logout } = useContext(AuthContext);
  const { 
    participants, 
    events,
    addParticipant,
    updateParticipant,
    getParticipantsForEvent, 
    addParticipantToEvent, 
    removeParticipantFromEvent 
  } = useContext(EventContext);
  const navigation = useNavigation();
  const route = useRoute();
  
  const { eventId, fromTabBar } = route.params || {};
  const currentEvent = events.find(e => e.id === eventId);
  
  const [search, setSearch] = useState('');
  const [showOnlyEventParticipants, setShowOnlyEventParticipants] = useState(!fromTabBar);

  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [name, setName] = useState('');
  const [alias, setAlias] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const [formExpanded, setFormExpanded] = useState(false);
  const [newName, setNewName] = useState('');
  const [newAlias, setNewAlias] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');

  useLayoutEffect(() => {
    if (eventId) {
      navigation.setOptions({
        headerLeft: () => (
          <TouchableOpacity 
            onPress={() => {
              navigation.navigate('Tabs', {
                screen: 'Home',
              });
            }} 
            style={{ marginLeft: 16 }}
          >
            <Ionicons name="arrow-back-outline" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        ),
        title: currentEvent ? `Participantes - ${currentEvent.name}` : 'Participantes'
      });
    }
  }, [navigation, eventId, currentEvent]);

  const eventParticipants = eventId ? getParticipantsForEvent(eventId) : [];
  
  const filtered = participants.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    if (!eventId) return matchesSearch;
    
    const isInEvent = eventParticipants.some(ep => ep.id === p.id);
    return matchesSearch && (showOnlyEventParticipants ? isInEvent : true);
  });

  const isParticipantInEvent = (participantId) => {
    return eventParticipants.some(p => p.id === participantId);
  };

  const collapseForm = () => {
    setFormExpanded(false);
    setNewName('');
    setNewAlias('');
    setNewPhone('');
    setNewEmail('');
  };

  const openView = p => {
    setSelectedId(p.id);
    setName(p.name);
    setAlias(p.aliasCBU || '');
    setPhone(p.phone || '');
    setEmail(p.email || '');
    setIsEditing(false);
    setModalVisible(true);
  };

  const openEdit = () => {
    setIsEditing(true);
  };

  const saveModal = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'El nombre es obligatorio');
      return;
    }
    
    try {
      const result = updateParticipant(selectedId, {
        name,
        aliasCBU: alias,
        phone,
        email
      });
      
      if (result) {
        Alert.alert('Éxito', 'Participante actualizado correctamente');
        setIsEditing(false);
        setModalVisible(false);
      } else {
        Alert.alert('Error', 'No se pudo actualizar el participante');
      }
    } catch (error) {
      console.error('Error al actualizar participante:', error);
      Alert.alert('Error', 'Ocurrió un error al actualizar el participante');
    }
  };

  const removeFromEvent = (participantId) => {
    if (eventId) {
      try {
        const result = removeParticipantFromEvent(eventId, participantId);
        if (result) {
          setShowOnlyEventParticipants(prev => {
            setTimeout(() => setShowOnlyEventParticipants(prev), 50);
            return prev;
          });
        }
      } catch (error) {
        console.error('Error al quitar participante:', error);
      }
    }
  };

  const addToEvent = (participantId) => {
    if (eventId) {
      try {
        addParticipantToEvent(eventId, participantId);
        
        setShowOnlyEventParticipants(prev => {
          setTimeout(() => setShowOnlyEventParticipants(prev), 50);
          return prev;
        });
      } catch (error) {
        console.error('Error al añadir participante:', error);
      }
    }
  };

  const addNew = () => {
    if (!newName.trim()) {
      Alert.alert('Error', 'El nombre es obligatorio');
      return;
    }
    
    try {
      const newParticipantData = {
        name: newName,
        aliasCBU: newAlias,
        phone: newPhone,
        email: newEmail,
        eventId: eventId
      };
      
      const newId = addParticipant(newParticipantData);
      
      if (newId) {
        Alert.alert('Éxito', 'Participante agregado correctamente');
        collapseForm();
        
        if (eventId) {
          setShowOnlyEventParticipants(prev => {
            setTimeout(() => setShowOnlyEventParticipants(prev), 50);
            return prev;
          });
        }
      } else {
        Alert.alert('Error', 'No se pudo agregar el participante');
      }
    } catch (error) {
      console.error('Error al agregar participante:', error);
      Alert.alert('Error', 'Ocurrió un error al agregar el participante');
    }
  };

  const renderItem = ({ item }) => {
    const isInEvent = eventId ? isParticipantInEvent(item.id) : false;
    
    return (
      <TouchableOpacity style={participantStyles.card} onPress={() => openView(item)}>
        <Ionicons 
          name="person-outline" 
          size={40} 
          color={isInEvent ? colors.primary : colors.textPrimary} 
          style={participantStyles.icon} 
        />
        <View style={participantStyles.info}>
          <Text style={participantStyles.name}>{item.name}</Text>
          <Text style={participantStyles.alias}>{item.aliasCBU}</Text>
        </View>
        <View style={participantStyles.actions}>
          <Ionicons
            name="phone-portrait-outline"
            size={20}
            color={item.phone ? colors.primary : colors.textDisabled}
            style={participantStyles.actionIcon}
          />
          <Ionicons
            name="at-outline"
            size={20}
            color={item.email ? colors.primary : colors.textDisabled}
            style={participantStyles.actionIcon}
          />
          
          {eventId && (
            isInEvent ? (
              <TouchableOpacity
                onPress={() => removeFromEvent(item.id)}
                style={participantStyles.actionBtn}
              >
                <Ionicons name="remove-circle-outline" size={24} color={colors.danger} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => addToEvent(item.id)}
                style={participantStyles.actionBtn}
              >
                <Ionicons name="add-circle-outline" size={24} color={colors.primary} />
              </TouchableOpacity>
            )
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={commonStyles.header}>
        <TextInput
          placeholder="Buscar participante"
          placeholderTextColor={colors.textSecondary}
          style={commonStyles.searchInput}
          value={search}
          onChangeText={setSearch}
        />
        {eventId && (
          <TouchableOpacity 
            onPress={() => setShowOnlyEventParticipants(!showOnlyEventParticipants)} 
            style={commonStyles.filterButton}
          >
            <Ionicons 
              name={showOnlyEventParticipants ? "people-outline" : "people-circle-outline"} 
              size={24} 
              color={showOnlyEventParticipants ? colors.textPrimary : colors.primary} 
            />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={p => p.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
      />

      <TouchableOpacity 
        style={commonStyles.floatingButton}
        onPress={() => setFormExpanded(!formExpanded)}
      >
        <Ionicons 
          name="add-outline" 
          size={30} 
          color={colors.textPrimary} 
        />
      </TouchableOpacity>

      <Modal
        visible={formExpanded}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setFormExpanded(false)}
      >
        <View style={commonStyles.modalOverlay}>
          <View style={commonStyles.modalContent}>
            <View style={commonStyles.modalHeader}>
              <Text style={commonStyles.modalTitle}>Formulario Carga Participante</Text>
              <TouchableOpacity onPress={() => setFormExpanded(false)}>
                <Ionicons name="close-outline" size={24} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>
            
            {[
              { icon: 'person-outline', value: newName, setter: setNewName, placeholder: 'Nombre' },
              { icon: 'wallet-outline', value: newAlias, setter: setNewAlias, placeholder: 'Alias CBU' },
              { icon: 'phone-portrait-outline', value: newPhone, setter: setNewPhone, placeholder: 'Teléfono', keyboardType: 'phone-pad' },
              { icon: 'at-outline', value: newEmail, setter: setNewEmail, placeholder: 'Email', keyboardType: 'email-address', autoCapitalize: 'none' },
            ].map((f, i) => (
              <View key={i} style={commonStyles.inputRow}>
                <Ionicons name={f.icon} size={20} color={colors.textPrimary} style={participantStyles.icon} />
                <TextInput
                  placeholder={f.placeholder}
                  placeholderTextColor={colors.textSecondary}
                  style={participantStyles.input}
                  value={f.value}
                  onChangeText={f.setter}
                  keyboardType={f.keyboardType}
                  autoCapitalize={f.autoCapitalize}
                />
              </View>
            ))}

            <TouchableOpacity
              style={commonStyles.saveButton}
              onPress={addNew}
            >
              <Text style={commonStyles.saveButtonText}>Guardar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        transparent
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={commonStyles.modalOverlay}>
          <View style={commonStyles.modalContent}>
            <View style={commonStyles.modalHeader}>
              <Text style={commonStyles.modalTitle}>
                {isEditing ? 'Editar Participante' : 'Participante'}
              </Text>
              {!isEditing && (
                <TouchableOpacity onPress={openEdit}>
                  <Ionicons name="create-outline" size={24} color={colors.primary}/>
                </TouchableOpacity>
              )}
            </View>
            {[
              { icon: 'person-outline', value: name, setter: setName, placeholder: 'Nombre' },
              { icon: 'wallet-outline', value: alias, setter: setAlias, placeholder: 'Alias CBU' },
              { icon: 'phone-portrait-outline', value: phone, setter: setPhone, placeholder: 'Teléfono', keyboardType: 'phone-pad' },
              { icon: 'at-outline', value: email, setter: setEmail, placeholder: 'Email', keyboardType: 'email-address', autoCapitalize: 'none' },
            ].map((f, i) => (
              <View key={i} style={commonStyles.inputRow}>
                <Ionicons name={f.icon} size={20} color={colors.textPrimary} style={participantStyles.icon} />
                <TextInput
                  placeholder={f.placeholder}
                  placeholderTextColor={colors.textSecondary}
                  style={participantStyles.input}
                  value={f.value}
                  onChangeText={f.setter}
                  editable={isEditing}
                  keyboardType={f.keyboardType}
                  autoCapitalize={f.autoCapitalize}
                />
              </View>
            ))}
            {isEditing && (
              <View style={participantStyles.buttonRow}>
                <TouchableOpacity
                  style={[commonStyles.button, commonStyles.cancelBtn]}
                  onPress={() => {
                    setIsEditing(false);
                    const participant = participants.find(p => p.id === selectedId);
                    if (participant) {
                      setName(participant.name);
                      setAlias(participant.aliasCBU || '');
                      setPhone(participant.phone || '');
                      setEmail(participant.email || '');
                    }
                  }}
                >
                  <Text style={commonStyles.buttonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[commonStyles.button, commonStyles.saveBtn]}
                  onPress={saveModal}
                >
                  <Text style={commonStyles.buttonText}>Guardar</Text>
                </TouchableOpacity>
              </View>
            )}
            {!isEditing && (
              <View style={participantStyles.singleButtonContainer}>
                <TouchableOpacity
                  style={participantStyles.closeButtonFull}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={participantStyles.closeButtonTextFixed}>Cerrar</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
