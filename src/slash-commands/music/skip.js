module.exports = {
  name: 'skip',
  description: '🎵跳過當前的曲目。',
  usage: '',
  permissions: {
    channel: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'EMBED_LINKS'],
    member: []
  },
  aliases: ['s', 'next'],
  options: [
    {
      name: '位置',
      value: 'song',
      type: 3,
      required: false,
      description: '您想跳到...位置。'
    }
  ],

  /**
   * @param {import("../base/CC-OSV-Client")} bot
   * @param {import("discord.js").Message} interaction
   */

  async execute (bot, interaction) {
    await interaction.deferReply()
    const guild = bot.guilds.cache.get(interaction.guild.id)
    const member = guild.members.cache.get(interaction.member.user.id)

    if (!member.voice.channel)
      return bot.say.errorMessage(
        interaction,
        '❌ | **您必須先加入一個語音頻道！**'
      )
    if (
      guild.me.voice.channel &&
      !guild.me.voice.channel.equals(member.voice.channel)
    )
      return bot.say.errorMessage(
        interaction,
        ':x: | **您必須和我在相同的語音通道以使用此指令！**'
      )

    const skipTo = await interaction.options.getString('位置', false)

    let player = await bot.manager.get(interaction.guild.id)

    if (!player)
      return bot.say.errorMessage(
        interaction,
        '❌ | **目前沒有播放任何音樂...**'
      )

    if (
      skipTo !== null &&
      (isNaN(skipTo) || skipTo < 1 || skipTo > player.queue.length)
    )
      return bot.say.infoMessage(interaction, '❌ | **無效的數字！**')
    player.stop(skipTo)
    bot.say.infoMessage(interaction, '**已跳過!**')
  }
}
