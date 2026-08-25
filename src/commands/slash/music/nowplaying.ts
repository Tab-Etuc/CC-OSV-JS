import { addSlashCommand } from "@classes/command.ts";
import { nowPlayingResponse } from "@services/musicCommands.ts";
import { runSlashGuildAction } from "@services/commandAdapters.ts";

export default addSlashCommand({
  name: "nowplaying",
  description: "顯示目前播放的歌曲",
  nameLocalizations: { "zh-TW": "正在播放" },
  descriptionLocalizations: { "zh-TW": "顯示目前正在播放的音樂資訊" },
  run: (bot, interaction) =>
    runSlashGuildAction(
      bot,
      interaction,
      (bot, guildId) => nowPlayingResponse(bot, guildId),
    ),
});
