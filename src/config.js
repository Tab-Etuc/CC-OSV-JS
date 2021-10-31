module.exports = {
  Admins: ['806346991730819121'], //Admins of the bot
  ExpressServer: false, //If you wanted to make the website run or not
  DefaultPrefix: process.env.Prefix || 'C', //Default prefix, Server Admins can change the prefix
  Port: process.env.PORT || 3000, //Which port website gonna be hosted
  Token: process.env.Token || '', //Discord Bot Token
  ClientID: process.env.Discord_ClientID || '', //Discord Client ID
  ClientSecret: process.env.Discord_ClientSecret || '', //Discord Client Secret
  Scopes: ['identify', 'guilds', 'applications.commands'], //Discord OAuth2 Scopes
  ServerDeafen: false, //If you want bot to stay deafened
  DefaultVolume: 100, //Sets the default volume of the bot, You can change this number anywhere from 1 to 100
  CallbackURL: '/api/callback', //Discord OAuth2 Callback URL
  '24/7': true, //If you want the bot to be stay in the vc 24/7
  CookieSecret: 'ji394xji6xu4', //A Secret like a password
  IconURL:
    'https://raw.githubusercontent.com/SudhanPlayz/Discord-MusicBot/master/assets/logo.gif', //URL of all embed author icons | Dont edit unless you dont need that Music CD Spining
  EmbedColor: 'RANDOM', //Color of most embeds | Dont edit unless you want a specific color instead of a random one each time
  Permissions: 2205281600, //Bot Inviting Permissions
  Website: process.env.Website || 'http://localhost', //Website where it was hosted at includes http or https || Use "0.0.0.0" if you using Heroku
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

  Presence: {
    status: 'online', // You can show online, idle, and dnd
    name: '音樂', // The message shown
    type: 'LISTENING' // PLAYING, WATCHING, LISTENING, STREAMING
  },

  //Please go to https://developer.spotify.com/dashboard/
  Spotify: {
    ClientID: process.env.Spotify_ClientID || '', //Spotify Client ID
    ClientSecret: process.env.Spotify_ClientSecret || '' //Spotify Client Secret
  }
}
