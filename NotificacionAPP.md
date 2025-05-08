# 📱 Lista Completa de Notificaciones en SplitSmart

Este documento proporciona un inventario completo de todas las notificaciones, alertas y mensajes de estado implementados en la aplicación SplitSmart.

## 1. Notificaciones de Operación (Alerts de éxito)

| Pantalla | Mensaje | Descripción | Disparador |
|----------|---------|-------------|------------|
| **SettingsScreen** | "Éxito", "Tema actualizado correctamente" | Confirmación de cambio de tema | Al guardar cambios de tema |
| **SettingsScreen** | "Éxito", "Idioma actualizado correctamente" | Confirmación de cambio de idioma | Al guardar cambios de idioma |
| **SettingsScreen** | "Éxito", "Configuración de notificaciones guardada correctamente" | Confirmación de ajustes guardados | Al guardar configuración de notificaciones |
| **SettingsScreen** | "Éxito", "Perfil actualizado correctamente" | Confirmación de actualización de datos personales | Al guardar cambios en el perfil |
| **ParticipantsScreen** | "Éxito", "Participante agregado correctamente" | Confirmación de creación de participante | Al agregar un nuevo participante |
| **ParticipantsScreen** | "Éxito", "Participante actualizado correctamente" | Confirmación de edición de datos | Al modificar información de un participante |
| **SignUpScreen** | "Registro exitoso", "¡Tu cuenta ha sido creada con éxito!" | Confirmación de registro completado | Al finalizar el proceso de registro |

## 2. Notificaciones de Error

| Pantalla | Mensaje | Descripción | Disparador |
|----------|---------|-------------|------------|
| **HomeScreen** | "Error", "Por favor, completa el título y la fecha del evento." | Validación de campos obligatorios | Al intentar guardar un evento sin completar campos requeridos |
| **CreateEventScreen** | "Error", "Por favor, completa el título y la fecha del evento." | Validación de campos obligatorios | Al intentar crear un evento sin completar campos requeridos |
| **CreateExpenseScreen** | "Error", "Por favor, completa los campos obligatorios correctamente." | Validación de campos obligatorios | Al intentar guardar un gasto sin completar campos requeridos |
| **ParticipantsScreen** | "Error", "Por favor, completa el nombre del participante" | Validación de campos obligatorios | Al intentar guardar un participante sin nombre |
| **ParticipantsScreen** | "Error", "El nombre es obligatorio" | Validación de campos obligatorios | Al editar un participante y dejar el nombre vacío |
| **ParticipantsScreen** | "Error", "No se pudo agregar el participante" | Error en la operación | Cuando falla la adición de un participante |
| **ParticipantsScreen** | "Error", "Ocurrió un error al agregar el participante" | Error general | Cuando ocurre una excepción al agregar un participante |
| **ParticipantsScreen** | "Error", "No se pudo actualizar el participante" | Error en la operación | Cuando falla la actualización de un participante |
| **ParticipantsScreen** | "Error", "Ocurrió un error al actualizar el participante" | Error general | Cuando ocurre una excepción al actualizar un participante |
| **SettingsScreen** | "Error", "Las contraseñas no coinciden" | Validación de contraseña | Al cambiar contraseña con confirmación incorrecta |
| **SettingsScreen** | "Error", "No se pudo actualizar el perfil" | Error en la operación | Cuando falla la actualización del perfil |
| **SignUpScreen** | "Error de registro", [Lista de errores] | Validación de múltiples campos | Al intentar registrarse con datos inválidos |

## 3. Notificaciones de Confirmación de Acciones

| Pantalla | Descripción | Disparador |
|----------|-------------|------------|
| **ParticipantsScreen** | Eliminación de participantes | Al intentar eliminar un participante (verificaciones mencionadas en CORECCIONES_Y_MEJORAS.md) |
| **CreateExpenseScreen** | Eliminar un gasto | Al presionar el ícono de basura en un gasto |
| **ExpenseSummaryScreen** | Marcar o desmarcar un pago | Al cambiar el estado de un pago en el modal de pago |

## 4. Notificaciones "Próximamente"

| Pantalla | Mensaje | Disparador |
|----------|---------|------------|
| **AvatarMenu** | "¡Próximamente!", "La función '[feature]' estará disponible en futuras actualizaciones. Estamos trabajando para mejorar tu experiencia." | Al seleccionar funciones que aún no están implementadas, como edición de email o teléfono desde el menú |

## 5. Indicadores Visuales de Estado

| Pantalla | Tipo | Descripción | Ubicación |
|----------|------|-------------|-----------|
| **ExpenseSummaryScreen** | Indicador de pago | Muestra un ícono de checkmark y texto "Pagado" | En la lista de pagos cuando un pago está marcado como completado |
| **HomeScreen** | Indicadores de color | Diferentes colores para iconos según el estado (activo/inactivo) | Iconos de acción en tarjetas de eventos |
| **ParticipantsScreen** | Contador de participantes | Muestra la cantidad de personas que representa un participante | En la vista detalle del participante |
| **SettingsScreen** | Checkbox de tema | Muestra un indicador visual del tema seleccionado | En el modal de selección de tema |
| **SettingsScreen** | Flag de idioma | Muestra un indicador visual del idioma seleccionado | En el modal de selección de idioma |

## 6. Mensajes de Validación en Tiempo Real

| Pantalla | Tipo | Descripción | Ubicación |
|----------|------|-------------|-----------|
| **SignUpScreen** | Validación de username | Mensajes de error bajo el campo | Al ingresar un nombre de usuario inválido o duplicado |
| **SignUpScreen** | Validación de email | Mensajes de error bajo el campo | Al ingresar un email con formato inválido o duplicado |
| **SignUpScreen** | Validación de contraseña | Indicador visual de fortaleza de contraseña | Al ingresar una contraseña |
| **SignUpScreen** | Validación de coincidencia | Mensaje de error si las contraseñas no coinciden | Al ingresar la confirmación de contraseña |

## 7. Notificaciones de Compartir

| Pantalla | Descripción | Disparador |
|----------|-------------|------------|
| **ExpenseSummaryScreen** | Compartir resumen de gastos y pagos | Al presionar el botón de compartir, se genera un texto formateado para WhatsApp |

## 8. Estados Visuales de Formularios

| Pantalla | Descripción | Ubicación |
|----------|-------------|-----------|
| **HomeScreen** | Campos con borde rojo | Inputs requeridos no completados |
| **CreateEventScreen** | Campos con borde rojo | Inputs requeridos no completados |
| **CreateExpenseScreen** | Campos con borde rojo | Inputs requeridos no completados |
| **ParticipantsScreen** | Campos con borde rojo | Inputs requeridos no completados |
| **SignUpScreen** | Campos con borde rojo | Inputs con validación fallida |

## 9. Configuración de Notificaciones

La aplicación permite al usuario configurar qué tipos de notificaciones desea recibir desde la pantalla de Configuración:

- **Notificaciones de operación** - Por ejemplo: "Se eliminó correctamente el gasto"
- **Confirmación de acciones** - Por ejemplo: "¿Seguro que desea eliminar el participante?"
- **Notificaciones "Próximamente"** - Avisos sobre funcionalidades futuras
- **Mensajes de error** - Alertas de validación y errores en formularios
- **Estado de pagos** - Notificaciones sobre cambios en el estado de los pagos

## Notas adicionales

La aplicación también muestra tooltips y mensajes informativos:
- Indicadores de modalidad (edición vs visualización)
- Etiquetas con descripciones en la configuración
- Texto explicativo sobre cambios de tema e idioma
- Mensajes de "no hay datos" en visualizaciones vacías
