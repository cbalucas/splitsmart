import React, { createContext, useState } from 'react';
import {
  sampleEvents,
  sampleParticipants,
  sampleEventsParticipants,
} from '../data/sampleData';

export const EventContext = createContext();

export function EventProvider({ children }) {
  const [events, setEvents] = useState(sampleEvents);
  const [participants] = useState(sampleParticipants);
  const [relations, setRelations] = useState(sampleEventsParticipants);

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

  return (
    <EventContext.Provider
      value={{
        events,
        addEvent,
        updateEvent,
        participants,
        getParticipantsForEvent,
        addParticipantToEvent,
        removeParticipantFromEvent,
      }}
    >
      {children}
    </EventContext.Provider>
  );
}
