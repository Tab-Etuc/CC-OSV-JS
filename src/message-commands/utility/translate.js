const request = require('superagent')
module.exports = {
  name: 'translate',
  description: '翻譯一段文字。',
  usage: '<文字>',
  permissions: {
    channel: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'EMBED_LINKS'],
    member: []
  },
  aliases: ['翻譯', 'tr'],
  /**
   *
   * @param {import("../base/CC-OSV-Client")} bot
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */

  run: async (bot, message, args, GuildDB) => {
    // 來日再精簡codeㄅ，能跑就好。
    msg = message.content
      .slice(GuildDB.prefix.length)
      .replace(/翻譯|tr|translate/gi, '')

    if (msg.indexOf(' ') == 0) msg = msg.replace(' ', '')
    msg = msg + '='
    msg = msg.replaceAll(/ /gi, '=')
    msg = msg.replaceAll(/,/gi, '0')

    msg = await request
      .post(
        `https://www.google.com/inputtools/request?text=${encodeURIComponent(
          msg
        )}&ime=zh-hant-t-i0&cb=?`
      )
      .catch(console.error)
    msg = JSON.parse(msg.req.res.text)

    !msg ||
    !msg[1][0][1][0] ||
    msg[1][0][1][0] == message.content ||
    msg[1][0][1][0] == ''
      ? (msg = message.content
          .slice(GuildDB.prefix.length)
          .replace(/翻譯|tr|translate/gi, ''))
      : (msg = msg[1][0][1][0])

    return message.channel.send(msg).catch(console.error)
  }
}
