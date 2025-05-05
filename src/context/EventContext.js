// src/context/EventContext.js
import React, { createContext, useState } from 'react';
import {
  sampleEvents,
  sampleParticipants,
  sampleEvents_Participants,
  sampleExpense,
} from '../data/sampleData';

export const EventContext = createContext();

export function EventProvider({ children }) {
  const [events, setEvents] = useState(sampleEvents);
  const [participants, setParticipants] = useState(sampleParticipants);
  const [relations, setRelations] = useState(sampleEvents_Participants);
  const [gastos, setGastos] = useState(sampleExpense);
  const [pagosPorEvento, setPagosPorEvento] = useState({});

  // 1) Añade un nuevo evento y sus relaciones
  const addEvent = (e) => {
    // crea el evento con las propiedades correctas
    const newId = (events.length + 1).toString();
    const evt = {
      id: newId,
      name: e.name,
      date: e.date,
      total: e.total,
      per: e.per,
      participants: e.participantsIds ? e.participantsIds.length : 0,
      estadoEvento: e.estadoEvento,
      whatsappEnvio: e.whatsappEnvio,
      address: e.address,
      map: e.map,
      icon: require('../assets/event-icon.png'),
    };
    setEvents((prev) => [...prev, evt]);

    // crea las relaciones evento↔participantes
    if (e.participantsIds && e.participantsIds.length) {
      const nextRels = e.participantsIds.map((pid, idx) => ({
        id: (relations.length + idx + 1).toString(),
        eventsId: newId,
        participantsId: pid,
        cantParticipantes: 1 // Por defecto, cada participante representa 1 persona
      }));
      setRelations((prev) => [...prev, ...nextRels]);
      
      // Actualizar el conteo total de personas
      setTimeout(() => {
        updateParticipantCount(newId);
        updateEventTotals(newId);
      }, 0);
    }
  };

  // 2) Actualiza un evento existente
  const updateEvent = (id, upd) => {
    setEvents((ev) =>
      ev.map((x) => (x.id === id ? { ...x, ...upd } : x))
    );
  };

  // 3) Obtiene participantes vinculados
  const getParticipantsForEvent = (eventId) =>
    relations
      .filter((r) => r.eventsId === eventId)
      .map((r) => participants.find((p) => p.id === r.participantsId))
      .filter(p => p); // Filtrar null/undefined

  // 4) Añade participante a evento
  const addParticipantToEvent = (eventId, participantId, cantParticipantes = 1) => {
    if (
      relations.some(
        (r) =>
          r.eventsId === eventId && r.participantsId === participantId
      )
    )
      return;
    const newRel = {
      id: (relations.length + 1).toString(),
      eventsId: eventId,
      participantsId: participantId,
      cantParticipantes: cantParticipantes
    };
    setRelations((rel) => [...rel, newRel]);
    
    // Actualizamos el contador en el evento con el recuento total de personas
    updateParticipantCount(eventId);
    
    // Actualizar el costo por persona después de añadir participante
    updateEventTotals(eventId);
  };

  // 5) Quita participante de evento
  const removeParticipantFromEvent = (eventId, participantId) => {
    try {
      setRelations((rel) =>
        rel.filter(
          (r) =>
            !(
              r.eventsId === eventId &&
              r.participantsId === participantId
            )
        )
      );
      
      // Actualizar el contador de participantes después de eliminar
      updateParticipantCount(eventId);
      
      // Actualizar el costo por persona después de quitar participante
      updateEventTotals(eventId);
      return true;
    } catch (error) {
      console.error("Error al quitar participante del evento:", error);
      return false;
    }
  };

  // 6) Obtiene gastos de un evento
  const getGastosForEvent = (eventId) => {
    // Obtenemos solo las relaciones específicas de este evento
    const eventRelaciones = relations.filter(r => r.eventsId === eventId);
    
    // Obtenemos solo los IDs de estas relaciones
    const eventRelacionesIds = eventRelaciones.map(r => r.id);
    
    // Filtramos los gastos que están vinculados a las relaciones de este evento específico
    return gastos.filter(g => eventRelacionesIds.includes(g.eventsParticipantsId));
  };
  
  // 6.1) Calcula el total de gastos de un evento
  const calculateTotalGastos = (eventId) => {
    const gastosEvento = getGastosForEvent(eventId);
    return gastosEvento.reduce((total, gasto) => {
      // Convertir el monto de string a número, reemplazando comas por puntos si es necesario
      const montoNum = typeof gasto.monto === 'string' 
        ? parseFloat(gasto.monto.replace(',', '.')) 
        : gasto.monto;
      return total + (montoNum || 0);
    }, 0);
  };
  
  // 6.2) Actualiza los totales de gastos y costo por persona para un evento
  const updateEventTotals = (eventId) => {
    const totalGastos = calculateTotalGastos(eventId);
    const totalPersonCount = getTotalPersonCount(eventId);
    
    // Usamos el número total de personas (cantParticipantes) para el cálculo
    const costoPorPersona = totalPersonCount > 0 ? totalGastos / totalPersonCount : 0;
    
    updateEvent(eventId, {
      total: totalGastos,
      per: parseFloat(costoPorPersona.toFixed(2)),
      totalPersonCount: totalPersonCount // Guardamos el conteo total de personas
    });
    
    return { total: totalGastos, per: costoPorPersona, totalPersonCount };
  };

  // Función para contar el número total de personas en un evento (sumando cantParticipantes)
  const getTotalPersonCount = (eventId) => {
    const eventRelations = relations.filter(r => r.eventsId === eventId);
    return eventRelations.reduce((total, relation) => {
      // Si no tiene cantParticipantes o es menor a 1, contamos como 1
      const cantParticipantes = relation.cantParticipantes && relation.cantParticipantes >= 1 
        ? relation.cantParticipantes : 1;
      return total + cantParticipantes;
    }, 0);
  };

  // Función para actualizar el contador de participantes de un evento
  const updateParticipantCount = (eventId) => {
    const totalPersonCount = getTotalPersonCount(eventId);
    const participantCount = getParticipantsForEvent(eventId).length;
    
    updateEvent(eventId, {
      participants: participantCount, // Mantenemos el número de participantes registrados
      totalPersonCount: totalPersonCount // Nuevo campo para el total de personas
    });
    
    return { participantCount, totalPersonCount };
  };

  // Función para obtener la cantidad de personas que representa un participante en un evento
  const getParticipantPersonCount = (eventId, participantId) => {
    const relation = relations.find(r => r.eventsId === eventId && r.participantsId === participantId);
    return relation ? (relation.cantParticipantes || 1) : 1;
  };

  // 7) Obtiene participante por ID
  const getParticipantById = (id) => {
    return participants.find(p => p.id === id);
  };
  
  // 8) Actualiza estado de pago
  const updatePagoEstado = (eventId, pagoId, pagado) => {
    setPagosPorEvento(prev => {
      const eventoPagos = { ...(prev[eventId] || {}) };
      eventoPagos[pagoId] = pagado;
      return {
        ...prev,
        [eventId]: eventoPagos
      };
    });
  };
  
  // 9) Obtener estados de pagos para un evento
  const getPagosEstado = (eventId) => {
    return pagosPorEvento[eventId] || {};
  };

  // 10) Añadir un nuevo gasto
  const addGasto = (gasto) => {
    // Buscar el ID más alto existente y sumar 1 para garantizar unicidad
    const maxId = gastos.reduce((max, g) => {
      const idNum = parseInt(g.id, 10);
      return idNum > max ? idNum : max;
    }, 0);
    const newId = (maxId + 1).toString();
    
    const newGasto = {
      id: newId,
      ...gasto
    };
    setGastos(prev => [...prev, newGasto]);
    
    // Actualizar el total del evento cuando se añade un gasto
    if (gasto.eventsParticipantsId) {
      const rel = relations.find(r => r.id === gasto.eventsParticipantsId);
      if (rel) {
        updateEventTotals(rel.eventsId);
      }
    }
    
    return newId;
  };

  // 11) Actualizar un gasto existente
  const updateGasto = (id, data) => {
    // Guardar el gasto anterior para identificar el evento
    const oldGasto = gastos.find(g => g.id === id);
    
    // Actualizar el gasto
    setGastos(prev => prev.map(g => g.id === id ? { ...g, ...data } : g));
    
    // Actualizar el total del evento
    if (oldGasto && oldGasto.eventsParticipantsId) {
      const rel = relations.find(r => r.id === oldGasto.eventsParticipantsId);
      if (rel) {
        updateEventTotals(rel.eventsId);
      }
    }
  };

  // 12) Eliminar un gasto
  const removeGasto = (id) => {
    // Guardar el gasto que se eliminará para identificar el evento
    const gastoToRemove = gastos.find(g => g.id === id);
    
    // Eliminar el gasto
    setGastos(prev => prev.filter(g => g.id !== id));
    
    // Actualizar el total del evento después de eliminar
    if (gastoToRemove && gastoToRemove.eventsParticipantsId) {
      const rel = relations.find(r => r.id === gastoToRemove.eventsParticipantsId);
      if (rel) {
        updateEventTotals(rel.eventsId);
      }
    }
  };

  // 13) Añadir un nuevo participante
  const addParticipant = (participant) => {
    try {
      const newId = (participants.length + 1).toString();
      const newParticipant = {
        id: newId,
        ...participant
      };
      setParticipants(prev => [...prev, newParticipant]);
      
      // Si se proporciona un eventId, agregar el participante al evento
      if (participant.eventId) {
        addParticipantToEvent(participant.eventId, newId);
      }
      
      return newId;
    } catch (error) {
      console.error("Error al agregar el participante:", error);
      return null;
    }
  };

  // 14) Actualizar un participante existente
  const updateParticipant = (id, data) => {
    try {
      setParticipants(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
      return true; // Devuelve true si la actualización fue exitosa
    } catch (error) {
      console.error("Error al actualizar el participante:", error);
      return false; // Devuelve false si hubo un error
    }
  };

  // 15) Eliminar un participante
  const removeParticipant = (id) => {
    // Identificar los eventos a los que pertenece el participante
    const eventosDelParticipante = relations
      .filter(r => r.participantsId === id)
      .map(r => r.eventsId);
    
    // Eliminar el participante
    setParticipants(prev => prev.filter(p => p.id !== id));
    
    // También eliminar relaciones asociadas con este participante
    setRelations(prev => prev.filter(r => r.participantsId !== id));
    
    // Actualizar totales de los eventos afectados
    eventosDelParticipante.forEach(eventId => {
      updateEventTotals(eventId);
    });
  };

  // Creamos el objeto con todos los valores y funciones que proporcionará el contexto
  const contextValue = {
    events,
    addEvent,
    updateEvent,
    participants,
    getParticipantsForEvent,
    addParticipantToEvent,
    removeParticipantFromEvent,
    gastos,
    getGastosForEvent,
    relations,
    setRelations, // Exponiendo setRelations para poder usarlo en componentes
    getParticipantById,
    updatePagoEstado,
    getPagosEstado,
    // Funciones para gastos
    addGasto,
    updateGasto,
    removeGasto,
    // Funciones para participantes
    addParticipant,
    updateParticipant,
    removeParticipant,
    // Funciones adicionales
    calculateTotalGastos,
    updateEventTotals,
    getTotalPersonCount,
    updateParticipantCount,
    getParticipantPersonCount
  };

  return (
    <EventContext.Provider value={contextValue}>
      {children}
    </EventContext.Provider>
  );
}
