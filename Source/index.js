require('dotenv').config();
require('module-alias/register');
require('moment-duration-format');

const Client = require('./base/CC-OSV-Client'),
  bot = new Client();

require('./handlers/EventHandler')(bot);
require(`./task/CangeChannelTime`)(bot);

bot.login(process.env.TOKEN);

module.exports = bot;