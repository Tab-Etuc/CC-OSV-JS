const Prizes = require('../../../models/mongoDB/Prizes.js')
const { MessageEmbed } = require('discord.js')

module.exports = {
  name: 'prize',
  description: '新增或移除於玩家升等時所賦予之身分組。',
  category: '實用',
  permission: 'ADMINISTRATOR',
  options: [
    {
      name: '動作',
      type: 'STRING',
      description: '您欲執行的動作。',
      required: true,
      choices: [
        {
          name: '新增',
          value: 'add'
        },
        {
          name: '移除',
          value: 'remove'
        }
      ]
    },
    {
      name: '等級',
      type: 'INTEGER',
      description: '您欲於幾等賦予玩家身分組？',
      required: true
    },
    {
      name: '身分組',
      type: 'ROLE',
      description: '您欲添加之身分組。',
      required: true
    }
  ],
  async execute (bot, interaction) {
    const arg = interaction.options.getString('動作', false)
    if (arg == 'add') {
      let level = interaction.options.getInteger('等級', false)

      let prizeData = await Prizes.findOne({ guildId: interaction.guild.id })
      let role = interaction.options.getRole('身分組', false)

      let embed = new MessageEmbed()
        .setColor('RANDOM')
        .setAuthor(
          interaction.member.user.username,
          interaction.member.user.displayAvatarURL({ dynamic: true })
        )

      if (level < 0)
        return interaction.reply({
          embeds: [embed.setDescription(`等級不可為負！`)]
        })

      if (!prizeData) {
        let newPrize = new Prizes({
          guildId: interaction.guild.id,
          levelPrizes: [{ level: level, role: role.id }]
        }).save()
      } else {
        if (
          prizeData.levelPrizes.find(x => x.level == level && x.role == role.id)
        ) {
          interaction.reply({
            embeds: [
              embed.setDescription(
                `未成功執行此操作。\n\`${role} 身分組早已於 ${level} 等時添加。\``
              )
            ]
          })
        } else {
          prizeData.levelPrizes.push({ level: level, role: role.id })
          prizeData.save()
          interaction.reply({
            embeds: [
              embed.setDescription(
                `成功執行。\n\`現在將於 ${level} 等時添加 ${role} 身分組。\``
              )
            ]
          })
        }
      }
    } else if (arg == 'remove') {
      let level = interaction.options.getInteger('等級', false)

      let role = interaction.options.getRole('身分組', false)
      let prizeData = await Prizes.findOne({ guildId: interaction.guild.id })
      let embed = new MessageEmbed()
        .setColor('RANDOM')
        .setAuthor(
          interaction.author.username,
          interaction.author.avatarURL({ dynamic: true })
        )

      if (level < 0)
        return interaction.reply({
          embeds: [embed.setDescription(`等級不可為負！`)]
        })

      if (!prizeData) {
        let newPrize = new Prizes({
          guildId: interaction.guild.id
        })
          .save()
          .then(data => {
            return interaction.reply({
              embeds: [
                embed.setDescription(
                  `未成功執行此操作。\n\`在等級：${level}中未發現 ${role} 身分組！\``
                )
              ]
            })
          })
      } else {
        if (
          prizeData.levelPrizes.find(
            x => x.level == level && x.role == (role.id || role)
          )
        ) {
          prizeData.levelPrizes = prizeData.levelPrizes.filter(
            x => x.role != (role.id || role)
          )
          prizeData.save()
          interaction.reply(
            embed.setDescription(
              `成功執行。\n\`已將於 ${level} 等時添加的身分組： ${role} 事件移除。 `
            )
          )
        } else {
          return interaction.reply({
            embeds: [
              embed.setDescription(
                `未成功執行此操作。\n\`在等級：${level}中未發現 ${role} 身分組！\``
              )
            ]
          })
        }
      }
    }
  }
}
