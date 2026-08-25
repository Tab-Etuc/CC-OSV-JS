import { addSlashCommand } from "@classes/command.ts";
import { hasGuildPermissions } from "@utils/permissions.ts";
import {
  buildSearchComponents,
  prepareMusicPlayback,
} from "@services/music.ts";
import { slashOption } from "@services/commandAdapters.ts";

export default addSlashCommand({
  name: "play",
  description: "播放音樂",
  nameLocalizations: { "zh-TW": "播放音樂" },
  descriptionLocalizations: {
    "zh-TW": "在語音頻道播放 YouTube 或 Spotify 音樂",
  },
  options: [{
    name: "query",
    type: 3,
    required: true,
    description: "歌曲名稱或連結",
    nameLocalizations: { "zh-TW": "歌曲" },
    descriptionLocalizations: { "zh-TW": "歌曲名稱或連結" },
  }],
  acknowledge: true,
  run: async (bot, interaction) => {
    const guildId = interaction.guildId;
    const userId = interaction.member?.id ?? interaction.user?.id;
    if (!guildId || !userId) return;
    if (
      !hasGuildPermissions(bot, guildId, bot.id, ["CONNECT", "VIEW_CHANNEL"])
    ) {
      await interaction.edit("機器人沒有加入語音頻道所需的權限。");
      return;
    }

    try {
      const result = await prepareMusicPlayback(
        bot,
        guildId,
        userId,
        interaction.channelId!,
        slashOption(interaction, "query"),
      );
      if (result.selectionId) {
        await interaction.edit({
          content: "請選擇要播放的歌曲。",
          components: buildSearchComponents(result.selectionId, result.tracks),
        });
        return;
      }
      await interaction.edit({
        content: `已加入 ${result.tracks.length} 首歌曲。`,
      });
    } catch (error) {
      await interaction.edit(
        error instanceof Error ? error.message : "播放歌曲失敗。",
      );
    }
  },
});
