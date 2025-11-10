import express from "express";

const app = express();
app.use(express.json());

// Root route (Fixes "Cannot GET /")
app.get("/", (req, res) => {
  res.send("Seat Booking API is running. Use /seats to view seat status.");
});

// Create 10 seats with default status "available"
let seats = {};
for (let i = 1; i <= 10; i++) {
  seats[i] = { status: "available", lockExpiry: null };
}

// GET all seats
app.get("/seats", (req, res) => {
  res.status(200).json(seats);
});

// POST: Lock a seat
app.post("/lock/:id", (req, res) => {
  const id = req.params.id;
  const seat = seats[id];

  if (!seat) {
    return res.status(404).json({ message: "Seat does not exist" });
  }

  if (seat.status === "booked") {
    return res.status(400).json({ message: `Seat ${id} is already booked` });
  }

  if (seat.status === "locked" && seat.lockExpiry > Date.now()) {
    return res.status(400).json({ message: `Seat ${id} is already locked` });
  }

  seat.status = "locked";
  seat.lockExpiry = Date.now() + 60 * 1000; // Lock for 1 minute

  return res.status(200).json({
    message: `Seat ${id} locked successfully. Confirm within 1 minute.`
  });
});

// POST: Confirm booking
app.post("/confirm/:id", (req, res) => {
  const id = req.params.id;
  const seat = seats[id];

  if (!seat) {
    return res.status(404).json({ message: "Seat does not exist" });
  }

  if (seat.status !== "locked" || seat.lockExpiry < Date.now()) {
    return res.status(400).json({
      message: `Seat ${id} is not locked and cannot be booked`
    });
  }

  seat.status = "booked";
  seat.lockExpiry = null;

  return res.status(200).json({
    message: `Seat ${id} booked successfully!`
  });
});

// Start server
app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
