import express from "express";

const app = express();
app.use(express.json());

// Initial card data
let cards = [
  { id: 1, suit: "Hearts", value: "Ace" },
  { id: 2, suit: "Spades", value: "King" },
  { id: 3, suit: "Diamonds", value: "Queen" }
];

// Root message (Fixes "Cannot GET /")
app.get("/", (req, res) => {
  res.send("Card API is running! Use /cards to view data.");
});

// GET: All cards
app.get("/cards", (req, res) => {
  res.status(200).json(cards);
});

// GET: Card by ID
app.get("/cards/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const card = cards.find(c => c.id === id);

  if (!card) {
    return res.status(404).json({ message: "Card not found" });
  }
  res.status(200).json(card);
});

// POST: Add new card
app.post("/cards", (req, res) => {
  const { suit, value } = req.body;

  const newCard = {
    id: cards.length ? cards[cards.length - 1].id + 1 : 1,
    suit,
    value
  };

  cards.push(newCard);
  res.status(201).json(newCard);
});

// DELETE: Remove card by ID
app.delete("/cards/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = cards.findIndex(c => c.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Card not found" });
  }

  const removedCard = cards.splice(index, 1)[0];

  res.status(200).json({
    message: `Card with ID ${id} removed`,
    card: removedCard
  });
});

// Start server
app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
