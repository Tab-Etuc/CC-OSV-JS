module.exports = {
  name: "tracksAdd",
  execute(bot, queue, tracks) {
    return bot.say.queueMessage(bot, queue, `${tracks.length}`);
  }
};