// Estilos comunes reutilizables en toda la aplicación
import { StyleSheet } from 'react-native';
import colors from './colors';

export default StyleSheet.create({
  // Contenedores
  container: {
    flex: 1,
    backgroundColor: colors.background
  },
  content: {
    flex: 1,
    paddingHorizontal: 16
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.card
  },
  
  // Búsqueda
  searchInput: {
    flex: 1,
    backgroundColor: colors.input,
    borderRadius: 12,
    paddingHorizontal: 12,
    color: colors.textPrimary
  },
  clearButton: {
    marginLeft: 8
  },
  filterButton: {
    marginLeft: 16
  },
  
  // Tarjetas
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12
  },
  
  // Inputs
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  input: {
    flex: 1,
    backgroundColor: colors.input,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: colors.textPrimary
  },
  icon: {
    marginRight: 12
  },

  // Botones
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16
  },
  button: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginHorizontal: 4
  },
  saveBtn: {
    backgroundColor: colors.primary
  },
  cancelBtn: {
    backgroundColor: colors.disabled
  },
  buttonText: {
    color: colors.textButton,
    fontWeight: 'bold'
  },
  
  // Botón flotante
  floatingButton: {
    position: 'absolute',
    bottom: 80,
    right: 16,
    backgroundColor: colors.primary,
    borderRadius: 50,
    padding: 16,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 999
  },
  
  // Modales
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.overlay
  },
  modalContent: {
    width: '90%',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  modalTitle: {
    fontSize: 20,
    color: colors.textPrimary,
    fontWeight: 'bold'
  },
  
  // Listas
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1
  },
  emptyText: {
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 32
  },
});