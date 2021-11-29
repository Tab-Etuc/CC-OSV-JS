const Guilds = require('./mongoDB/Guilds')
/**
 * @param {string} guildId - A discord guild Id.
 * @returns
 */
module.exports = async guildId => {
  const guild = Guilds.findOne({ _id: guildId })
  let language
  if (!guild) {
    new Guilds({ _id: guildId }).save()
    language = 'zh-TW'
  } else language = guild.language || 'zh-TW'
  return require(`../languages/${language}.json`);
}
