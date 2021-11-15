const Guild = require('../../models/mongoDB/Guilds')

module.exports = {
  name: 'raw',
  once: false,
  async execute (bot, packet) {
    bot.manager.updateVoiceState(packet)

    // 點擊表情符號添加身分組
    if (!['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(packet.t))
      return

    const channel = bot.channels.cache.get(packet.d.channel_id) // 偵測是否為"舊的"訊息 => 防止每當一則新訊息添加了表情符號，BOT都會run一次code
    if (channel.messages.cache.has(packet.d.message_id)) return

    let server = await Guild.findOne({ _id: packet.d.guild_id })
    server.EmojiRole.forEach(async data => {
      try {
        // 當添加表情符號時
        if (['MESSAGE_REACTION_ADD'].includes(packet.t)) {
          if (packet.d.message_id.toString() in data) {
            if (
              packet.d.emoji.id in data[packet.d.message_id.toString()] ||
              packet.d.emoji.name in data[packet.d.message_id.toString()]
            ) {
              let role = null
              if (packet.d.emoji.id === null) {
                role = packet.d.emoji.name
              } else if (packet.d.emoji.id) {
                role = packet.d.emoji.id
              } else return
              const roles = data[packet.d.message_id.toString()][role].role
              const user = await guild.members.cache.get(packet.d.user_id)

              roles.forEach(async function (roleId) {
                const role = guild.roles.cache.find(r => r.id === roleId)
                await user.roles.add(role)
              })
              await user.send(
                data[packet.d.message_id.toString()][packet.d.emoji.id]
                  .Message_On_Add ||
                  data[packet.d.message_id.toString()][packet.d.emoji.name]
                    .Message_On_Remove
              )
            }
          }

          // 當移除表情符號時
        } else if (['MESSAGE_REACTION_REMOVE'].includes(packet.t)) {
          if (packet.d.message_id.toString() in data) {
            if (
              packet.d.emoji.id in data[packet.d.message_id.toString()] ||
              packet.d.emoji.name in data[packet.d.message_id.toString()]
            ) {
              const guild = await bot.guilds.fetch(packet.d.guild_id)
              const user = await guild.members.cache.get(packet.d.user_id)
              let role = null
              if (packet.d.emoji.id === null) {
                role = packet.d.emoji.name
              } else if (packet.d.emoji.id) {
                role = packet.d.emoji.id
              } else return
              const roles = data[packet.d.message_id.toString()][role].role
              roles.forEach(async function (roleId) {
                const role = guild.roles.cache.find(r => r.id === roleId)
                await user.roles.remove(role)
              })

              await user.send(
                data[packet.d.message_id.toString()][packet.d.emoji.id]
                  .Message_On_Remove ||
                  data[packet.d.message_id.toString()][packet.d.emoji.name]
                    .Message_On_Remove
              )
            }
          }
        }
      } catch (err) {
        console.log(err)
      }
    })
  }
}
