const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: String,
  price: Number,
  imageUrl: String,
});

module.exports = mongoose.model('Product', ProductSchema);
