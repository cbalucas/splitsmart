// src/context/EventContext.js
import React, { createContext, useState } from 'react';
import {
  sampleEvents,
  sampleParticipants,
  sampleEventsParticipants,
  sampleGastos,
} from '../data/sampleData';

export const EventContext = createContext();

export function EventProvider({ children }) {
  const [events, setEvents] = useState(sampleEvents);
  const [participants, setParticipants] = useState(sampleParticipants);
  const [relations, setRelations] = useState(sampleEventsParticipants);
  const [gastos, setGastos] = useState(sampleGastos);
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
      }));
      setRelations((prev) => [...prev, ...nextRels]);
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
  const addParticipantToEvent = (eventId, participantId) => {
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
    };
    setRelations((rel) => [...rel, newRel]);
    // incrementa el contador en el evento
    updateEvent(eventId, {
      participants: getParticipantsForEvent(eventId).length + 1,
    });
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
      // decrementa contador
      updateEvent(eventId, {
        participants: getParticipantsForEvent(eventId).length - 1,
      });
      return true;
    } catch (error) {
      console.error("Error al quitar participante del evento:", error);
      return false;
    }
  };

  // 6) Obtiene gastos de un evento
  const getGastosForEvent = (eventId) => {
    const relIds = relations
      .filter((r) => r.eventsId === eventId)
      .map((r) => r.id);
    return gastos.filter((g) => relIds.includes(g.eventsParticipantsId));
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
    return newId;
  };

  // 11) Actualizar un gasto existente
  const updateGasto = (id, data) => {
    setGastos(prev => prev.map(g => g.id === id ? { ...g, ...data } : g));
  };

  // 12) Eliminar un gasto
  const removeGasto = (id) => {
    setGastos(prev => prev.filter(g => g.id !== id));
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
    setParticipants(prev => prev.filter(p => p.id !== id));
    // También eliminar relaciones asociadas con este participante
    setRelations(prev => prev.filter(r => r.participantsId !== id));
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
    removeParticipant
  };

  return (
    <EventContext.Provider value={contextValue}>
      {children}
    </EventContext.Provider>
  );
}
