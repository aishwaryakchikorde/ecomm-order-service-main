# 🛒 Cart & Order Management - React Module

This module provides **shopping cart** and **checkout order placement** functionality for a React-based e-commerce frontend. It uses **React Context API** to manage global cart state and supports protected routing for authenticated users.

---

## ✅ Features

- Global **CartContext** to manage cart items
- Preloaded dummy item in cart for testing
- 🛍️ Cart Page: View items, quantity, and price
- 🧾 Checkout Page: Enter address, place a mock order
- React Router routes for `/cart` and `/checkout`
- ProtectedRoute wrapper to restrict unauthenticated access

---


---

## 🧠 How It Works

### Cart Context (`CartContext.js`)
- Stores `cartItems` in a React state
- Comes with a default test product
- Provides `addToCart()` method for future use

### Cart Page (`CartPage.jsx`)
- Lists all cart items
- Shows quantity, price, and total
- Button: "Proceed to Checkout"

### Checkout Page (`CheckoutPage.jsx`)
- Accepts a shipping address via textarea
- Calculates total price
- Shows order confirmation after clicking "Place Order"

---
### How to Test
Navigate to /cart (a default item is already in cart)

Click "Proceed to Checkout"

Enter address and click "Place Order"

See confirmation message 🎉


