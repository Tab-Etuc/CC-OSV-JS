module.exports = {
  name: "botDisconnect",
  execute(bot, queue) {
    return bot.say.queueMessage(bot, queue, "因為機器人已與語音通道斷開連接，音樂停止。", "RED");
  }
};