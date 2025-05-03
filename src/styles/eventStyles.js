// Estilos específicos para la pantalla de creación y edición de eventos
import { StyleSheet } from 'react-native';
import colors from './colors';

export default StyleSheet.create({
  // Título de la página
  pageTitle: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16
  },
  
  // Switch de WhatsApp
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  switchLabel: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 16
  },
  
  // Calendario
  calIcon: {
    marginLeft: 8
  },
  
  // Footer y botones
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 16
  },
  button: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center'
  },
  buttonPrimary: {
    backgroundColor: colors.primary,
    marginLeft: 8
  },
  buttonDisabled: {
    backgroundColor: colors.disabled,
    marginRight: 8
  },
  buttonText: {
    color: colors.textButton,
    fontSize: 16,
    fontWeight: 'bold'
  },
  
  // Secciones para participantes
  partHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 8
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1
  },
  toggleListButton: {
    padding: 4
  },
  addIconButton: {
    padding: 4,
    marginLeft: 8
  },
  
  // Lista de participantes
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
  
  // Modal de participantes
  addListOverlay: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: colors.overlay
  },
  addListTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12
  },
  addListSearchInput: {
    backgroundColor: colors.input,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: colors.textPrimary,
    marginBottom: 8
  },
  addListClose: {
    backgroundColor: colors.disabled,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 8
  },
  addListCloseText: {
    color: colors.textPrimary,
    fontWeight: 'bold'
  }
});