const moment = require('moment-timezone')
const chalk = require('chalk')
const { MessageEmbed } = require('discord.js')

class Logger {
  get now () {
    return moment()
      .tz('Asia/Taipei')
      .format('MM-DD, HH:mm:ss a')
  }

  async sendErrorLog (bot, error, type) {
    try {
      if (
        error.message?.includes('Missing Access') ||
        error.message?.includes('Missing Permissions')
      )
        return

      if (
        error.stack?.includes?.(
          'DeprecationWarning: Listening to events on the Db class'
        )
      )
        return

      const channelId = '851788198467338242'
      if (!channelId) {
        return error('錯誤日誌', error?.stack || `${error}`)
      }

      const channel =
        bot.channels.cache.get(channelId) ||
        (await bot.channels.fetch(channelId))

      if (!channel) {
        return error('錯誤日誌', error?.stack || `${error}`)
      }

      const webhooks = await channel.fetchWebhooks()
      const hook = webhooks.first()

      if (!hook) {
        return error('錯誤日誌', error?.stack || `${error}`)
      }

      const code = error.code || '無'
      const httpStatus = error.httpStatus || '無'
      const requestData = error.requestData ?? { json: {} }
      const name = error.name || '無'
      let stack = error.stack || error
      let jsonString

      try {
        jsonString = JSON.stringify(requestData.json, null, 2)
      } catch {
        jsonString = ''
      }

      if (jsonString?.length >= 4096) {
        jsonString = jsonString ? `${jsonString?.substr(0, 4090)}...` : ''
      }

      if (typeof stack === 'object') stack = JSON.stringify(stack)

      if (typeof stack === 'string' && stack.length >= 4096) {
        console.error(stack)
        stack = '錯誤的內容太長ㄌ'
      }

      const { codeBlock } = require('@discordjs/builders')

      const embed = new MessageEmbed()
        .setTitle('錯誤日誌')
        .addField('名稱', name, true)
        .addField('程式', code.toString(), true)
        .addField('HTTP狀態', httpStatus.toString(), true)
        .addField('時間點', bot.logger.now, true)
        .addField('請求數據', codeBlock(jsonString?.substr(0, 1020)))
        .setDescription(`${codeBlock(stack)}`)
        .setColor(type === 'error' ? 'RED' : 'ORANGE')

      await hook.send({ embeds: [embed] })
    } catch (e) {
      console.error({ error })
      console.error(e)
    }
  }
  /**
   * @param {string} type
   * @param {string} error
   */
  error (type, error) {
    return console.error(
      `${chalk.red('[ERROR]')}[${type.toUpperCase()}][${this.now}]: ${error}`
    )
  }

  /**
   * @param {string} type
   * @param {string} warning
   */
  warn (type, warning) {
    return console.warn(
      `${chalk.yellow('[WARNING]')}[${type.toUpperCase()}][${
        this.now
      }]: ${warning}`
    )
  }

  /**
   * @param {string} type
   * @param {string} text
   */
  log (type, text) {
    return console.log(
      `${chalk.blue('[LOG]')}[${type.toUpperCase()}][${this.now}]: ${text}`
    )
  }

  /**
   * @param {string} type
   * @param {string} content
   */
  info (type, content) {
    return console.log(
      `${chalk.blueBright('[INFO]')}[${type.toUpperCase()}][${
        this.now
      }]: ${content}`
    )
  }
}

module.exports = new Logger()
