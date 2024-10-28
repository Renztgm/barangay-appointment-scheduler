class AppointmentScheduler {
    constructor() {
        this.timeslots = [
            '8:00-9:00', '9:00-10:00', '10:00-11:00', '11:00-12:00',
            '1:00-2:00', '2:00-3:00', '3:00-4:00', '4:00-5:00'
        ];
        this.currentWeekStart = new Date();
        this.selectedDate = null;
        this.selectedTime = null;

        this.initElements();
        this.updateWeekTable();
        this.addEventListeners();
    }

    initElements() {
        this.dateHeader = document.getElementById('date-header');
        this.timeSlots = document.getElementById('time-slots');
        this.weekRange = document.getElementById('week-range');
        this.prevWeekButton = document.getElementById('prev-week');
        this.nextWeekButton = document.getElementById('next-week');
        this.confirmationModal = document.getElementById('confirmation-modal');
        this.confirmationDetails = document.getElementById('confirmation-details');
        this.confirmAppointmentButton = document.getElementById('confirm-appointment');
        this.cancelConfirmationButton = document.getElementById('cancel-confirmation');
        this.form = document.getElementById('form');
        this.confirmedAppointmentsList = document.getElementById('confirmed-appointments-list');
    }

    getMonday(d) {
        d = new Date(d);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(d.setDate(diff));
    }

    formatDate(date) {
        const options = { month: 'short', day: '2-digit', year: 'numeric' };
        return date.toLocaleDateString(undefined, options);
    }

    showConfirmationModal(date, time) {
        this.confirmationDetails.textContent = `Appointment scheduled on ${date} at ${time}.`;
        this.confirmationModal.style.display = 'block';
    }

    hideConfirmationModal() {
        this.confirmationModal.style.display = 'none';
    }

    addEventListeners() {
        this.prevWeekButton.addEventListener('click', () => {
            this.currentWeekStart.setDate(this.currentWeekStart.getDate() - 7);
            this.updateWeekTable();
        });

        this.nextWeekButton.addEventListener('click', () => {
            this.currentWeekStart.setDate(this.currentWeekStart.getDate() + 7);
            this.updateWeekTable();
        });
    }

    updateWeekTable() {
        // This method should be implemented in the derived class
        throw new Error("updateWeekTable method must be implemented.");
    }
}
