const moment = require('moment-timezone')
const Guild = require('../models/mongoDB/Guilds')

module.exports = async function ChangeTime (bot) {
  setInterval(async () => {
    try {
      let servers = await Guild.find()
      servers = servers.map(g => g._id)
      servers.forEach(async a => {
        let server = await Guild.findOne({ _id: a })
        let ClockTime_Array = server.ClockTime
        let ClockDate_Array = server.ClockDate
        ClockTime_Array
          ? ChangeClockTime(bot, ClockTime_Array)
          : console.log(server)
        ClockDate_Array ? ChangeClockDate(bot, ClockDate_Array) : console.log(a)
      })
    } catch (err) {
      console.log(err)
    }
  }, 30000)
}

async function ChangeClockTime (bot, ClockTime_Array) {
  let channel_name
  const TimeHour = moment()
    .tz('Asia/Taipei')
    .format('HH')

  for (i in ClockTime_Array) {
    var channel = bot.channels.cache.get(ClockTime_Array[i])
    channel ? (channel_name = channel.name) : (channel_name = false)
    if (!channel_name) return
    channel_name = channel_name.replace(/π ηΎε¨ζε»οΌ|ι»/g, '')
    if (channel_name !== TimeHour) {
      bot.channels.cache.get(ClockTime_Array[i]).edit({
        name: 'π ηΎε¨ζε»οΌ' + TimeHour + 'ι»'
      })
      bot.logger.log('EVENTS', `Bot: ε·²ζ΄ζι »ιζιγ`)
    }
  }
}
async function ChangeClockDate (bot, ClockDate_Array) {
  let channel_name
  const TimeMonth = moment()
    .tz('Asia/Taipei')
    .format('MM')
  const TimeDay = moment()
    .tz('Asia/Taipei')
    .format('DD')
  for (i in ClockDate_Array) {
    var channel = bot.channels.cache.get(ClockDate_Array[i])
    channel ? (channel_name = channel.name) : (channel_name = false)
    if (!channel_name) return

    channel_name = channel_name.replace(/πεεΉ΄β|ζ|ζ₯β/g, '')

    if (channel_name !== TimeMonth.toString() + TimeDay.toString()) {
      bot.channels.cache.get(ClockDate_Array[i]).edit({
        name: 'πεεΉ΄β' + TimeMonth + 'ζ' + TimeDay + 'ζ₯β'
      })
      bot.logger.log('EVENTS', `Bot: ε·²ζ΄ζι »ιζ₯ζγ`)
    }
  }
}
