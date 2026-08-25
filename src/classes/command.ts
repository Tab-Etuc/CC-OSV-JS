import { config, discordeno } from "@deps";
import { send } from "@utils/send.ts";
import { Bot, BotClient } from "@base/CC-OSV-Client.ts";
import { hasGuildPermissions } from "@utils/permissions.ts";
import { main } from "@utils/log.ts";

export const prefix = config.prefixes[0] ?? "";

export interface CCOSVSlashCommand {
  name: string;
  description: string;
  nameLocalizations?: discordeno.Localization;
  descriptionLocalizations?: discordeno.Localization;
  options?: discordeno.ApplicationCommandOption[];
  run: (bot: BotClient, interaction: discordeno.Interaction) => unknown;
  enabled?: boolean;
  acknowledge?: boolean;
}

export interface CCOSVMsgCommand {
  name: string;
  mod: string;
  description: string;
  aliases: string[];
  permission?: discordeno.PermissionStrings[];
  usage?: string;
  requiredArgs?: boolean;
  run: (
    bot: BotClient,
    message: discordeno.Message,
    args: string[],
  ) => unknown;
}

export const globalMsgCommand = new Map<string, CCOSVMsgCommand>();
export const globalSlashCommand = new Map<string, CCOSVSlashCommand>();
let commandsLoaded = false;

export function addMsgCommand(command: CCOSVMsgCommand): void {
  globalMsgCommand.set(command.name.toLowerCase(), command);
}

export function addSlashCommand(command: CCOSVSlashCommand): void {
  globalSlashCommand.set(command.name.toLowerCase(), command);
}

async function importCommandDirectory(root: URL): Promise<void> {
  for await (const entry of Deno.readDir(root)) {
    if (entry.name.startsWith("_") || entry.name.startsWith(".")) continue;
    const entryUrl = new URL(
      `${entry.name}${entry.isDirectory ? "/" : ""}`,
      root,
    );
    if (entry.isDirectory) {
      await importCommandDirectory(entryUrl);
    } else if (entry.isFile && entry.name.endsWith(".ts")) {
      await import(entryUrl.href);
    }
  }
}

/** 載入所有指令檔案；使用 URL 可避免從其他工作目錄啟動時找不到檔案。 */
export async function refreshCommand(): Promise<void> {
  if (commandsLoaded) return;

  await importCommandDirectory(
    new URL("../commands/message/", import.meta.url),
  );
  await importCommandDirectory(new URL("../commands/slash/", import.meta.url));
  commandsLoaded = true;
  main.info(
    `已載入 ${globalMsgCommand.size} 個訊息指令與 ${globalSlashCommand.size} 個 slash 指令。`,
  );
}

function toApplicationCommand(command: CCOSVSlashCommand) {
  return {
    name: command.name,
    description: command.description,
    nameLocalizations: command.nameLocalizations,
    descriptionLocalizations: command.descriptionLocalizations,
    options: command.options ?? [],
  };
}

/** 一次同步 slash 指令，避免每個模組載入時各自發出 REST 請求。 */
export async function syncSlashCommands(): Promise<void> {
  const commands = [...globalSlashCommand.values()]
    .filter((command) => command.enabled !== false)
    .map(toApplicationCommand);
  if (commands.length === 0) return;
  await Bot.helpers.upsertGlobalApplicationCommands(commands);
}

export function findMsgCommand(name: string): CCOSVMsgCommand | undefined {
  const normalized = name.trim().toLowerCase();
  return globalMsgCommand.get(normalized) ??
    [...globalMsgCommand.values()].find((command) =>
      command.aliases.some((alias) => alias.toLowerCase() === normalized)
    );
}

export function findSlashCommand(name?: string): CCOSVSlashCommand | undefined {
  return name ? globalSlashCommand.get(name.toLowerCase()) : undefined;
}

function canRunCommand(
  bot: BotClient,
  command: CCOSVMsgCommand,
  message: discordeno.Message,
): boolean {
  if (!command.permission?.length) return true;
  if (!message.guildId) return false;
  return hasGuildPermissions(
    bot,
    message.guildId,
    message.author.id,
    command.permission,
  );
}

async function runMessageCommand(
  bot: BotClient,
  command: CCOSVMsgCommand,
  message: discordeno.Message,
  args: string[],
): Promise<void> {
  try {
    await command.run(bot, message, args);
  } catch (error) {
    main.error(`指令 ${command.name} 執行失敗：`, error);
    await send(bot, message.channelId, "指令執行時發生錯誤，請稍後再試。");
  }
}

/** 解析前綴訊息並執行指令。 */
export async function MsgCommandHandler(
  bot: BotClient,
  message: discordeno.Message,
): Promise<boolean> {
  const usedPrefix = config.prefixes.find((item) =>
    message.content.startsWith(item)
  );
  if (!usedPrefix) return false;

  const input = message.content.slice(usedPrefix.length).trim();
  if (!input) return false;
  const [commandName, ...args] = input.split(/\s+/);
  const command = findMsgCommand(commandName ?? "");
  if (!command) return false;

  if (command.requiredArgs && args.length === 0) {
    await send(bot, message.channelId, "請提供必要的參數。");
    return true;
  }
  if (!canRunCommand(bot, command, message)) {
    await send(bot, message.channelId, "你沒有執行此指令的權限。");
    return true;
  }

  await runMessageCommand(bot, command, message, args);
  return true;
}
