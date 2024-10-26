document.getElementById('form').addEventListener('submit', async (e) => {
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
    document.getElementById('response-message').textContent = `Appointment scheduled: ${newAppointment.name} for ${newAppointment.service} on ${newAppointment.date} at ${newAppointment.time}`;
    addAppointmentToList(newAppointment); // Call to update the UI
});

async function loadAppointments() {
    const response = await fetch('http://localhost:5000/api/appointments');
    const appointments = await response.json();
    appointments.forEach(addAppointmentToList); // Populate existing appointments
}

function addAppointmentToList(appointment) {
    const li = document.createElement('li');
    li.textContent = `ID: ${appointment.id} - ${appointment.name} - ${appointment.service} on ${appointment.date} at ${appointment.time}`;
    document.getElementById('appointments-list').appendChild(li);
}

loadAppointments(); // Load existing appointments on page load
