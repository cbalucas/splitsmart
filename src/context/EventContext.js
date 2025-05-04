// src/context/EventContext.js
import React, { createContext, useState, useEffect } from 'react';
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

  // Calcular los totales para todos los eventos cuando se inicia la app
  useEffect(() => {
    // Obtener todos los eventIds únicos
    const uniqueEventIds = [...new Set(relations.map(r => r.eventsId))];
    
    // Primero actualizar la cantidad de participantes para cada evento
    const updatedEvents = events.map(event => {
      const participantsCount = relations.filter(r => r.eventsId === event.id).length;
      return { ...event, participants: participantsCount };
    });
    
    // Actualizar el estado de eventos con las cantidades de participantes
    setEvents(updatedEvents);
    
    // Ahora calcular el total y el monto por persona para cada evento
    uniqueEventIds.forEach(eventId => {
      recalcTotals(eventId, gastos);
    });
  }, []); // Solo se ejecuta cuando el componente se monta

  // ————— Participantes —————
  
  // Añade un nuevo participante
  const addParticipant = (participantData) => {
    // Generar un nuevo ID basado en el máximo actual + 1
    const maxId = participants.reduce((max, p) => {
      const num = parseInt(p.id, 10);
      return num > max ? num : max;
    }, 0);
    const newId = (maxId + 1).toString();
    
    const newParticipant = {
      id: newId,
      name: participantData.name,
      aliasCBU: participantData.aliasCBU || '',
      phone: participantData.phone || '',
      email: participantData.email || '',
    };
    
    setParticipants(prev => [...prev, newParticipant]);
    
    // Si se especificó un eventId, agregar al evento
    if (participantData.eventId) {
      addParticipantToEvent(participantData.eventId, newId);
    }
    
    return newId; // Retornar el ID para posibles usos posteriores
  };
  
  // Actualiza un participante existente
  const updateParticipant = (id, updatedData) => {
    setParticipants(prev =>
      prev.map(p => p.id === id ? { ...p, ...updatedData } : p)
    );
    return true;
  };
  
  // Elimina un participante y todas sus relaciones
  const removeParticipant = (id) => {
    // Primero eliminar todas las relaciones que contengan a este participante
    const participantRelations = relations.filter(r => r.participantsId === id);
    
    // Para cada relación, actualizar el contador de participantes del evento
    participantRelations.forEach(rel => {
      const eventId = rel.eventsId;
      const currentCount = getParticipantsForEvent(eventId).length;
      updateEvent(eventId, { participants: currentCount - 1 });
    });
    
    // Eliminar las relaciones
    setRelations(prev => prev.filter(r => r.participantsId !== id));
    
    // Eliminar el participante
    setParticipants(prev => prev.filter(p => p.id !== id));
    
    return true;
  };

  // ————— Eventos —————

  // Añade o actualiza un evento
  const addEvent = (e) => {
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
    setEvents(prev => [...prev, evt]);

    if (e.participantsIds?.length) {
      const nextRels = e.participantsIds.map((pid, idx) => ({
        id: (relations.length + idx + 1).toString(),
        eventsId: newId,
        participantsId: pid,
      }));
      setRelations(prev => [...prev, ...nextRels]);
    }
  };

  const updateEvent = (id, upd) => {
    setEvents(prev =>
      prev.map(x => (x.id === id ? { ...x, ...upd } : x))
    );
  };

  const getParticipantsForEvent = (eventId) =>
    relations
      .filter(r => r.eventsId === eventId)
      .map(r => participants.find(p => p.id === r.participantsId));

  const addParticipantToEvent = (eventId, participantId) => {
    if (
      relations.some(r => r.eventsId === eventId && r.participantsId === participantId)
    ) return;

    const newRel = {
      id: (relations.length + 1).toString(),
      eventsId: eventId,
      participantsId: participantId,
    };
    setRelations(prev => [...prev, newRel]);
    
    // Actualizar contador de participantes
    const newCount = getParticipantsForEvent(eventId).length + 1;
    
    // Obtener el total actual del evento
    const currentEvent = events.find(e => e.id === eventId);
    const totalGastos = currentEvent?.total || 0;
    
    // Calcular el nuevo valor por persona
    const newPer = newCount > 0 ? totalGastos / newCount : 0;
    
    // Actualizar el evento con los nuevos valores
    updateEvent(eventId, {
      participants: newCount,
      per: newPer
    });
  };

  const removeParticipantFromEvent = (eventId, participantId) => {
    try {
      // Antes de eliminar, guardar el conteo actual para la actualización
      const currentCount = getParticipantsForEvent(eventId).length;
      if (currentCount <= 1) {
        console.error('No se puede eliminar el último participante');
        return false;
      }
      
      // Filtrar relaciones que no coincidan con estos criterios
      setRelations(prev =>
        prev.filter(
          r => !(r.eventsId === eventId && r.participantsId === participantId)
        )
      );
      
      // Obtener el total actual del evento
      const currentEvent = events.find(e => e.id === eventId);
      const totalGastos = currentEvent?.total || 0;
      
      // Calcular nuevos valores
      const newCount = currentCount - 1;
      const newPer = newCount > 0 ? totalGastos / newCount : 0;
      
      // Actualizar conteo de participantes y valor por persona
      updateEvent(eventId, {
        participants: newCount,
        per: newPer
      });
      
      return true;
    } catch (error) {
      console.error('Error al remover participante:', error);
      return false;
    }
  };
  
  // Obtener los gastos para un evento específico
  const getGastosForEvent = (eventId) => {
    // Obtener los IDs de relación para este evento
    const relIds = relations
      .filter(r => r.eventsId === eventId)
      .map(r => r.id);
    
    // Filtrar los gastos que corresponden a estas relaciones
    return gastos.filter(g => relIds.includes(g.eventsParticipantsId));
  };
  
  // Obtener un participante por su ID
  const getParticipantById = (participantId) => {
    return participants.find(p => p.id === participantId);
  };

  // ————— Gastos —————

  // Recalcula total y per para un evento
  const recalcTotals = (eventId, gastosArray) => {
    // obtiene IDs de relación para este evento
    const relIds = relations
      .filter(r => r.eventsId === eventId)
      .map(r => r.id);

    // suma los montos de gastos
    const totalSum = gastosArray
      .filter(g => relIds.includes(g.eventsParticipantsId))
      .reduce((acc, g) => {
        // Convertir el monto de string a número, reemplazando comas por puntos
        const monto = typeof g.monto === 'string' 
          ? parseFloat(g.monto.replace(',', '.')) 
          : g.monto;
        return acc + (isNaN(monto) ? 0 : monto); // Añadir validación para evitar NaN
      }, 0);

    // encuentra el evento y su cantidad de participantes
    const evt = events.find(e => e.id === eventId);
    const count = relations.filter(r => r.eventsId === eventId).length; // Calcular directamente de las relaciones

    // calcula per
    const perPerson = count > 0 ? totalSum / count : 0;

    updateEvent(eventId, {
      total: totalSum,
      per: perPerson,
      participants: count // Actualizar también la cantidad de participantes
    });
  };

  // 1) Añade un gasto con ID único
  const addGasto = g => {
    const newId = Date.now().toString();
    const gasto = {
      id: newId,
      descripcion: g.descripcion,
      monto: g.monto,
      date: g.date,
      eventsParticipantsId: g.eventsParticipantsId,
    };

    setGastos(prev => {
      const updated = [...prev, gasto];
      // recalcula totales para el evento correspondiente
      const rel = relations.find(r => r.id === gasto.eventsParticipantsId);
      if (rel) recalcTotals(rel.eventsId, updated);
      return updated;
    });
  };

  // 2) Actualiza un gasto existente
  const updateGasto = (id, upd) => {
    setGastos(prev => {
      const updated = prev.map(x => (x.id === id ? { ...x, ...upd } : x));
      // recalcula totales para el evento
      const g = updated.find(x => x.id === id);
      if (g) {
        const rel = relations.find(r => r.id === g.eventsParticipantsId);
        if (rel) recalcTotals(rel.eventsId, updated);
      }
      return updated;
    });
  };

  // 3) Elimina un gasto
  const removeGasto = id => {
    setGastos(prev => {
      const removed = prev.find(x => x.id === id);
      const updated = prev.filter(x => x.id !== id);
      // recalcula totales para el evento
      if (removed) {
        const rel = relations.find(r => r.id === removed.eventsParticipantsId);
        if (rel) recalcTotals(rel.eventsId, updated);
      }
      return updated;
    });
  };

  return (
    <EventContext.Provider
      value={{
        // eventos
        events,
        addEvent,
        updateEvent,
        // participantes
        participants,
        addParticipant,
        updateParticipant,
        removeParticipant,
        getParticipantById,
        // relaciones
        relations,
        getParticipantsForEvent,
        addParticipantToEvent,
        removeParticipantFromEvent,
        // gastos
        gastos,
        addGasto,
        updateGasto,
        removeGasto,
        getGastosForEvent,
      }}
    >
      {children}
    </EventContext.Provider>
  );
}
