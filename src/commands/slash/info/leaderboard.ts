import { addSlashCommand } from "@classes/command.ts";
import { leaderboardResponse } from "@services/commandResponses.ts";
import { slashOption } from "@services/commandAdapters.ts";

export default addSlashCommand({
  name: "leaderboard",
  description: "顯示等級或財富排行榜",
  options: [{
    name: "type",
    type: 3,
    required: false,
    description: "level 或 economy",
    choices: [{ name: "等級", value: "level" }, {
      name: "財富",
      value: "economy",
    }],
  }],
  run: async (bot, interaction) => {
    if (!interaction.guildId) return;
    await interaction.respond(
      await leaderboardResponse(
        bot,
        interaction.guildId,
        slashOption(interaction, "type") === "economy",
      ),
    );
  },
});
