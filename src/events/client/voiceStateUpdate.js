/**
 *
 * @param {import("../lib/DiscordMusicBot")} client
 * @param {import("discord.js").VoiceState} oldState
 * @param {import("discord.js").VoiceState} newState
 * @returns {Promise<void>}
 */
module.exports = {
  name: 'voiceStateUpdate',
  once: true,
  async execute (bot) {
    // get guild and player
    let guildId = newState.guild.id
    const player = client.manager.get(guildId)

    // check if the bot is active (playing, paused or empty does not matter (return otherwise)
    if (!player || player.state !== 'CONNECTED') return

    // prepreoces the data
    const stateChange = {}
    // get the state change
    if (oldState.channel === null && newState.channel !== null)
      stateChange.type = 'JOIN'
    if (oldState.channel !== null && newState.channel === null)
      stateChange.type = 'LEAVE'
    if (oldState.channel !== null && newState.channel !== null)
      stateChange.type = 'MOVE'
    if (oldState.channel === null && newState.channel === null) return // you never know, right
    if (newState.serverMute == true && oldState.serverMute == false)
      return player.pause(true)
    if (newState.serverMute == false && oldState.serverMute == true)
      return player.pause(false)
    // move check first as it changes type
    if (stateChange.type === 'MOVE') {
      if (oldState.channel.id === player.voiceChannel)
        stateChange.type = 'LEAVE'
      if (newState.channel.id === player.voiceChannel) stateChange.type = 'JOIN'
    }
    // double triggered on purpose for MOVE events
    if (stateChange.type === 'JOIN') stateChange.channel = newState.channel
    if (stateChange.type === 'LEAVE') stateChange.channel = oldState.channel

    // check if the bot's voice channel is involved (return otherwise)
    if (!stateChange.channel || stateChange.channel.id !== player.voiceChannel)
      return

    // filter current users based on being a bot
    stateChange.members = stateChange.channel.members.filter(
      member => !member.user.bot
    )

    switch (stateChange.type) {
      case 'JOIN':
        if (stateChange.members.size === 1 && player.paused) {
          let emb = client
            .Embed()
            .setAuthor(`Resuming paused queue`, client.config.iconURL)
            .setDescription(
              `Resuming playback because all of you left me with music to play all alone`
            )
          await client.channels.cache
            .get(player.textChannel)
            .send({ embeds: [emb] })

          // update the now playing message and bring it to the front
          let msg2 = await client.channels.cache
            .get(player.textChannel)
            .send({ embeds: [player.nowPlayingMessage.embeds[0]] })
          player.setNowplayingMessage(msg2)

          player.pause(false)
        }
        break
      case 'LEAVE':
        if (
          stateChange.members.size === 0 &&
          !player.paused &&
          player.playing
        ) {
          player.pause(true)

          let emb = client
            .Embed()
            .setAuthor(`Paused!`, client.config.iconURL)
            .setDescription(`The player has been paused because everybody left`)
          await client.channels.cache
            .get(player.textChannel)
            .send({ embeds: [emb] })
        }
        break
    }
  }
}