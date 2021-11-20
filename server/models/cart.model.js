const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  customerID: {
    type: String,
    required: true,
  },
});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;