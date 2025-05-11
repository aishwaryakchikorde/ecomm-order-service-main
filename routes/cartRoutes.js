const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");

// Add or update item in cart
router.post("/:userId", async (req, res) => {
  const { productId, quantity, name, price } = req.body;
  const { userId } = req.params;

  if (!userId || !productId || typeof quantity !== "number") {
    return res.status(400).json({ message: "Invalid cart input." });
  }

  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,
        items: [{ productId, quantity, name, price }],
      });
    } else {
      const itemIndex = cart.items.findIndex(item => item.productId === productId);

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ productId, quantity, name, price });
      }
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    console.error("Add to cart error:", err);
    res.status(500).json({ message: "Server error while adding to cart" });
  }
});

// Get cart items
router.get("/:userId", async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ message: "Error fetching cart" });
  }
});

// Remove item from cart
router.delete("/:userId/:productId", async (req, res) => {
  const { userId, productId } = req.params;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(item => item.productId !== productId);
    await cart.save();

    res.status(200).json({ message: "Item removed", cart });
  } catch (err) {
    console.error("Remove from cart error:", err);
    res.status(500).json({ message: "Server error while removing item" });
  }
});

// Clear cart
router.delete("/clear/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = [];
    await cart.save();

    res.status(200).json({ message: "Cart cleared" });
  } catch (err) {
    console.error("Clear cart error:", err);
    res.status(500).json({ message: "Server error while clearing cart" });
  }
});

module.exports = router;
