// SplitSmart/src/screens/HomeScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
  SafeAreaView,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const sampleEvents = [
  {
    id: '1',
    name: 'Cumpleaños Ana',
    date: '2025-05-10',
    total: 2500,
    per: 500,
    participants: 5,
    icon: require('../assets/event-icon.png'),
  },
  {
    id: '2',
    name: 'Asado con amigos',
    date: '2025-04-29',
    total: 1800,
    per: 300,
    participants: 6,
    icon: require('../assets/event-icon.png'),
  },
  // puedes añadir más eventos de ejemplo aquí
];

export default function HomeScreen() {
  const { logout, user } = useContext(AuthContext);
  const [search, setSearch] = useState('');
  const [filteredEvents, setFilteredEvents] = useState(sampleEvents);

  // Filtrar por nombre
  const handleSearch = (text) => {
    setSearch(text);
    const filtered = sampleEvents.filter((e) =>
      e.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredEvents(filtered);
  };

  const renderEvent = ({ item }) => (
    <View style={styles.eventCard}>
      <Image source={item.icon} style={styles.eventIcon} />
      <View style={styles.eventInfo}>
        <Text style={styles.eventName}>{item.name}</Text>
        <Text style={styles.eventDate}>{item.date}</Text>
        <Text style={styles.eventParticipants}>
          Participantes: {item.participants}
        </Text>
      </View>
      <View style={styles.amounts}>
        <Text>Total: ${item.total}</Text>
        <Text>Por persona: ${item.per}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity>
          <Ionicons name="create-outline" size={20} />
        </TouchableOpacity>
        <TouchableOpacity style={{ marginLeft: 12 }}>
          <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TextInput
          placeholder="Buscar"
          value={search}
          onChangeText={handleSearch}
          style={styles.searchInput}
        />
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="options-outline" size={24} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="calendar-outline" size={24} />
        </TouchableOpacity>
        <TouchableOpacity onPress={logout} style={{ marginLeft: 16 }}>
          <Image
            source={require('../assets/avatar.png')}
            style={styles.avatar}
          />
        </TouchableOpacity>
      </View>

      {/* LISTADO DE EVENTOS */}
      <FlatList
        data={filteredEvents}
        keyExtractor={(item) => item.id}
        renderItem={renderEvent}
        contentContainerStyle={{ paddingBottom: 80 }}
      />

      {/* TAB BAR (si estás usando React Navigation Tabs, esto no es necesario) */}
      {/* Si dejas la navegación por tabs, este bloque se ignora */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#EEEEEE',
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
  },
  iconButton: {
    marginLeft: 12,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  eventCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#F0F0F0',
  },
  eventIcon: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  eventInfo: { flex: 2 },
  eventName: { fontWeight: 'bold', marginBottom: 4 },
  eventDate: { color: '#777777' },
  eventParticipants: { color: '#777777', marginTop: 4 },
  amounts: {
    alignItems: 'flex-end',
    marginRight: 12,
  },
  actions: {
    flexDirection: 'row',
  },
});
