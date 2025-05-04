// Estilos específicos para la pantalla de gastos (CreateExpenseScreen)
import { StyleSheet } from 'react-native';
import colors from './colors';

export default StyleSheet.create({
  // Tarjeta de gasto - Estilo unificado con eventos
  cardContainer: {
    marginBottom: 12,
    marginTop: 2, // Margen superior para separar de la barra de búsqueda
    borderRadius: 12,
    overflow: 'hidden'
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    overflow: 'hidden',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12
  },
  eventIcon: {
    marginRight: 12
  },
  eventInfo: {
    flex: 2
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
  eventPayerName: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 4
  },
  amounts: {
    alignItems: 'flex-end'
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amountText: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 8
  },
  deleteButton: {
    padding: 4,
  },
  
  // Campos de entrada y formularios
  icon: {
    marginRight: 12
  },
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
  
  // Mensaje vacío
  empty: { 
    color: colors.textSecondary, 
    textAlign: 'center', 
    marginTop: 32 
  },
  
  // Modal de participantes
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
  }
});