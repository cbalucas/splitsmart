// src/components/AvatarMenu.js
import React, { useState, useContext, useEffect } from 'react';
import { View, TouchableOpacity, Modal, Text, StyleSheet, Image, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons, FontAwesome, Ionicons } from '@expo/vector-icons';
import colors from '../styles/colors';
import { AuthContext } from '../context/AuthContext';
import { sampleUsers } from '../data/sampleData';

const AvatarMenu = ({ logout: propLogout }) => {
    const [menuVisible, setMenuVisible] = useState(false);
    const [expandedSection, setExpandedSection] = useState(null);
    const [userData, setUserData] = useState(null);
    const navigation = useNavigation();
    const { logout: contextLogout, user } = useContext(AuthContext);
    
    // Usar la función de logout que viene por prop, o si no, usar la del contexto
    const logout = propLogout || contextLogout;

    // Obtener los datos completos del usuario actual
    useEffect(() => {
        if (user) {
            if (user.isGuest) {
                // Si es un usuario invitado, usar los datos que vienen en el objeto user
                setUserData(user);
            } else {
                // Verificar si ya tenemos todos los datos necesarios en el objeto user
                if (user.userName && user.email !== undefined && user.celular !== undefined) {
                    setUserData(user);
                } else {
                    // Buscar el usuario por id, email o nombre de usuario
                    const currentUser = sampleUsers.find(u => 
                        u.id === user.id || 
                        u.email === user.email || 
                        u.usuario === user.userName
                    );
                    
                    if (currentUser) {
                        setUserData({
                            ...user,
                            nombre: currentUser.nombre || user.nombre,
                            userName: currentUser.usuario || user.userName,
                            email: currentUser.email || user.email,
                            celular: currentUser.celular || user.celular,
                            imagenProfile: currentUser.imagenProfile || user.imagenProfile
                        });
                    } else {
                        // Si no se encuentra, usar los datos que tenemos
                        setUserData(user);
                    }
                }
            }
        } else {
            // Datos predeterminados si no hay usuario autenticado
            setUserData({
                nombre: 'Usuario',
                userName: '',
                email: '',
                celular: '',
                imagenProfile: null
            });
        }
    }, [user]);

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

    // Usar la imagen de perfil del usuario o la imagen predeterminada
    const profileImage = userData?.imagenProfile || require('../assets/avatar.png');

    return (
        <View>
            <TouchableOpacity onPress={toggleMenu}>
                <Image 
                    source={profileImage} 
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
                                source={profileImage} 
                                style={styles.menuAvatar} 
                            />
                            <Text style={styles.userName}>{userData?.nombre || 'Usuario'}</Text>
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
                                        <View style={styles.submenuItem}>
                                            <Ionicons name="person" size={16} color={colors.secondary} />
                                            <Text style={styles.submenuLabel}>Usuario:</Text>
                                            <Text style={styles.submenuValue}>
                                                {userData?.isGuest ? 'INVITADO' : (userData?.userName || 'No disponible')}
                                            </Text>
                                        </View>
                                        <View style={styles.submenuItem}>
                                            <Ionicons name="mail" size={16} color={colors.secondary} />
                                            <Text style={styles.submenuLabel}>Email:</Text>
                                            <Text style={styles.submenuValue}>
                                                {userData?.isGuest ? '' : (userData?.email || 'No disponible')}
                                            </Text>
                                        </View>
                                        <View style={styles.submenuItem}>
                                            <Ionicons name="call" size={16} color={colors.secondary} />
                                            <Text style={styles.submenuLabel}>Celular:</Text>
                                            <Text style={styles.submenuValue}>
                                                {userData?.isGuest ? '' : (userData?.celular || 'No disponible')}
                                            </Text>
                                        </View>
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
                                            { icon: "person-outline", label: "Perfil" },
                                            { icon: "color-palette", label: "Tema" },
                                            { icon: "language", label: "Idioma" },
                                            { icon: "notifications", label: "Notificaciones" },
                                            { icon: "notifications", label: "Confirmacion de Acciones" }
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
});

export default AvatarMenu;