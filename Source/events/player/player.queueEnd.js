module.exports = {
  name: "queueEnd",
  execute(bot, queue) {
    return bot.say.queueMessage(bot, queue, "音樂播放結束，機器人已離開語音頻道。");
  }
};