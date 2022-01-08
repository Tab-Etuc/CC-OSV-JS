const Prizes = require('../../models/mongoDB/Prizes.js')
const Users = require('../../models/mongoDB/Users.js')
const Guilds = require('../../models/mongoDB/Guilds.js')

const Discord = require('discord.js')

module.exports = {
  name: 'messageCreate',
  once: false,
  async execute (bot, message) {
    try {
      if (message.author.bot || !message.guild) return //如果是機器人發出的訊息、不在公會裡 就不執行

      let prefix = bot.config.DefaultPrefix
      let GuildData = await Guilds.findOne({
        _id: message.guildId
      })
      // 如果沒有伺服器資料，則創建
      if (!GuildData) {
        new Guilds({
          _id: message.guildId,
          prefix: prefix
        }).save()
      }
      if (GuildData && GuildData.prefix) prefix = GuildData.prefix

      const prefixMention = new RegExp(`^<@!?${bot.user.id}> `)
      prefix = message.content.match(prefixMention)
        ? message.content.match(prefixMention)[0]
        : prefix

      const args = message.content
        .slice(prefix.length)
        .trim()
        .split(/ +/g)
      //Making the command lowerCase because our file name will be in lowerCase
      const command = args.shift().toLowerCase()

      //Searching a command
      const cmd =
        bot.msgCommands.get(command) ||
        bot.msgCommands.find(x => x.aliases && x.aliases.includes(command))
      if (cmd) {
        if (message.content.indexOf(prefix) !== 0) return

        //Executing the codes when we get the command or aliases
        if (
          (cmd.permissions &&
            cmd.permissions.channel &&
            !message.channel
              .permissionsFor(bot.user)
              .has(cmd.permissions.channel)) ||
          (cmd.permissions &&
            cmd.permissions.member &&
            !message.channel
              .permissionsFor(message.member)
              .has(cmd.permissions.member)) ||
          (cmd.permissions &&
            !message.channel
              .permissionsFor(message.member)
              .has(['ADMINISTRATOR']))
        )
          return bot.sendError(message.channel, '缺少權限!')
        cmd.run(bot, message, args, GuildData)
        GuildData.CommandsRan++
        GuildData.save()
      }

      // chat level
      let levelData = await Users.findOne({
        guildId: message.guildId,
        userId: message.author.id
      })
      let rankData = await Prizes.findOne({
        guildId: message.guildId
      })

      if (!rankData) {
        // 如果沒有伺服器資料，則創建
        new Prizes({
          guildId: message.guildId
        }).save()
      }

      if (!levelData) {
        // 如果沒有玩家資料，則創建
        new Users({
          guildId: message.guildId,
          userId: message.author.id,
          userName: message.author.username
        }).save()
      } else {
        let addedXp = Math.floor(Math.random() * (5 - 1) + 1)
        levelData.xp += addedXp
        levelData.totalXp += addedXp
        levelData.save().then(data => {
          if (data.xp >= data.xpToLevel) {
            levelData.xp = 0
            levelData.level++
            levelData.xpToLevel = data.level * 100
            levelData.save().then(async _data => {
              const embed = new Discord.MessageEmbed()
                .setColor('#a8e1fa')
                .setAuthor(
                  message.guild.name,
                  message.guild.iconURL({ dynamic: true })
                )
                .setThumbnail(message.guild.iconURL({ dynamic: true }))
                .setDescription(
                  `恭喜 <@${message.author.id}> 升級\nʚ・⋯⋯⋯⋯⋯・୨୧・⋯⋯⋯⋯⋯・ɞ\n您現在是等級 **${levelData.level}**\n繼續聊天可解鎖更多等級身份\nʚ・⋯⋯⋯⋯⋯・୨୧・⋯⋯⋯⋯⋯・ɞ`
                )
              message.reply({ embeds: [embed] }).then(msg => {
                if (
                  rankData &&
                  rankData.levelPrizes.find(x => x.level == _data.level)
                ) {
                  rankData.levelPrizes
                    .filter(x => x.level == _data.level)
                    .forEach(x => {
                      message.member.roles
                        .add(x.role)
                        .catch(e => console.log(e))
                      const embed = new Discord.MessageEmbed()
                        .setColor('#a8e1fa')
                        .setAuthor(
                          message.guild.name,
                          message.guild.iconURL({ dynamic: true })
                        )
                        .setThumbnail(message.guild.iconURL({ dynamic: true }))
                        .setDescription(
                          `恭喜 <@${message.author.id}> 升級\nʚ・⋯⋯⋯⋯⋯・୨୧・⋯⋯⋯⋯⋯・ɞ\n您現在是等級 **${levelData.level}**\n您剛解鎖了身分組：<@&${x.role}>\n繼續聊天可解鎖更多等級身份\nʚ・⋯⋯⋯⋯⋯・୨୧・⋯⋯⋯⋯⋯・ɞ`
                        )
                      msg.edit({ embeds: [embed] })
                    })
                }
              })
            })
          }
        })
      }

      let C_msg = message.content
      let NQN_msg = message.content

      C_msg = C_msg.replace(
        /cl3i|c襖喔|CL3I|C襖喔|Cl3i|CL3i|cL3I|cl3I/g,
        '好喔'
      )

      let substringArray = get_substrings_between(message.content, ':', ':')
      // 如果不是 NQN 模式的處理。這邊是將 Cl3I => 好喔
      if (!substringArray.length) {
        if (C_msg === message.content) return

        let webhook = await message.channel.fetchWebhooks()

        webhook = webhook.find(x => x.name === 'CL3I')

        if (!webhook) {
          webhook = await message.channel.createWebhook(`CL3I`, {
            avatar: bot.user.displayAvatarURL({ dynamic: true })
          })
        }

        await webhook.edit({
          name: message.member.nickname
            ? message.member.nickname
            : message.author.username,
          avatar: message.author.displayAvatarURL({ dynamic: true })
        })

        message.delete()

        webhook.send(C_msg)

        return await webhook.edit({
          name: `NQN`,
          avatar: bot.user.displayAvatarURL({ dynamic: true })
        })
      }

      NQN_msg = C_msg.replace(
        /cl3i|c襖喔|CL3I|C襖喔|Cl3i|CL3i|cL3I|cl3I/g,
        '好喔'
      )

      substringArray.forEach(m => {
        let emoji = bot.emojis.cache.find(x => x.name === m)
        if (emoji['animated']) {
          var replace = `:${m}:`
          var rexreplace = new RegExp(replace, 'g')

          if (
            emoji &&
            !NQN_msg.split(' ').find(x => x === emoji.toString()) &&
            !NQN_msg.includes(`<a${replace}${emoji.id}>`)
          )
            NQN_msg = NQN_msg.replace(rexreplace, emoji.toString())
        } else {
          return
        }
      })

      if (NQN_msg === message.content) return

      let webhook = await message.channel.fetchWebhooks()
      webhook = webhook.find(x => x.name === 'NQN')

      if (!webhook) {
        webhook = await message.channel.createWebhook(`NQN`, {
          avatar: bot.user.displayAvatarURL({ dynamic: true })
        })
      }

      await webhook
        .edit({
          name: message.member.nickname
            ? message.member.nickname
            : message.author.username,
          avatar: message.author.displayAvatarURL({ dynamic: true })
        })
        .catch(console.error)

      message.delete()

      webhook.send(NQN_msg)

      await webhook
        .edit({
          name: `NQN`,
          avatar: bot.user.displayAvatarURL({ dynamic: true })
        })
        .catch(console.error)
    } catch (error) {
      console.log(error)
    }
  }
}
function get_substrings_between (str, startDelimiter, endDelimiter) {
  var contents = []
  var startDelimiterLength = startDelimiter.length
  var endDelimiterLength = endDelimiter.length
  var startFrom = (contentStart = contentEnd = 0)

  while (false !== (contentStart = strpos(str, startDelimiter, startFrom))) {
    contentStart += startDelimiterLength
    contentEnd = strpos(str, endDelimiter, contentStart)
    if (false === contentEnd) {
      break
    }
    contents.push(str.substr(contentStart, contentEnd - contentStart))
    startFrom = contentEnd + endDelimiterLength
  }

  return contents
}
function strpos (haystack, needle, offset) {
  var i = (haystack + '').indexOf(needle, offset || 0)
  return i === -1 ? false : i
}
