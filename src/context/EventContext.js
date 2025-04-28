import React, { createContext, useState } from 'react';
import { sampleEvents } from '../data/sampleData';

export const EventContext = createContext();

export function EventProvider({ children }) {
  const [events, setEvents] = useState(sampleEvents);

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

 // Función para actualizar cualquier campo de un evento,
  // pero la usaremos para cerrar (estadoEvento = false)
  const updateEvent = (id, updates) => {
    setEvents(prev =>
      prev.map(ev => ev.id === id ? { ...ev, ...updates } : ev)
    );
  };

  return (
    <EventContext.Provider value={{ events, addEvent, updateEvent }}>
      {children}
    </EventContext.Provider>
  );
}
