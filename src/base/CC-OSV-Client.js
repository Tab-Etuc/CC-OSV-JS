const {
  Client,
  MessageEmbed,
  Collection,
  MessageActionRow,
  MessageButton
} = require('discord.js')
const { Manager } = require('erela.js')
const prettyMilliseconds = require('pretty-ms')
const spotify = require('better-erela.js-spotify').default
const apple = require('erela.js-apple')
const deezer = require('erela.js-deezer')
const facebook = require('erela.js-facebook')
const getLavalink = require('../models/music/getLavalink')
const getChannel = require('../models/music/getChannel')
const getLanguage = require('../models/getLanguage')
const DBD = require('../dashboard/discord-dashboard/index')
const DarkDashboard = require('../dashboard/dbd-dark-dashboard/index')

require('./EpicPlayer')
require('../models/format')
require('dotenv').config()

let langsSettings = {}

let currencyNames = {}

let botNicknames = {}

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
    this.ms = prettyMilliseconds

    this.getLavalink = getLavalink
    this.getChannel = getChannel
    this.getLanguage = getLanguage
    this.build()
  }

  build () {
    let bot = this
    const Dashboard = new DBD.Dashboard({
      port: process.env.PORT,
      client: {
        id: process.env.Discord_ClientID,
        secret: process.env.Discord_ClientSecret
      },
      redirectUri: process.env.DOMAIN + '/discord/callback',
      domain: process.env.DOMAIN,
      bot: this,
      theme: DarkDashboard({
        information: {
          createdBy: 'CC_#8844',
          websiteTitle: 'CC-OSV',
          websiteName: 'CC-OSV Dashboard',
          websiteUrl: process.env.DOMAIN,
          dashboardUrl: process.env.DOMAIN,
          supportServer: 'https://discord.gg/yYq4UgRRzz',
          imageFavicon: 'https://imgur.com/IrttPgS.png',
          iconURL: 'https://imgur.com/IrttPgS.png',
          pagestylebg: 'linear-gradient(to #2CA8FF, pink 0%, #155b8d 100%)',
          main_color: '#2CA8FF',
          sub_color: '#ebdbdb'
        },
        invite: {
          client_id: '893700228195184661',
          redirectUri: process.env.DOMAIN + '/close',
          permissions: '8'
        },
        index: {
          card: {
            category: 'CC-OSV 儀錶板',
            title: `歡迎來到CC-OSV 儀錶板，您可以於此處控制CC-OSV的核心功能。`,
            image: 'https://imgur.com/w1stfDH.png'
          },
          information: {
            category: 'Category',
            title: 'Information',
            description: `This bot and panel is currently a work in progress so contact me if you find any issues on discord.`,
            footer: 'Footer'
          },
          feeds: {
            category: 'Category',
            title: 'Information',
            description: `This bot and panel is currently a work in progress so contact me if you find any issues on discord.`,
            footer: 'Footer'
          }
        },
        guilds: {
          cardTitle: '伺服器',
          cardDescription: '以下是您目前擁有權限的所有伺服器：'
        },
        //If guildSettings is removed the text will not be visible.
        guildSettings: {
          cardTitle: '伺服器設置',
          cardDescription: '您可以於此處管理伺服器的所有設置：'
        },
        commands: {
          categoryOne: {
            category: `實用`,
            subTitle: `關於實用類別的所有指令。`,
            list: [
              {
                commandName: '幫助',
                commandUsage: '/help',
                commandDescription: '列出可使用的指令列表和使用教學。',
                commandAlias: '實用'
              },
              {
                commandName: '計算機',
                commandUsage: '/計算機',
                commandDescription: '使用一個以按鈕操作的計算機。',
                commandAlias: '實用'
              },
              {
                commandName: '創建 Embed',
                commandUsage: '/embed',
                commandDescription: '簡單地創建一個Embed訊息。',
                commandAlias: '實用'
              },
              {
                commandName: '禁言',
                commandUsage: '/mute',
                commandDescription: '使一位對象失去發言權限。',
                commandAlias: '實用'
              },
              {
                commandName: '連線品質',
                commandUsage: '/ping',
                commandDescription: '🏓展示Bot的延遲',
                commandAlias: '實用'
              },
              {
                commandName: 'prize',
                commandUsage: '/prize <新增|移除> [等級] [身分組]',
                commandDescription: '新增或移除於玩家升等時所賦予之身分組。',
                commandAlias: '實用'
              },
              {
                commandName: 'prizelist',
                commandUsage: '/prizelist',
                commandDescription: '展示您在升等時會得到的身分組。',
                commandAlias: '實用'
              },
              {
                commandName: '清除',
                commandUsage: '/purge <數量>',
                commandDescription: '清除指定數量的訊息。',
                commandAlias: '實用'
              },
              {
                commandName: 'rank',
                commandUsage: '/rank',
                commandDescription: '顯示您的聊天等級。',
                commandAlias: '實用'
              },
              {
                commandName: '排行榜',
                commandUsage: '/排行榜 <資產|聊天等級>',
                commandDescription: '查看伺服器中的(等級/經濟)排行榜。',
                commandAlias: '實用'
              },
              {
                commandName: '上線時間',
                commandUsage: '/uptime',
                commandDescription: '顯示CC-OSV自上次更新歷經了多少時間。',
                commandAlias: '實用'
              }
            ]
          },
          categoryTwo: {
            category: `音樂`,
            subTitle: `關於音樂類別的所有指令。`,
            list: [
              {
                commandName: '循環',
                commandUsage: '/loop',
                commandDescription: '🔂循環當前的歌曲。',
                commandAlias: '音樂'
              },
              {
                commandName: '循環播放列',
                commandUsage: '/loopqueue',
                commandDescription: '🔂循環整個播放列',
                commandAlias: '音樂'
              },
              {
                commandName: '正在播放',
                commandUsage: '/nowplaying',
                commandDescription: '🎵查看目前正在播放的歌曲',
                commandAlias: '音樂'
              },
              {
                commandName: '暫停',
                commandUsage: '/pause',
                commandDescription: '⏸暫停音樂。',
                commandAlias: '音樂'
              },
              {
                commandName: '播放',
                commandUsage: '/play <歌曲>',
                commandDescription: '🎵播放音樂。',
                commandAlias: '音樂'
              },
              {
                commandName: '播放列',
                commandUsage: '/queue',
                commandDescription: '🎵顯示所有目前播放列中的歌曲',
                commandAlias: '音樂'
              },
              {
                commandName: '移除',
                commandUsage: '/remove <編號>',
                commandDescription: '🎵從播放列中移除一首歌',
                commandAlias: '音樂'
              },
              {
                commandName: '重新播放',
                commandUsage: '/resume',
                commandDescription: '🔂重新播放音樂。',
                commandAlias: '音樂'
              },
              {
                commandName: '搜尋',
                commandUsage: '/search <歌曲名>',
                commandDescription: '🔎播放基於查詢的歌曲結果',
                commandAlias: '音樂'
              },
              {
                commandName: '跳過',
                commandUsage: '/skip <位置>',
                commandDescription: '🎵跳過當前的曲目。',
                commandAlias: '音樂'
              },
              {
                commandName: '停止',
                commandUsage: '/stop',
                commandDescription: '🎵停止播放歌曲。',
                commandAlias: '音樂'
              },
              {
                commandName: '音量',
                commandUsage: '/volume <音量>',
                commandDescription: '🔉查看或變更播放音量。當前的曲目。',
                commandAlias: '音樂'
              }
            ]
          },
          categoryThree: {
            category: `樂趣`,
            subTitle: `關於樂趣類別的所有指令。`,
            list: [
              {
                commandName: '井字遊戲',
                commandUsage: '/井字遊戲 <玩家>',
                commandDescription: '遊玩一局井字遊戲。',
                commandAlias: '樂趣'
              }
            ]
          },
          categoryFour: {
            category: `經濟`,
            subTitle: `關於經濟類別的所有指令。`,
            list: [
              {
                commandName: '餘額',
                commandUsage: '/餘額 [玩家]',
                commandDescription: '查看您的餘額。',
                commandAlias: '經濟'
              },
              {
                commandName: '購買',
                commandUsage: '/購買 <商品> [數量]',
                commandDescription: '購買市廛上的商品。',
                commandAlias: '經濟'
              },
              {
                commandName: '存款',
                commandUsage: '/存款 <金額>',
                commandDescription: '將您的現金存入銀行。',
                commandAlias: '經濟'
              },
              {
                commandName: '背包',
                commandUsage: '/背包',
                commandDescription: '查看您的背包。',
                commandAlias: '經濟'
              },
              {
                commandName: '搶劫',
                commandUsage: '/搶劫 <玩家>',
                commandDescription: '試圖搶某人的錢。',
                commandAlias: '經濟'
              },
              {
                commandName: '商店',
                commandUsage: '/商店',
                commandDescription: '前往市廛，採購琳瑯滿目的商品。',
                commandAlias: '經濟'
              },
              {
                commandName: '提款',
                commandUsage: '/提款 <金額>',
                commandDescription: '從銀行取出現金。',
                commandAlias: '經濟'
              }
            ]
          }
        }
      }),
      settings: [
        {
          categoryId: 'Level',
          categoryName: '聊天等級',
          categoryDescription: '聊天等級的相關設置。',
          categoryOptionsList: [
            {
              optionId: 'LevelSystemEnable',
              optionName: '是否啟用升等系統',
              optionDescription: '',
              optionType: DBD.formTypes.select(
                { 是: 'true', 否: 'false' },
                false
              ),
              getActualSet: async ({ guild }) => {
                return currencyNames[guild.id] || null
              },
              setNew: async ({ guild, newData }) => {
                currencyNames[guild.id] = newData
                return
              }
            },
            {
              optionId: 'levelUpMsg',
              optionName: '當升等時發送的訊息',
              optionDescription: '請選擇一個用於顯示作為時鐘的頻道。',
              optionType: DBD.formTypes.input(
                '恭喜！{member} 剛升到了 {level} 級！',
                1,
                16,
                false,
                true
              ),
              getActualSet: async ({ guild }) => {
                return currencyNames[guild.id] || null
              },
              setNew: async ({ guild, newData }) => {
                currencyNames[guild.id] = newData
                return
              }
            }
          ]
        },
        {
          categoryId: 'nickname',
          categoryName: '暱稱',
          categoryDescription: '暱稱。',
          categoryOptionsList: [
            // {
            //   optionId: 'lang',
            //   optionName: '語言',
            //   optionDescription: '簡單地更換CC-OSV的語言。',
            //   optionType: DBD.formTypes.select({
            //     Chinese: 'zh',
            //     English: 'en'
            //   }),
            //   getActualSet: async ({ guild }) => {
            //     return langsSettings[guild.id] || null
            //   },
            //   setNew: async ({ guild, newData }) => {
            //     langsSettings[guild.id] = newData
            //     return
            //   }
            // },
            {
              optionId: 'nickname',
              optionName: '暱稱',
              optionDescription: '更換CC-OSV在此伺服器的暱稱',
              optionType: DBD.formTypes.input(
                '˚₊ ࣪« 𝒞𝒞-𝒪𝒮𝒱 » ࣪ ˖',
                1,
                16,
                false,
                true
              ),
              getActualSet: async ({ guild }) => {
                return botNicknames[guild.id] || false
              },
              setNew: async ({ guild, newData }) => {
                botNicknames[guild.id] = newData
                return
              }
            }
          ]
        },
        {
          categoryId: 'Clock',
          categoryName: '時鐘',
          categoryDescription: '設置一個可以顯示時間的頻道。',
          categoryOptionsList: [
            {
              optionId: 'ClockChannel',
              optionName: '頻道',
              optionDescription: '請選擇一個用於顯示作為時鐘的頻道。',
              optionType: DBD.formTypes.channelsSelect(false, ['GUILD_VOICE']),
              getActualSet: async ({ guild }) => {
                return currencyNames[guild.id] || null
              },
              setNew: async ({ guild, newData }) => {
                currencyNames[guild.id] = newData
                return
              }
            }
          ]
        },
        {
          categoryId: 'ReactionRole',
          categoryName: '響應 給予身分組',
          categoryDescription: '點擊表情符號獲取身分組。',
          categoryOptionsList: [
            {
              optionId: 'RoleChannel',
              optionName: '頻道',
              optionDescription: '',
              optionType: DBD.formTypes.channelsSelect(false, ['GUILD_TEXT']),
              getActualSet: async ({ guild }) => {
                return currencyNames[guild.id] || null
              },
              setNew: async ({ guild, newData }) => {
                currencyNames[guild.id] = newData
                return
              }
            },
            {
              optionId: 'MsgID',
              optionName: '該訊息ID。',
              optionDescription: '',
              optionType: DBD.formTypes.input('', 1, 16, false, true),
              getActualSet: async ({ guild }) => {
                return currencyNames[guild.id] || null
              },
              setNew: async ({ guild, newData }) => {
                currencyNames[guild.id] = newData
                return
              }
            },
            {
              optionId: 'EmojiID',
              optionName: '該表情符號ID',
              optionDescription: '',
              optionType: DBD.formTypes.input('', 1, 16, false, true),
              getActualSet: async ({ guild }) => {
                return currencyNames[guild.id] || null
              },
              setNew: async ({ guild, newData }) => {
                currencyNames[guild.id] = newData
                return
              }
            },
            {
              optionId: 'Role',
              optionName: '欲給予的身分組',
              optionDescription: '',
              optionType: DBD.formTypes.rolesSelect(false, false),
              getActualSet: async ({ guild }) => {
                return currencyNames[guild.id] || null
              },
              setNew: async ({ guild, newData }) => {
                currencyNames[guild.id] = newData
                return
              }
            },
            {
              optionId: 'MsgToSend',
              optionName: '欲發送的訊息',
              optionDescription: '',
              optionType: DBD.formTypes.input(
                '您獲得了{role}身分組。',
                1,
                16,
                false,
                true
              ),
              getActualSet: async ({ guild }) => {
                return currencyNames[guild.id] || null
              },
              setNew: async ({ guild, newData }) => {
                currencyNames[guild.id] = newData
                return
              }
            }
          ]
        }
      ]
    })

    this.login(this.config.Token)
    require('../handlers/EventHandler')(this)
    require(`../task/CangeChannelTime`)(this)
    Dashboard.init()

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
}

module.exports = CCOSV
