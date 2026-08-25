import { Bot, BotClient, MongoDBReady } from "@base/CC-OSV-Client.ts";
import { discordeno } from "@deps";
import { checkGuildData } from "@base/database.ts";
import { MsgCommandHandler } from "@classes/command.ts";
import { chatLevelSystem } from "@utils/chatLevelSystem.ts";
import { cacheMessage } from "@utils/cache.ts";
import { main } from "@utils/log.ts";

export function setMessageCreateEvent(): void {
  Bot.events.messageCreate = async (rawMessage) => {
    const message = rawMessage as unknown as discordeno.Message;
    if (message.author.bot) return;

    cacheMessage(Bot, message);
    if (message.guildId && MongoDBReady) {
      try {
        await checkGuildData(message.guildId, message.author.id);
        await chatLevelSystem(Bot, message);
      } catch (error) {
        main.error("訊息資料處理失敗：", error);
      }
    }

    try {
      await MsgCommandHandler(Bot as BotClient, message);
    } catch (error) {
      main.error("訊息指令執行失敗：", error);
    }
  };
}
