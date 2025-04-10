const rooms = [
    {
        id: 'HAB-001',
        name: 'Habitación 1',
        type: 'Doble',
        capacity: 2,
        price: 80,
        amenities: ['TV', 'Aire acondicionado', 'Baño privado']
    },
    {
        id: 'HAB-002',
        name: 'Habitación 2', 
        type: 'Individual',
        capacity: 1,
        price: 50,
        amenities: ['Ventilador', 'Baño compartido']
    },
    {
        id: 'HAB-003',
        name: 'Habitación 3',
        type: 'Familiar',
        capacity: 4,
        price: 120,
        amenities: ['TV', 'Aire acondicionado', 'Baño privado', 'Cuna disponible']
    }
];

const reservations = [
    {
        id: 'RES-001',
        guest: 'María González',
        roomId: 'HAB-001',
        checkIn: '2023-06-15',
        checkOut: '2023-06-18',
        channel: 'Booking.com',
        status: 'confirmada',
        payment: 'completo',
        notes: 'Llegada tarde',
        total: 240
    },
    {
        id: 'RES-002',
        guest: 'Carlos Mendoza',
        roomId: 'HAB-002',
        checkIn: '2023-06-16',
        checkOut: '2023-06-20',
        channel: 'Airbnb',
        status: 'pendiente',
        payment: 'depósito',
        notes: 'Requiere cuna',
        total: 200
    },
    {
        id: 'RES-003',
        guest: 'Ana Torres',
        roomId: 'HAB-003',
        checkIn: '2023-06-17',
        checkOut: '2023-06-19',
        channel: 'WhatsApp',
        status: 'confirmada',
        payment: 'pendiente',
        notes: 'Vegetariana',
        total: 240
    }
];

// Opciones para filtros
const statusOptions = ['confirmada', 'pendiente', 'cancelada'];
const paymentOptions = ['completo', 'depósito', 'pendiente', 'reembolsado'];
const channelOptions = ['Booking.com', 'Airbnb', 'WhatsApp', 'Directa'];

// Calcular estadísticas
function getStats() {
    const confirmed = reservations.filter(r => r.status === 'confirmada').length;
    const pending = reservations.filter(r => r.status === 'pendiente').length;
    const revenue = reservations.reduce((sum, r) => r.status === 'confirmada' ? sum + r.total : sum, 0);
    const occupied = [...new Set(reservations.filter(r => r.status === 'confirmada').map(r => r.roomId))].length;
    
    return {
        confirmed,
        pending,
        revenue,
        occupied,
        totalRooms: rooms.length
    };
}
