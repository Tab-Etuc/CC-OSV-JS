require('dotenv').config();
const mongoose = require('mongoose');
const economy = require('./EconomyModel');
const ItemManager = require('../utils/ItemManager');

mongoose.connect(process.env.MONGODB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


class Mongo {

    async fetchUser(bot, userId) {
        const someone = bot.users.cache.get(userId);
        if (!someone || someone.bot) return false;
        const user = await economy.findOne({ _id: userId });
        if (!user) {
            const newUser = new economy({
                _id: userId,
                name: someone.name,
                items: []
            });
            newUser.save();
            return newUser;
        }
        return user;
    }

    /**
     * 
     * @param {string} userId - A discord user ID.
     * @param {number} amount - Amount of bank space to give.
     */

    async giveBankSpace(bot, userId, amount) {
        const someone = bot.users.cache.get(userId);
        if (!someone || someone.bot) return false;
        let user = await economy.findOne({ _id: userId });
        if (!user) {
            const newUser = new economy({
                _id: userId,
                name: someone.name,
                items: []
            });
            newUser.save();
            return newUser;
        }
        user.bankSpace += parseInt(amount);
        await user.save();
        return user;
    }

    /**
     * 
     * @param {string} userId - A discord user ID.
     */

    async createUser(bot, userId) {
        const someone = bot.users.cache.get(userId);
        if (!someone || someone.bot) return false;
        const user = await economy.findOne({ _id: userId });
        if (!user) return false;
        const newUser = new economy({
            _id: userId,
            name: someone.name,
            items: []
        });
        newUser.save();
        return newUser;
    }

    /**
     * 
     * @param {string} userId - A discord user ID.
     * @param {number} amount - Amount of coins to give.
     */

    async giveCoins(bot, userId, amount) {
        const someone = bot.users.cache.get(userId);
        if (!someone || someone.bot) return false;
        let user = await economy.findOne({ _id: userId });
        if (!user) {
            const newUser = new economy({
                _id: userId,
                name: someone.name,
                items: [],
                coinsInWallet: parseInt(amount)
            });
            newUser.save();
            return newUser;
        }
        user.coinsInWallet += parseInt(amount);
        await user.save();
        return user;
    }

}

module.exports = new Mongo();