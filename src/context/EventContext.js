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
  const [participants] = useState(sampleParticipants);
  const [relations, setRelations] = useState(sampleEventsParticipants);
  const [gastos, setGastos] = useState(sampleGastos);

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
    // actualizar contador de participantes
    updateEvent(eventId, {
      participants: getParticipantsForEvent(eventId).length + 1,
    });
  };

  const removeParticipantFromEvent = (eventId, participantId) => {
    setRelations(prev =>
      prev.filter(
        r => !(r.eventsId === eventId && r.participantsId === participantId)
      )
    );
    updateEvent(eventId, {
      participants: getParticipantsForEvent(eventId).length - 1,
    });
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
      .reduce((acc, g) => acc + g.monto, 0);

    // encuentra el evento y su cantidad de participantes
    const evt = events.find(e => e.id === eventId);
    const count = evt ? evt.participants : 0;

    // calcula per
    const perPerson = count > 0 ? totalSum / count : 0;

    updateEvent(eventId, {
      total: totalSum,
      per: perPerson,
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

  // 4) Obtiene todos los gastos de un evento
  const getGastosForEvent = eventId => {
    const relIds = relations
      .filter(r => r.eventsId === eventId)
      .map(r => r.id);
    return gastos.filter(g => relIds.includes(g.eventsParticipantsId));
  };

  return (
    <EventContext.Provider
      value={{
        // eventos
        events,
        addEvent,
        updateEvent,
        participants,
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
