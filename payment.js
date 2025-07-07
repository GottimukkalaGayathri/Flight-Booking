const user = JSON.parse(localStorage.getItem("loggedInUser"));
const flightId = localStorage.getItem("selectedFlightId");

if (!user || !flightId) {
  window.location.replace("index.html");
}

let flightPrice = 0;
let flightData = null;

async function getFlightDetails() {
  const res = await fetch(`http://localhost:5000/flights/${flightId}`);
  const flight = await res.json();
  flightPrice = flight.price;
  flightData = flight;
  return flight;
}

function updateTotalAmount() {
  const count = parseInt(document.getElementById("seatCount").value) || 0;
  const total = flightPrice * count;
  document.getElementById("totalAmountText").textContent = `Total: ₹${total}`;
}

function renderPaymentField(method) {
  const box = document.getElementById("paymentDetailsBox");
  box.innerHTML = "";
  if (!method) return;

  const input = document.createElement("input");
  input.required = true;
  input.placeholder =
    method === "UPI"
      ? "Enter your UPI ID"
      : method.includes("Card")
      ? "Enter your Card Number"
      : "Enter Account Number";

  input.id = "paymentDetails";
  input.type = method.includes("Card") ? "number" : "text";
  box.appendChild(input);
}

document.getElementById("seatCount").addEventListener("input", updateTotalAmount);
document.getElementById("paymentMethod").addEventListener("change", (e) =>
  renderPaymentField(e.target.value)
);

document.getElementById("paymentForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const method = document.getElementById("paymentMethod").value;
  const details = document.getElementById("paymentDetails")?.value;
  const seatsRequested = parseInt(document.getElementById("seatCount").value) || 0;

  if (!method || !details || seatsRequested < 1) return;

  const flight = await getFlightDetails();

  const remainingSeats = flight.seats - (flight.bookedSeats || 0);
  if (seatsRequested > remainingSeats) {
    alert(`Only ${remainingSeats} seat(s) available`);
    return;
  }

  const userBookings = await fetch(
    `http://localhost:5000/bookings?userId=${user.id}`
  ).then((r) => r.json());

  const sameSlot = userBookings.find(
    (b) => b.date === flight.date && b.time === flight.time
  );
  if (sameSlot) {
    alert("You already booked a flight for the same time.");
    return;
  }

  await fetch("http://localhost:5000/bookings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: user.id,
      flightId: flight.id,
      date: flight.date,
      time: flight.time,
      seats: seatsRequested,
      paymentMethod: method,
      paymentDetails: details
    })
  });

  const updatedBookedSeats = (flight.bookedSeats || 0) + seatsRequested;
  await fetch(`http://localhost:5000/flights/${flight.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ bookedSeats: updatedBookedSeats })
  });

  localStorage.removeItem("selectedFlightId");

  const modal = document.getElementById("ticketModal");
  const ticketText = document.getElementById("ticketText");
  const totalPrice = seatsRequested * flight.price;

  ticketText.innerHTML = `
    <strong>Name:</strong> ${user.name}<br>
    <strong>From:</strong> ${flight.from}<br>
    <strong>To:</strong> ${flight.to}<br>
    <strong>Date:</strong> ${flight.date}<br>
    <strong>Time:</strong> ${flight.time}<br>
    <strong>Seats:</strong> ${seatsRequested}<br>
    <strong>Total Paid:</strong> ₹${totalPrice}<br>
    <strong>Payment:</strong> ${method}
  `;

  modal.style.display = "flex";
});

getFlightDetails().then(updateTotalAmount);
