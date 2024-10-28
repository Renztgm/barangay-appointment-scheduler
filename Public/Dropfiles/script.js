document.addEventListener('DOMContentLoaded', () => {
    const timeslotTable = document.getElementById('timeslot-table');
    const dateHeader = document.getElementById('date-header');
    const timeSlots = document.getElementById('time-slots');
    const weekRange = document.getElementById('week-range');
    const prevWeekButton = document.getElementById('prev-week');
    const nextWeekButton = document.getElementById('next-week');
    const confirmationModal = document.getElementById('confirmation-modal');
    const confirmationDetails = document.getElementById('confirmation-details');
    const confirmAppointmentButton = document.getElementById('confirm-appointment');
    const cancelConfirmationButton = document.getElementById('cancel-confirmation');

    const timeslots = [
        '8:00-9:00', '9:00-10:00', '10:00-11:00', '11:00-12:00',
        '1:00-2:00', '2:00-3:00', '3:00-4:00', '4:00-5:00'
    ];

    let currentWeekStart = new Date();

    function getMonday(d) {
        d = new Date(d);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(d.setDate(diff));
    }

    function formatDate(date) {
        const options = { month: 'short', day: '2-digit', year: 'numeric' };
        return date.toLocaleDateString(undefined, options);
    }

    function updateWeekTable() {
        const monday = getMonday(currentWeekStart);
        dateHeader.innerHTML = '';
        timeSlots.innerHTML = '';

        const friday = new Date(monday);
        friday.setDate(friday.getDate() + 4);
        weekRange.textContent = `${formatDate(monday)} - ${formatDate(friday)}`;

        for (let i = 0; i < 5; i++) {
            const date = new Date(monday);
            date.setDate(monday.getDate() + i);
            const th = document.createElement('th');
            th.textContent = `${formatDate(date)}`;
            dateHeader.appendChild(th);
        }

        timeslots.forEach(slot => {
            const row = document.createElement('tr');
            for (let i = 0; i < 5; i++) {
                const td = document.createElement('td');
                const button = document.createElement('button');
                button.textContent = slot;
                button.className = 'timeslot-button';
                button.dataset.time = slot;

                button.addEventListener('click', () => {
                    document.querySelectorAll('.timeslot-button').forEach(btn => btn.classList.remove('selected'));
                    button.classList.add('selected');
                    showConfirmationModal(button.dataset.time);
                });

                td.appendChild(button);
                row.appendChild(td);
            }
            timeSlots.appendChild(row);
        });
    }

    function showConfirmationModal(time) {
        confirmationDetails.textContent = `Appointment scheduled at ${time}.`;
        confirmationModal.style.display = 'block';
        confirmAppointmentButton.dataset.time = time; // Store the time in the button
    }

    function hideConfirmationModal() {
        confirmationModal.style.display = 'none';
    }

    prevWeekButton.addEventListener('click', () => {
        currentWeekStart.setDate(currentWeekStart.getDate() - 7);
        updateWeekTable();
    });

    nextWeekButton.addEventListener('click', () => {
        currentWeekStart.setDate(currentWeekStart.getDate() + 7);
        updateWeekTable();
    });

    confirmAppointmentButton.addEventListener('click', () => {
        const selectedButton = document.querySelector('.timeslot-button.selected');
        const time = selectedButton.dataset.time;

        const appointmentData = {
            name: 'John Doe',
            service: 'Consultation',
            time: time,
            phone: '1234567890',
            email: 'john@example.com'
        };

        fetch('http://localhost:5000/api/appointments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(appointmentData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to submit appointment.');
            }
            return response.json();
        })
        .then(data => {
            alert('Appointment confirmed at ' + data.time);
            hideConfirmationModal();
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });

    cancelConfirmationButton.addEventListener('click', hideConfirmationModal);

    updateWeekTable();
});
