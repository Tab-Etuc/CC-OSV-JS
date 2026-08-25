import { addMsgCommand } from "@classes/command.ts";
import { send } from "@utils/send.ts";
import { hasGuildPermissions } from "@utils/permissions.ts";
import {
  buildSearchComponents,
  prepareMusicPlayback,
} from "@services/music.ts";

export default addMsgCommand({
  name: "play",
  mod: "music",
  description: "播放音樂",
  aliases: ["p"],
  requiredArgs: true,
  usage: "<歌曲名稱或連結>",
  run: async (bot, message, args) => {
    const guildId = message.guildId;
    if (!guildId) return;
    if (
      !hasGuildPermissions(bot, guildId, bot.id, ["CONNECT", "VIEW_CHANNEL"])
    ) {
      await send(
        bot,
        message.channelId,
        "機器人沒有加入語音頻道所需的權限。\n",
      );
      return;
    }

    const status = await send(bot, message.channelId, {
      content: "正在搜尋歌曲。",
      messageReference: {
        messageId: message.id,
        channelId: message.channelId,
        guildId,
        failIfNotExists: true,
      },
    });

    try {
      const result = await prepareMusicPlayback(
        bot,
        guildId,
        message.author.id,
        message.channelId,
        args.join(" "),
      );
      if (result.selectionId) {
        await bot.helpers.editMessage(status.channelId, status.id, {
          content: "請選擇要播放的歌曲。",
          components: buildSearchComponents(result.selectionId, result.tracks),
        });
        return;
      }
      await bot.helpers.editMessage(status.channelId, status.id, {
        content: `已加入 ${result.tracks.length} 首歌曲。`,
      });
    } catch (error) {
      const detail = error instanceof Error ? error.message : "搜尋歌曲失敗。";
      await bot.helpers.editMessage(status.channelId, status.id, {
        content: detail,
      });
    }
  },
});
