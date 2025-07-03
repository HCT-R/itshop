const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  images: [{ type: String }],
  brand: { type: String },
  category: { type: String, required: true },
  isNew: { type: Boolean, default: false },
  stock: { type: Number, default: 0 },
  specs: {
    type: Map,
    of: String,
    default: {}
  }
});

module.exports = mongoose.model("Product", productSchema);
