const form = document.getElementById("flightForm");
const msg = document.getElementById("msg");
const dateInput = document.getElementById("date");

// Auto set tomorrow’s date and prevent past dates
const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
const minDate = tomorrow.toISOString().split("T")[0];
dateInput.min = minDate;
dateInput.value = minDate;

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Date validation (future only)
  const selectedDate = new Date(dateInput.value);
  if (selectedDate < tomorrow) {
    msg.textContent = "Please select a valid future date.";
    msg.style.color = "red";
    return;
  }

  const flight = {
    from: form.from.value,
    to: form.to.value,
    date: form.date.value,
    time: form.time.value,
    seats: parseInt(form.seats.value),
    price: parseInt(form.price.value),
    bookedSeats: 0
  };

  const res = await fetch("http://localhost:5000/flights", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(flight)
  });

  if (res.ok) {
    msg.textContent = "Flight added successfully!";
    msg.style.color = "green";
    form.reset();
    dateInput.value = minDate;
  } else {
    msg.textContent = "Failed to add flight.";
    msg.style.color = "red";
  }
});
