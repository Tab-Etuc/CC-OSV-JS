import { config, discordeno, hasGuildPermissions } from "@deps";
import { send } from "@utils/send.ts";
import { Bot, BotClient } from "@base/CC-OSV-Client.ts";
import { InteractionWithCustomProps } from "@typings/discordeno.ts";

export let prefix: string;

prefix = config.prefixes[0];

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

export interface CCOSVSlashCommand {
  /** The name of the command, used for both slash and message commands. */
  name: string;
  /** The type of command. */
  type?: discordeno.ApplicationCommandTypes;
  /** The description of the command*/
  description: string;
  nameLocalizations?: discordeno.Localization;
  descriptionLocalizations?: discordeno.Localization;
  /** The options for the command, used for both slash and message commands. */
  // options?: ApplicationCommandOption[];
  options?: discordeno.ApplicationCommandOption[];
  run: (bot: BotClient, data: InteractionWithCustomProps) => unknown;
  /** Whether or not this slash command should be enabled right now. Defaults to true. */
  enabled?: boolean;
  /** Whether or not this command is still in development and should be setup in the dev server for testing. */
  dev?: boolean;
  /** Whether or not this command will take longer than 3s and need to acknowledge to discord. */
  acknowledge?: boolean;
}

export interface CCOSVMsgCommand {
  name: string;
  mod: string;
  description: string;
  aliases: string[];
  permission?: discordeno.PermissionStrings[];
  owner?: boolean;
  usage?: string;
  requiredArgs?: boolean;
  run: (bot: BotClient, message: discordeno.Message, args: string[]) => unknown;
}

// export class CCOSVSlashCommand implements SlashCommand {
//   public name: string;
//   public mod: string;
//   public type: discordeno.ApplicationCommandTypes;
//   public options: discordeno.ApplicationCommandOption[] = [];
//   public description: string;
//   public nameLocalizations: discordeno.Localization;
//   public descriptionLocalizations: discordeno.Localization;

//   constructor(
//     name: string,
//     mod: string,
//     type: discordeno.ApplicationCommandTypes,
//     options: discordeno.ApplicationCommandOption[] = [],
//     otherOptions?: Partial<SlashCommand>,
//   ) {
//     this.name = name;
//     this.mod = mod;
//     this.type = type;
//     this.options = options;
//     this.description = otherOptions?.description || "No description found";
//     this.nameLocalizations = otherOptions?.nameLocalizations || {};
//     this.descriptionLocalizations = otherOptions?.descriptionLocalizations ||
//       {};
//     this.run = otherOptions?.run || this.run;
//   }
//   // deno-lint-ignore no-unused-vars
//   run(bot: BotClient, interaction: discordeno.Interaction): void {}
// }

export function addMsgCommand(cmd: CCOSVMsgCommand): void {
  globalMsgCommand.set(cmd.name, cmd);
}

export function addSlashCommand(cmd: CCOSVSlashCommand): void {
  globalSlashCommand.set(cmd.name, cmd);

  const d = {
    name: cmd.name,
    nameLocalizations: cmd?.nameLocalizations ?? undefined,
    descriptionLocalizations: cmd.descriptionLocalizations ?? undefined,
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
  cmdName: string | undefined,
): CCOSVSlashCommand | undefined {
  if (!cmdName) return;
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
