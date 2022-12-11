import { addSlashCommand } from "@classes/command.ts";
import { hasGuildPermissions } from "@deps";

export default addSlashCommand({
  name: "join",
  description: "join the channel",
  nameLocalizations: { "zh-TW": "加入頻道" },
  descriptionLocalizations: { "zh-TW": "讓機器人加入您所在的語音頻道" },
  acknowledge: false,
  run: async (bot, interaction) => {
    let player = bot.guildPlayers.get(interaction.guildId!);

    if (player?.connected) {
      return await interaction.reply("**已連接至語音頻道...**");
    }
    const hasPerms = hasGuildPermissions(bot, interaction.guildId!, bot.id, [
      "CONNECT",
      "VIEW_CHANNEL",
    ]);
    if (!hasPerms) {
      return await interaction.reply(
        "I don't have permissions to connect or view the channel that you're in!",
      );
    }
    const memberVoiceData = bot.guilds.get(interaction.guildId!)?.voiceStates
      .get(
        interaction.member!.id,
      );

    // Handle the case in which the voice data doesn't exist
    if (!memberVoiceData || !memberVoiceData.channelId) {
      return await interaction.reply(":x: You aren't in a voice channel!");
    }
    player ??= bot.musicNode.createPlayer(interaction.guildId!);
    player.connect(memberVoiceData.channelId);
    await interaction.reply("**已連接至語音頻道**");
  },
});
