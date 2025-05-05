export const sampleEvents = [
    
    { id: '1', name: 'Cumpleaños',    date: '2025-05-10',  estadoEvento: true,  whatsappEnvio: true,  icon: require('../assets/event-icon.png'), address: 'Calle Falsa 123', map: 'https://www.google.com.ar' },
    { id: '2', name: 'Asado con amigos',   date: '2025-04-29', estadoEvento: true,  whatsappEnvio: false, icon: require('../assets/event-icon.png'), address: 'Av. Siempre Viva 742', map: 'https://www.google.com.ar' },
    { id: '3', name: 'Vieja Mendoza',      date: '2025-04-10', estadoEvento: false, whatsappEnvio: false, icon: require('../assets/event-icon.png'), address: 'Calle X 853', map: 'https://www.google.com.ar' },
    { id: '4', name: '1 de Mayo',      date: '2025-05-01', estadoEvento: true, whatsappEnvio: false, icon: require('../assets/event-icon.png'), address: 'Fontana de Sur', map: 'https://www.google.com.ar' },
  ];

  export const sampleParticipants = [
    { id: '1', name: 'Lukitas',   aliasCBU: 'ANAPEREZ123', phone: '3516175809', email: 'ana@example.com' },
    { id: '2', name: 'Droopy',  aliasCBU: 'LUISGOM99',   phone: '',             email: 'luis@example.com' },
    { id: '3', name: 'Santi', aliasCBU: 'MARI.LOPEZ.MP',   phone: '+987654321',   email: '' },
    { id: '4', name: 'Nacho', aliasCBU: 'PEDRO.MARTINEZ', phone: '1234567890', email: ''},
    { id: '5', name: 'Pony', aliasCBU: 'LAURA.FERNANDEZ', phone: '', email: '' },
    { id: '6', name: 'Paquito', aliasCBU: 'CARLOS.SANCHEZ', phone: '+1234567890', email: '' },   
    { id: '7', name: 'Martin', aliasCBU: 'SOFIA.TORRES', phone: '', email: '' },
    { id: '8', name: 'Roger', aliasCBU: 'SOFIA.TORRES', phone: '', email: '' },
    { id: '9', name: 'Nico', aliasCBU: 'SOFIA.TORRES', phone: '', email: '' },
    { id: '10', name: 'Sanjua', aliasCBU: 'SOFIA.TORRES', phone: '', email: '' },

  ];

  export const sampleEvents_Participants = [
    // PARTICIPANTES 4 - EVENTO 1
    { id: '1', participantsId: '1',  eventsId:'1', cantParticipantes: 1 },
    { id: '2', participantsId: '3',  eventsId:'1', cantParticipantes: 1 },
    { id: '3', participantsId: '7',  eventsId:'1' , cantParticipantes: 1 },
    { id: '4', participantsId: '4',  eventsId:'1',  cantParticipantes: 2 },
    // PARTICIPANTES 5 - EVENTO 2
    { id: '9', participantsId: '5',  eventsId:'2',cantParticipantes: 1 },
    { id: '10', participantsId: '6',  eventsId:'2' ,cantParticipantes: 1 },
    { id: '11', participantsId: '1',  eventsId:'2' ,cantParticipantes: 1 },
    { id: '6', participantsId: '3',  eventsId:'2' ,cantParticipantes: 1 },
    { id: '12', participantsId: '2',  eventsId:'2',cantParticipantes: 1 },
    // PARTICIPANTES 3 - EVENTO 3
    { id: '5', participantsId: '1',  eventsId:'3' ,cantParticipantes: 1 },
    { id: '8', participantsId: '2',  eventsId:'3' ,cantParticipantes: 2 },
    { id: '7', participantsId: '7',  eventsId:'3' ,cantParticipantes: 1 },
    // PARTICIPANTES 3 - EVENTO 4
    { id: '13', participantsId: '1',  eventsId:'4',cantParticipantes: 2 },
    { id: '14', participantsId: '2',  eventsId:'4',cantParticipantes: 2 },
    { id: '15', participantsId: '3',  eventsId:'4',cantParticipantes: 2 },
    { id: '16', participantsId: '4',  eventsId:'4',cantParticipantes: 2 },
    { id: '17', participantsId: '6',  eventsId:'4',cantParticipantes: 2 },
    { id: '18', participantsId: '7',  eventsId:'4',cantParticipantes: 2 },
    { id: '19', participantsId: '8',  eventsId:'4' ,cantParticipantes: 1 },
  ];

  export const sampleExpense = [
    // EVENTO 1
    { id: '1', descripcion: 'Carne',  monto:'50000,00',eventsParticipantsId: '4',  date: '2025-04-10' },
    { id: '3', descripcion: 'Bebida',  monto:'5752,50',eventsParticipantsId: '1',  date: '2025-04-10' },
    { id: '6', descripcion: 'Bebida',  monto:'2550,00',eventsParticipantsId: '1',  date: '2025-04-10' },
    { id: '5', descripcion: 'Bebida',  monto:'70052,50',eventsParticipantsId: '3',  date: '2025-04-10' },
    // EVENTO 2
    { id: '4', descripcion: 'Bebida',  monto:'3552,50',eventsParticipantsId: '6',  date: '2025-04-10' },
    { id: '7', descripcion: 'Asado',  monto:'153552,50',eventsParticipantsId: '6',  date: '2025-04-10' },
    // EVENTO 3
    { id: '2', descripcion: 'Picada',  monto:'35200,00',eventsParticipantsId: '8',  date: '2025-04-10' },
    { id: '8', descripcion: 'Hielo',  monto:'5200,00',eventsParticipantsId: '7',  date: '2025-04-10' },
    { id: '9', descripcion: 'Bebidas',  monto:'27500,00',eventsParticipantsId: '7',  date: '2025-04-10' },
    // EVENTO 4
    { id: '10', descripcion: 'Locro',  monto:'40000,00',eventsParticipantsId: '15',  date: '2025-04-10' },
    { id: '11', descripcion: 'Helado',  monto:'42000,00',eventsParticipantsId: '14',  date: '2025-04-10' },
    { id: '12', descripcion: 'Bebidas',  monto:'58000,00',eventsParticipantsId: '13',  date: '2025-04-10' },
    { id: '13', descripcion: 'Bebidas',  monto:'30000,00',eventsParticipantsId: '18',  date: '2025-04-10' },
    { id: '14', descripcion: 'Tarta',  monto:'30000,00',eventsParticipantsId: '19',  date: '2025-04-10' },
    { id: '15', descripcion: 'Carne',  monto:'60000,00',eventsParticipantsId: '16',  date: '2025-04-10' },
  
  ];

  export const sampleUsers = [
    { 
      id: '1', 
      nombre: 'Lucas Paez Allende', 
      usuario: 'lucas.paez.allende', 
      email: 'demo@splitsmart.com', 
      contraseña: 'Demo123', 
      celular: '3516175809', 
      imagenProfile: require('../assets/avatar.png')
    },
    { 
      id: '2', 
      nombre: 'Ana Perez', 
      usuario: 'ana.perez', 
      email: 'ana@example.com', 
      contraseña: 'ana1234', 
      celular: '3512356789', 
      imagenProfile: null
    },
    { 
      id: '3', 
      nombre: 'Martin Gomez', 
      usuario: 'martin.gomez', 
      email: 'martin@example.com', 
      contraseña: 'martin2023', 
      celular: '3516789012', 
      imagenProfile: null
    },
    { 
      id: '4', 
      nombre: 'Carolina Sanchez', 
      usuario: 'caro.sanchez', 
      email: 'caro@example.com', 
      contraseña: 'caro4567', 
      celular: '3513456789', 
      imagenProfile: null
    },
    { 
      id: '5', 
      nombre: 'Santiago Lopez', 
      usuario: 'santi.lopez', 
      email: 'santi@example.com', 
      contraseña: 'santi9876', 
      celular: '3514567890', 
      imagenProfile: null
    }
  ];
