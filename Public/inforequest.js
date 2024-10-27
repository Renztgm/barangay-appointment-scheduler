// Function to get URL parameters
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

const appointmentId = getUrlParameter('id'); // Get the appointment ID from the URL

async function loadAppointmentInfo() {
    const response = await fetch(`http://localhost:5000/api/appointments/${appointmentId}`);
    if (response.ok) {
        const appointment = await response.json();
        document.getElementById('request-id').textContent = appointment.id;
        document.getElementById('request-name').textContent = appointment.name;
        document.getElementById('request-service').textContent = appointment.service;
        document.getElementById('request-date').textContent = appointment.date;
        document.getElementById('request-time').textContent = appointment.time;
        document.getElementById('request-status').textContent = appointment.status || 'Pending';
        document.getElementById('request-phone').textContent = appointment.number || 'N/A'; // Adjust according to your appointment structure
        document.getElementById('request-email').textContent = appointment.email || 'N/A'; // Adjust according to your appointment structure
    } else {
        console.error('Failed to fetch appointment details:', response.statusText);
        alert('Failed to fetch appointment details. Please try again later.');
    }
}

// Function to accept an appointment
async function acceptAppointment() {
    const response = await fetch(`http://localhost:5000/api/appointments/${appointmentId}/accept`, {
        method: 'PATCH',
    });
    if (response.ok) {
        alert('Appointment accepted successfully!');
        loadAppointmentInfo(); // Refresh appointment info
    } else {
        const errorText = await response.text(); // Get the error response text
        console.error('Error:', response.status, errorText); // Log status and error text
        alert('Failed to accept appointment. Please try again later.');
    }
}

// Function to decline an appointment
async function declineAppointment() {
    const response = await fetch(`http://localhost:5000/api/appointments/${appointmentId}/decline`, {
        method: 'PATCH',
    });
    if (response.ok) {
        alert('Appointment declined successfully!');
        loadAppointmentInfo(); // Refresh appointment info
    } else {
        const errorText = await response.text(); // Get the error response text
        console.error('Error:', response.status, errorText); // Log status and error text
        alert('Failed to decline appointment. Please try again later.');
    }
}

// Function to reschedule an appointment
async function rescheduleAppointment() {
    const newDate = prompt('Enter new date (YYYY-MM-DD):');
    const newTime = prompt('Enter new time (HH:MM):');

    const response = await fetch(`http://localhost:5000/api/appointments/${appointmentId}/reschedule`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newDate, newTime }),
    });

    if (response.ok) {
        alert('Appointment rescheduled successfully!');
        loadAppointmentInfo(); // Refresh appointment info
    } else {
        const errorText = await response.text(); // Get the error response text
        console.error('Error:', response.status, errorText); // Log status and error text
        alert('Failed to reschedule appointment. Please try again later.');
    }
}

// Load appointment info on page load
loadAppointmentInfo();

// Event listeners for buttons
document.getElementById('accept-request').addEventListener('click', acceptAppointment);
document.getElementById('decline-request').addEventListener('click', declineAppointment);
document.getElementById('reschedule-request').addEventListener('click', rescheduleAppointment);
