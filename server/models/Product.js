const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  image: { type: String },
  brand: { type: String },
  category: { type: String, required: true },
  isNew: { type: Boolean, default: false },
  stock: { type: Number, default: 0 },
  specs: {
    os: String,
    cpu: String,
    cpuModel: String,
    cpuFrequency: String,
    igpu: String,
    gpu: String,
    ram: String,
    ramConfig: String,
    ramSlots: String,
    storage: String,
    screen: String
  }
});

module.exports = mongoose.model("Product", productSchema);
