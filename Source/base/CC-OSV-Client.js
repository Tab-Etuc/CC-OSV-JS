const { Client, Collection } = require('discord.js')
const { Player } = require('discord-player')
const Logger = require('../models/Logger')
const Embeds = require('../models/Embeds')
const Util = require('../models/Functions')

const economy = require('../models/EconomyModel');

// Creates CC-OSV-bot class
class bot extends Client {
  constructor () {
    super({
      intents: 32767,
      fetchAllMembers: true,
      allowedMentions: {
        parse: ['users']
      }
    })
    // this.config = require("../config"); // Load the config file
    // this.customEmojis = require("../emojis.json"); // load the bot's emojis
    // this.languages = require("../languages/language-meta.json"); // Load the bot's languages
    // this.commands = new Collection(); // Creates new commands collection
    // this.aliases = new Collection(); // Creates new command aliases collection
    // this.logger = require("../helpers/logger"); // Load the logger file
    // this.wait = util.promisify(setTimeout); // client.wait(1000) - Wait 1 second
    // this.functions = require("../helpers/functions"); // Load the functions file
    // this.guildsData = require("../base/Guild"); // Guild mongoose model
    // this.usersData = require("../base/User"); // User mongoose model
    // this.membersData = require("../base/Member"); // Member mongoose model
    // this.logs = require("../base/Log"); // Log mongoose model
    // this.dashboard = require("../dashboard/app"); // Dashboard app
    // this.queues = new Collection(); // This collection will be used for the music
    // this.states = {}; // Used for the dashboard
    // this.knownGuilds = [];
    this.dashboard = require("../dashboard/app");
    this.states = {}; // Used for the dashboard

    this.queue = new Map()
    this.commands = new Collection()
    this.logger = Logger
    this.utils = Util
    this.say = Embeds
    

    this.player = new Player(this, {
      leaveOnEnd: true,
      leaveOnStop: true,
      leaveOnEmpty: true,
      leaveOnEmptyCooldown: 60000,
      autoSelfDeaf: true,
      initialVolume: 100
    })

  }

//   get defaultLanguage () {
//     return this.languages.find(language => language.default).name
//   };

//   translate (key, args, locale) {
//     if (!locale) locale = this.defaultLanguage
//     const language = this.translations.get(locale)
//     if (!language) throw 'Invalid language set in data.'
//     return language(key, args)
//   };

  async fetchUser (bot, userId) {
    const someone = bot.users.cache.get(userId)
    if (!someone || someone.bot) return false
    const user = await economy.findOne({ _id: userId })
    if (!user) {
      const newUser = new economy({
        _id: userId,
        name: someone.username,
        items: []
      })
      newUser.save()
      return newUser
    }
    return user
  };

  /**
   *
   * @param {string} userId - A discord user ID.
   * @param {number} amount - Amount of bank space to give.
   */

  async giveBankSpace (bot, userId, amount) {
    const someone = bot.users.cache.get(userId)
    if (!someone || someone.bot) return false
    let user = await economy.findOne({ _id: userId })
    if (!user) {
      const newUser = new economy({
        _id: userId,
        name: someone.username,
        items: []
      })
      newUser.save()
      return newUser
    }
    user.bankSpace += parseInt(amount)
    await user.save()
    return user
  };

  /**
   *
   * @param {string} userId - A discord user ID.
   */

  async createUser (bot, userId) {
    const someone = bot.users.cache.get(userId)
    if (!someone || someone.bot) return false
    const user = await economy.findOne({ _id: userId })
    if (!user) return false
    const newUser = new economy({
      _id: userId,
      name: someone.name,
      items: []
    })
    newUser.save()
    return newUser
  };

  /**
   *
   * @param {string} userId - A discord user ID.
   * @param {number} amount - Amount of coins to give.
   */

  async giveCoins (bot, userId, amount) {
    const someone = bot.users.cache.get(userId)
    if (!someone || someone.bot) return false
    let user = await economy.findOne({ _id: userId })
    if (!user) {
      const newUser = new economy({
        _id: userId,
        name: someone.username,
        items: [],
        coinsInWallet: parseInt(amount)
      })
      newUser.save()
      return newUser
    }
    user.coinsInWallet += parseInt(amount)
    await user.save()
    return user
  };
  
}

module.exports = bot
