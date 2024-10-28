class AppointmentManager extends AppointmentScheduler {
    constructor() {
        super();
        this.timeslots = [
            '8:00-9:00', '9:00-10:00', '10:00-11:00', '11:00-12:00',
            '1:00-2:00', '2:00-3:00', '3:00-4:00', '4:00-5:00'
        ];

        // Initialize the week table
        this.updateWeekTable();

        // Set up additional event listeners
        this.confirmAppointmentButton = document.getElementById('confirm-appointment');
        this.cancelConfirmationButton = document.getElementById('cancel-confirmation');
        
        // Add event listeners to buttons
        if (this.confirmAppointmentButton && this.cancelConfirmationButton) {
            this.confirmAppointmentButton.addEventListener('click', () => this.handleConfirm());
            this.cancelConfirmationButton.addEventListener('click', () => this.hideConfirmationBox());
        }

        // Initialize the confirmation box
        this.confirmationBox = document.getElementById('confirmation-box');
    }

    // Method to update the week table with time slots
    updateWeekTable() {
        const monday = this.getMonday(this.currentWeekStart);
        this.dateHeader.innerHTML = '';
        this.timeSlots.innerHTML = '';

        // Set week range display
        const friday = new Date(monday);
        friday.setDate(friday.getDate() + 4);
        this.weekRange.textContent = `${this.formatDate(monday)} - ${this.formatDate(friday)}`;

        // Populate the date header
        for (let i = 0; i < 5; i++) {
            const date = new Date(monday);
            date.setDate(monday.getDate() + i);
            const th = document.createElement('th');
            th.textContent = `${this.formatDate(date)}`;
            this.dateHeader.appendChild(th);
        }

        // Populate the time slots for each day
        this.timeslots.forEach(slot => {
            const row = document.createElement('tr');
            for (let i = 0; i < 5; i++) {
                const td = document.createElement('td');
                const button = document.createElement('button');
                button.textContent = slot;
                button.className = 'timeslot-button';
                button.dataset.time = slot;

                const currentDate = new Date(monday);
                currentDate.setDate(monday.getDate() + i);
                button.dataset.date = this.formatDate(currentDate);

                // Event listener to highlight the selected slot
                button.addEventListener('click', () => {
                    this.selectTimeSlot(button);
                });

                td.appendChild(button);
                row.appendChild(td);
            }
            this.timeSlots.appendChild(row);
        });
    }

    // Method to handle time slot selection
    selectTimeSlot(button) {
        document.querySelectorAll('.timeslot-button').forEach(btn => btn.classList.remove('selected'));
        button.classList.add('selected');
        this.selectedDate = button.dataset.date; // Store the selected date
        this.selectedTime = button.dataset.time; // Store the selected time
        this.showConfirmationBox(); // Show the confirmation box
    }

    // Show confirmation box
    showConfirmationBox() {
        const confirmationDetails = document.getElementById('confirmation-details');
        if (confirmationDetails) {
            confirmationDetails.textContent = `Confirm appointment on ${this.selectedDate} at ${this.selectedTime}?`;
            this.confirmationBox.style.display = 'block'; // Show confirmation box
        }
    }

    // Hide confirmation box
    hideConfirmationBox() {
        this.confirmationBox.style.display = 'none'; // Hide confirmation box
    }

// Handle confirmation of appointment
// Handle confirmation of appointment
async handleConfirm() {
    const name = document.getElementById('name').value;
    const service = document.getElementById('service').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;

    const appointmentData = {
        name,
        service,
        date: this.selectedDate,
        time: this.selectedTime,
        phone,
        email
    };

    try {
        const response = await fetch('http://localhost:5000/api/appointments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(appointmentData)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        this.displayConfirmedAppointment(data);
        alert('Appointment confirmed!'); // Alert after confirmation

        // Clear input fields after confirmation
        this.clearInputFields();
        
        // Hide confirmation box
        this.hideConfirmationBox();
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

// Method to show confirmation message in the box
showConfirmationMessage(message) {
    const confirmationDetails = document.getElementById('confirmation-details');
    confirmationDetails.textContent = message;
    this.confirmationBox.style.display = 'block'; // Ensure the box is displayed
}


    // Method to clear input fields
    clearInputFields() {
        document.getElementById('name').value = '';
        document.getElementById('service').value = '';
        document.getElementById('phone').value = '';
        document.getElementById('email').value = '';
    }

    // Display confirmed appointment
    displayConfirmedAppointment(appointment) {
        const appointmentItem = document.createElement('div');
        appointmentItem.textContent = `${appointment.name} - ${appointment.service} on ${appointment.date} at ${appointment.time}`;
        const confirmedAppointmentsList = document.getElementById('confirmed-appointments-list');
        if (confirmedAppointmentsList) {
            confirmedAppointmentsList.appendChild(appointmentItem);
        }
    }
}

// Initialize the AppointmentManager
document.addEventListener('DOMContentLoaded', () => {
    new AppointmentManager();
});
