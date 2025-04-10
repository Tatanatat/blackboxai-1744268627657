document.addEventListener('DOMContentLoaded', function() {
    // Cargar datos iniciales
    updateDashboard();
    renderReservations();
    setupViewToggle();

    // Configurar listeners
    document.querySelectorAll('select').forEach(select => {
        select.addEventListener('change', filterReservations);
    });
    document.querySelector('input[type="text"]').addEventListener('input', filterReservations);
});

function updateDashboard() {
    const stats = getStats();
    document.getElementById('confirmed-count').textContent = stats.confirmed;
    document.getElementById('pending-count').textContent = stats.pending;
    document.getElementById('occupied-count').textContent = `${stats.occupied}/${stats.totalRooms}`;
    document.getElementById('revenue-count').textContent = `$${stats.revenue}`;
}

function setupViewToggle() {
    const tableViewBtn = document.getElementById('table-view-btn');
    const calendarViewBtn = document.getElementById('calendar-view-btn');
    const tableView = document.getElementById('table-view');
    const calendarView = document.getElementById('calendar-view');

    tableViewBtn.addEventListener('click', () => {
        tableView.classList.remove('hidden');
        calendarView.classList.add('hidden');
        tableViewBtn.classList.add('bg-blue-600', 'text-white');
        tableViewBtn.classList.remove('bg-gray-200', 'text-gray-700');
        calendarViewBtn.classList.add('bg-gray-200', 'text-gray-700');
        calendarViewBtn.classList.remove('bg-blue-600', 'text-white');
    });

    calendarViewBtn.addEventListener('click', () => {
        tableView.classList.add('hidden');
        calendarView.classList.remove('hidden');
        calendarViewBtn.classList.add('bg-blue-600', 'text-white');
        calendarViewBtn.classList.remove('bg-gray-200', 'text-gray-700');
        tableViewBtn.classList.add('bg-gray-200', 'text-gray-700');
        tableViewBtn.classList.remove('bg-blue-600', 'text-white');
        renderCalendar();
    });
}

function renderCalendar() {
    // Implementación básica del calendario
    const calendarView = document.getElementById('calendar-view');
    calendarView.innerHTML = `
        <div class="mb-4">
            <h2 class="text-xl font-semibold">Calendario de Reservas</h2>
            <div class="flex justify-between mt-2">
                <button id="prev-week" class="px-3 py-1 bg-gray-200 rounded-md">← Semana anterior</button>
                <span id="current-week" class="font-medium"></span>
                <button id="next-week" class="px-3 py-1 bg-gray-200 rounded-md">Siguiente semana →</button>
            </div>
        </div>
        <div id="week-view" class="grid grid-cols-7 gap-1">
            ${['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(day => `
                <div class="text-center font-medium py-2">${day}</div>
            `).join('')}
            ${Array(7).fill().map((_, i) => `
                <div class="border p-1 min-h-24">
                    <div class="text-right text-sm">${i+1}</div>
                    ${renderDayReservations(i+1)}
                </div>
            `).join('')}
        </div>
    `;
}

function renderDayReservations(day) {
    const dayReservations = reservations.filter(res => {
        const checkIn = new Date(res.checkIn);
        return checkIn.getDate() === day;
    });

    return dayReservations.map(res => `
        <div class="text-xs p-1 mb-1 bg-blue-100 rounded">
            ${res.guest} (${res.roomId})
        </div>
    `).join('');
}

function renderReservations(reservationsToShow = reservations) {
    const tableBody = document.getElementById('reservations-table');
    tableBody.innerHTML = '';

    reservationsToShow.forEach(res => {
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50';
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${res.id}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${res.guest}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${res.room}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${formatDate(res.checkIn)}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${formatDate(res.checkOut)}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${res.channel}</td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(res.status)}">
                    ${capitalizeFirstLetter(res.status)}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentClass(res.payment)}">
                    ${capitalizeFirstLetter(res.payment)}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <button onclick="editReservation('${res.id}')" class="text-blue-600 hover:text-blue-900 mr-3">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="cancelReservation('${res.id}')" class="text-red-600 hover:text-red-900">
                    <i class="fas fa-times"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function filterReservations() {
    const searchTerm = document.querySelector('input[type="text"]').value.toLowerCase();
    const roomFilter = document.querySelectorAll('select')[0].value;
    const statusFilter = document.querySelectorAll('select')[1].value;

    const filtered = reservations.filter(res => {
        return (res.guest.toLowerCase().includes(searchTerm) || 
                res.id.toLowerCase().includes(searchTerm)) &&
               (roomFilter === 'Todas las habitaciones' || res.room === roomFilter) &&
               (statusFilter === 'Todos los estados' || res.status === statusFilter.toLowerCase());
    });

    renderReservations(filtered);
}

function editReservation(id) {
    const reservation = reservations.find(r => r.id === id);
    if (!reservation) return;

    // In a real app, we would populate the modal form with reservation data
    showToast(`Editando reserva ${id}`, 'info');
    document.getElementById('edit-modal').classList.remove('hidden');
}

function cancelReservation(id) {
    if (confirm(`¿Estás seguro de cancelar la reserva ${id}?`)) {
        const index = reservations.findIndex(r => r.id === id);
        if (index !== -1) {
            reservations[index].status = 'cancelada';
            renderReservations();
            showToast(`Reserva ${id} cancelada`, 'success');
        }
    }
}

// Helper functions
function formatDate(dateString) {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function getStatusClass(status) {
    switch(status) {
        case 'confirmada': return 'bg-green-100 text-green-800';
        case 'pendiente': return 'bg-yellow-100 text-yellow-800';
        case 'cancelada': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
    }
}

function getPaymentClass(payment) {
    switch(payment) {
        case 'completo': return 'bg-green-100 text-green-800';
        case 'depósito': return 'bg-blue-100 text-blue-800';
        case 'pendiente': return 'bg-yellow-100 text-yellow-800';
        case 'reembolsado': return 'bg-purple-100 text-purple-800';
        default: return 'bg-gray-100 text-gray-800';
    }
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast px-4 py-3 rounded-md shadow-md text-white ${
        type === 'info' ? 'bg-blue-500' : 
        type === 'success' ? 'bg-green-500' : 
        'bg-gray-500'
    }`;
    toast.textContent = message;
    
    const container = document.getElementById('toast-container');
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Close modal when clicking outside
document.getElementById('edit-modal').addEventListener('click', function(e) {
    if (e.target === this) {
        this.classList.add('hidden');
    }
});
