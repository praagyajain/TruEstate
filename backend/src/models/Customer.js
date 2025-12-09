
const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
    customerId: String,
    name: String,
    phone: String,
    gender: String,
    age: Number,
    region: String,
    type: String
});

CustomerSchema.index({ name: 'text' });

module.exports = mongoose.model('Customer', CustomerSchema);
