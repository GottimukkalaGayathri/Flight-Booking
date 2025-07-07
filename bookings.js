const user = JSON.parse(localStorage.getItem("loggedInUser"));
const container = document.getElementById("bookings-list");

if (!user) {
  window.location.href = "index.html";
}

async function loadBookings() {
  const bookingsRes = await fetch(`http://localhost:5000/bookings?userId=${user.id}`);
  const bookings = await bookingsRes.json();

  const flightsRes = await fetch("http://localhost:5000/flights");
  const flights = await flightsRes.json();

  if (bookings.length === 0) {
    container.innerHTML = "No bookings found.";
    return;
  }

  bookings.forEach(b => {
    const f = flights.find(f => f.id === b.flightId);
    if (!f) return;

    const box = document.createElement("div");
    box.className = "booking-card";
    box.innerHTML = `
      <h3>${f.from} → ${f.to}</h3>
      <p>${f.date} | ${f.time}</p>
      <p>₹${f.price}</p>
      <p>Status: Booked</p>
    `;
    container.appendChild(box);
  });
}

function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "index.html";
}

function goBack() {
  window.location.href = "flights.html";
}

loadBookings();
