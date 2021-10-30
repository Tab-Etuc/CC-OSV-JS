const { Client, Collection } = require('discord.js')
const { LavasfyClient } = require("lavasfy");
const { Manager } = require("erela.js");
const economy = require('../models/EconomyModel');
const { readdirSync } = require("fs");

require("discordjs-activity");
require("./EpicPlayer");

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
    
    this.msgCommands = new Collection();
    this.ittCommands = new Collection();
    this.logger = require('./Logger');
    this.utils = require('../models/Functions');
    this.say = require('../models/Embeds');
    this.config = require("../config");
  

  this.Lavasfy = new LavasfyClient(
    {
      clientID: this.config.Spotify.ClientID,
      clientSecret: this.config.Spotify.ClientSecret,
      playlistPageLoadLimit: 3,
      filterAudioOnlyResult: true,
      autoResolve: true,
      useSpotifyMetadata: true,
    },
    [
      {
        id: this.config.Lavalink.id,
        host: this.config.Lavalink.host,
        port: this.config.Lavalink.port,
        password: this.config.Lavalink.pass,
        secure: this.config.Lavalink.secure,
      },
    ]
  );

  this.Manager = new Manager({
    nodes: [
      {
        identifier: this.config.Lavalink.id,
        host: this.config.Lavalink.host,
        port: this.config.Lavalink.port,
        password: this.config.Lavalink.pass,
        secure: this.config.Lavalink.secure,
      },
    ],
    send(id, payload) {
      const guild = this.guilds.cache.get(id);
      if (guild) guild.shard.send(payload);
    },
  })
    .on("nodeConnect", (node) =>
      this.log(`Lavalink: Node ${node.options.identifier} connected`)
    )
    .on("nodeError", (node, error) =>
      this.log(
        `Lavalink: Node ${node.options.identifier} had an error: ${error.message}`
      )
    )
    .on("trackStart", async (player, track) => {
      this.SongsPlayed++;
      let TrackStartedEmbed = new MessageEmbed()
        .setAuthor(`正在播放 ♪`, this.config.IconURL)
        .setThumbnail(player.queue.current.displayThumbnail())
        .setDescription(`[${track.title}](${track.uri})`)
        .addField("Requested by", `${track.requester}`, true)
        .addField(
          "Duration",
          `\`${prettyMilliseconds(track.duration, {
            colonNotation: true,
          })}\``,
          true
        )
        .setColor(this.config.EmbedColor);
      //.setFooter("Started playing at");
      let NowPlaying = await this.channels.cache
        .get(player.textChannel)
        .send(TrackStartedEmbed);
      player.setNowplayingMessage(NowPlaying);
    })
    .on("queueEnd", (player) => {
      if(player.queueRepeat || player.trackRepeat){
        console.log(player)
      }
      let QueueEmbed = new MessageEmbed()
        .setAuthor("The queue has ended", this.config.IconURL)
        .setColor(this.config.EmbedColor)
        .setTimestamp();
      this.channels.cache.get(player.textChannel).send(QueueEmbed);
      if (!this.config["24/7"]) player.destroy();
    });
    require('../handlers/EventHandler')(this);
    require(`../task/CangeChannelTime`)(this);
    this.LoadMsgCommands();
}
  fetchUser (bot, userId) {
    const someone = bot.users.cache.get(userId)
    if (!someone || someone.bot) return false
    const user = economy.findOne({ _id: userId })
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

  giveBankSpace (bot, userId, amount) {
    const someone = bot.users.cache.get(userId)
    if (!someone || someone.bot) return false
    let user = economy.findOne({ _id: userId })
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
    user.save()
    return user
  };

  /**
   *
   * @param {string} userId - A discord user ID.
   */

  createUser (bot, userId) {
    const someone = bot.users.cache.get(userId)
    if (!someone || someone.bot) return false
    const user = economy.findOne({ _id: userId })
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

  giveCoins (bot, userId, amount) {
    const someone = bot.users.cache.get(userId)
    if (!someone || someone.bot) return false
    let user = economy.findOne({ _id: userId })
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
    user.save()
    return user
  };
  
  build() {
    this.login(this.config.Token);
  }
  sendTime(Channel, Error) {
    let embed = new MessageEmbed()
      .setColor(this.config.EmbedColor)
      .setDescription(Error);

    Channel.send(embed);
  }

  LoadMsgCommands(){
    const commandFiles = readdirSync(join(__dirname, "../message-commands")).filter((file) => file.endsWith(".js"));
    for (const file of commandFiles) {
      const command = require(join(__dirname, "../message-commands", `${file}`));
      this.msgCommands.set(command.name, command);
  }

}
}

module.exports = bot
