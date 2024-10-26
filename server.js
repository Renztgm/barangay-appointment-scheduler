const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
let appointments = []; // Temporary storage for appointments

// POST endpoint to create a new appointment
app.post('/api/appointments', (req, res) => {
    const { name, service, date, time } = req.body;
    const newAppointment = { name, service, date, time };
    appointments.push(newAppointment);
    res.status(201).json(newAppointment);
});

// GET endpoint to retrieve all appointments
app.get('/api/appointments', (req, res) => {
    res.json(appointments);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
