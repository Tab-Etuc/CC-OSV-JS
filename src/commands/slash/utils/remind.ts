import { addSlashCommand } from "@classes/command.ts";
import { parseDuration } from "@services/reminders.ts";
import { reminderResponse } from "@services/commandResponses.ts";
import { interactionUserId, slashOption } from "@services/commandAdapters.ts";

export default addSlashCommand({
  name: "remind",
  description: "設定提醒（最長 7 天）",
  options: [{
    name: "after",
    type: 3,
    required: true,
    description: "例如 10m、2h、1d",
  }, { name: "text", type: 3, required: true, description: "提醒內容" }],
  run: async (bot, interaction) => {
    const delay = parseDuration(slashOption(interaction, "after"));
    const text = slashOption(interaction, "text").trim();
    const userId = interactionUserId(interaction);
    if (!interaction.channelId || !userId || !delay || !text) {
      await interaction.respond(
        "格式不正確，時間請使用 10m、2h 或 1d（上限 7 天）。",
      );
      return;
    }
    await interaction.respond(
      reminderResponse(bot, interaction.channelId, userId, delay, text),
    );
  },
});
