const mongoose = require("mongoose");

const levelSchema = mongoose.Schema({
    guildId: String,
    userId: String,
    userName: String,
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    totalXp: { type: Number, default: 0 },
    xpToLevel: { type: Number, default: 100 }
});

module.exports = mongoose.model("Levels", levelSchema);