const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors()); // Enable CORS for all requests
app.use(bodyParser.json()); // Parse JSON request bodies

let appointments = []; // Temporary storage for appointments
let appointmentIdCounter = 1632261020240000001; // Start the counter from your specified ID

// POST endpoint to create a new appointment
app.post('/api/appointments', (req, res) => {
    const { name, service, date, time } = req.body;

    // Create a new appointment object with an auto-generated ID
    const newAppointment = {
        id: appointmentIdCounter++, // Increment the counter for each new appointment
        name,
        service,
        date,
        time,
    };

    // Store the new appointment in the array
    appointments.push(newAppointment);
    
    // Send the newly created appointment back to the client
    res.status(201).json(newAppointment);
});

// GET endpoint to retrieve all appointments
app.get('/api/appointments', (req, res) => {
    res.json(appointments); // Send the list of appointments as a response
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
