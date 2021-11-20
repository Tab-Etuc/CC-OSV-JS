const { MessageEmbed } = require('discord.js')
const economy = require('../../../models/mongoDB/Economy')
const Levels = require('../../../models/mongoDB/Levels.js')

module.exports = {
  name: '排行榜',
  description: '查看伺服器中的(等級/經濟)排行榜。',
  category: '實用',
  options: [
    {
      name: '類別',
      type: 'STRING',
      description: '您欲查看之類別。',
      required: true,
      choices: [
        {
          name: '資產',
          value: 'economy'
        },
        {
          name: '聊天等級',
          value: 'level'
        }
      ]
    }
  ],

  async execute (bot, interaction) {
    const arg = interaction.options.getString('類別', false)
    if (arg === 'economy') {
      let data = await economy
        .find({ guildId: interaction.guild.id })
        .sort({ coinsInBank: -1 })
        .exec()
      data = data
        .filter(
          x =>
            interaction.guild.members.cache.get(x.userId) &&
            interaction.guild.members.cache.get(x.userId).bot != true
        )
        .slice(0, 6)
      if (!data.length) return interaction.reply('查無數據。')

      const emojis = [':first_place:', ':second_place:', ':third_place:']
      data = data.map(
        (x, i) =>
          `${emojis[i] ||
            '🔹'} **${x.coinsInWallet.toLocaleString()}** - ${bot.users.cache.get(
            x.userId
          ).tag || '未知#0000'}`
      )

      const embed = new MessageEmbed()
        .setAuthor(`${interaction.guild.name} 富豪榜`)
        .setDescription(`${data.join('\n')}`)
        .setColor('RANDOM')
        .setFooter('希望我能有這麼多錢......')
      interaction.reply({ embeds: [embed] })
    } else if (arg === 'level') {
      let levelData = await Levels.find({ guildId: interaction.guild.id })
        .sort({ totalXp: -1 })
        .exec()
      levelData = levelData
        .filter(x => interaction.guild.members.cache.has(x.userId))
        .slice(0, 25)
        .map(
          (x, i) =>
            `\`${i + 1}.\` <@${x.userId}> : **${
              x.level
            }** Level - **${numberFormat(x.totalXp)}** Xp - (\`${numberFormat(
              x.xp
            )}/${numberFormat(x.xpToLevel)}\`)`
        )
        .join('\n')

      if (!levelData.length) levelData = `查無數據。`
      const embed = new MessageEmbed()
        .setColor('RANDOM')
        .setAuthor(
          interaction.guild.name,
          interaction.guild.iconURL({ dynamic: true })
        )
        .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
        .setDescription(`**${interaction.guild.name}**  \n\n` + levelData)
      interaction.reply({ embeds: [embed] })
    }
  }
}

function numberFormat (num) {
  let numberFormats = [
    { value: 1, symbol: '' },
    { value: 1e3, symbol: 'K' },
    { value: 1e6, symbol: 'M' },
    { value: 1e9, symbol: 'G' },
    { value: 1e12, symbol: 'T' },
    { value: 1e15, symbol: 'P' },
    { value: 1e18, symbol: 'E' }
  ]
  let i
  for (i = numberFormats.length - 1; i > 0; i--) {
    if (num >= numberFormats[i].value) break
  }
  return (
    (num / numberFormats[i].value)
      .toFixed(2)
      .replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + numberFormats[i].symbol
  )
}
