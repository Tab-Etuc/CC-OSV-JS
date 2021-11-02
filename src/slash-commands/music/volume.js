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
    const guild = bot.guilds.cache.get(interaction.guild.id)
    const member = guild.members.cache.get(interaction.member.user.id)

    if (!member.voice.channel)
      return bot.say.errorMessage(
        interaction,
        '❌ | 您必須先加入一個語音頻道！'
      )
    if (
      guild.me.voice.channel &&
      !guild.me.voice.channel.equals(member.voice.channel)
    )
      return bot.say.errorMessage(
        interaction,
        ':x: | **您必須和我在相同的語音通道以使用此指令！**'
      )
    let player = await bot.manager.get(interaction.guild.id)
    if (!player)
      return bot.say.errorMessage(
        interaction,
        '❌ | **目前沒有播放任何音樂...**'
      )
    if (!arg)
      return bot.say.infoMessage(
        interaction,
        `🔉 | 當前的音量 \`${player.volume}\`.`
      )
    let vol = parseInt(arg)
    if (!vol || vol < 1 || vol > 100)
      return bot.say.infoMessage(
        interaction,
        `**請輸入一個數字介於** \`1 - 100\``
      )
    player.setVolume(vol)
    bot.say.infoMessage(interaction, `🔉 | 音量已設定至 \`${player.volume}\``)
  }
}
