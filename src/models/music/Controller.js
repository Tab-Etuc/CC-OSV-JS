/**
 *
 * @param {import("../../base/CC-OSV-Client")} bot
 * @param {import("discord.js").ButtonInteraction} interaction
 */
module.exports = async (bot, interaction) => {
  let guild = bot.guilds.cache.get(interaction.customId.split(':')[1])
  let property = interaction.customId.split(':')[2]
  let player = bot.manager.get(guild.id)

  if (!player)
    return interaction.reply({
      embeds: [bot.Embed('音樂已結束，沒有可以控制的播放器。')]
    })

  if (property === 'LowVolume') {
    player.setVolume(player.volume - 10)
    return interaction.reply({
      embeds: [bot.Embed('成功將音量設定至' + player.volume)]
    })
  }

  if (property === 'Replay') {
    if (!player.queue.previous)
      return interaction.reply({
        embeds: [bot.ErrorEmbed('沒有找到先前播放的歌曲。')]
      })
    player.queue.unshift(player.queue.previous)
    player.queue.unshift(player.queue.current)
    player.stop()
    return interaction.deferUpdate()
  }

  if (property === 'PlayAndPause') {
    if (player.paused) player.pause(false)
    else player.pause(true)
    return interaction.reply({
      embeds: [bot.Embed(player.paused ? '已暫停' : '重新播放')]
    })
  }

  if (property === 'Next') {
    player.stop()
    return interaction.deferUpdate()
  }

  if (property === 'HighVolume') {
    player.setVolume(player.volume + 10)
    return interaction.reply({
      embeds: [bot.Embed('成功將音量設定至' + player.volume)]
    })
  }

  return interaction.reply({
    ephemeral: true,
    content: '未知的控制器選項。'
  })
}
