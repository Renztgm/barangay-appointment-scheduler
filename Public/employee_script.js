document.getElementById('fetch-schedule').addEventListener('click', async () => {
    const response = await fetch('http://localhost:5000/api/appointments');

    if (response.ok) {
        const appointments = await response.json();
        const scheduleList = document.getElementById('schedule-list');
        scheduleList.innerHTML = ''; // Clear the table before adding new rows

        if (appointments.length === 0) {
            document.getElementById('response-message').textContent = 'No appointments scheduled.';
        } else {
            appointments.forEach(appointment => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${appointment.id}</td>  <!-- Include ID here -->
                    <td>${appointment.name}</td>
                    <td>${appointment.service}</td>
                    <td>${appointment.date}</td>
                    <td>${appointment.time}</td>
                `;
                scheduleList.appendChild(row);
            });
            document.getElementById('response-message').textContent = 'Schedule retrieved successfully.';
        }
    } else {
        document.getElementById('response-message').textContent = 'Failed to fetch schedule.';
    }
});

// Function to load existing appointments on page load
async function loadAppointments() {
    const response = await fetch('http://localhost:5000/api/appointments');
    const appointments = await response.json();
    appointments.forEach(addAppointmentToList); // Populate existing appointments
}

// Function to add appointment to the list
function addAppointmentToList(appointment) {
    const li = document.createElement('li');
    li.textContent = `ID: ${appointment.id} - ${appointment.name} - ${appointment.service} on ${appointment.date} at ${appointment.time}`;
    document.getElementById('appointments-list').appendChild(li);
}

// Call to load existing appointments on page load
loadAppointments();
