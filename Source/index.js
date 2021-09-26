const {
	Collection,
	Client,
	Intents,
} = require('discord.js');
require('dotenv').config();
require('module-alias/register');


const { Player } = require("discord-player");
const Mongo = require("./models/MongoClient");
const Logger = require("./models/Logger");
const Embeds = require("./models/Embeds");
const Util = require("./models/Functions");

const bot = new Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MEMBERS,
		Intents.FLAGS.GUILD_PRESENCES,
		Intents.FLAGS.GUILD_BANS,
		Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
		Intents.FLAGS.GUILD_INTEGRATIONS,
		Intents.FLAGS.GUILD_WEBHOOKS,
		Intents.FLAGS.GUILD_INVITES,
		Intents.FLAGS.GUILD_VOICE_STATES,
		Intents.FLAGS.GUILD_PRESENCES,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
		Intents.FLAGS.GUILD_MESSAGE_TYPING,
		Intents.FLAGS.DIRECT_MESSAGES,
		Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
		Intents.FLAGS.DIRECT_MESSAGE_TYPING,
	],
	fetchAllMembers: true,
	disableMentions: 'everyone',
}
);



bot.queue = new Map()
bot.commands = new Collection();

bot.logger = Logger;
bot.utils = Util;
bot.say = Embeds;
bot.mongo = Mongo;

bot.player = new Player(bot, {
	leaveOnEnd: true,
	leaveOnStop: true,
	leaveOnEmpty: true,
	leaveOnEmptyCooldown: 60000,
	autoSelfDeaf: true,
	initialVolume: 100
});

require("moment-duration-format");
require("./handlers/EventHandler")(bot);
require("./task/CangeChannelTime")(bot);

bot.login(process.env.TOKEN);

module.exports = bot;