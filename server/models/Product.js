
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  image: { type: String },
  brand: { type: String },       // Новое поле
  category: { type: String },    // Новое поле
});

module.exports = mongoose.model("Product", productSchema);
