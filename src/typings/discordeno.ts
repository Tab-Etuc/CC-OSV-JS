import { discordeno } from "@deps";

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
