function deleteFlight(id) {
  fetch(`http://localhost:5000/flights/${id}`, { method: "DELETE" })
    .then(() => location.reload());
}

function markFull(id) {
  fetch(`http://localhost:5000/flights/${id}`)
    .then(res => res.json())
    .then(flight => {
      flight.seats = 0;
      return fetch(`http://localhost:5000/flights/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(flight)
      });
    })
    .then(() => location.reload());
}

function loadFlights() {
  fetch("http://localhost:5000/flights")
    .then(res => res.json())
    .then(flights => {
      const now = new Date();

      const upcoming = flights.filter(f => new Date(`${f.date}T${f.time}`) >= now);
      const past = flights.filter(f => new Date(`${f.date}T${f.time}`) < now);

      renderFlights(upcoming, "upcomingFlightsList");
      renderFlights(past, "pastFlightsList");
    });
}

function renderFlights(flights, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  if (flights.length === 0) {
    container.innerHTML = "<p>No flights found.</p>";
    return;
  }

  flights.forEach(flight => {
    const card = document.createElement("div");
    card.className = "flight-card";
    card.innerHTML = `
      <h3>${flight.from} ➜ ${flight.to}</h3>
      <p><strong>Date:</strong> ${flight.date}</p>
      <p><strong>Time:</strong> ${flight.time}</p>
      <p><strong>Price:</strong> ₹${flight.price}</p>
      <p><strong>Total Seats:</strong> ${flight.seats ?? "N/A"}</p>
      <p><strong>Booked Seats:</strong> ${flight.bookedSeats ?? 0}</p>
      <div class="admin-buttons">
        <button class="delete-btn" onclick="deleteFlight('${flight.id}')">Delete</button>
        <button class="full-btn" onclick="markFull('${flight.id}')">Mark Full</button>
      </div>
    `;
    container.appendChild(card);
  });
}

function startClock() {
  const clockEl = document.getElementById("clock");
  setInterval(() => {
    const now = new Date();
    clockEl.textContent = now.toLocaleString();
  }, 1000);
}

window.onload = () => {
  loadFlights();
  startClock();
};
