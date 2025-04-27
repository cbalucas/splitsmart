import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ParticipantsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Aquí irá la pantalla de Participantes</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 16, color: '#333' },
});
