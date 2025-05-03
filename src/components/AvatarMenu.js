// src/components/AvatarMenu.js
import React, { useState, useContext } from 'react';
import { View, TouchableOpacity, Modal, Text, StyleSheet, Image, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons, FontAwesome, Ionicons } from '@expo/vector-icons';
import colors from '../styles/colors';
import { AuthContext } from '../context/AuthContext';

const AvatarMenu = ({ logout: propLogout }) => {
    const [menuVisible, setMenuVisible] = useState(false);
    const [expandedSection, setExpandedSection] = useState(null);
    const navigation = useNavigation();
    const { logout: contextLogout, user } = useContext(AuthContext);
    
    // Usar la función de logout que viene por prop, o si no, usar la del contexto
    const logout = propLogout || contextLogout;

    const toggleMenu = () => {
        setMenuVisible(!menuVisible);
        setExpandedSection(null); // Cerrar secciones expandidas al cerrar/abrir el menú
    };

    const toggleSection = (section) => {
        if (expandedSection === section) {
            setExpandedSection(null); // Cerrar si ya está abierto
        } else {
            setExpandedSection(section); // Abrir la nueva sección
        }
    };

    const handleNavigateToProfile = () => {
        setMenuVisible(false);
        navigation.navigate('EditProfile');
    };

    const handleNavigateToSettings = () => {
        setMenuVisible(false);
        navigation.navigate('Settings');
    };

    const handleLogout = async () => {
        setMenuVisible(false);
        await logout();
    };

    // Acciones temporales para las opciones de submenú
    const handleSubMenuAction = (category, option) => {
        setMenuVisible(false);
        console.log(`Seleccionado: ${category} - ${option}`);
        
        // Aquí puedes implementar las navegaciones específicas o acciones
        // según la opción seleccionada
    };

    return (
        <View>
            <TouchableOpacity onPress={toggleMenu}>
                <Image 
                    source={require('../assets/avatar.png')} 
                    style={styles.avatar} 
                />
            </TouchableOpacity>

            <Modal
                transparent={true}
                visible={menuVisible}
                animationType="fade"
                onRequestClose={() => setMenuVisible(false)}
            >
                <Pressable 
                    style={styles.modalOverlay} 
                    onPress={() => setMenuVisible(false)}
                >
                    <View 
                        style={styles.menuContainer}
                        onStartShouldSetResponder={() => true}
                        onTouchEnd={(e) => e.stopPropagation()}
                    >
                        {/* Header con avatar y nombre de usuario */}
                        <View style={styles.menuHeader}>
                            <Image 
                                source={require('../assets/avatar.png')} 
                                style={styles.menuAvatar} 
                            />
                            <Text style={styles.userName}>{user?.displayName || 'Usuario'}</Text>
                        </View>

                        {/* Menu Items */}
                        <View style={styles.menuItemsContainer}>
                            {/* Perfil con submenú */}
                            <View>
                                <TouchableOpacity 
                                    style={styles.menuItem} 
                                    onPress={() => toggleSection('profile')}
                                >
                                    <View style={styles.menuItemContent}>
                                        <FontAwesome name="user-circle" size={20} color={colors.primary} />
                                        <Text style={styles.menuItemText}>Perfil</Text>
                                        <Ionicons 
                                            name={expandedSection === 'profile' ? "chevron-up" : "chevron-down"} 
                                            size={16} 
                                            color={colors.textSecondary} 
                                            style={{marginLeft: 'auto'}}
                                        />
                                    </View>
                                </TouchableOpacity>
                                
                                {/* Submenú de Perfil */}
                                {expandedSection === 'profile' && (
                                    <View style={styles.submenu}>
                                        {[
                                            { icon: "image", label: "Imagen" },
                                            { icon: "person", label: "Usuario" },
                                            { icon: "mail", label: "Email" },
                                            { icon: "call", label: "Celular" }
                                        ].map((item, index) => (
                                            <TouchableOpacity 
                                                key={index} 
                                                style={styles.submenuItem}
                                                onPress={() => handleSubMenuAction('Profile', item.label)}
                                            >
                                                <Ionicons name={item.icon} size={16} color={colors.secondary} />
                                                <Text style={styles.submenuText}>{item.label}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                )}
                            </View>
                            
                            {/* Configuración con submenú */}
                            <View>
                                <TouchableOpacity 
                                    style={styles.menuItem} 
                                    onPress={() => toggleSection('settings')}
                                >
                                    <View style={styles.menuItemContent}>
                                        <Ionicons name="settings-outline" size={20} color={colors.primary} />
                                        <Text style={styles.menuItemText}>Configuración</Text>
                                        <Ionicons 
                                            name={expandedSection === 'settings' ? "chevron-up" : "chevron-down"} 
                                            size={16} 
                                            color={colors.textSecondary} 
                                            style={{marginLeft: 'auto'}}
                                        />
                                    </View>
                                </TouchableOpacity>
                                
                                {/* Submenú de Configuración */}
                                {expandedSection === 'settings' && (
                                    <View style={styles.submenu}>
                                        {[
                                            { icon: "color-palette", label: "Tema" },
                                            { icon: "language", label: "Idioma" },
                                            { icon: "notifications", label: "Notificaciones" }
                                        ].map((item, index) => (
                                            <TouchableOpacity 
                                                key={index} 
                                                style={styles.submenuItem}
                                                onPress={() => handleSubMenuAction('Settings', item.label)}
                                            >
                                                <Ionicons name={item.icon} size={16} color={colors.secondary} />
                                                <Text style={styles.submenuText}>{item.label}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                )}
                            </View>
                            
                            {/* Salir (sin submenú) */}
                            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
                                <View style={styles.menuItemContent}>
                                    <MaterialIcons name="logout" size={20} color={colors.danger} />
                                    <Text style={[styles.menuItemText, {color: colors.danger}]}>Cerrar Sesión</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Pressable>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
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
        width: 220,
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
    },
    submenuText: {
        fontSize: 14,
        color: colors.textSecondary,
        marginLeft: 8,
    },
});

export default AvatarMenu;