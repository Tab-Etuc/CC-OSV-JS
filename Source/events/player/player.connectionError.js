module.exports = {
  name: "connectionError",
  execute(bot, queue, error) {
    bot.say.queueMessage(bot, queue, "播放時發生錯誤。抱歉造成不便。", "RED");

    return bot.utils.sendErrorLog(bot, { stack: `${error.message}`, name: "PLAYER_CONNECTION_ERROR", code: `${queue.id}` }, "error");
  }
};