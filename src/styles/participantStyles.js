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
    paddingHorizontal: 12,
    backgroundColor: colors.input,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'transparent' // Por defecto transparente, se volverá rojo con error
  },
  inputError: {
    borderColor: colors.danger,
    borderWidth: 1
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

  // Nuevos estilos para el contador de personas
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
    backgroundColor: colors.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 2
  },
  counterBtn: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12
  },
  counterText: {
    color: colors.textPrimary,
    fontWeight: 'bold',
    fontSize: 14,
    paddingHorizontal: 6,
    minWidth: 20,
    textAlign: 'center'
  },
  countLabel: {
    color: colors.primary,
    fontSize: 12,
    marginTop: 2
  },
  
  // Estilos para el modal con contador de participantes
  participantCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    justifyContent: 'space-between'
  },
  participantCountLabel: {
    color: colors.textPrimary,
    fontSize: 16
  },

  // Estilos para botones deshabilitados
  disabledBtn: {
    opacity: 0.5
  },
});