const bot = require('./index')

const formatNum = bot.utils.formatNumber
const serverCount = formatNum(bot.guilds.cache.size)
const userCount = formatNum(
  bot.guilds.cache.reduce((a, g) => a + g.memberCount, 0)
)
module.exports = {
  Admins: ['806346991730819121'], //Admins of the bot
  DefaultPrefix: process.env.Prefix || 'C', //Default prefix, Server Admins can change the prefix
  Token: process.env.Token || '', //Discord Bot Token
  MongoDB: process.env.MONGODB || '',
  ClientID: process.env.Discord_ClientID || '', //Discord Client ID
  ClientSecret: process.env.Discord_ClientSecret || '', //Discord Client Secret
  Scopes: ['identify', 'guilds', 'applications.commands'], //Discord OAuth2 Scopes
  DefaultVolume: 100, //Sets the default volume of the bot, You can change this number anywhere from 1 to 100
  '24/7': true, //If you want the bot to be stay in the vc 24/7
  EmbedColor: 'RANDOM', //Color of most embeds | Dont edit unless you want a specific color instead of a random one each time
  Permissions: 2205281600, //Bot Inviting Permissions
  nodes: [
    {
      identifier: 'Main',
      host: 'lava.link',
      port: 80,
      password: 'xji.gl4.vu'
      //retryAmount: 5, - Optional
      //retryDelay: 1000, - Optional
      //secure: false - Optional | Default: false
    }
  ], //Lavalink servers

  Presence: [
    {
      status: 'idle',
      name: `正服務 ${serverCount} 個伺服器 和 ${userCount} 位使用者`,
      type: 'LISTENING'
    },
    { status: 'idle', name: 'CC-OSV 測試版', type: 'WATCHING' },
    { status: 'idle', name: '由 CC_#8844 編寫', type: 'WATCHING' }
  ]
}
