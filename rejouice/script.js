const flights = [];
let idCounter = 1;

const board = document.getElementById("flightBoard");
const form = document.getElementById("flightForm");
const search = document.getElementById("search");

form.addEventListener("submit", e => {
  e.preventDefault();
  const inputs = form.querySelectorAll("input");

  flights.push({
    id: idCounter++,
    flightNumber: inputs[0].value,
    origin: inputs[1].value,
    destination: inputs[2].value,
    gate: inputs[3].value,
    departureTime: Number(inputs[4].value),
    status: "Scheduled"
  });

  form.reset();
  render();
});

function render(filter = "") {
  board.innerHTML = "";

  flights
    .filter(f => f.flightNumber.includes(filter) || f.destination.includes(filter))
    .forEach(flight => {
      const card = document.createElement("div");
      card.className = `flight ${flight.status}`;

      card.innerHTML = `
        <h3>${flight.flightNumber}</h3>
        <p>${flight.origin} → ${flight.destination}</p>
        <p>Gate: ${flight.gate}</p>
        <p>Status: ${flight.status}</p>
        <p>Departs in: ${flight.departureTime} min</p>
        <button data-action="boarding">Board</button>
        <button data-action="delay">Delay</button>
        <button data-action="cancel">Cancel</button>
      `;

      card.addEventListener("click", e => {
        if (!e.target.dataset.action) return;

        if (e.target.dataset.action === "boarding") flight.status = "Boarding";
        if (e.target.dataset.action === "delay") flight.status = "Delayed";
        if (e.target.dataset.action === "cancel") flight.status = "Cancelled";

        render(search.value);
      });

      board.appendChild(card);
    });

  updateStats();
}

function updateStats() {
  document.getElementById("totalFlights").textContent = flights.length;
  document.getElementById("delayedFlights").textContent = flights.filter(f => f.status === "Delayed").length;
  document.getElementById("cancelledFlights").textContent = flights.filter(f => f.status === "Cancelled").length;
}

search.addEventListener("input", e => render(e.target.value));

setInterval(() => {
  flights.forEach(f => {
    if (f.departureTime > 0 && f.status !== "Cancelled") {
      f.departureTime--;
      if (f.departureTime === 0) f.status = "Departed";
    }
  });
  render(search.value);
}, 60000);

render();
