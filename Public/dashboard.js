// Function to view requester information based on ID
async function viewRequesterInfo(id) {
    try {
        const response = await fetch(`http://localhost:5000/api/appointments/${id}`); // Fetch the requester info from the server
        if (!response.ok) {
            throw new Error('Failed to fetch requester information');
        }

        const info = await response.json(); // Parse JSON response

        // Populate modal with requester details
        const modalContent = `
            <p><strong>ID:</strong> ${info.id}</p>
            <p><strong>Name:</strong> ${info.name}</p>
            <p><strong>Service:</strong> ${info.service}</p>
            <p><strong>Date:</strong> ${info.date}</p>
            <p><strong>Time:</strong> ${info.time}</p>
            <p><strong>Status:</strong> ${info.status}</p>
            <p><strong>Number:</strong> ${info.number}</p>
            <p><strong>Email:</strong> ${info.email}</p>
        `;
        document.getElementById('modal-body-content').innerHTML = modalContent;
    } catch (error) {
        console.error('Error fetching requester information:', error);
        document.getElementById('modal-body-content').innerHTML = '<p>No information found.</p>';
    }
    
    // Show the modal
    $('#infoModal').modal('show');
}

// Function to populate appointment summary
async function populateAppointmentSummary() {
    const appointmentSummary = document.getElementById('appointment-summary');
    appointmentSummary.innerHTML = ''; // Clear existing rows

    try {
        const response = await fetch('http://localhost:5000/api/appointments'); // Fetch appointments from the server
        if (!response.ok) {
            throw new Error('Failed to fetch appointments');
        }

        const appointments = await response.json(); // Parse JSON response

        appointments.forEach(appointment => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${appointment.id}</td>
                <td>${appointment.name}</td>
                <td>${appointment.service}</td>
                <td>${appointment.date}</td>
                <td>${appointment.time}</td>
                <td>${appointment.status}</td>
                <td>
                    <button class="btn btn-info" onclick="viewRequesterInfo('${appointment.id}')">View Info</button>
                </td>
            `;
            appointmentSummary.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching appointments:', error);
        appointmentSummary.innerHTML = '<tr><td colspan="7">Error fetching appointment data.</td></tr>';
    }
}

// Populate appointment summary when the dashboard loads
document.addEventListener('DOMContentLoaded', populateAppointmentSummary);

function viewRequesterInfo(id) {
    // Redirect to the inforequest.html with the appointment ID
    window.location.href = `inforequest.html?id=${id}`;
}
