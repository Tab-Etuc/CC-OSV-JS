module.exports = {
  name: "ready",
  once: true,
  async execute(bot) {
    //initializing commands
    require("../../handlers/CommandHandler")(bot);
    bot.logger.log("EVENTS", `Bot: 已上線。`);
    const formatNum = bot.utils.formatNumber;

    const serverCount = formatNum(bot.guilds.cache.size);
    const userCount = formatNum(
      bot.guilds.cache.reduce((a, g) => a + g.memberCount, 0),
    );

    const statuses = [
      { "name": `正服務 ${serverCount} 個伺服器 和 ${userCount} 位使用者`, "type": "LISTENING" },
      { "name": "CC-OSV 測試版", "type": "WATCHING" },
      { "name": "由 CC_#8844 編寫", "type": "WATCHING" }
    ];
    setInterval(() => {
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      bot.user.setActivity(status.name, { type: status.type });
    }, 60000);
  }
};
