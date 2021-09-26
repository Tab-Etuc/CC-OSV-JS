const { Permissions } = require("discord.js");

module.exports = {
  name: "youtube",
  description: "和伺服器成員一起觀看YouTube影片。",
  category: "音樂",
  async execute(bot, interaction) {
    const channel = interaction.member?.voice?.channel;

    if (!channel)
      return bot.say.warnMessage(interaction, "您必須先加入一個音樂頻道。");

    if (!channel?.viewable)
      return bot.say.warnMessage(interaction, "我需要權限： **\`查看頻道\`**");

    const permissions = channel?.permissionsFor(interaction.guild.me);
    if (!permissions.has(Permissions.FLAGS.CREATE_INSTANT_INVITE))
      return bot.say.warnMessage(interaction, "我需要權限： **\`創建即時邀請\`** ");

    const invite = await channel?.createInvite({
      targetApplication: "755600276941176913",
      targetType: 2
    });

    const embed = bot.say.rootEmbed(interaction)
      .setTitle(`成功設置** YouTube ** 至 **${channel.name}** 頻道。`)
      .setDescription(`[點擊此處](https:\/\/discord.com\/invite\/${invite.code})`);

    return interaction.reply({ embeds: [embed], allowedMentions: { repliedUser: false } }).catch(console.error);
  }
};
