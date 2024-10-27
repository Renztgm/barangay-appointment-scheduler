const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors()); // Enable CORS for all requests
app.use(bodyParser.json()); // Parse JSON request bodies

let appointments = []; // Temporary storage for appointments
let appointmentIdCounter = 1; // Start the counter from 1

// POST endpoint to create a new appointment
app.post('/api/appointments', (req, res) => {
    const { name, service, date, time, phone, email } = req.body;

    if (!name || !service || !date || !time || !phone || !email) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    const newAppointment = {
        id: appointmentIdCounter++,
        name,
        service,
        date,
        time,
        status: 'Pending',
        number: phone,
        email: email
    };

    appointments.push(newAppointment);
    res.status(201).json(newAppointment);
});


// GET endpoint to retrieve all appointments
app.get('/api/appointments', (req, res) => {
    res.json(appointments); // Send the list of appointments as a response
});

// GET endpoint to retrieve an appointment by ID
app.get('/api/appointments/:id', (req, res) => {
    const { id } = req.params;
    const appointment = appointments.find(app => app.id === parseInt(id)); // Find the appointment by ID
    if (appointment) {
        res.json(appointment); // Return the found appointment
    } else {
        res.status(404).json({ message: 'Appointment not found' }); // Handle not found
    }
});

// PATCH endpoint to accept an appointment
app.patch('/api/appointments/:id/accept', (req, res) => {
    const { id } = req.params;
    const appointment = appointments.find(app => app.id === parseInt(id));

    if (appointment) {
        appointment.status = 'Accepted'; // Update the status to Accepted
        res.status(200).json(appointment); // Send the updated appointment back
    } else {
        res.status(404).json({ message: 'Appointment not found' }); // Handle not found
    }
});

// PATCH endpoint to decline an appointment
app.patch('/api/appointments/:id/decline', (req, res) => {
    const { id } = req.params;
    const appointment = appointments.find(app => app.id === parseInt(id));

    if (appointment) {
        appointment.status = 'Declined'; // Update the status to Declined
        res.status(200).json(appointment); // Send the updated appointment back
    } else {
        res.status(404).json({ message: 'Appointment not found' }); // Handle not found
    }
});

// PATCH endpoint to reschedule an appointment
app.patch('/api/appointments/:id/reschedule', (req, res) => {
    const { id } = req.params;
    const appointment = appointments.find(app => app.id === parseInt(id));

    if (appointment) {
        const { newDate, newTime } = req.body;
        appointment.date = newDate; // Update the date
        appointment.time = newTime; // Update the time
        appointment.status = 'Rescheduled'; // Update the status to Rescheduled
        res.status(200).json(appointment); // Send the updated appointment back
    } else {
        res.status(404).json({ message: 'Appointment not found' }); // Handle not found
    }
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
