const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  name: String,
  phone: String,
  items: [
    {
      name: String,
      price: Number,
      image: String
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Order", orderSchema);
