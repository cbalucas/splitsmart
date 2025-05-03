// Estilos específicos para la pantalla de participantes (ParticipantsScreen)
import { StyleSheet } from 'react-native';
import colors from './colors';

export default StyleSheet.create({
  // Tarjeta de participante
  card: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    marginVertical: 4,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  icon: {
    marginRight: 12
  },
  info: { 
    flex: 1 
  },
  name: { 
    color: colors.textPrimary, 
    fontWeight: 'bold', 
    fontSize: 16 
  },
  alias: { 
    color: colors.textSecondary, 
    fontSize: 14 
  },
  
  // Acciones de participante
  actions: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  actionIcon: { 
    marginHorizontal: 8 
  },
  actionBtn: { 
    padding: 4 
  },
  
  // Campo de entrada
  input: {
    flex: 1,
    color: colors.textPrimary,
    paddingVertical: 8,
    paddingHorizontal: 0
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16
  },
  
  // Modal de formulario
  formModalOverlay: {
    flex: 1, 
    backgroundColor: colors.overlay,
    justifyContent: 'center', 
    padding: 16 
  },
  formModalContent: {
    backgroundColor: colors.card, 
    borderRadius: 12, 
    padding: 16 
  },
  formModalHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 12 
  },
  formTitle: { 
    color: colors.textPrimary, 
    fontSize: 18, 
    fontWeight: 'bold' 
  },
  
  // Botones específicos del modal
  saveButton: { 
    backgroundColor: colors.primary, 
    borderRadius: 8, 
    paddingVertical: 12, 
    alignItems: 'center', 
    marginTop: 16 
  },
  saveButtonText: { 
    color: colors.textButton, 
    fontWeight: 'bold' 
  },
  closeButtonFull: {
    backgroundColor: colors.disabled, 
    borderRadius: 8, 
    paddingVertical: 12, 
    alignItems: 'center', 
    marginTop: 8
  },
  closeButtonTextFixed: {
    color: colors.textPrimary, 
    fontWeight: 'bold'
  },
  singleButtonContainer: {
    marginTop: 16
  },
});