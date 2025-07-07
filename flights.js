const user = JSON.parse(localStorage.getItem("loggedInUser"));
if (!user) {
  window.location.replace("index.html");
}

document.getElementById("username").innerText = user.name || "User";

function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "index.html";
}

function getCurrentDateTime() {
  const now = new Date();
  const date = now.toISOString().split("T")[0];
  const time = now.toTimeString().split(" ")[0].slice(0, 5);
  return { date, time };
}

function isPastFlight(flight) {
  const { date: today, time: nowTime } = getCurrentDateTime();
  if (flight.date < today) return true;
  if (flight.date === today && flight.time <= nowTime) return true;
  return false;
}

function loadAllFlights() {
  fetch("http://localhost:5000/flights")
    .then(res => res.json())
    .then(flights => {
      const upcomingFlights = flights.filter(f => !isPastFlight(f));
      displayFlights(upcomingFlights);
    });
}

function searchFlights() {
  const fromInput = document.getElementById("fromInput").value.trim().toLowerCase();
  const toInput = document.getElementById("toInput").value.trim().toLowerCase();
  const dateInput = document.getElementById("dateInput").value;

  fetch("http://localhost:5000/flights")
    .then(res => res.json())
    .then(flights => {
      const upcomingFlights = flights.filter(f => !isPastFlight(f));
      const filtered = upcomingFlights.filter(flight => {
        const fromMatch = flight.from.toLowerCase().includes(fromInput);
        const toMatch = flight.to.toLowerCase().includes(toInput);
        const dateMatch = dateInput ? flight.date === dateInput : true;
        return fromMatch && toMatch && dateMatch;
      });

      displayFlights(filtered);

      if (filtered.length === 0) {
        const container = document.getElementById("flightsContainer");
        container.innerHTML = `<p style="color:#b10000;font-weight:bold;">No matching flights found.</p>`;
      }
    });
}

let userBookings = [];

function displayFlights(data) {
  const container = document.getElementById("flightsContainer");
  container.innerHTML = "";

  data.forEach(flight => {
    const availableSeats = flight.seats - (flight.bookedSeats || 0);
    const isFull = availableSeats <= 0;

    const hasSameTime = userBookings.some(
      b => b.date === flight.date && b.time === flight.time
    );

    const isAlreadyBooked = userBookings.some(b => b.flightId === flight.id);

    const card = document.createElement("div");
    card.className = "flight-card";
    const buttonText = isFull ? "Full" : isAlreadyBooked ? "Booked" : "Book";
    const buttonClass = isAlreadyBooked ? "booked-btn" : "";

    card.innerHTML = `
      <h3>${flight.from} ➜ ${flight.to}</h3>
      <p><strong>Date:</strong> ${flight.date}</p>
      <p><strong>Time:</strong> ${flight.time}</p>
      <p><strong>Remaining Seats:</strong> ${availableSeats}</p>
      <p class="price">₹${flight.price}</p>
      <div class="payment-section">
        <button class="${buttonClass}" ${isFull || hasSameTime ? "disabled" : ""}
          onclick="openPaymentPage('${flight.id}')">${buttonText}</button>
      </div>
    `;

    container.appendChild(card);
  });
}

function openPaymentPage(flightId) {
  localStorage.setItem("selectedFlightId", flightId);
  window.location.href = "payment.html";
}

function getUserBookings() {
  fetch(`http://localhost:5000/bookings?userId=${user.id}`)
    .then(res => res.json())
    .then(bookings => {
      userBookings = bookings;
      const list = document.getElementById("bookingList");
      list.innerHTML = "";
      bookings.forEach(b => {
        fetch(`http://localhost:5000/flights/${b.flightId}`)
          .then(res => res.json())
          .then(flight => {
            if (flight) {
              const li = document.createElement("li");
              const cancelBtn = document.createElement("button");
              cancelBtn.textContent = "Cancel";
              cancelBtn.onclick = () => confirmCancel(b.id, flight, b.seats);
              cancelBtn.classList.add("cancel-btn");

              li.innerHTML = `
                ${flight.from} → ${flight.to} (${flight.date})
                <br/><br/>
              `;
              li.appendChild(cancelBtn);
              list.appendChild(li);
            }
          });
      });
    });
}

function confirmCancel(bookingId, flight, seats) {
  const modal = document.getElementById("cancelModal");
  const msg = document.getElementById("cancelFlightText");
  msg.textContent = `Are you sure to cancel ${flight.from} → ${flight.to} on ${flight.date}?`;

  modal.style.display = "flex";

  document.getElementById("modal-confirm").onclick = async () => {
    await fetch(`http://localhost:5000/bookings/${bookingId}`, { method: "DELETE" });

    const updatedSeats = (flight.bookedSeats || 0) - seats;
    await fetch(`http://localhost:5000/flights/${flight.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookedSeats: updatedSeats })
    });

    modal.style.display = "none";
    getUserBookings();
    loadAllFlights();
  };

  document.getElementById("modal-cancel").onclick = () => {
    modal.style.display = "none";
  };
}

window.onload = () => {
  getUserBookings();
  loadAllFlights();
};
