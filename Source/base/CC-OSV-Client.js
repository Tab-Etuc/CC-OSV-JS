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
  
  async findOrCreateUser({ id: userID }, isLean){
		if(this.databaseCache.users.get(userID)){
			return isLean ? this.databaseCache.users.get(userID).toJSON() : this.databaseCache.users.get(userID);
		} else {
			let userData = (isLean ? await this.usersData.findOne({ id: userID }).lean() : await this.usersData.findOne({ id: userID }));
			if(userData){
				if(!isLean) this.databaseCache.users.set(userID, userData);
				return userData;
			} else {
				userData = new this.usersData({ id: userID });
				await userData.save();
				this.databaseCache.users.set(userID, userData);
				return isLean ? userData.toJSON() : userData;
			}
		}
	}

	// This function is used to find a member data or create it
	async findOrCreateMember({ id: memberID, guildID }, isLean){
		if(this.databaseCache.members.get(`${memberID}${guildID}`)){
			return isLean ? this.databaseCache.members.get(`${memberID}${guildID}`).toJSON() : this.databaseCache.members.get(`${memberID}${guildID}`);
		} else {
			let memberData = (isLean ? await this.membersData.findOne({ guildID, id: memberID }).lean() : await this.membersData.findOne({ guildID, id: memberID }));
			if(memberData){
				if(!isLean) this.databaseCache.members.set(`${memberID}${guildID}`, memberData);
				return memberData;
			} else {
				memberData = new this.membersData({ id: memberID, guildID: guildID });
				await memberData.save();
				const guild = await this.findOrCreateGuild({ id: guildID });
				if(guild){
					guild.members.push(memberData._id);
					await guild.save();
				}
				this.databaseCache.members.set(`${memberID}${guildID}`, memberData);
				return isLean ? memberData.toJSON() : memberData;
			}
		}
	}

	// This function is used to find a guild data or create it
	async findOrCreateGuild({ id: guildID }, isLean){
		if(this.databaseCache.guilds.get(guildID)){
			return isLean ? this.databaseCache.guilds.get(guildID).toJSON() : this.databaseCache.guilds.get(guildID);
		} else {
			let guildData = (isLean ? await this.guildsData.findOne({ id: guildID }).populate("members").lean() : await this.guildsData.findOne({ id: guildID }).populate("members"));
			if(guildData){
				if(!isLean) this.databaseCache.guilds.set(guildID, guildData);
				return guildData;
			} else {
				guildData = new this.guildsData({ id: guildID });
				await guildData.save();
				this.databaseCache.guilds.set(guildID, guildData);
				return isLean ? guildData.toJSON() : guildData;
			}
		}
	}

    
	// This function is used to resolve a user from a string
	async resolveUser(search){
		let user = null;
		if(!search || typeof search !== "string") return;
		// Try ID search
		if(search.match(/^<@!?(\d+)>$/)){
			const id = search.match(/^<@!?(\d+)>$/)[1];
			user = this.users.fetch(id).catch(() => {});
			if(user) return user;
		}
		// Try username search
		if(search.match(/^!?(\w+)#(\d+)$/)){
			const username = search.match(/^!?(\w+)#(\d+)$/)[0];
			const discriminator = search.match(/^!?(\w+)#(\d+)$/)[1];
			user = this.users.find((u) => u.username === username && u.discriminator === discriminator);
			if(user) return user;
		}
		user = await this.users.fetch(search).catch(() => {});
		return user;
	}

	async resolveMember(search, guild){
		let member = null;
		if(!search || typeof search !== "string") return;
		// Try ID search
		if(search.match(/^<@!?(\d+)>$/)){
			const id = search.match(/^<@!?(\d+)>$/)[1];
			member = await guild.members.fetch(id).catch(() => {});
			if(member) return member;
		}
		// Try username search
		if(search.match(/^!?(\w+)#(\d+)$/)){
			guild = await guild.fetch();
			member = guild.members.cache.find((m) => m.user.tag === search);
			if(member) return member;
		}
		member = await guild.members.fetch(search).catch(() => {});
		return member;
	}

	async resolveRole(search, guild){
		let role = null;
		if(!search || typeof search !== "string") return;
		// Try ID search
		if(search.match(/^<@&!?(\d+)>$/)){
			const id = search.match(/^<@&!?(\d+)>$/)[1];
			role = guild.roles.cache.get(id);
			if(role) return role;
		}
		// Try name search
		role = guild.roles.cache.find((r) => search === r.name);
		if(role) return role;
		role = guild.roles.cache.get(search);
		return role;
	}
  
}

module.exports = bot
