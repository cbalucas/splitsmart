// src/screens/HomeScreen.js
import React, { useState, useContext } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { AuthContext } from '../context/AuthContext';
import { sampleEvents } from '../data/sampleData';

export default function HomeScreen() {
  const { logout } = useContext(AuthContext);

  // events in state so filters/reactivity work
  const [events, setEvents] = useState(sampleEvents);
  const [search, setSearch] = useState('');
  const [filterStateActive, setFilterStateActive] = useState(false);
  const [filterDateActive, setFilterDateActive] = useState(false);

  // compute “yesterday” for date filters
  const today     = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  // combined filtering: text / estado / fecha
  const filtered = events.filter(e => {
    const matchesSearch = e.name.toLowerCase().includes(search.toLowerCase());
    const matchesState  = !filterStateActive || e.estadoEvento;
    const eventDate     = new Date(e.date);
    const matchesDate   = !filterDateActive || eventDate >= yesterday;
    return matchesSearch && matchesState && matchesDate;
  });

  // toggle estadoEvento to false
  const closeEvent = (id) => {
    setEvents(prev =>
      prev.map(ev =>
        ev.id === id ? { ...ev, estadoEvento: false } : ev
      )
    );
  };

  const renderEvent = ({ item }) => {
    // date icon logic
    const eventDate     = new Date(item.date);
    const dateIconName  = eventDate >= yesterday ? 'today-outline' : 'calendar-outline';
    const dateIconColor = eventDate >= yesterday ? '#00FF55'      : '#FF6B6B';

    // whatsapp icon color
    const whatsappColor = item.whatsappEnvio ? '#00FF55' : '#888';

    // other actions
    const viewColor    = '#4285F4';
    const lockIconName = item.estadoEvento ? 'lock-open-outline'  : 'lock-closed-outline';
    const lockColor    = item.estadoEvento ? '#00FF55'            : '#FF6B6B';
    const editColor    = item.estadoEvento ? '#4285F4'            : '#888';

    return (
      <View style={styles.card}>
        {/* event content */}
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
            <Text style={styles.eventParticipants}>
              {item.participants} participantes
            </Text>
          </View>
          <View style={styles.amounts}>
            <Text style={styles.amountText}>${item.total}</Text>
            <Text style={styles.amountSub}>por persona ${item.per}</Text>
          </View>
        </View>
        {/* actions row */}
        <View style={styles.actions}>
         
          <TouchableOpacity>
            <Ionicons name="eye-outline" size={20} color={viewColor} />
          </TouchableOpacity>
          <View style={styles.actionButton}>
            <Ionicons name="logo-whatsapp" size={20} color={whatsappColor} />
          </View>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => closeEvent(item.id)}
          >
            <Ionicons name={lockIconName} size={20} color={lockColor} />
          </TouchableOpacity>
          <TouchableOpacity
            disabled={!item.estadoEvento}
            style={styles.actionButton}
          >
            <Ionicons name="create-outline" size={20} color={editColor} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* header with search + filters */}
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
          <Image
            source={require('../assets/avatar.png')}
            style={styles.avatar}
          />
        </TouchableOpacity>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={renderEvent}
        contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:           { flex: 1, backgroundColor: '#0A0E1A' },
  header:              { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#1F2230' },
  searchInput:         { flex: 1, backgroundColor: '#0F1120', borderRadius: 12, paddingHorizontal: 12, color: '#FFF', fontSize: 16 },
  filterButton:        { marginLeft: 12, padding: 4 },
  avatar:              { width: 32, height: 32, borderRadius: 16, borderWidth: 1, borderColor: '#00FF55' },
  card:                { backgroundColor: '#1F2230', borderRadius: 12, marginBottom: 12, overflow: 'hidden' },
  cardContent:         { flexDirection: 'row', alignItems: 'center', padding: 12 },
  eventIcon:           { marginRight: 12 },
  eventInfo:           { flex: 2 },
  eventName:           { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  eventDate:           { color: '#AAA', fontSize: 14, marginTop: 4 },
  eventParticipants:   { color: '#AAA', fontSize: 14, marginTop: 4 },
  amounts:             { alignItems: 'flex-end', marginRight: 12 },
  amountText:          { color: '#00FF55', fontWeight: 'bold' },
  amountSub:           { color: '#AAA', fontSize: 12, marginTop: 2 },
  actions:             { flexDirection: 'row', justifyContent: 'flex-end', padding: 8, backgroundColor: '#0F1120' },
  actionButton:        { marginLeft: 16 },
});
