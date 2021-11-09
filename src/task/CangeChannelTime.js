const moment = require('moment-timezone')
const Guild = require('../models/Guilds')

const data_time = ['888695124438163476', '852346393141182484']
const data_date = ['852364573095755808']

const TimeHour = moment()
  .tz('Asia/Taipei')
  .format('HH')
const TimeMonth = moment()
  .tz('Asia/Taipei')
  .format('MM')
const TimeDay = moment()
  .tz('Asia/Taipei')
  .format('DD')
module.exports = async function ChangeTime (bot) {
  setInterval(() => {
    try {
      bot.guilds.cache.forEach(guild => {
        let guildId = guild.id
        let server = Guild.findOne({ guildId: guildId })
        let ClockTime_Array = server.ClockTime
        let ClockDate_Array = server.ClockDate

        let channel_name
        for (i in ClockTime_Array) {
          var channel = bot.channels.cache.get(ClockTime_Array[i])
          channel ? (channel_name = channel.name) : (channel_name = false)
          if (!channel_name) return
          channel_name = channel_name.replace(/🕠現在時刻：|點/g, '')
          if (channel_name !== TimeHour) {
            bot.channels.cache.get(ClockTime_Array[i]).edit({
              name: '🕠現在時刻：' + TimeHour + '點'
            })
            bot.logger.log('EVENTS', `Bot: 已更換頻道時間。`)
          }
        }
        for (i in ClockDate_Array) {
          var channel = bot.channels.cache.get(ClockDate_Array[i])
          channel ? (channel_name = channel.name) : (channel_name = false)
          if (!channel_name) return
          channel_name = channel_name.replace(/📅伍年●|月|日●/g, '')

          if (channel_name !== TimeMonth.toString() + TimeDay.toString()) {
            bot.channels.cache.get(ClockDate_Array[i]).edit({
              name: '📅伍年●' + TimeMonth + '月' + TimeDay + '日●'
            })
            bot.logger.log('EVENTS', `Bot: 已更換頻道日期。`)
          }
        }
      })
      
    } catch (error) {
      console.log(error)
    }
  }, 30000)
}
