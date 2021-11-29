require('dotenv').config()
module.exports = {
  Test: process.env.Test || false,
  Admins: ['806346991730819121'], //Admins of the bot
  DefaultPrefix: process.env.Prefix || 'C', //Default prefix, Server Admins can change the prefix
  Token: process.env.Token || '', //Discord Bot Token
  MongoDB: process.env.MONGODB || '',
  ClientID: process.env.Discord_ClientID || '', //Discord Client ID
  ClientSecret: process.env.Discord_ClientSecret || '', //Discord Client Secret
  DefaultVolume: 100, //Sets the default volume of the bot, You can change this number anywhere from 1 to 100
  '24/7': false, //If you want the bot to be stay in the vc 24/7
  EmbedColor: 'RANDOM', //Color of most embeds | Dont edit unless you want a specific color instead of a random one each time
  Permissions: 2205281600, //Bot Inviting Permissions
  nodes: [
    {
      identifier: 'Main',
      host: 'lava.link',
      port: 80,
      password: 'boolookbelow'
      //retryAmount: 5, - Optional
      //retryDelay: 1000, - Optional
      //secure: false - Optional | Default: false
    }
  ] //Lavalink servers
}
