module.exports = {
  name: 'purge',
  description: '清除指定數量的訊息。',
  category: '實用',
  subCommands: ['<數量>**\n欲清除之訊息數量。'],
  options: [
    {
      name: '數量',
      type: 'INTEGER',
      description: '您欲清除之訊息數量。',
      required: true
    },
    {
      name: '訊息顯示',
      type: 'STRING',
      description: '是否將訊息清除完畢之訊息發送至頻道',
      required: false,
      choices: [
        {
          name: '是',
          value: 'yes'
        },
        {
          name: '否',
          value: 'no'
        }
      ]
    }
  ],
  async execute (bot, interaction) {
    const MTBS = await bot.getLanguage(interaction.guildId, 'utility', 'Purge')

    const integer = interaction.options.getInteger('數量')
    const BOOLEAN_ = interaction.options.getString('訊息顯示')

    if (integer < 1) return
    const hundreds = Math.floor(integer / 100)
    const remainder = integer % 100
    let totalDeleted = 0

    if (remainder > 0) {
      const e = await interaction.channel.bulkDelete(remainder, true)
      totalDeleted += e.size
    }
    for (let i = 0; i < hundreds; ++i) {
      const e = await interaction.channel.bulkDelete(100, true)
      totalDeleted += e.size
    }

    const embed = bot.say
      .rootEmbed(interaction)
      .setTitle(MTBS.DoneTitle)
      .setDescription(MTBS.Done.format(integer))
      .setTimestamp()
      .setFooter(MTBS.Channel.format(interaction.channel.name))
    if (!BOOLEAN_ || BOOLEAN_ == 'yes') {
      await interaction.reply({
        content: MTBS.MsgTips,
        embeds: [embed]
      })
    } else {
      return interaction.reply({ embeds: [embed], ephemeral: true })
    }
  }
}
