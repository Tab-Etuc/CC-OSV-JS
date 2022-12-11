import { discordeno } from "@deps";
import { BotClient } from "@base/CC-OSV-Client.ts";

export interface InteractionWithCustomProps extends discordeno.Interaction {
  /** Send a reply to an interaction. */
  reply(
    response: discordeno.InteractionResponse | string,
  ): Promise<discordeno.Message | undefined>;
  /** Edit a deferred reply of an interaction. */
  editReply(
    response: discordeno.InteractionCallbackData | string,
  ): Promise<discordeno.Message | undefined>;
}

export function customizeInteractionTransformer(bot: BotClient) {
  // Store the internal transformer function
  const oldInteraction = bot.transformers.interaction;

  // Overwrite the internal function.
  bot.transformers.interaction = function (_, payload) {
    // Run the old function to get the internal value.
    const interaction = oldInteraction(bot, payload);

    // Add anything to this object. In this case we add a Interaction.reply() method.
    Object.defineProperty(interaction, "reply", {
      value: function (response: discordeno.InteractionResponse | string) {
        if (typeof response === "string") {
          response = {
            type: discordeno.InteractionResponseTypes.ChannelMessageWithSource,
            data: { content: response },
          };
        }

        return bot.helpers.sendInteractionResponse(
          interaction.id,
          interaction.token,
          response,
        );
      },
    });
    Object.defineProperty(interaction, "editReply", {
      value: function (response: discordeno.InteractionCallbackData | string) {
        if (typeof response === "string") {
          response = { content: response };
        }

        return bot.helpers.editOriginalInteractionResponse(
          interaction.token,
          response,
        );
      },
    });
    // Add as many properties or methods you would like here.
    // NOTE: Whenever you add anything here, in order to get nice autocomplete you should also add it to the src/types/discordeno.ts file.

    // Return the new customized object.
    return interaction;
  };
}
