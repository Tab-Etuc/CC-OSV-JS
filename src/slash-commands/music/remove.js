const { MessageEmbed } = require('discord.js')

module.exports = {
  name: 'remove',
  description: `🎵從播放列中移除一首歌`,
  usage: '[編號]',
  permissions: {
    channel: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'EMBED_LINKS'],
    member: []
  },
  aliases: ['rm'],

  options: [
    {
      name: '編號',
      value: '[track]',
      type: 4,
      required: true,
      description: '從播放列中移除一首歌'
    }
  ],
  /**
   *
   * @param {import("../structures/DiscordMusicBot")} bot
   * @param {import("discord.js").Message} interaction
   * @param {string[]} args
   * @param {*} param3
   */
  async execute(bot, interaction, args, { GuildDB })  {
    let player = await bot.Manager.get(interaction.guild_id)
    const guild = bot.guilds.cache.get(interaction.guild_id)
    const member = guild.members.cache.get(interaction.member.user.id)
    const song = player.queue.slice(args[0] - 1, 1)
    if (!player)
      return bot.sendTime(interaction, '❌ | **目前沒有播放任何音樂...**')
    if (!member.voice.channel)
      return bot.sendTime(
        interaction,
        '❌ | **您必須在語音通道中使用此指令！**'
      )
    if (
      guild.me.voice.channel &&
      !guild.me.voice.channel.equals(member.voice.channel)
    )
      return bot.sendTime(
        interaction,
        ':x: | **您必須和我在相同的語音通道以使用此指令！You must be in the same voice channel as me to use this command!**'
      )

    if (!player.queue || !player.queue.length || player.queue.length === 0)
      return bot.sendTime('❌ | **目前沒有播放任何音樂...**')
    let rm = new MessageEmbed()
      .setDescription(
        `✅ | 已從播放列移除編號 **\`${Number(args[0])}\`** 之歌曲!`
      )
      .setColor('GREEN')
    if (isNaN(args[0]))
      rm.setDescription(`**用法:** \`${GuildDB.prefix}remove [編號]\``)
    if (args[0] > player.queue.length)
      rm.setDescription(`播放列僅有 ${player.queue.length} 首歌曲！`)
    await interaction.send(rm)
    player.queue.remove(Number(args[0]) - 1)
  }
}
