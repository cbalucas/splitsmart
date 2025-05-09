// src/components/AvatarMenu.js
import React, { useState, useContext, useEffect } from 'react';
import { View, TouchableOpacity, Modal, Text, Image, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons, FontAwesome, Ionicons } from '@expo/vector-icons';
import colors from '../styles/colors';
import styles from '../styles/avatarMenuStyles';
import { AuthContext } from '../context/AuthContext';
import { sampleUsers } from '../data/sampleData';

const AvatarMenu = ({ logout: propLogout }) => {    const [menuVisible, setMenuVisible] = useState(false);
    const [expandedSection, setExpandedSection] = useState(null);
    const [userData, setUserData] = useState(null);
    const [comingSoonModal, setComingSoonModal] = useState(false);
    const [comingSoonFeature, setComingSoonFeature] = useState('');
    const [guestWarningModal, setGuestWarningModal] = useState(false);
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
    };    const handleNavigateToSettings = () => {
        setMenuVisible(false);
        // Si es un usuario invitado, mostrar la advertencia en lugar de navegar
        if (user?.isGuest) {
            // Mostrar modal de advertencia específico para invitado
            showGuestWarningModal();
        } else {
            navigation.navigate('Settings');
        }
    };

    const handleLogout = async () => {
        setMenuVisible(false);
        await logout();
    };    // Función para mostrar el modal "Próximamente"
    const showComingSoonModal = (feature) => {
        setComingSoonFeature(feature);
        setMenuVisible(false); // Cerrar el menú
        setComingSoonModal(true); // Mostrar el modal
    };
    
    // Función para mostrar el modal de advertencia para usuarios invitados
    const showGuestWarningModal = () => {
        setMenuVisible(false); // Cerrar el menú
        setGuestWarningModal(true); // Mostrar el modal
    };

    // Gestionar el clic en las opciones del submenú de perfil
    const handleProfileItemClick = (item) => {
        showComingSoonModal(`Edición de ${item}`);
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
                        <View style={styles.menuItemsContainer}>                            {/* Perfil con submenú */}
                            <View>
                                <TouchableOpacity 
                                    style={styles.menuItem} 
                                    onPress={() => {
                                        // Si es invitado, no permitir expandir el submenú
                                        if (!userData?.isGuest) {
                                            toggleSection('profile');
                                        }
                                    }}
                                >
                                    <View style={styles.menuItemContent}>
                                        <FontAwesome name="user-circle" size={20} color={colors.primary} />
                                        <Text style={styles.menuItemText}>Perfil</Text>
                                        {!userData?.isGuest && (
                                            <Ionicons 
                                                name={expandedSection === 'profile' ? "chevron-up" : "chevron-down"} 
                                                size={16} 
                                                color={colors.textSecondary} 
                                                style={{marginLeft: 'auto'}}
                                            />
                                        )}
                                    </View>
                                </TouchableOpacity>
                                
                                {/* Para usuario invitado, mostrar solo el nombre de usuario */}
                                {userData?.isGuest && (
                                    <View style={styles.submenu}>
                                        <View style={styles.submenuItem}>
                                            <Ionicons name="person" size={16} color={colors.secondary} />
                                            <Text style={styles.submenuLabel}>Usuario:</Text>
                                            <Text style={styles.submenuValue}>INVITADO</Text>
                                        </View>
                                    </View>
                                )}
                                
                                {/* Submenú de Perfil para usuarios registrados */}
                                {expandedSection === 'profile' && !userData?.isGuest && (
                                    <View style={styles.submenu}>
                                        <View style={styles.submenuItem}>
                                            <Ionicons name="person" size={16} color={colors.secondary} />
                                            <Text style={styles.submenuLabel}>Usuario:</Text>
                                            <Text style={styles.submenuValue}>
                                                {userData?.userName || 'No disponible'}
                                            </Text>
                                        </View>
                                        <TouchableOpacity 
                                            style={styles.submenuItem}
                                            onPress={() => handleProfileItemClick('email')}
                                        >
                                            <Ionicons name="mail" size={16} color={colors.secondary} />
                                            <Text style={styles.submenuLabel}>Email:</Text>
                                            <Text style={styles.submenuValue}>
                                                {userData?.email || 'No disponible'}
                                            </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity 
                                            style={styles.submenuItem}
                                            onPress={() => handleProfileItemClick('teléfono')}
                                        >                                            <Ionicons name="call" size={16} color={colors.secondary} />
                                            <Text style={styles.submenuLabel}>Celular:</Text>
                                            <Text style={styles.submenuValue}>
                                                {userData?.celular || 'No disponible'}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </View>
                            
                            {/* Configuración (sin submenú) */}
                            <TouchableOpacity 
                                style={styles.menuItem} 
                                onPress={handleNavigateToSettings}
                            >
                                <View style={styles.menuItemContent}>
                                    <Ionicons name="settings-outline" size={20} color={colors.primary} />
                                    <Text style={styles.menuItemText}>Configuración</Text>
                                </View>
                            </TouchableOpacity>
                            
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

            {/* Modal Próximamente */}
            <Modal
                transparent={true}
                visible={comingSoonModal}
                animationType="fade"
                onRequestClose={() => setComingSoonModal(false)}
            >
                <Pressable 
                    style={styles.comingSoonModalOverlay} 
                    onPress={() => setComingSoonModal(false)}
                >
                    <View 
                        style={styles.comingSoonModalContent}
                        onStartShouldSetResponder={() => true}
                        onTouchEnd={(e) => e.stopPropagation()}
                    >
                        <Ionicons 
                            name="rocket-outline" 
                            size={60} 
                            color={colors.primary} 
                            style={styles.comingSoonIcon}
                        />
                        <Text style={styles.comingSoonTitle}>¡Próximamente!</Text>
                        <Text style={styles.comingSoonMessage}>
                            La función "{comingSoonFeature}" estará disponible en futuras actualizaciones. 
                            Estamos trabajando para mejorar tu experiencia.
                        </Text>
                        <TouchableOpacity 
                            style={styles.comingSoonButton}
                            onPress={() => setComingSoonModal(false)}
                        >
                            <Text style={styles.comingSoonButtonText}>Entendido</Text>                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Modal>

            {/* Modal de advertencia para usuarios invitados */}
            <Modal
                transparent={true}
                visible={guestWarningModal}
                animationType="fade"
                onRequestClose={() => setGuestWarningModal(false)}
            >
                <Pressable 
                    style={styles.comingSoonModalOverlay} 
                    onPress={() => setGuestWarningModal(false)}
                >
                    <View 
                        style={styles.comingSoonModalContent}
                        onStartShouldSetResponder={() => true}
                        onTouchEnd={(e) => e.stopPropagation()}
                    >
                        <Ionicons 
                            name="lock-closed-outline" 
                            size={60} 
                            color={colors.primary} 
                            style={styles.comingSoonIcon}
                        />
                        <Text style={styles.comingSoonTitle}>Acceso restringido</Text>
                        <Text style={styles.comingSoonMessage}>
                            No se puede acceder por haberse logeado como invitado.
                        </Text>
                        <TouchableOpacity 
                            style={styles.comingSoonButton}
                            onPress={() => setGuestWarningModal(false)}
                        >
                            <Text style={styles.comingSoonButtonText}>Entendido</Text>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Modal>
        </View>
    );
};

export default AvatarMenu;