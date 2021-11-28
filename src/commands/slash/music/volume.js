module.exports = {
  name: 'volume',
  description: '🔉查看或變更播放音量。',
  usage: '<音量>',
  permissions: {
    channel: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'EMBED_LINKS'],
    member: []
  },
  options: [
    {
      name: '音量',
      type: 3,
      required: false,
      description: '您欲調整的音量大小。預設為100，請輸入介於1~100的數字。'
    }
  ],
  aliases: ['vol', 'v'],
  /**
   * @param {import("../base/CC-OSV-Client")} bot
   * @param {import("discord.js").Message} interaction
   */
  async execute (bot, interaction) {
    await interaction.deferReply()

    let arg = await interaction.options.getString('音量', true)

    const channel = await bot.getChannel(bot, interaction)
    if (!channel) return

    let player = bot.manager.players.get(interaction.guild.id)
    if (!player)
      return bot.say.slashError(
        interaction,
        '❌ | **目前沒有播放任何音樂...**'
      )
    if (!arg)
      return bot.say.slashInfo(
        interaction,
        `🔉 | 當前的音量 \`${player.volume}\`.`
      )
    let vol = parseInt(arg)
    if (!vol || vol < 1 || vol > 100)
      return bot.say.slashInfo(
        interaction,
        `**請輸入一個數字介於** \`1 - 100\``
      )
    player.setVolume(vol)
    bot.say.slashInfo(interaction, `🔉 | 音量已設定至 \`${player.volume}\``)
  }
}
