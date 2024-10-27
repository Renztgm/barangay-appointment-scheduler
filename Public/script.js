// script.js

// Function to generate time slots and date headers
function generateTimeSlots() {
    const timeSlotsBody = document.getElementById('time-slots-body');
    const dateHeaders = document.getElementById('date-headers');

    const timeSlots = [
        "8:00-9:00", "9:00-10:00", "10:00-11:00", "11:00-12:00",
        "1:00-2:00", "2:00-3:00", "3:00-4:00", "4:00-5:00"
    ];

    // Generate date headers for the current date and the next four days
    const currentDate = new Date();
    for (let i = 0; i < 5; i++) {
        const date = new Date(currentDate);
        date.setDate(currentDate.getDate() + i);
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        const dateString = date.toLocaleDateString('en-US', options).toUpperCase();
        const th = document.createElement('th');
        th.textContent = dateString; // Set the date as header text
        dateHeaders.appendChild(th);
    }

    // Create a row for each time slot
    timeSlots.forEach(slot => {
        const row = document.createElement('tr');

        // Create cells for each day of the week with button boxes
        for (let day = 1; day <= 5; day++) {
            const cell = document.createElement('td');
            const button = document.createElement('button');
            button.textContent = slot; // Embed the time slot text on the button
            button.className = 'time-button'; // Add a class for styling if needed

            // Add click event to store the selected time and day
            button.addEventListener('click', () => {
                // Remove highlight from all buttons
                const allButtons = document.querySelectorAll('.time-button');
                allButtons.forEach(btn => btn.classList.remove('selected'));

                // Highlight the selected button
                button.classList.add('selected');

                // Get input values
                const name = document.getElementById('name').value;
                const service = document.getElementById('service').value;
                const phone = document.getElementById('phone').value;
                const email = document.getElementById('email').value;

                // Send the appointment details to the server
                fetch('http://localhost:5000/api/appointments', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name,
                        service,
                        date: dateHeaders.children[day - 1].textContent, // Date from header
                        time: slot,
                        phone,
                        email
                    }),
                })
                .then(response => {
                    if (!response.ok) throw new Error('Network response was not ok');
                    return response.json();
                })
                .then(data => {
                    document.getElementById('response-message').textContent = `Appointment scheduled: ${data.name} for ${data.service} on ${data.date} at ${data.time}. Phone: ${data.number}, Email: ${data.email}`;
                })
                .catch(error => {
                    console.error('Error:', error);
                    document.getElementById('response-message').textContent = 'Failed to schedule appointment.';
                });
            });

            cell.appendChild(button); // Add button to the cell
            row.appendChild(cell); // Add cell to the row
        }

        timeSlotsBody.appendChild(row); // Append the row to the table body
    });
}

// Call the function to generate time slots when the document loads
document.addEventListener('DOMContentLoaded', generateTimeSlots);
