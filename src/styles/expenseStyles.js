// Estilos específicos para la pantalla de gastos (CreateExpenseScreen)
import { StyleSheet } from 'react-native';
import colors from './colors';

export default StyleSheet.create({
  // Lista de gastos
  filterInput: {
    backgroundColor: colors.input,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: colors.textPrimary,
    marginVertical: 16
  },
  
  // Tarjeta de gasto
  card: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    marginVertical: 4,
    padding: 12,
    borderRadius: 8,
  },
  iconColumn: { 
    marginRight: 12 
  },
  infoColumn: { 
    flex: 2 
  },
  descText: { 
    color: colors.textPrimary, 
    fontWeight: 'bold', 
    fontSize: 16 
  },
  payerText: { 
    color: colors.textPrimary, 
    fontSize: 14, 
    marginTop: 4 
  },
  dateText: { 
    color: colors.textSecondary, 
    fontSize: 12, 
    marginTop: 2 
  },
  actionsColumn: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  amountText: { 
    color: colors.primary, 
    fontWeight: 'bold', 
    marginRight: 8 
  },
  deleteBtn: { 
    padding: 4 
  },
  empty: { 
    color: colors.textPrimary, 
    textAlign: 'center', 
    marginTop: 32 
  },
  
  // Campos de entrada y formularios
  icon: {
    marginRight: 12
  },
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
  
  // Modal de participantes
  participantModalContent: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 16
  },
  modalSearch: {
    backgroundColor: colors.input,
    borderRadius: 8,
    padding: 8,
    color: colors.textPrimary,
    marginBottom: 8
  },
  partRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 8 
  },
  partName: { 
    color: colors.textPrimary, 
    marginLeft: 8, 
    flex: 1 
  },
  modalClose: {
    backgroundColor: colors.disabled,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 8
  },
  modalCloseText: { 
    color: colors.textPrimary, 
    fontWeight: 'bold' 
  }
});