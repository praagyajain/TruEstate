const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require('mongoose');

async function run() {
    await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI);
    const Product = require('../src/models/Product');
    const res = await Product.updateMany({ tags: { $type: 'array' } }, { $unset: { tags: "" } });
    console.log('modifiedCount:', res.modifiedCount);
    await mongoose.disconnect();
}

run().catch(err => { console.error(err); process.exit(1); });