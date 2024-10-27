document.addEventListener('DOMContentLoaded', () => {
    const dateHeader = document.getElementById('date-header');
    const timeSlots = document.getElementById('time-slots');
    const weekRange = document.getElementById('week-range');
    const prevWeekButton = document.getElementById('prev-week');
    const nextWeekButton = document.getElementById('next-week');
    const confirmationModal = document.getElementById('confirmation-modal');
    const confirmationDetails = document.getElementById('confirmation-details');
    const confirmAppointmentButton = document.getElementById('confirm-appointment');
    const cancelConfirmationButton = document.getElementById('cancel-confirmation');
    const form = document.getElementById('form');

    // Array of time slots
    const timeslots = [
        '8:00-9:00', '9:00-10:00', '10:00-11:00', '11:00-12:00',
        '1:00-2:00', '2:00-3:00', '3:00-4:00', '4:00-5:00'
    ];

    let currentWeekStart = new Date();
    let selectedDate = null;
    let selectedTime = null;

    // Function to get the Monday of the current week
    function getMonday(d) {
        d = new Date(d);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(d.setDate(diff));
    }

    // Format date as "MMM DD YYYY"
    function formatDate(date) {
        const options = { month: 'short', day: '2-digit', year: 'numeric' };
        return date.toLocaleDateString(undefined, options);
    }

    // Update the table for the current week
    function updateWeekTable() {
        const monday = getMonday(currentWeekStart);
        dateHeader.innerHTML = '';
        timeSlots.innerHTML = '';

        // Set week range display
        const friday = new Date(monday);
        friday.setDate(friday.getDate() + 4);
        weekRange.textContent = `${formatDate(monday)} - ${formatDate(friday)}`;

        // Populate the date header
        for (let i = 0; i < 5; i++) {
            const date = new Date(monday);
            date.setDate(monday.getDate() + i);
            const th = document.createElement('th');
            th.textContent = `${formatDate(date)}`;
            dateHeader.appendChild(th);
        }

        // Populate the time slots for each day
        timeslots.forEach(slot => {
            const row = document.createElement('tr');
            for (let i = 0; i < 5; i++) {
                const td = document.createElement('td');
                const button = document.createElement('button');
                button.textContent = slot;
                button.className = 'timeslot-button';
                button.dataset.time = slot;
                button.dataset.date = new Date(monday).setDate(monday.getDate() + i);

                // Event listener to highlight the selected slot
                button.addEventListener('click', () => {
                    document.querySelectorAll('.timeslot-button').forEach(btn => btn.classList.remove('selected'));
                    button.classList.add('selected');
                    selectedDate = button.dataset.date; // Store the selected date
                    selectedTime = button.dataset.time; // Store the selected time
                    showConfirmationModal(selectedDate, selectedTime);
                });

                td.appendChild(button);
                row.appendChild(td);
            }
            timeSlots.appendChild(row);
        });
    }

    // Show the confirmation modal
    function showConfirmationModal(date, time) {
        const selectedDateObj = new Date(parseInt(date));
        confirmationDetails.textContent = `Appointment scheduled on ${formatDate(selectedDateObj)} at ${time}.`;
        confirmationModal.style.display = 'block';
    }

    // Hide the confirmation modal
    function hideConfirmationModal() {
        confirmationModal.style.display = 'none';
    }

    // Handle week navigation
    prevWeekButton.addEventListener('click', () => {
        currentWeekStart.setDate(currentWeekStart.getDate() - 7);
        updateWeekTable();
    });

    nextWeekButton.addEventListener('click', () => {
        currentWeekStart.setDate(currentWeekStart.getDate() + 7);
        updateWeekTable();
    });

    // Confirm appointment
    confirmAppointmentButton.addEventListener('click', async () => {
        const name = document.getElementById('name').value;
        const service = document.getElementById('service').value;
        const phone = document.getElementById('phone').value;
        const email = document.getElementById('email').value;

        const appointmentData = {
            name,
            service,
            date: selectedDate,
            time: selectedTime,
            phone,
            email
        };

        try {
            const response = await fetch('http://localhost:5000/api/appointments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(appointmentData)
            });

            if (!response.ok) {
                throw new Error('Failed to submit appointment.'); // Handle error responses
            }

            const data = await response.json();
            alert('Appointment confirmed: ' + JSON.stringify(data));
            hideConfirmationModal(); // Hide the modal after confirming
            form.reset(); // Optionally reset the form here
            updateWeekTable(); // Refresh the week table if needed
        } catch (error) {
            console.error(error); // Log the error to console
            alert(error.message); // Show the error message to the user
        }
    });

    // Cancel confirmation
    cancelConfirmationButton.addEventListener('click', hideConfirmationModal);

    // Initialize the week table
    updateWeekTable();
});
