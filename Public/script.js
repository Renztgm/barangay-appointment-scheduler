document.getElementById('appointmentForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const service = document.getElementById('service').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;

    const response = await fetch('http://localhost:5000/api/appointments', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, service, date, time })
    });

    const newAppointment = await response.json();
    displayAppointment(newAppointment);
    this.reset(); // Reset form fields
});

// Function to display appointments
async function fetchAppointments() {
    const response = await fetch('http://localhost:5000/api/appointments');
    const appointments = await response.json();
    appointments.forEach(displayAppointment);
}

// Function to display a single appointment
function displayAppointment(appointment) {
    const appointmentsList = document.getElementById('appointmentsList');
    const li = document.createElement('li');
    li.textContent = `${appointment.name} - ${appointment.service} on ${appointment.date} at ${appointment.time}`;
    appointmentsList.appendChild(li);
}

// Fetch appointments on page load
fetchAppointments();
