import { discordeno } from "@deps";
import { BotClient } from "@base/CC-OSV-Client.ts";
import { CCOSVEmbed } from "@classes/embed.ts";
export async function executeButtonClick(
  bot: BotClient,
  interaction: discordeno.Interaction,
) {
  if (!interaction.data) return;
  if (interaction.data?.customId == "deleteMsg") {
    bot.helpers.deleteMessage(
      interaction.channelId as bigint,
      interaction.message?.id as bigint,
    );
  } else if (interaction.data.customId! == "cancelPlay") {
    const em = new CCOSVEmbed().setTitle(":x: | 操作取消").setColor(
      "#ff6464",
    ).build();

    bot.helpers.editMessage(
      interaction.channelId as bigint,
      interaction.message?.id as bigint,
      {
        content: "",
        embeds: em,
        components: [],
      },
    );
  }
  await Promise.allSettled([
    // SETUP-DD-TEMP: Insert any functions you wish to run when a user clicks a button.
  ]).catch(console.log);
}
