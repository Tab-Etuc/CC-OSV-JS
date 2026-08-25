import { addSlashCommand } from "@classes/command.ts";
import { rankResponse } from "@services/commandResponses.ts";
import { resolveUser, userName } from "@utils/discord.ts";
import { interactionUserId, slashOption } from "@services/commandAdapters.ts";

export default addSlashCommand({
  name: "rank",
  description: "查看等級與經驗值",
  options: [{ name: "user", type: 6, required: false, description: "使用者" }],
  run: async (bot, interaction) => {
    if (!interaction.guildId) return;
    const userId = slashOption(interaction, "user") ||
      interactionUserId(interaction)?.toString();
    const target = await resolveUser(bot, userId);
    if (!target) {
      await interaction.respond("找不到這位使用者。");
      return;
    }
    await interaction.respond(
      await rankResponse(interaction.guildId, target.id, userName(target)),
    );
  },
});
