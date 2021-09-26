module.exports = {
  name: "channelEmpty",
  execute(bot, queue) {
    return bot.say.queueMessage(bot, queue, "音樂播放結束，機器人已退出音樂機器人頻道。");
  }
};