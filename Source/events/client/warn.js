module.exports = {
  name: "warn",
  once: false,
  execute(bot, error) {
    return bot.utils.sendErrorLog(bot, error, "warning");
  }
};