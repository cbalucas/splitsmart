// src/context/EventContext.js
import React, { createContext, useState } from 'react';
import { sampleEvents, sampleParticipants, sampleEventsParticipants } from '../data/sampleData';

export const EventContext = createContext();

export function EventProvider({ children }) {
  const [events, setEvents] = useState(sampleEvents);
  const [participants] = useState(sampleParticipants);
  const [relations, setRelations] = useState(sampleEventsParticipants);

  // Añade un nuevo evento al array
  const addEvent = (e) => {
    const evt = {
      id:    (events.length + 1).toString(),
      name:  e.name,
      date:  e.date,
      total: e.gastoTotal,                   // gastoTotal → total
      per:   e.gastoCU,                      // gastoCU    → per
      participants: e.participantesNro,      // participantesNro → participants
      estadoEvento: e.estadoEvento,
      whatsappEnvio: e.whatsappEnvio,
      address: e.address,
      map:     e.map,
      icon:    require('../assets/event-icon.png'), // icon por defecto
    };
    setEvents(prev => [...prev, evt]);
  };

  const updateEvent = (id, upd) => {
    setEvents(ev => ev.map(x => x.id===id ? { ...x, ...upd } : x));
  };

  // 1) Obtener participantes de un evento
  const getParticipantsForEvent = (eventId) =>
    relations
      .filter(r => r.eventsId === eventId)
      .map(r => participants.find(p => p.id === r.participantsId));

  // 2) Añadir participante a un evento
  const addParticipantToEvent = (eventId, participantId) => {
    // evita duplicados
    if (relations.some(r => r.eventsId===eventId && r.participantsId===participantId)) return;
    const newRel = {
      id:    (relations.length + 1).toString(),
      eventsId:       eventId,
      participantsId: participantId
    };
    setRelations(rel => [...rel, newRel]);
  };

  // 3) Quitar participante de un evento
  const removeParticipantFromEvent = (eventId, participantId) => {
    setRelations(rel =>
      rel.filter(r => !(r.eventsId===eventId && r.participantsId===participantId))
    );
  };

  return (
    <EventContext.Provider
      value={{
        events,
        addEvent,
        updateEvent,
        participants,                 // lista completa
        getParticipantsForEvent,
        addParticipantToEvent,
        removeParticipantFromEvent
      }}
    >
      {children}
    </EventContext.Provider>
  );
}