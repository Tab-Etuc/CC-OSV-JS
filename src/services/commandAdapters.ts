import { discordeno } from "@deps";
import { BotClient } from "@base/CC-OSV-Client.ts";
import { replyMessage } from "@utils/messageReply.ts";

export type CommandResponse =
  | string
  | discordeno.CreateMessageOptions
  | discordeno.Camelize<
    discordeno.DiscordEmbed
  >[];

export type GuildCommandAction = (
  bot: BotClient,
  guildId: bigint,
  args: string[],
) => CommandResponse | Promise<CommandResponse>;

export async function runMessageGuildAction(
  bot: BotClient,
  message: discordeno.Message,
  action: GuildCommandAction,
  args: string[] = [],
): Promise<void> {
  if (!message.guildId) return;
  await replyMessage(bot, message, await action(bot, message.guildId, args));
}

export async function runSlashGuildAction(
  bot: BotClient,
  interaction: discordeno.Interaction,
  action: GuildCommandAction,
  args: string[] = [],
): Promise<void> {
  if (!interaction.guildId) return;
  const response = await action(bot, interaction.guildId, args);
  await interaction.respond(toSlashResponse(response));
}

function toSlashResponse(
  response: CommandResponse,
): string | discordeno.InteractionCallbackData {
  if (typeof response === "string") return response;
  if (Array.isArray(response)) return { embeds: response };
  return response as unknown as discordeno.InteractionCallbackData;
}

export function slashOption(
  interaction: discordeno.Interaction,
  name: string,
  index = 0,
): string {
  const option =
    interaction.data?.options?.find((item) => item.name === name) ??
      interaction.data?.options?.[index];
  return String(option?.value ?? "");
}

export function interactionUserId(
  interaction: discordeno.Interaction,
): bigint | undefined {
  return interaction.member?.id ?? interaction.user?.id;
}
