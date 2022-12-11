import { discordeno } from "@deps";
import { BotClient } from "@base/CC-OSV-Client.ts";
import { CCOSVEmbed } from "@classes/embed.ts";
import { playQueueUntilEnd } from "@utils/music.ts";

export async function executeSelectMenu(
  bot: BotClient,
  interaction: discordeno.Interaction,
) {
  if (!interaction.data) return;
  if (interaction.data.customId!.includes("-select_song")) {
    bot.helpers.deleteMessage(
      interaction.channelId as bigint,
      interaction.message?.id as bigint,
    );
    const guildId = BigInt(
      interaction.data.customId!.replace("-select_song", ""),
    );
    let player = bot.guildPlayers.get(guildId);
    if (!player) {
      // Player doesn't exist - make a new one

      // BUG !!!! need to fix " throw new Error("No available nodes."); " ((還沒連接到node時
      player = bot.musicNode.createPlayer(guildId);

      // Set the player, will be used to skip & stop current queue
      bot.guildPlayers.set(guildId, player);
    }

    const Selected = bot.guildSelectCollectors.get(guildId);
    if (!Selected) return;

    await bot.helpers.sendInteractionResponse(
      interaction.id,
      interaction.token,
      {
        type: discordeno.InteractionResponseTypes
          .DeferredUpdateMessage,
      },
    );

    const currQueue = bot.guildQueues.get(guildId);
    const position = Number(interaction.data.values![0]);

    if (!currQueue) {
      bot.guildQueues.set(guildId, Array(Selected[position]));

      // Begin playing
      await playQueueUntilEnd(
        bot,
        interaction.channelId!,
        player,
        guildId,
        undefined,
      );
    } else {
      currQueue.push(...Array(Selected[position]));
      bot.helpers.sendMessage(BigInt(interaction.channelId!), {
        content: "",
        embeds: new CCOSVEmbed()
          .setDesc(
            `:white_check_mark: Added ${Selected[position].title} to queue [<@${
              interaction.member!.id
            }>]`,
          )
          .build(),
      });
    }
  }
  await Promise.allSettled([
    // SETUP-DD-TEMP: Insert any functions you wish to run when a user clicks a button.
  ]).catch(console.log);
}
