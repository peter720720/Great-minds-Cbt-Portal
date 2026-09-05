const mongoose = require('mongoose');

const CbtAccessSchema = new mongoose.Schema({
    key: { type: String, unique: true, required: true },
    passwordHash: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('CbtAccess', CbtAccessSchema);
