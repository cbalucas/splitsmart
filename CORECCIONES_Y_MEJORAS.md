# SplitSmart: Plan de Correcciones y Mejoras

## 📋 Cómo utilizar este documento

Este documento está organizado por categorías y prioridades. Para cada tarea se incluye:

- **ID**: Identificador único para referencia rápida
- **Descripción**: Explicación detallada del problema o mejora
- **Prioridad**: Alta (🔴), Media (🟡), Baja (🟢)
- **Estado**: Pendiente (📝), En progreso (⏳), Completado (✅), Cancelado (❌)
- **Estimación**: Tiempo estimado para completar (horas/días)
- **Asignado a**: Persona responsable de la tarea
- **Notas**: Comentarios adicionales, dependencias o soluciones propuestas

## 🚀 Correcciones Urgentes

| ID    | Descripción | Prioridad | Estado | Estimación | Asignado a | Notas |
|-------|------------|-----------|--------|------------|------------|-------|
| CU-01 | Al presionar el botón volver del celular, se debe dirigir a HOME y no a la pantalla anterior | 🔴 | 📝 | 2h | | Modificar NavigationContainerRef |
| CU-02 | El botón inferior de Participantes redirecciona incorrectamente cuando se viene de ver participantes de un evento específico | 🔴 | 📝 | 3h | | Verificar parámetros de navegación |
| CU-03 | Restablecer estilos perdidos durante la separación de estilo y funcionalidad | 🔴 | 📝 | 4h | | Revisar cada componente afectado |

## 🛠️ Mejoras de Experiencia de Usuario 

| ID    | Descripción | Prioridad | Estado | Estimación | Asignado a | Notas |
|-------|------------|-----------|--------|------------|------------|-------|
| UX-01 | Nuevo evento tenga el formato de + de gastos y participantes | 🟡 | 📝 | 4h | | Unificar experiencia de creación |
| UX-02 | Definir campos obligatorios en formularios (Eventos/Gastos/Participantes) | 🟡 | 📝 | 3h | | Añadir validaciones y marcas visuales |
| UX-03 | Mejorar división de gastos por participantes específicos | 🟡 | 📝 | 6h | | Implementar selector múltiple de participantes |

## 📊 Nuevas Funcionalidades

| ID    | Descripción | Prioridad | Estado | Estimación | Asignado a | Notas |
|-------|------------|-----------|--------|------------|------------|-------|
| NF-01 | Exportación de informes de gastos (PDF, CSV) | 🟢 | 📝 | 8h | | Investigar react-native-pdf y opciones de exportación |
| NF-02 | Sistema de pagos entre participantes | 🟢 | 📝 | 12h | | Crear modelo de saldos y flujo de pagos |

## ⚙️ Configuración y Perfil

| ID    | Descripción | Prioridad | Estado | Estimación | Asignado a | Notas |
|-------|------------|-----------|--------|------------|------------|-------|
| CFG-01 | Implementar tema oscuro/claro con selector | 🟡 | 📝 | 6h | | Usar Context API para el tema |
| CFG-02 | Soporte multiidioma (Spa/Eng/Por/Fra/Ita) | 🟢 | 📝 | 8h | | Implementar i18n con archivos de traducción |
| CFG-03 | Funcionalidad de cambio de contraseña | 🟡 | 📝 | 3h | | Añadir validación de contraseña actual |
| CFG-04 | Edición de perfil (nombre, imagen, etc.) | 🟡 | 📝 | 5h | | Incluir selector/captura de imagen |

## 📱 Optimización y Rendimiento

| ID    | Descripción | Prioridad | Estado | Estimación | Asignado a | Notas |
|-------|------------|-----------|--------|------------|------------|-------|
| OPT-01 | Optimizar rendimiento de listas largas | 🟢 | 📝 | 4h | | Implementar windowing con FlashList |
| OPT-02 | Reducir tiempo de carga inicial | 🟢 | 📝 | 3h | | Mejorar estrategia de carga de datos |

## 📝 Instrucciones para actualizar este documento

1. Al iniciar una tarea, cambiar el estado de "📝" a "⏳" y asignar a la persona responsable
2. Al completar, cambiar el estado a "✅" y añadir la fecha de finalización en notas
3. Para añadir nuevas tareas, seguir el formato de ID establecido (tipo-número)
4. Mantener actualizada la prioridad según las necesidades del proyecto


