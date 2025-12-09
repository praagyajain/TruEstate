
const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    productId: String,
    name: String,
    brand: String,
    category: String,
    tags: [String]
});
ProductSchema.index({ name: 'text' });

module.exports = mongoose.model('Product', ProductSchema);
