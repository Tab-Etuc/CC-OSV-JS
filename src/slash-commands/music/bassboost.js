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

  async execute(bot, interaction, args, { GuildDB }) {
    const levels = {
      無: 0.0,
      低: 0.2,
      中: 0.3,
      高: 0.35
    }

    let player = await bot.Manager.get(interaction.guild_id)
    const guild = bot.guilds.cache.get(interaction.guild_id)
    const member = guild.members.cache.get(interaction.member.user.id)
    const voiceChannel = member.voice.channel
    if (!player)
      return bot.sendTime(interaction, '❌ | **目前沒有播放任何音樂...**')
    if (!member.voice.channel)
      return bot.sendTime(
        interaction,
        '❌ | **您必須在語音通道中使用此指令。**'
      )
    if (guild.me.voice.channel && !guild.me.voice.channel.equals(voiceChannel))
      return bot.sendTime(
        interaction,
        ':x: | **您必須和我在相同的語音通道以使用此指令！**'
      )
    if (!args)
      return bot.sendTime(
        interaction,
        '**請指定一個效果等級 \n可用的等級:** `無`, `低`, `中`, `高`'
      ) //if the user do not provide args [arguments]

    let level = '無'
    if (args.length && args[0].value in levels) level = args[0].value

    player.setEQ(
      ...new Array(3)
        .fill(null)
        .map((_, i) => ({ band: i, gain: levels[level] }))
    )

    return bot.sendTime(
      interaction,
      `✅ | **低音效果等級已設定至：** \`${level}\``
    )
  }
}
