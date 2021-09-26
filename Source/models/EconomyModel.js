const mongoose = require('mongoose');

const EconomySchema = new mongoose.Schema({
    _id: { type: String, required: false },
    name: { type: String, required: false},
    coinsInWallet: { type: Number, required: false, default: 100 },
    coinsInBank: { type: Number, required: false, default: 500 },
    bankSpace: { type: Number, required: false, default: 2500 },
    items: { type: Array, required: false, default: [] },
    interest: { type: String, required: false, default: 1}
});

module.exports = mongoose.model('economy', EconomySchema);
