// Estilos específicos para la pantalla de inicio (HomeScreen)
import { StyleSheet } from 'react-native';
import colors from './colors';

export default StyleSheet.create({
  // Header
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.card
  },
  
  // Card de evento
  cardContainer: {
    marginBottom: 12
  },
  card: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12
  },
  cardContent: {
    flexDirection: 'row',
    padding: 12
  },
  eventIcon: {
    marginRight: 12
  },
  eventInfo: {
    flex: 1
  },
  eventName: {
    color: colors.textPrimary,
    fontWeight: 'bold',
    fontSize: 16
  },
  eventDate: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 4
  },
  eventAddress: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 2
  },
  amounts: {
    alignItems: 'flex-end',
    marginRight: 12
  },
  amountText: {
    color: colors.primary,
    fontWeight: 'bold'
  },
  amountSub: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 2
  },
  participantsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4
  },
  eventParticipantsCount: {
    color: colors.textSecondary,
    fontSize: 14,
    marginLeft: 4
  },
  
  // Acciones de eventos
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 8,
    backgroundColor: colors.input,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12
  },
  actionButton: {
    marginLeft: 16
  },
  
  // Modal de evento
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  modalIcon: {
    marginRight: 12
  },
  switchLabel: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 16
  },
  modalInput: {
    flex: 1,
    backgroundColor: colors.input,
    borderRadius: 8,
    paddingHorizontal: 12,
    color: colors.textPrimary
  },
  calIcon: {
    marginLeft: 8
  },
  dollarSign: {
    color: colors.textPrimary,
    fontSize: 16,
    marginRight: 4
  },
  
  // Secciones colapsables
  partHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16
  },
  toggleListButton: {
    padding: 4
  },
  addIconButton: {
    padding: 4,
    marginLeft: 8
  },
  
  // Participantes y gastos
  partRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4
  },
  partName: {
    color: colors.textPrimary,
    marginLeft: 8,
    flex: 1
  },
  partRemove: {
    padding: 4
  },
  
  // Footer del modal
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24
  },
});