# 🏷️ Documentación de Labels en SplitSmart

Este documento proporciona un inventario detallado de todas las etiquetas (labels) utilizadas en la aplicación SplitSmart, organizadas por tipo y pantalla donde aparecen.

## 1. Títulos de Pantalla (HeaderTitle)

| Pantalla | Título | Descripción |
|----------|--------|-------------|
| **AppNavigator** | `Gastos del Evento` | Título de la pantalla de creación/edición de gastos |
| **AppNavigator** | `Nuevo Evento` | Título de la pantalla para crear eventos |
| **AppNavigator** | `Resumen` | Título de la pantalla de resumen de gastos |
| **AppNavigator** | `Configuración` | Título de la pantalla de configuración |
| **ExpenseSummaryScreen** | `RESUMEN DE GASTOS Y PAGOS` | Título principal del resumen de gastos |

## 2. Títulos de Sección (SectionTitle)

| Pantalla | Título | Descripción |
|----------|--------|-------------|
| **SettingsScreen** | `Cambiar Número de Teléfono` | Sección para modificar el teléfono de contacto |
| **SettingsScreen** | `Cambiar Contraseña` | Sección para modificar la contraseña de acceso |
| **SettingsScreen** | `Características` | Sección en "Acerca de" que lista funcionalidades |
| **SettingsScreen** | `Desarrolladores` | Sección que muestra información del equipo |
| **SettingsScreen** | `Contáctanos` | Sección con información de contacto |
| **SettingsScreen** | `Términos y Políticas` | Sección con información legal |
| **HomeScreen** | `Participantes (N)` | Título de la sección de participantes en detalle de evento |
| **HomeScreen** | `Gastos (N)` | Título de la sección de gastos en detalle de evento |
| **ExpenseSummaryScreen** | `LISTA DE GASTOS` | Título de la sección que lista los gastos |
| **ExpenseSummaryScreen** | `GASTOS POR PERSONA` | Título de la sección con gastos individualizados |
| **ExpenseSummaryScreen** | `PARTICIPANTES` | Título de la sección de participantes |
| **ExpenseSummaryScreen** | `PAGOS A REALIZAR` | Título de la sección de pagos pendientes |

## 3. Títulos de Modal (ModalTitle)

| Pantalla | Título | Descripción |
|----------|--------|-------------|
| **SettingsScreen** | `Editar Perfil` | Modal para modificar datos personales |
| **SettingsScreen** | `Configurar Notificaciones` | Modal para ajustar preferencias de notificaciones |
| **SettingsScreen** | `Seleccionar tema` | Modal para elegir tema visual |
| **SettingsScreen** | `Seleccionar idioma` | Modal para elegir idioma de la aplicación |
| **SettingsScreen** | `Acerca de SplitSmart` | Modal con información sobre la aplicación |
| **HomeScreen** | `Detalle Evento` / `Editar Evento` | Modal para ver/editar detalles de un evento |
| **HomeScreen** | `Nuevo Evento` | Modal para crear un evento |
| **ParticipantsScreen** | `Crear Participante` | Modal para añadir un participante |
| **ParticipantsScreen** | `Editar Participante` / `Detalle del Participante` | Modal para ver/editar un participante |
| **ExpenseSummaryScreen** | `Estado del Pago` | Modal para actualizar estado del pago |
| **CreateExpenseScreen** | `Carga de Gasto` | Modal para añadir un gasto |
| **CreateExpenseScreen** | `Seleccionar Participante` | Modal para elegir quién pagó |
| **CreateExpenseScreen** | `Editar Gasto` / `Detalle de Gasto` | Modal para ver/editar un gasto |

## 4. Placeholders de Campo (TextInput Placeholders)

| Pantalla | Placeholder | Descripción |
|----------|------------|-------------|
| **HomeScreen** | `Buscar evento` | Campo de búsqueda de eventos |
| **HomeScreen** | `Nombre del evento` | Campo para nombre del evento |
| **HomeScreen** | `YYYY-MM-DD` | Campo para fecha del evento |
| **HomeScreen** | `Dirección` | Campo para dirección del evento |
| **HomeScreen** | `Mapa URL` | Campo para enlace al mapa de ubicación |
| **HomeScreen** | `Título *` | Campo obligatorio para título del evento |
| **HomeScreen** | `Fecha (YYYY-MM-DD) *` | Campo obligatorio para fecha del evento |
| **CreateExpenseScreen** | `Buscar gasto` | Campo de búsqueda de gastos |
| **CreateExpenseScreen** | `Descripción *` | Campo obligatorio para descripción del gasto |
| **CreateExpenseScreen** | `Monto *` | Campo obligatorio para el valor del gasto |
| **CreateExpenseScreen** | `Buscar participante...` | Campo para buscar participante que pagó |
| **SettingsScreen** | `Número de teléfono` | Campo para actualizar teléfono |
| **SettingsScreen** | `Contraseña actual` | Campo para verificar contraseña actual |
| **SettingsScreen** | `Nueva contraseña` | Campo para nueva contraseña |
| **SettingsScreen** | `Confirmar nueva contraseña` | Campo para confirmar la nueva contraseña |
| **LoginScreen** | `Email o Usuario` | Campo para identificador de inicio de sesión |
| **LoginScreen** | `Contraseña` | Campo para contraseña |
| **SignUpScreen** | `Ingresa tu nombre de usuario` | Campo para crear nombre de usuario |

## 5. Texto de Botones (ButtonText)

| Pantalla | Texto | Descripción |
|----------|-------|-------------|
| **HomeScreen** | `Crear primer evento` | Botón para crear el primer evento cuando no hay eventos |
| **HomeScreen** | `Cerrar` | Botón para cerrar modal |
| **HomeScreen** | `Guardar` | Botón para guardar cambios |
| **HomeScreen** | `Cancelar` | Botón para cancelar operación |
| **LoginScreen** | `Iniciar Sesión` | Botón principal de inicio de sesión |
| **LoginScreen** | `Continuar con Google` | Botón para login con cuenta Google |
| **SignUpScreen** | `Registrarme` | Botón para completar el registro |
| **SettingsScreen** | `Cerrar` | Botón para cerrar modal |
| **SettingsScreen** | `Guardar` | Botón para guardar cambios |
| **SettingsScreen** | `Cancelar` | Botón para cancelar operación |
| **ParticipantsScreen** | `Guardar` | Botón para guardar participante |
| **ParticipantsScreen** | `Cancelar` | Botón para cancelar creación/edición |

## 6. Etiquetas de Estado (Status Labels)

| Pantalla | Etiqueta | Descripción |
|----------|----------|-------------|
| **HomeScreen** | `c/u $X.XX` | Muestra el costo por persona |
| **HomeScreen** | `$X,XXX` | Muestra el total del evento |
| **ExpenseSummaryScreen** | `Pagado` | Estado de pago completado |
| **ExpenseSummaryScreen** | `Pendiente` | Estado de pago sin realizar |
| **ParticipantsScreen** | `(N)` | Indicador de cantidad de personas representadas |

## 7. Etiquetas Informativas

| Pantalla | Etiqueta | Descripción |
|----------|----------|-------------|
| **HomeScreen** | `No se encontraron eventos que coincidan con tu búsqueda` | Mensaje cuando no hay resultados de búsqueda |
| **HomeScreen** | `No hay eventos disponibles` | Mensaje cuando no hay eventos creados |
| **CreateExpenseScreen** | `No se encontraron gastos` | Mensaje cuando no hay gastos registrados |
| **ParticipantsScreen** | `No hay participantes registrados` | Mensaje cuando el evento no tiene participantes |
| **ExpenseSummaryScreen** | `No hay gastos registrados` | Mensaje cuando no hay gastos para resumir |
| **ExpenseSummaryScreen** | `Total: $X,XXX` | Total de gastos acumulados |
| **ExpenseSummaryScreen** | `Promedio por persona: $X,XXX` | Costo promedio por persona |

## 8. Etiquetas de Campos (Field Labels)

| Pantalla | Etiqueta | Descripción |
|----------|----------|-------------|
| **HomeScreen** | `Envío por WhatsApp:` | Etiqueta del switch de WhatsApp |
| **SettingsScreen** | `Tema:` | Etiqueta para selección de tema |
| **SettingsScreen** | `Idioma:` | Etiqueta para selección de idioma |
| **SettingsScreen** | `Recibir notificaciones:` | Etiqueta para toggle de notificaciones |
| **SettingsScreen** | `Modo Oscuro:` | Etiqueta para toggle de modo oscuro |
| **ParticipantsScreen** | `Nombre:` | Etiqueta para nombre de participante |
| **ParticipantsScreen** | `CBU/Alias:` | Etiqueta para datos bancarios |
| **ParticipantsScreen** | `Cantidad de personas:` | Etiqueta para indicar cuántas personas representa |

## 9. Indicadores de Navegación

| Pantalla | Indicador | Descripción |
|----------|-----------|-------------|
| **AppTabs** | `Inicio` | Etiqueta de la pestaña principal |
| **AppTabs** | `Participantes` | Etiqueta de la pestaña de participantes |
| **AppTabs** | `Perfil` | Etiqueta de la pestaña de perfil/configuración |

## 10. Etiquetas de Validación

| Pantalla | Etiqueta | Descripción |
|----------|----------|-------------|
| **SignUpScreen** | `El nombre de usuario es requerido` | Validación de campo obligatorio |
| **SignUpScreen** | `El nombre de usuario ya está en uso` | Validación de unicidad |
| **SignUpScreen** | `El formato del email es inválido` | Validación de formato |
| **CreateExpenseScreen** | `El monto debe ser un número positivo` | Validación de monto |
| **CreateEventScreen** | `El título es obligatorio` | Validación de campo obligatorio |
| **SettingsScreen** | `Las contraseñas no coinciden` | Validación de coincidencia |

## Notas sobre implementación y mejoras futuras

- Los labels están definidos directamente en los archivos de componentes, no se utiliza un sistema centralizado de i18n
- Para futuras versiones se recomienda implementar un sistema de internacionalización como i18n o react-intl
- Para mejorar la accesibilidad, asegurar que todos los elementos tengan sus respectivas etiquetas accesibles
- Mantener la consistencia visual y textual entre las diferentes pantallas
