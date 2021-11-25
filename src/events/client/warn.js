module.exports = {
  name: "warn",
  once: false,
  execute(bot, error) {
    return bot.logger.sendErrorLog(bot, error, "warning");
  }
};