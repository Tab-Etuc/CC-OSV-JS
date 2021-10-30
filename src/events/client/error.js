module.exports = {
  name: "error",
  once: false,
  execute(bot, error) {
    return bot.utils.sendErrorLog(bot, error, "error");
  }
};