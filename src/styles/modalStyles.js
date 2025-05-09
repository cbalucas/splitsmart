// src/styles/modalStyles.js
import { StyleSheet } from 'react-native';
import colors from './colors';

export default StyleSheet.create({
    // Estilos para el modal de advertencia de usuario invitado
    // Basados en los estilos de comingSoon del avatarMenuStyles
    guestWarningModalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    guestWarningModalContent: {
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
    guestWarningTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: colors.primary,
        marginBottom: 15,
        textAlign: 'center',
    },
    guestWarningMessage: {
        fontSize: 16,
        color: colors.textPrimary,
        textAlign: 'center',
        marginBottom: 20,
        lineHeight: 22,
    },
    guestWarningButton: {
        backgroundColor: colors.primary,
        paddingVertical: 10,
        paddingHorizontal: 25,
        borderRadius: 25,
        marginTop: 10,
    },
    guestWarningButtonText: {
        color: colors.textButton,
        fontWeight: 'bold',
        fontSize: 16,
    },
    guestWarningIcon: {
        marginBottom: 15,
    }
});
