import { addSlashCommand } from "@classes/command.ts";
import { dailyResponse } from "@services/commandResponses.ts";
import { interactionUserId } from "@services/commandAdapters.ts";

export default addSlashCommand({
  name: "daily",
  description: "領取每日獎勵",
  run: async (_bot, interaction) => {
    const guildId = interaction.guildId;
    const userId = interactionUserId(interaction);
    if (!guildId || !userId) return;
    await interaction.respond(await dailyResponse(guildId, userId));
  },
});
