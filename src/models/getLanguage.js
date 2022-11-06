const Guilds = require('./mongoDB/Guilds');
/**
 * @param {string} guildId - A discord guild Id.
 * @returns
 */
module.exports = async (locale, category, commandName) => {
  const data = require(`../languages/${locale}.json`);
  return data['commands'][category][commandName];
};
