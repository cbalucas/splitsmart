// src/context/EventContext.js
import React, { createContext, useState } from 'react';
import {
  sampleEvents,
  sampleParticipants,
  sampleEventsParticipants,
  sampleGastos,
} from '../data/sampleData'

export const EventContext = createContext();

export function EventProvider({ children }) {
  const [events, setEvents] = useState(sampleEvents);
  const [participants] = useState(sampleParticipants);
  const [relations, setRelations] = useState(sampleEventsParticipants);
  const [gastos, setGastos] = useState(sampleGastos);

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
      .map((r) => participants.find((p) => p.id === r.participantsId));

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
  };

  // —————————— Gestión de Gastos ——————————

  // 1) Añade un gasto
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
  };

  // 2) Actualiza un gasto
  const updateGasto = (id, upd) => {
    setGastos((prev) =>
      prev.map((x) => (x.id === id ? { ...x, ...upd } : x))
    );
  };

  // 3) Elimina un gasto
  const removeGasto = (id) => {
    setGastos((prev) => prev.filter((x) => x.id !== id));
  };

  // 4) Obtiene todos los gastos de un evento (a través de sus relations)
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

        // Nuevo
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