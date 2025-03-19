document.getElementById('eventForm').addEventListener('submit', function(event) {
    event.preventDefault();

    let eventName = document.getElementById('eventName').value;
    let eventDate = document.getElementById('eventDate').value;
    let eventTime = document.getElementById('eventTime').value;
    let eventVenue = document.getElementById('eventVenue').value;
    let eventBudget = document.getElementById('eventBudget').value;
    let numSeats = document.getElementById('numSeats').value;

    let guestNames = [];
    for (let i = 0; i < numSeats; i++) {
        guestNames.push(document.getElementById(`guestName${i}`).value);
    }

    let data = {
        eventName: eventName,
        eventDate: eventDate,
        eventTime: eventTime,
        eventVenue: eventVenue,
        eventBudget: eventBudget,
        numSeats: numSeats,
        guestNames: guestNames
    };

    // Store event time in local storage
    localStorage.setItem('eventDateTime', `${eventDate}T${eventTime}`);

    fetch('/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        let output = `
            <h2>Event Details</h2>
            <p>Event Name: ${data.eventDetails.eventName}</p>
            <p>Date: ${data.eventDetails.eventDate}</p>
            <p>Time: ${data.eventDetails.eventTime}</p>
            <p>Venue: ${data.eventDetails.eventVenue}</p>
            <p>Budget: ${data.eventDetails.eventBudget}</p>
            <p>Number of Seats: ${data.eventDetails.numSeats}</p>
            <h3>Guest Names</h3>
            <p>Seats are allocated as follows:</p>
            <ul>
                ${data.eventDetails.guestNames.map((name, index) => `<li>Seat ${index + 1}: ${name}</li>`).join('')}
            </ul>
            <p>${data.message}</p>
        `;

        document.getElementById('output').innerHTML = output;
    })
    .catch(error => console.error('Error:', error));
});

function generateGuestFields() {
    let numSeats = document.getElementById('numSeats').value;
    let guestNamesDiv = document.getElementById('guestNames');
    guestNamesDiv.innerHTML = '';

    for (let i = 0; i < numSeats; i++) {
        guestNamesDiv.innerHTML += `
            <label for="guestName${i}">Guest Name ${i + 1}:</label>
            <input type="text" id="guestName${i}" name="guestName${i}" required>
        `;
    }
}


