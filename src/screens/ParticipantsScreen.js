import React, { useState, useContext, useEffect, useLayoutEffect, useCallback } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Modal,
  Alert,
  BackHandler, // Importar BackHandler
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
    removeParticipantFromEvent,
    updateEventTotals,
    relations,
    setRelations,
    getTotalPersonCount
  } = useContext(EventContext);
  const navigation = useNavigation();
  const route = useRoute();
  
  const { eventId, fromTabBar } = route.params || {};
  const currentEvent = events.find(e => e.id === eventId);
  
  const [search, setSearch] = useState('');
  const [showOnlyEventParticipants, setShowOnlyEventParticipants] = useState(!fromTabBar);

  // Estados para manejo de errores de validación
  const [errors, setErrors] = useState({
    name: false
  });
  
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [name, setName] = useState('');
  const [alias, setAlias] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  // Añadimos el estado modalMode
  const [modalMode, setModalMode] = useState('view'); // 'view' por defecto

  const [formExpanded, setFormExpanded] = useState(false);
  const [newName, setNewName] = useState('');
  const [newAlias, setNewAlias] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');

  const [cantParticipantes, setCantParticipantes] = useState(1);
  const [newCantParticipantes, setNewCantParticipantes] = useState(1);
  
  // Función para obtener la cantidad de participantes de una relación
  const getParticipantCount = (participantId) => {
    if (!eventId) return 1;
    
    const relation = relations.find(r => r.eventsId === eventId && r.participantsId === participantId);
    return relation?.cantParticipantes || 1;
  };
  
  // Función para actualizar la cantidad de participantes en una relación
  const updateParticipantCount = (participantId, count) => {
    if (!eventId) return;
    
    // Buscar la relación específica
    const relation = relations.find(r => r.eventsId === eventId && r.participantsId === participantId);
    if (relation) {
      // Actualizar la relación en el estado
      const updatedRelations = relations.map(r => 
        (r.id === relation.id) ? { ...r, cantParticipantes: count } : r
      );
      
      // Actualizar el estado global
      setRelations(updatedRelations);
      
      // Actualizar los totales del evento
      setTimeout(() => {
        updateEventTotals(eventId);
      }, 0);
      
      return true;
    }
    return false;
  };

  // Función para navegar al Home
  const goToHome = useCallback(() => {
    // Si hay un eventId, pasamos este parámetro para forzar la actualización en Home
    navigation.navigate('Tabs', {
      screen: 'Home',
      params: eventId ? { 
        updatedEventId: eventId, 
        updateTimestamp: Date.now() // Timestamp para forzar actualización
      } : undefined
    });
  }, [navigation, eventId]);

  // Manejo del botón de retroceso hardware
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      // Si hay algún modal abierto, ciérralo en lugar de navegar
      if (modalVisible) {
        setModalVisible(false);
        return true; // Evita el comportamiento predeterminado
      }
      if (formExpanded) {
        setFormExpanded(false);
        return true; // Evita el comportamiento predeterminado
      }
      
      // Si no hay modales abiertos, navega al Home
      goToHome();
      return true; // Evita el comportamiento predeterminado
    });

    // Limpiar el listener cuando el componente se desmonta
    return () => backHandler.remove();
  }, [goToHome, modalVisible, formExpanded]);

  useLayoutEffect(() => {
    if (eventId) {
      navigation.setOptions({
        headerLeft: () => (
          <TouchableOpacity 
            onPress={goToHome} 
            style={{ marginLeft: 16 }}
          >
            <Ionicons name="arrow-back-outline" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        ),
        title: currentEvent ? `Participantes - ${currentEvent.name}` : 'Participantes'
      });
    }
  }, [navigation, eventId, currentEvent, goToHome]);

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

  // Resetear los valores del formulario sin cerrarlo
  const resetFormValues = () => {
    setNewName('');
    setNewAlias('');
    setNewPhone('');
    setNewEmail('');
    setErrors({
      name: false
    });
  };

  // Cerrar el formulario y resetear valores
  const collapseForm = () => {
    setFormExpanded(false);
    resetFormValues();
  };

  // Preparar nuevo formulario al abrir el modal
  useEffect(() => {
    if (formExpanded) {
      resetFormValues(); // Solo resetea valores, no cierra el modal
    }
  }, [formExpanded]);

  const openView = p => {
    setSelectedId(p.id);
    setName(p.name);
    setAlias(p.aliasCBU || '');
    setPhone(p.phone || '');
    setEmail(p.email || '');
    
    // Cargar cantParticipantes si está en el evento
    if (eventId && isParticipantInEvent(p.id)) {
      setCantParticipantes(getParticipantCount(p.id));
    } else {
      setCantParticipantes(1); // Valor predeterminado
    }
    
    setIsEditing(false);
    setModalMode('view'); // Establecer el modo a 'view'
    setModalVisible(true);
  };

  const openEdit = () => {
    setIsEditing(true);
    setModalMode('edit'); // Establecer el modo a 'edit'
  };

  const saveModal = () => {
    // Validar campos obligatorios
    if (!name.trim()) {
      setErrors(prev => ({...prev, name: true}));
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
        // Si el participante está en el evento actual, actualizar su cantidad de participantes
        if (eventId && isParticipantInEvent(selectedId)) {
          updateParticipantCount(selectedId, cantParticipantes);
        }
        
        Alert.alert('Éxito', 'Participante actualizado correctamente');
        setErrors({name: false});
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
          // Actualizar los totales después de quitar un participante
          updateEventTotals(eventId);
          
          // Actualizar la interfaz
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
        
        // Actualizar los totales después de añadir un participante
        updateEventTotals(eventId);
        
        // Actualizar la interfaz
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
    // Validar campos obligatorios
    const newErrors = {
      name: !newName.trim()
    };
    
    setErrors(newErrors);
    
    // Si hay errores, detener la operación
    if (Object.values(newErrors).some(error => error)) {
      return Alert.alert('Error', 'Por favor, completa el nombre del participante');
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
    const personCount = isInEvent ? getParticipantCount(item.id) : 1;
    
    return (
      <TouchableOpacity 
        style={participantStyles.card} 
        onPress={() => {
          if (isInEvent) {
            // Si está en el evento, cargamos la cantidad actual de participantes
            setCantParticipantes(personCount);
          }
          openView(item);
        }}
      >
        <Ionicons 
          name="person-outline" 
          size={40} 
          color={isInEvent ? colors.primary : colors.textPrimary} 
          style={participantStyles.icon} 
        />
        <View style={participantStyles.info}>
          <Text style={participantStyles.name}>{item.name}</Text>
          <Text style={participantStyles.alias}>{item.aliasCBU}</Text>
          
          {isInEvent && personCount > 1 && (
            <Text style={participantStyles.countLabel}>
              Representa a {personCount} personas
            </Text>
          )}
        </View>
        <View style={participantStyles.actions}>
          {isInEvent && (
            <View style={participantStyles.counterContainer}>
              <TouchableOpacity
                onPress={() => {
                  if (personCount > 1) {
                    updateParticipantCount(item.id, personCount - 1);
                  }
                }}
                style={[
                  participantStyles.counterBtn,
                  personCount <= 1 ? participantStyles.disabledBtn : null
                ]}
                disabled={personCount <= 1}
              >
                <Ionicons 
                  name="remove" 
                  size={18} 
                  color={personCount <= 1 ? colors.textDisabled : colors.danger} 
                />
              </TouchableOpacity>
              
              <Text style={participantStyles.counterText}>{personCount}</Text>
              
              <TouchableOpacity
                onPress={() => {
                  if (personCount < 10) {
                    updateParticipantCount(item.id, personCount + 1);
                  }
                }}
                style={[
                  participantStyles.counterBtn,
                  personCount >= 10 ? participantStyles.disabledBtn : null
                ]}
                disabled={personCount >= 10}
              >
                <Ionicons 
                  name="add" 
                  size={18} 
                  color={personCount >= 10 ? colors.textDisabled : colors.primary} 
                />
              </TouchableOpacity>
            </View>
          )}
          
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
              <Text style={commonStyles.modalTitle}>Crear Participante</Text>
            </View>
            
            <View style={commonStyles.inputRow}>
              <Ionicons 
                name="person-outline" 
                size={20} 
                color={newName ? colors.primary : (errors.name ? colors.danger : colors.textPrimary)}
                style={participantStyles.icon} 
              />
              <TextInput
                style={[
                  participantStyles.input,
                  errors.name && participantStyles.inputError
                ]}
                placeholder="Nombre *"
                placeholderTextColor={errors.name ? colors.danger : colors.textSecondary}
                value={newName}
                onChangeText={(text) => {
                  setNewName(text);
                  if (text.trim()) {
                    setErrors(prev => ({...prev, name: false}));
                  }
                }}
              />
            </View>
            
            <View style={commonStyles.inputRow}>
              <Ionicons 
                name="wallet-outline" 
                size={20} 
                color={newAlias ? colors.primary : colors.textPrimary}
                style={participantStyles.icon} 
              />
              <TextInput
                style={participantStyles.input}
                placeholder="Alias CBU"
                placeholderTextColor={colors.textSecondary}
                value={newAlias}
                onChangeText={setNewAlias}
              />
            </View>
            
            <View style={commonStyles.inputRow}>
              <Ionicons 
                name="phone-portrait-outline" 
                size={20} 
                color={newPhone ? colors.primary : colors.textPrimary}
                style={participantStyles.icon} 
              />
              <TextInput
                style={participantStyles.input}
                placeholder="Teléfono"
                placeholderTextColor={colors.textSecondary}
                value={newPhone}
                onChangeText={setNewPhone}
                keyboardType="phone-pad"
              />
            </View>
            
            <View style={commonStyles.inputRow}>
              <Ionicons 
                name="at-outline" 
                size={20} 
                color={newEmail ? colors.primary : colors.textPrimary}
                style={participantStyles.icon} 
              />
              <TextInput
                style={participantStyles.input}
                placeholder="Email"
                placeholderTextColor={colors.textSecondary}
                value={newEmail}
                onChangeText={setNewEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={participantStyles.buttonRow}>
              <TouchableOpacity
                style={[commonStyles.button, commonStyles.cancelBtn]}
                onPress={() => collapseForm()}
              >
                <Text style={commonStyles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[commonStyles.button, commonStyles.saveBtn]}
                onPress={addNew}
              >
                <Text style={commonStyles.buttonText}>Guardar</Text>
              </TouchableOpacity>
            </View>
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
                {isEditing ? 'Editar Participante' : 'Detalle Participante'}
              </Text>
              {!isEditing && (
                <TouchableOpacity onPress={openEdit}>
                  <Ionicons name="create-outline" size={24} color={colors.primary}/>
                </TouchableOpacity>
              )}
            </View>
            
            <View style={commonStyles.inputRow}>
              <Ionicons 
                name="person-outline" 
                size={20} 
                color={isEditing 
                  ? (name ? colors.primary : (errors.name ? colors.danger : colors.textPrimary)) 
                  : colors.textPrimary}
                style={participantStyles.icon} 
              />
              <TextInput
                style={[
                  participantStyles.input,
                  isEditing && errors.name && participantStyles.inputError
                ]}
                placeholder="Nombre *"
                placeholderTextColor={isEditing && errors.name ? colors.danger : colors.textSecondary}
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  if (text.trim()) {
                    setErrors(prev => ({...prev, name: false}));
                  }
                }}
                editable={isEditing}
              />
            </View>
            
            <View style={commonStyles.inputRow}>
              <Ionicons 
                name="wallet-outline" 
                size={20} 
                color={isEditing ? (alias ? colors.primary : colors.textPrimary) : colors.textPrimary}
                style={participantStyles.icon} 
              />
              <TextInput
                placeholder="Alias CBU"
                placeholderTextColor={colors.textSecondary}
                style={participantStyles.input}
                value={alias}
                onChangeText={setAlias}
                editable={isEditing}
              />
            </View>
            
            <View style={commonStyles.inputRow}>
              <Ionicons 
                name="phone-portrait-outline" 
                size={20} 
                color={isEditing ? (phone ? colors.primary : colors.textPrimary) : colors.textPrimary}
                style={participantStyles.icon} 
              />
              <TextInput
                placeholder="Teléfono"
                placeholderTextColor={colors.textSecondary}
                style={participantStyles.input}
                value={phone}
                onChangeText={setPhone}
                editable={isEditing}
                keyboardType="phone-pad"
              />
            </View>
            
            <View style={commonStyles.inputRow}>
              <Ionicons 
                name="at-outline" 
                size={20} 
                color={isEditing ? (email ? colors.primary : colors.textPrimary) : colors.textPrimary}
                style={participantStyles.icon} 
              />
              <TextInput
                placeholder="Email"
                placeholderTextColor={colors.textSecondary}
                style={participantStyles.input}
                value={email}
                onChangeText={setEmail}
                editable={isEditing}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            
            {/* Cantidad de participantes (solo para participantes en el evento actual) */}
            {eventId && isParticipantInEvent(selectedId) && (
              <View style={participantStyles.participantCountContainer}>
                <Text style={participantStyles.participantCountLabel}>
                  Cantidad de personas que representa:
                </Text>
                <View style={participantStyles.counterContainer}>
                  <TouchableOpacity
                    onPress={() => {
                      if (cantParticipantes > 1) {
                        setCantParticipantes(cantParticipantes - 1);
                        // Si no estamos en modo edición, actualizamos directamente
                        if (!isEditing) {
                          updateParticipantCount(selectedId, cantParticipantes - 1);
                        }
                      }
                    }}
                    style={participantStyles.counterBtn}
                    disabled={cantParticipantes <= 1 || !isEditing}
                  >
                    <Ionicons 
                      name="remove" 
                      size={18} 
                      color={cantParticipantes <= 1 ? colors.textDisabled : colors.danger} 
                    />
                  </TouchableOpacity>
                  
                  <Text style={participantStyles.counterText}>{cantParticipantes}</Text>
                  
                  <TouchableOpacity
                    onPress={() => {
                      if (cantParticipantes < 10) {
                        setCantParticipantes(cantParticipantes + 1);
                        // Si no estamos en modo edición, actualizamos directamente
                        if (!isEditing) {
                          updateParticipantCount(selectedId, cantParticipantes + 1);
                        }
                      }
                    }}
                    style={participantStyles.counterBtn}
                    disabled={cantParticipantes >= 10 || !isEditing}
                  >
                    <Ionicons 
                      name="add" 
                      size={18} 
                      color={cantParticipantes >= 10 ? colors.textDisabled : colors.primary} 
                    />
                  </TouchableOpacity>
                </View>
              </View>
            )}
            
            <View style={participantStyles.buttonRow}>
              <TouchableOpacity
                style={[commonStyles.button, commonStyles.cancelBtn]}
                onPress={() => {
                  if (isEditing) {
                    setIsEditing(false);
                    const participant = participants.find(p => p.id === selectedId);
                    if (participant) {
                      setName(participant.name);
                      setAlias(participant.aliasCBU || '');
                      setPhone(participant.phone || '');
                      setEmail(participant.email || '');
                    }
                  } else {
                    setModalVisible(false);
                  }
                }}
              >
                <Text style={commonStyles.buttonText}>{isEditing ? 'Cancelar' : 'Cerrar'}</Text>
              </TouchableOpacity>
              {isEditing && (
                <TouchableOpacity
                  style={[commonStyles.button, commonStyles.saveBtn]}
                  onPress={saveModal}
                >
                  <Text style={commonStyles.buttonText}>Guardar</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
