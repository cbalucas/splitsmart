// src/components/AvatarMenu.js
import React, { useState, useContext, useEffect } from 'react';
import { View, TouchableOpacity, Modal, Text, Image, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons, FontAwesome, Ionicons } from '@expo/vector-icons';
import colors from '../styles/colors';
import styles from '../styles/avatarMenuStyles';
import { AuthContext } from '../context/AuthContext';
import { sampleUsers } from '../data/sampleData';

const AvatarMenu = ({ logout: propLogout }) => {
    const [menuVisible, setMenuVisible] = useState(false);
    const [expandedSection, setExpandedSection] = useState(null);
    const [userData, setUserData] = useState(null);
    const [comingSoonModal, setComingSoonModal] = useState(false);
    const [comingSoonFeature, setComingSoonFeature] = useState('');
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

    const handleNavigateToSettings = () => {
        // En lugar de navegar, mostrar el modal
        showComingSoonModal('Configuración');
    };

    const handleLogout = async () => {
        setMenuVisible(false);
        await logout();
    };

    // Función para mostrar el modal "Próximamente"
    const showComingSoonModal = (feature) => {
        setComingSoonFeature(feature);
        setMenuVisible(false); // Cerrar el menú
        setComingSoonModal(true); // Mostrar el modal
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
                                        <TouchableOpacity 
                                            style={styles.submenuItem}
                                            onPress={() => handleProfileItemClick('email')}
                                        >
                                            <Ionicons name="mail" size={16} color={colors.secondary} />
                                            <Text style={styles.submenuLabel}>Email:</Text>
                                            <Text style={styles.submenuValue}>
                                                {userData?.isGuest ? '' : (userData?.email || 'No disponible')}
                                            </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity 
                                            style={styles.submenuItem}
                                            onPress={() => handleProfileItemClick('teléfono')}
                                        >
                                            <Ionicons name="call" size={16} color={colors.secondary} />
                                            <Text style={styles.submenuLabel}>Celular:</Text>
                                            <Text style={styles.submenuValue}>
                                                {userData?.isGuest ? '' : (userData?.celular || 'No disponible')}
                                            </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity 
                                            style={[styles.submenuItem, {marginTop: 8}]}
                                            onPress={() => showComingSoonModal('Editar perfil')}
                                        >
                                            <Ionicons name="create-outline" size={16} color={colors.primary} />
                                            <Text style={{...styles.submenuText, color: colors.primary, fontWeight: 'bold'}}>
                                                Editar perfil
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </View>
                            
                            {/* Configuración */}
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
                                            { icon: "person-outline", label: "Perfil", feature: "Configuración de perfil" },
                                            { icon: "color-palette", label: "Tema", feature: "Configuración de tema" },
                                            { icon: "language", label: "Idioma", feature: "Configuración de idioma" },
                                            { icon: "notifications", label: "Notificaciones", feature: "Configuración de notificaciones" },
                                            { icon: "alert-circle-outline", label: "Confirmación de Acciones", feature: "Configuración de confirmación de acciones" }
                                        ].map((item, index) => (
                                            <TouchableOpacity 
                                                key={index} 
                                                style={styles.submenuItem}
                                                onPress={() => showComingSoonModal(item.feature)}
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
                            <Text style={styles.comingSoonButtonText}>Entendido</Text>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Modal>
        </View>
    );
};

export default AvatarMenu;