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

  // Recalcula total y per de un evento
  const recalcEventTotals = (eventId) => {
    // IDs de relaciones para este evento
    const relIds = relations
      .filter((r) => r.eventsId === eventId)
      .map((r) => r.id);
    // Gastos vinculados
    const evGastos = gastos.filter((g) => relIds.includes(g.eventsParticipantsId));
    // Suma total
    const totalSum = evGastos.reduce((sum, g) => sum + parseFloat(g.monto), 0);
    // Cantidad de participantes
    const count = relations.filter((r) => r.eventsId === eventId).length;
    const per = count > 0 ? totalSum / count : 0;
    updateEvent(eventId, { total: totalSum, per });
  };

  // 1) Añade un nuevo evento y sus relaciones
  const addEvent = (e) => {
    const newId = (events.length + 1).toString();
    const evt = {
      id: newId,
      name: e.name,
      date: e.date,
      total: 0,
      per: 0,
      participants: e.participantsIds ? e.participantsIds.length : 0,
      estadoEvento: e.estadoEvento,
      whatsappEnvio: e.whatsappEnvio,
      address: e.address,
      map: e.map,
      icon: require('../assets/event-icon.png'),
    };
    setEvents((prev) => [...prev, evt]);

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
      .map((r) => participants.find((p) => p.id === r.participantsId));

  // 4) Añade participante a evento
  const addParticipantToEvent = (eventId, participantId) => {
    if (
      relations.some(
        (r) => r.eventsId === eventId && r.participantsId === participantId
      )
    )
      return;
    const newRel = {
      id: (relations.length + 1).toString(),
      eventsId: eventId,
      participantsId: participantId,
    };
    setRelations((rel) => [...rel, newRel]);
    updateEvent(eventId, { participants: relCount(eventId) });
    recalcEventTotals(eventId);
  };

  // 5) Quita participante de evento
  const removeParticipantFromEvent = (eventId, participantId) => {
    setRelations((rel) =>
      rel.filter(
        (r) => !(r.eventsId === eventId && r.participantsId === participantId)
      )
    );
    updateEvent(eventId, { participants: relCount(eventId) });
    recalcEventTotals(eventId);
  };

  const relCount = (eventId) =>
    relations.filter((r) => r.eventsId === eventId).length;

  // ——— Gestión de Gastos ———

  // Añade un gasto y recalcula totales
  const addGasto = (g) => {
    const newId = (gastos.length + 1).toString();
    const gasto = {
      id: newId,
      descripcion: g.descripcion,
      monto: g.monto,
      date: g.date,
      eventsParticipantsId: g.eventsParticipantsId,
    };
    setGastos((prev) => [...prev, gasto]);
    const evId = relations.find((r) => r.id === gasto.eventsParticipantsId).eventsId;
    recalcEventTotals(evId);
  };

  // Actualiza un gasto y recalcula totales
  const updateGasto = (id, upd) => {
    setGastos((prev) => prev.map((x) => (x.id === id ? { ...x, ...upd } : x)));
    const gasto = gastos.find((g) => g.id === id);
    if (gasto) {
      const evId = relations.find((r) => r.id === gasto.eventsParticipantsId).eventsId;
      recalcEventTotals(evId);
    }
  };

  // Elimina un gasto y recalcula totales
  const removeGasto = (id) => {
    const gasto = gastos.find((g) => g.id === id);
    if (gasto) {
      const evId = relations.find((r) => r.id === gasto.eventsParticipantsId).eventsId;
      setGastos((prev) => prev.filter((x) => x.id !== id));
      recalcEventTotals(evId);
    }
  };

  // Obtiene todos los gastos de un evento
  const getGastosForEvent = (eventId) => {
    const relIds = relations
      .filter((r) => r.eventsId === eventId)
      .map((r) => r.id);
    return gastos.filter((g) => relIds.includes(g.eventsParticipantsId));
  };

  return (
    <EventContext.Provider
      value={{
        events,
        addEvent,
        updateEvent,
        participants,
        relations,
        getParticipantsForEvent,
        addParticipantToEvent,
        removeParticipantFromEvent,
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
