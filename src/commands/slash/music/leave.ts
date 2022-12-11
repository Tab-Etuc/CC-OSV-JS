import { addSlashCommand } from "@classes/command.ts";

export default addSlashCommand({
  name: "leave",
  description: "leave the channel",
  nameLocalizations: { "zh-TW": "離開頻道" },
  descriptionLocalizations: { "zh-TW": "讓機器人離開您所在的語音頻道" },
  acknowledge: false,
  run: async (bot, interaction) => {
    const player = bot.guildPlayers.get(interaction.guildId!);

    if (!player?.connected) {
      return await interaction.reply("**已連接至語音頻道...**");
    }

    player.disconnect();
    await interaction.reply("**已離開語音頻道**");
  },
});
