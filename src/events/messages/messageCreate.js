const Prizes = require('../../models/Prizes.js')
const Levels = require('../../models/Levels.js')
const Guilds = require('../../models/Guilds.js')

const Discord = require('discord.js')

module.exports = {
  name: 'messageCreate',
  once: false,
  async execute (bot, message) {
    try {
      if (message.author.bot || !message.guild) return //如果是機器人發出的訊息、不在公會裡 就不執行

      const args = message.content
        .slice(prefix.length)
        .trim()
        .split(/ +/g)
      //Making the command lowerCase because our file name will be in lowerCase
      const command = args.shift().toLowerCase()

      //Searching a command
      const cmd =
        bot.commands.get(command) ||
        bot.commands.find(x => x.aliases && x.aliases.includes(command))
      if (cmd) {
        let prefix = bot.config.DefaultPrefix

        let GuildData = await Guilds.findOne({
          guildId: message.guild.id
        })

        if (GuildData && GuildData.prefix) prefix = GuildData.prefix
        // 如果沒有伺服器資料，則創建
        if (!GuildData) {
          let newGuild = new Guilds({
            guildId: message.guild.id,
            prefix: prefix
          }).save()
        }

        //Prefixes also have mention match
        const prefixMention = new RegExp(`^<@!?${bot.user.id}> `)
        prefix = message.content.match(prefixMention)
          ? message.content.match(prefixMention)[0]
          : prefix

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
            GuildData.DJ &&
            !message.channel
              .permissionsFor(message.member)
              .has(['ADMINISTRATOR']) &&
            !message.member.roles.cache.has(GuildData.DJ))
        )
          return bot.sendError(
            message.channel,
            'Missing Permissions!'
          )
        cmd.run(bot, message, args, { GuildData })
        let guild = await Guilds.findOne({ guildId: message.guild.id })
        guild.CommandsRan++
        guild.save()
      }

      // chat level
      let levelData = await Levels.findOne({
        guildId: message.guild.id,
        userId: message.author.id
      })
      let rankData = await Prizes.findOne({
        guildId: message.guild.id
      })

      if (!rankData) {
        // 如果沒有伺服器資料，則創建
        let newRank = new Prizes({
          guildId: message.guild.id
        }).save()
      }

      if (!levelData) {
        // 如果沒有玩家資料，則創建
        let newLevel = new Levels({
          guildId: message.guild.id,
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

      let substringArray = bot.utils.get_substrings_between(
        message.content,
        ':',
        ':'
      )
      // 如果不是 NQN 模式的處理
      if (!substringArray.length) {
        if (C_msg === message.content) return

        let webhook = await message.channel.fetchWebhooks()
        webhook = webhook.find(x => x.name === 'NQN')

        if (!webhook) {
          webhook = await message.channel.createWebhook(`NQN`, {
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

      await webhook.edit({
        name: message.member.nickname
          ? message.member.nickname
          : message.author.username,
        avatar: message.author.displayAvatarURL({ dynamic: true })
      })

      message.delete()

      webhook.send(NQN_msg)

      await webhook.edit({
        name: `NQN`,
        avatar: bot.user.displayAvatarURL({ dynamic: true })
      })
    } catch (error) {
      console.log(error)
    }
  }
}