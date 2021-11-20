const {
  Client,
  MessageEmbed,
  Collection,
  MessageActionRow,
  MessageButton
} = require('discord.js')
const { Manager } = require('erela.js')
const Users = require('../models/mongoDB/Users')
const prettyMilliseconds = require('pretty-ms')
const spotify = require('better-erela.js-spotify').default
const apple = require('erela.js-apple')
const deezer = require('erela.js-deezer')
const facebook = require('erela.js-facebook')
const getLavalink = require('../models/getLavalink')
const getChannel = require('../models/getChannel')

require('./EpicPlayer')
require('dotenv').config()

// Creates CC-OSV-bot class
class CCOSV extends Client {
  constructor (
    props = {
      intents: 32767,
      fetchAllMembers: true,
      allowedMentions: {
        parse: ['users']
      }
    }
  ) {
    super(props)

    this.msgCommands = new Collection()
    this.slashCommands = new Collection()
    this.logger = require('./Logger')
    this.utils = require('../models/Functions')
    this.say = require('../models/Embeds')
    this.config = require('../config')
    this.ProgressBar = require('../models/ProgressBar')
    this.Pagination = require('../models/pagination')
    this.ms = prettyMilliseconds

    this.getLavalink = getLavalink
    this.getChannel = getChannel
    this.build()
  }
  /**
   *
   * @param {string} userId - A discord user ID.
   * @param {string} guildId - A discord guild Id.
   */

  fetchUser (bot, userId, guildId) {
    const someone = bot.users.cache.get(userId)
    if (!someone || someone.bot) return false
    const user = Users.findOne({ userId: userId, guildId: guildId })
    if (!user) {
      const newUser = new Users({
        guildId: message.guildId,
        userId: message.author.id,
        userName: message.user.username
      }).save()
      return newUser
    }
    return user
  }

  /**
   *
   * @param {string} userId - A discord user ID.
   * @param {string} guildId - A discord guild Id.
   * @param {number} amount - Amount of coins to give.
   */

  give (bot, userId, guildId, amount) {
    const someone = bot.users.cache.get(userId)
    if (!someone || someone.bot) return false
    let user = Users.findOne({ userId: userId, guildId: guildId })
    if (!user) {
      const newUser = new Users({
        guildId: message.guildId,
        userId: message.author.id,
        userName: message.user.username,
        coinsInWallet: parseInt(amount)
      }).save()
      return newUser
    }
    user.coinsInWallet += parseInt(amount)
    user.save()
    return user
  }

  build () {
    let bot = this

    this.login(this.config.Token)
    require('../handlers/EventHandler')(this)
    require(`../task/CangeChannelTime`)(this)

    this.manager = new Manager({
      plugins: [new deezer(), new apple(), new spotify(), new facebook()],
      nodes: this.config.nodes,
      send (id, payload) {
        const guild = bot.guilds.cache.get(id)
        if (guild) guild.shard.send(payload)
      }
    })
      .on('nodeConnect', node =>
        this.logger.log('Lavalink', `${node.options.identifier} connected`)
      )
      .on('nodeReconnect', node =>
        this.logger.log('Lavalink', `${node.options.identifier} reconnected`)
      )
      .on('nodeError', (node, error) =>
        this.logger.log(
          'Lavalink',
          `${node.options.identifier} had an error: ${error.message}`
        )
      )
      .on('trackError', (player, track) =>
        this.logger.log('Lavalink', `${track} had an error.`)
      )
      .on('trackStart', async (player, track) => {
        let TrackStartedEmbed = new MessageEmbed()
          .setAuthor(`正在播放 ♪`, this.config.IconURL)
          .setThumbnail(player.queue.current.displayThumbnail())
          .setDescription(`[${track.title}](${track.uri})`)
          .addField('請求者', `${track.requester}`, true)
          .addField(
            '持續時間',
            `\`${prettyMilliseconds(track.duration, {
              colonNotation: true
            })}\``,
            true
          )
          .setColor(this.config.EmbedColor)
        //.setFooter("Started playing at");
        let NowPlaying = await bot.channels.cache.get(player.textChannel).send({
          embeds: [TrackStartedEmbed],
          components: [bot.createController(player.options.guild)]
        })
        player.setNowplayingMessage(NowPlaying)
      })
      .on('queueEnd', async (player, track) => {
        
        let QueueEmbed = new MessageEmbed()
          .setAuthor(
            '播放結束。\n註：如遇到突發狀況，請嘗試再次輸入指令。',
            this.config.IconURL
          )
          .setColor(this.config.EmbedColor)
          .setTimestamp()
        bot.channels.cache
          .get(player.textChannel)
          .send({ embeds: [QueueEmbed] })
        if (!this.config['24/7']) player.destroy()
      })
  }
  createPlayer (textChannel, voiceChannel) {
    return this.manager.create({
      guild: textChannel.guild.id,
      voiceChannel: voiceChannel.id,
      textChannel: textChannel.id,
      selfDeafen: this.config.serverDeafen,
      volume: this.config.defaultVolume
    })
  }
  createController (guild) {
    return new MessageActionRow().addComponents(
      new MessageButton()
        .setStyle('SECONDARY')
        .setCustomId(`controller:${guild}:LowVolume`)
        .setEmoji('🔉'),

      new MessageButton()
        .setStyle('SUCCESS')
        .setCustomId(`controller:${guild}:Replay`)
        .setEmoji('◀'),

      new MessageButton()
        .setStyle('DANGER')
        .setCustomId(`controller:${guild}:PlayAndPause`)
        .setEmoji('⏯'),

      new MessageButton()
        .setStyle('SUCCESS')
        .setCustomId(`controller:${guild}:Next`)
        .setEmoji('▶'),

      new MessageButton()
        .setStyle('SECONDARY')
        .setCustomId(`controller:${guild}:HighVolume`)
        .setEmoji('🔊')
    )
  }
  Embed (text) {
    let embed = new MessageEmbed().setColor(this.config.embedColor)

    if (text) embed.setDescription(text)

    return embed
  }

  /**
   *
   * @param {string} text
   * @returns {MessageEmbed}
   */
  ErrorEmbed (text) {
    let embed = new MessageEmbed()
      .setColor('RED')
      .setDescription('❌ | ' + text)

    return embed
  }
}

module.exports = CCOSV
