import { findSlashCommand } from "@classes/command.ts";
import { BotClient } from "@base/CC-OSV-Client.ts";
import { discordeno } from "@deps";
import { main } from "@utils/log.ts";

export async function executeSlashCommand(
  bot: BotClient,
  interaction: discordeno.Interaction,
): Promise<void> {
  const command = findSlashCommand(interaction.data?.name);
  if (!command) {
    await interaction.respond("找不到此 slash 指令。");
    return;
  }

  try {
    if (command.acknowledge) await interaction.defer();
    await command.run(bot, interaction);
  } catch (error) {
    main.error(`Slash 指令 ${command.name} 執行失敗：`, error);
    const response = "指令執行時發生錯誤，請稍後再試。";
    if (interaction.acknowledged) {
      await interaction.edit(response);
    } else {
      await interaction.respond(response);
    }
  }
}
