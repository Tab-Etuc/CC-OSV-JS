import { addMsgCommand } from "@classes/command.ts";
import { send } from "@utils/send.ts";
import { resolveUser, userName } from "@utils/discord.ts";
import { rankResponse } from "@services/commandResponses.ts";

export default addMsgCommand({
  name: "rank",
  mod: "info",
  description: "查看等級與經驗值",
  aliases: ["level", "profile"],
  usage: "[@使用者]",
  run: async (bot, message, args) => {
    if (!message.guildId) return;
    const target = await resolveUser(bot, args[0], message.author);
    if (!target) {
      await send(bot, message.channelId, "找不到這位使用者。");
      return;
    }
    await send(
      bot,
      message.channelId,
      await rankResponse(message.guildId, target.id, userName(target)),
    );
  },
});
