module.exports = {
  name: "error",
  once: false,
  execute(bot, error) {
    
    return bot.logger.sendErrorLog(bot, error, "error");
  }
};