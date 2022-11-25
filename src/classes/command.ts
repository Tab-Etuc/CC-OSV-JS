import { config, discordeno, hasGuildPermissions } from "@deps";
import { send } from "@utils/send.ts";
import { Bot, BotClient } from "@base/CC-OSV-Client.ts";

export let prefix: string;

prefix = config.prefixes[0];

interface MsgCommand {
  name: string;
  owner?: boolean;
  mod: string;
  aliases?: string[];
  permission?: discordeno.PermissionStrings[];
  description?: string;
  requiredArgs?: boolean;
  usage?: string;
  run?: (
    bot: BotClient,
    message: discordeno.Message,
    args: string[],
  ) => void;
}

interface SlashCommand {
  name: string;
  mod: string;
  type: discordeno.ApplicationCommandTypes;
  description?: string;
  nameLocalizations?: discordeno.Localization;
  descriptionLocalizations?: discordeno.Localization;
  run?: (
    Bot: BotClient,
    interaction: discordeno.Interaction,
  ) => void;
}

export async function refreshCommand(): Promise<void> {
  // Message commands
  for (const mod of Deno.readDirSync("./src/commands/message/")) {
    for (
      const { name } of Deno.readDirSync(`./src/commands/message/${mod.name}`)
    ) {
      await import(`../commands/message/${mod.name}/${name}`);
    }
  }

  // Slash commands
  for (const mod of Deno.readDirSync("./src/commands/slash/")) {
    for (
      const { name } of Deno.readDirSync(`./src/commands/slash/${mod.name}`)
    ) {
      await import(
        `../commands/slash/${mod.name}/${name}`
      );
    }
  }
}

export const globalMsgCommand = new discordeno.Collection<
  string,
  CCOSVMsgCommand
>();

export const globalSlashCommand = new discordeno.Collection<
  string,
  CCOSVSlashCommand
>();

export class CCOSVMsgCommand implements MsgCommand {
  public name: string;
  public description: string;
  public aliases: string[];
  public permission?: discordeno.PermissionStrings[];
  public owner?: boolean;
  public mod: string;
  public usage: string;
  public requiredArgs?: boolean;

  constructor(name: string, mod: string, options?: Partial<MsgCommand>) {
    this.name = name;
    this.description = options?.description || "No description found";
    this.aliases = options?.aliases || ["No aliases found"];
    this.permission = options?.permission;
    this.owner = options?.owner;
    this.mod = mod;
    this.usage = options?.usage || "";
    this.requiredArgs = options?.requiredArgs || false;
    this.run = options?.run || this.run;
  }

  // deno-lint-ignore no-unused-vars
  run(bot: BotClient, message: discordeno.Message, args: string[]): void {}
}

export class CCOSVSlashCommand implements SlashCommand {
  public name: string;
  public mod: string;
  public type: discordeno.ApplicationCommandTypes;
  public options: discordeno.ApplicationCommandOption[] = [];
  public description: string;
  public nameLocalizations: discordeno.Localization;
  public descriptionLocalizations: discordeno.Localization;

  constructor(
    name: string,
    mod: string,
    type: discordeno.ApplicationCommandTypes,
    options: discordeno.ApplicationCommandOption[] = [],
    otherOptions?: Partial<SlashCommand>,
  ) {
    this.name = name;
    this.mod = mod;
    this.type = type;
    this.options = options;
    this.description = otherOptions?.description || "No description found";
    this.nameLocalizations = otherOptions?.nameLocalizations || {};
    this.descriptionLocalizations = otherOptions?.descriptionLocalizations ||
      {};
    this.run = otherOptions?.run || this.run;
  }
  // deno-lint-ignore no-unused-vars
  run(bot: BotClient, interaction: discordeno.Interaction): void {}
}

export function addMsgCommand(cmd: CCOSVMsgCommand): void {
  globalMsgCommand.set(cmd.name, cmd);
}

export function addSlashCommand(cmd: CCOSVSlashCommand): void {
  globalSlashCommand.set(cmd.name, cmd);

  const d = {
    name: cmd.name,
    nameLocalizations: cmd.nameLocalizations,
    descriptionLocalizations: cmd.descriptionLocalizations,
    description: cmd?.description ?? "Empty description",
    options: cmd?.options ?? [],
  };
  Bot.helpers.createGlobalApplicationCommand(d);
}

function msgCommandRunner(
  command: CCOSVMsgCommand,
  message: discordeno.Message,
  args: string[],
  bot: BotClient,
): void {
  try {
    command.run(bot, message, args);
  } catch (error) {
    if (error instanceof Error && error.stack) {
      send(bot, message.channelId, String(error.stack));
    } else {
      send(bot, message.channelId, String(error));
    }
  }
}

function slashCommandRunner(
  command: CCOSVSlashCommand,
  bot: BotClient,
  interaction: discordeno.Interaction,
): void {
  try {
    command.run(bot, interaction);
  } catch (error) {
    if (error instanceof Error && error.stack) {
      bot.helpers.sendInteractionResponse(interaction.id, interaction.token, {
        type: discordeno.InteractionResponseTypes.ChannelMessageWithSource,
        data: { content: String(error.stack) },
      });
    } else {
      bot.helpers.sendInteractionResponse(interaction.id, interaction.token, {
        type: discordeno.InteractionResponseTypes.ChannelMessageWithSource,
        data: { content: String(error) },
      });
    }
  }
}

function permissionChecker(
  bot: BotClient,
  command: CCOSVMsgCommand,
  userid: bigint,
  guildId: bigint,
  member?: discordeno.Member,
): boolean {
  const owners = config.owners;
  if (command.owner) {
    return owners.includes(userid.toString());
  } else if (!member) return true;
  else if (!command.permission) return true;

  return hasGuildPermissions(
    bot,
    guildId,
    member,
    command.permission,
  );
}

export function findMsgCommand(cmdName: string): CCOSVMsgCommand | undefined {
  return globalMsgCommand.get(cmdName) ||
    globalMsgCommand.find((m) => m.aliases && m.aliases.includes(cmdName));
}

export function findSlashCommand(
  cmdName: string,
): CCOSVSlashCommand | undefined {
  return globalSlashCommand.get(cmdName);
}

export function MsgCommandHandler(
  bot: BotClient,
  message: discordeno.Message,
): boolean {
  prefix = config.prefixes.find(
    (m: string) => message.content.startsWith(m),
    message.content,
  ) as string;
  if (!prefix) return false;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const cmdName = (args.shift() as string).toLowerCase();
  const command = findMsgCommand(cmdName);
  if (!command) return false;
  if (command.requiredArgs && args.length < 1) {
    send(bot, message.channelId, "You don't have permission to do that!");
    return false;
  }
  const perm = permissionChecker(
    bot,
    command,
    message.authorId,
    message.guildId!,
    message.member,
  );
  if (!perm) {
    send(bot, message.channelId, "You don't have permission to do that!");
    return false;
  }
  msgCommandRunner(command, message, args, bot);
  return true;
}

export function SlashCommandHandler(
  bot: BotClient,
  interaction: discordeno.Interaction,
): boolean {
  const commandName = interaction?.data?.name;
  if (!commandName) return false;
  const command = findSlashCommand(commandName);
  if (!command) return false;
  slashCommandRunner(command, bot, interaction);
  return true;
}
