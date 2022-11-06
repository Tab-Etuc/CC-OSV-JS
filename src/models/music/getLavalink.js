/**
 *
 * @param {import("../../base/CC-OSV-Client")} bot
 * @returns {import("erela.js").Node | undefined}
 */
 module.exports = async (bot, interaction) => {
    return new Promise((resolve) => {
      for (let i = 0; i < bot.manager.nodes.size; i++) {
        const node = bot.manager.nodes.array()[i];
        if (node.connected) return resolve(node);
      }
      bot.say.slashError(
        interaction,
        '**Lavalink伺服器重新連線中，請稍後再試。**'
      )
      resolve(undefined);
    });
  };