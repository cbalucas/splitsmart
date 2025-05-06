// src/styles/avatarMenuStyles.js
import { StyleSheet } from 'react-native';
import colors from './colors';

export default StyleSheet.create({
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: colors.primary,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-start',
    },
    menuContainer: {
        position: 'absolute',
        top: 60,
        right: 20,
        backgroundColor: colors.card,
        borderRadius: 10,
        padding: 10,
        width: 280, // Aumentado de 220 a 280 para dar más espacio al contenido
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    menuHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    menuAvatar: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginRight: 10,
    },
    userName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.textPrimary,
        flexShrink: 1, // Permite que el texto se encoja si es demasiado largo
    },
    menuItemsContainer: {
        marginTop: 10,
    },
    menuItem: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    menuItemContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuItemText: {
        marginLeft: 10,
        fontSize: 16,
        color: colors.textPrimary,
    },
    submenu: {
        marginLeft: 30,
        marginTop: 5,
        marginBottom: 5,
    },
    submenuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        flexWrap: 'wrap', // Permite que los elementos se envuelvan si no caben
    },
    submenuText: {
        fontSize: 14,
        color: colors.textSecondary,
        marginLeft: 8,
    },
    submenuLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.textSecondary,
        marginLeft: 8,
        marginRight: 4,
    },
    submenuValue: {
        fontSize: 14,
        color: colors.textPrimary,
        flexShrink: 1,
        flex: 1, // Toma el espacio disponible restante
    },
    // Estilos para el modal informativo
    comingSoonModalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    comingSoonModalContent: {
        backgroundColor: colors.card,
        borderRadius: 12,
        padding: 20,
        width: '80%',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8,
        borderWidth: 2,
        borderColor: colors.primary,
    },
    comingSoonTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: colors.primary,
        marginBottom: 15,
        textAlign: 'center',
    },
    comingSoonMessage: {
        fontSize: 16,
        color: colors.textPrimary,
        textAlign: 'center',
        marginBottom: 20,
        lineHeight: 22,
    },
    comingSoonButton: {
        backgroundColor: colors.primary,
        paddingVertical: 10,
        paddingHorizontal: 25,
        borderRadius: 25,
        marginTop: 10,
    },
    comingSoonButtonText: {
        color: colors.textButton,
        fontWeight: 'bold',
        fontSize: 16,
    },
    comingSoonIcon: {
        marginBottom: 15,
    }
});