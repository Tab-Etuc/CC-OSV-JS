const levels = {
  無: 0.0,
  低: 0.2,
  中: 0.3,
  高: 0.35
}
module.exports = {
  name: 'bassboost',
  description: '🎵啟用低音效果',
  usage: '<無|低|中|高>',
  permissions: {
    channel: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'EMBED_LINKS'],
    member: []
  },
  options: [
    {
      name: '效果等級',
      description: '請指定一個效果等級 \n可用的等級: `無`, `低`, `中`, `高`',
      value: '[level]',
      type: 3,
      required: true
    }
  ],
  /**
   *
   * @param {import("../structures/DiscordMusicBot")} bot
   * @param {import("discord.js").Message} interaction
   * @param {string[]} args
   * @param {*} param3
   */

  async execute(bot, interaction) {
    const levels = {
      無: 0.0,
      低: 0.2,
      中: 0.3,
      高: 0.35
    }

    
    let player = await bot.manager.get(interaction.guild.id)
    
    const guild = bot.guilds.cache.get(interaction.guild.id)
    const member = guild.members.cache.get(interaction.member.user.id)
    const channel = await bot.getChannel(bot, interaction);
    if (!player)
      return bot.say.errorMessage(interaction, '❌ | **目前沒有播放任何音樂...**')
    if (!member.voice.channel)
      return bot.say.errorMessage(
        interaction,
        '❌ | **您必須在語音通道中使用此指令。**'
      )
    if (guild.me.voice.channel && !guild.me.voice.channel.equals(channel))
      return bot.say.errorMessage(
        interaction,
        ':x: | **您必須和我在相同的語音通道以使用此指令！**'
      )
    if (!arg)
      return bot.say.errorMessage(
        interaction,
        '**請指定一個效果等級 \n可用的等級:** `無`, `低`, `中`, `高`'
      ) //if the user do not provide args [arguments]

    let level = '無'
    let cLevel = await interaction.options.getString('效果等級', true)
    if (cLevel in levels) level = cLevel

    player.setEQ(
      ...new Array(3)
        .fill(null)
        .map((_, i) => ({ band: i, gain: levels[level] }))
    )

    return bot.say.infoMessage(
      interaction,
      `✅ | **低音效果等級已設定至：** \`${level}\``
    )
  }
}
