const Guild = require('../../models/Guilds')

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

    let servers = await Guild.find() // 獲取mongoDB資料
    servers = servers.map(g => g._id) // 從 {servers} 資料中獲取伺服器ID列表

    // 逐一檢查是否含有 {EmojiRole} 資料，並給予身分組
    servers.forEach(async a => {
      let server = await Guild.findOne({ _id: a })
      let data = server.EmojiRole

      try {
        // 當添加表情符號時
        if (['MESSAGE_REACTION_ADD'].includes(packet.t)) {
          if (packet.d.message_id.toString() in data) {
            if (
              packet.d.emoji.id
                ? packet.d.emoji.id.toString() in
                  data[packet.d.message_id.toString()]
                : packet.d.emoji.name.toString() in
                  data[packet.d.message_id.toString()]
            ) {
              const guild = await bot.guilds.fetch(packet.d.guild_id)
              const user = await guild.members.cache.get(packet.d.user_id)
              const roles =
                data[packet.d.message_id.toString()][
                  packet.d.emoji.id.toString()
                ].role

              roles.forEach(async function (roleId) {
                const role = guild.roles.cache.find(r => r.id === roleId)
                await user.roles.add(role)
              })
              await user.send(
                data[packet.d.message_id.toString()][
                  packet.d.emoji.id.toString()
                ].Message_On_Add
              )
            }
          }

          // 當移除表情符號時
        } else if (['MESSAGE_REACTION_REMOVE'].includes(packet.t)) {
          if (packet.d.message_id.toString() in data) {
            if (
              packet.d.emoji.id
                ? packet.d.emoji.id.toString() in
                  data[packet.d.message_id.toString()]
                : packet.d.emoji.name.toString() in
                  data[packet.d.message_id.toString()]
            ) {
              const guild = await bot.guilds.fetch(packet.d.guild_id)
              const user = await guild.members.cache.get(packet.d.user_id)
              const roles =
                data[packet.d.message_id.toString()][
                  packet.d.emoji.id.toString()
                ].role
              roles.forEach(async function (roleId) {
                const role = guild.roles.cache.find(r => r.id === roleId)
                await user.roles.remove(role)
              })

              await user.send(
                data[packet.d.message_id.toString()][
                  packet.d.emoji.id.toString()
                ].Message_On_Remove
              )
            }
          }
        }
      } catch {}
    })
  }
}
