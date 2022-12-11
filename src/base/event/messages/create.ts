import { Bot, BotClient } from "@base/CC-OSV-Client.ts";
import { checkGuildData } from "@base/database.ts";
import { MsgCommandHandler } from "@classes/command.ts";
import { chatLevelSystem } from "@utils/chatLevelSystem.ts";

export function setMessageCreateEvent() {
  Bot.events.messageCreate = async function (bot, message) {
    if (message.isFromBot) {
      return;
    }
    checkGuildData(message.guildId!, message.authorId);
    chatLevelSystem(bot as BotClient, message);
    MsgCommandHandler(bot as BotClient, message);

    await Promise.allSettled([
      // SETUP-DD-TEMP: Add any functions you want to run on every message here. For example, automoderation filters.
    ]).catch(console.log);
  };
}
