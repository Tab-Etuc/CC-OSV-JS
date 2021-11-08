const moment = require('moment-timezone')


const data_time = ['888695124438163476', '852346393141182484']
const data_date = ['852364573095755808']
module.exports = async function ChangeTime (bot) {
  setInterval(() => {
    try {
      for (i in data_time) {
        const time_hour = moment()
          .tz('Asia/Taipei')
          .format('HH')


        let channel_name
        var channel = bot.channels.cache.get(data_time[i])
        channel ? (channel_name = channel.name) : (channel_name = false)
        if (!channel_name) return

        channel_name = channel_name.replace(/🕠現在時刻：|點/g, '')

        if (channel_name !== time_hour) {
          bot.channels.cache.get(data_time[i]).edit({
            name: '🕠現在時刻：' + time_hour + '點'
          })
          bot.logger.log('EVENTS', `Bot: 已更換頻道時間。`)
        }
      }
      // Date
      for (i in data_date) {
        const timeM = moment()
          .tz('Asia/Taipei')
          .format('MM')
        const timeD = moment()
          .tz('Asia/Taipei')
          .format('DD')

        let channel_name
        var channel = bot.channels.cache.get(data_date[i])

        channel ? (channel_name = channel.name) : (channel_name = false)
        if (!channel_name) return
        channel_name = channel_name.replace(/📅伍年●|月|日●/g, '')

        if (channel_name !== timeM.toString() + timeD.toString()) {
          bot.channels.cache.get(data_date[i]).edit({
            name: '📅伍年●' + timeM + '月' + timeD + '日●'
          })
          bot.logger.log('EVENTS', `Bot: 已更換頻道日期。`)
        }
      }
    } catch (error) {
      console.log(error)
    }
  }, 30000)
}
