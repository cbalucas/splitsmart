export const sampleEvents = [
    // { id: '1', name: 'Cumpleaños Ana',    date: '2025-05-10', total: 2500,    per: 500,   participants: 5, estadoEvento: true,  whatsappEnvio: true,  icon: require('../assets/event-icon.png'), address: 'Calle Falsa 123', map: 'https://maps.example.com' },
    // { id: '2', name: 'Asado con amigos',   date: '2025-04-29', total: 1800,    per: 300,   participants: 6, estadoEvento: true,  whatsappEnvio: false, icon: require('../assets/event-icon.png'), address: 'Av. Siempre Viva 742', map: 'https://maps.example.com' },
    // { id: '3', name: 'Vieja Mendoza',      date: '2025-04-10', total: 250000,  per: 50000, participants: 5, estadoEvento: false, whatsappEnvio: false, icon: require('../assets/event-icon.png'), address: 'Calle Falsa 123', map: 'https://maps.example.com' },
    
    // Ejemplos para pruebas nuevas con el nuevo formato
    { id: '1', name: 'Cumpleaños',    date: '2025-05-10',  estadoEvento: true,  whatsappEnvio: true,  icon: require('../assets/event-icon.png'), address: 'Calle Falsa 123', map: 'https://www.google.com.ar' },
    { id: '2', name: 'Asado con amigos',   date: '2025-04-29', estadoEvento: true,  whatsappEnvio: false, icon: require('../assets/event-icon.png'), address: 'Av. Siempre Viva 742', map: 'https://www.google.com.ar' },
    { id: '3', name: 'Vieja Mendoza',      date: '2025-04-10', estadoEvento: false, whatsappEnvio: false, icon: require('../assets/event-icon.png'), address: 'Calle X 853', map: 'https://www.google.com.ar' },

  ];

  export const sampleParticipants = [
    { id: '1', name: 'Ana Pérez',   aliasCBU: 'ANAPEREZ123', phone: '3516175809', email: 'ana@example.com' },
    { id: '2', name: 'Luis Gómez',  aliasCBU: 'LUISGOM99',   phone: '',             email: 'luis@example.com' },
    { id: '3', name: 'María López', aliasCBU: 'MARI.LOPEZ.MP',   phone: '+987654321',   email: '' },
    { id: '4', name: 'Pedro Martínez', aliasCBU: 'PEDRO.MARTINEZ', phone: '1234567890', email: ''},
    { id: '5', name: 'Laura Fernández', aliasCBU: 'LAURA.FERNANDEZ', phone: '', email: '' },
    { id: '6', name: 'Carlos Sánchez', aliasCBU: 'CARLOS.SANCHEZ', phone: '+1234567890', email: '' },   
    { id: '7', name: 'Sofía Torres', aliasCBU: 'SOFIA.TORRES', phone: '', email: '' },

  ];

  export const sampleEventsParticipants = [
    // PARTICIPANTES 4 - EVENTO 1
    { id: '1', participantsId: '1',  eventsId:'1' },
    { id: '2', participantsId: '3',  eventsId:'1' },
    { id: '3', participantsId: '7',  eventsId:'1' },
    { id: '4', participantsId: '4',  eventsId:'1' },
    // PARTICIPANTES 5 - EVENTO 2
    { id: '9', participantsId: '5',  eventsId:'2' },
    { id: '10', participantsId: '6',  eventsId:'2' },
    { id: '11', participantsId: '1',  eventsId:'2' },
    { id: '6', participantsId: '3',  eventsId:'2' },
    { id: '12', participantsId: '2',  eventsId:'2' },
    // PARTICIPANTES 3 - EVENTO 3
    { id: '5', participantsId: '1',  eventsId:'3' },
    { id: '7', participantsId: '7',  eventsId:'3' },
    { id: '8', participantsId: '2',  eventsId:'3' },
    
   
  ];

  export const sampleGastos = [
    // EVENTO 1
    { id: '1', descripcion: 'Carne',  monto:'50000',eventsParticipantsId: '4',  date: '2025-04-10' },
    { id: '3', descripcion: 'Bebida',  monto:'5752.50',eventsParticipantsId: '1',  date: '2025-04-10' },
    { id: '6', descripcion: 'Bebida',  monto:'2550',eventsParticipantsId: '1',  date: '2025-04-10' },
    { id: '5', descripcion: 'Bebida',  monto:'70052.50',eventsParticipantsId: '3',  date: '2025-04-10' },
    // EVENTO 2
    { id: '4', descripcion: 'Bebida',  monto:'3552.50',eventsParticipantsId: '6',  date: '2025-04-10' },
    { id: '7', descripcion: 'Asado',  monto:'153552.50',eventsParticipantsId: '6',  date: '2025-04-10' },
    // EVENTO 3
    { id: '2', descripcion: 'Picada',  monto:'35200',eventsParticipantsId: '8',  date: '2025-04-10' },
    { id: '8', descripcion: 'Hielo',  monto:'5200',eventsParticipantsId: '7',  date: '2025-04-10' },
    { id: '9', descripcion: 'Bebidas',  monto:'27500',eventsParticipantsId: '7',  date: '2025-04-10' },
  
  ];


  // export const samplePagos = [
  //   { id: '1', gastoId: '',  eventsParticipantsId: '4',monto:'50000' },
  //   // … más participantes …
  // ];