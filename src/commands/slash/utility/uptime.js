const moment = require("moment");


module.exports = {
  name: "uptime",
  description: "顯示bot上線多久了。",
  category: "實用",
  execute(bot, interaction) {
    const uptime = moment
      .duration(bot.uptime)
      .format(" D [天], H [小時], m [分鐘], s [秒]");

    const embed = bot.say.rootEmbed(interaction)
      .setAuthor("Uptime", bot.user.displayAvatarURL())
      .setDescription(`${uptime}`);

    return interaction.reply({ ephemeral: true, embeds: [embed], allowedMentions: { repliedUser: false } });
  }
};