// routes/orderRoutes.js
const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

router.get("/test", (req, res) => {
  res.status(200).json({ message: "Order route working!" });
});

router.post("/", async (req, res) => {
  const { userId, items, totalAmount } = req.body;

  if (!userId || !Array.isArray(items) || items.length === 0 || totalAmount <= 0) {
    return res.status(400).json({ message: "Invalid order input." });
  }

  try {
    const newOrder = new Order({ userId, items, totalAmount, status: "Placed" });
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (err) {
    console.error("Order creation failed:", err);
    res.status(500).json({ message: "Server error while placing order" });
  }
});

module.exports = router;
