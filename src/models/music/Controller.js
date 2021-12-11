/**
 *
 * @param {import("../../base/CC-OSV-Client")} bot
 * @param {import("discord.js").ButtonInteraction} interaction
 */
module.exports = async (bot, interaction) => {
  let guild = bot.guilds.cache.get(interaction.customId.split(':')[1])
  let property = interaction.customId.split(':')[2]
  let player = bot.manager.get(guild.id)

  if (!player) return Error(interaction, '音樂已結束，沒有可以控制的播放器。')

  if (property === 'LowVolume') {
    player.setVolume(player.volume - 10)
    return Info(interaction, '成功將音量設定至' + player.volume)
  }

  if (property === 'Replay') {
    if (!player.queue.previous)
      return Error(interaction, '沒有找到先前播放的歌曲。')

    player.queue.unshift(player.queue.previous)
    player.queue.unshift(player.queue.current)
    player.stop()
    return interaction.deferUpdate()
  }

  if (property === 'PlayAndPause') {
    if (player.paused) player.pause(false)
    else player.pause(true)

    return Info(interaction, player.paused ? '已暫停' : '重新播放')
  }

  if (property === 'Next') {
    player.stop()
    return interaction.deferUpdate()
  }

  if (property === 'HighVolume') {
    player.setVolume(player.volume + 10)
    return Info(interaction, '成功將音量設定至' + player.volume)
  }

  return interaction.reply({
    ephemeral: true,
    content: '未知的控制器選項。'
  })
}
async function Info (interaction, text) {
  return interaction
    .editReply({
      embeds: [
        new MessageEmbed()
          .setDescription(text)
          .setColor(interaction.guild.me.displayColor || '#00FFFF')
      ],
      allowedMentions: { repliedUser: false }
    })
    .catch(console.error)
}

/**
 * Reply a custom embed
 * @param {import("discord.js").Interaction } interaction
 * @param {string} text
 */
async function Error (interaction, text) {
  return interaction
    .editReply({
      ephemeral: true,
      embeds: [
        new MessageEmbed().setDescription('❌ | ' + text).setColor('RED')
      ],
      allowedMentions: { repliedUser: false }
    })
    .catch(console.error)
}
