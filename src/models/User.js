const mongoose = require("mongoose");

const schema = mongoose.Schema({
    userID: String,
    guildID: String,
    money: {
        type: Number,
        default: 0
    },
    level: {
        type: Number,
        default: 0
    },
    xp: {
        type: Number,
        default: 0
    },
    messages: {
        type: Number,
        default: 0
    },
    warn: {
        type: Number,
        default: 0
    },
    _time: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model("User", schema);