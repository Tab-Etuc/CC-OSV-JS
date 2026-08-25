import { Bot, MongoDBReady } from "@base/CC-OSV-Client.ts";
import { checkGuildData } from "@base/database.ts";
import { setMessageCreateEvent } from "@base/event/messages/create.ts";
import { setReadyEvent } from "@base/event/ready.ts";
import { setVoiceServerUpdateEvent } from "@base/event/voice/ServerUpdate.ts";
import { setVoiceStateUpdateEvent } from "@base/event/voice/StateUpdate.ts";
import {
  addWarning,
  getWarnings,
  removeWarning,
} from "@services/moderation.ts";
import { chatLevelSystem } from "@utils/chatLevelSystem.ts";
import {
  assert,
  assertEquals,
  createFakeBot,
  createFakeMessage,
  GUILD_ID,
  USER_ID,
} from "./helpers.ts";

Deno.test("MongoDB 未啟用時資料初始化與聊天 XP 會安全略過", async () => {
  assertEquals(MongoDBReady, false);
  await checkGuildData(GUILD_ID, USER_ID);
  const bot = createFakeBot();
  const message = createFakeMessage() as never;
  await chatLevelSystem(bot, message);
  const noGuild = {
    ...(createFakeMessage() as unknown as Record<string, unknown>),
    guildId: undefined,
  } as never;
  await chatLevelSystem(bot, noGuild);
});

Deno.test("MongoDB 未啟用時 moderation 會回傳明確錯誤", async () => {
  for (
    const action of [
      () => addWarning(GUILD_ID, USER_ID, 100000000000000030n, "reason"),
      () => getWarnings(GUILD_ID, USER_ID),
      () => removeWarning(GUILD_ID, "warning"),
    ]
  ) {
    let failed = false;
    try {
      await action();
    } catch (error) {
      failed = error instanceof Error &&
        error.message === "此功能需要設定 MongoDB。";
    }
    assert(failed, "未啟用 MongoDB 時應拒絕資料操作");
  }
});

Deno.test("Gateway event registration 會註冊所有必要 callback", () => {
  setReadyEvent();
  setMessageCreateEvent();
  setVoiceServerUpdateEvent();
  setVoiceStateUpdateEvent();
  assert(typeof Bot.events.ready === "function", "ready callback 未註冊");
  assert(
    typeof Bot.events.messageCreate === "function",
    "messageCreate callback 未註冊",
  );
  assert(
    typeof Bot.events.voiceServerUpdate === "function",
    "voiceServerUpdate callback 未註冊",
  );
  assert(
    typeof Bot.events.voiceStateUpdate === "function",
    "voiceStateUpdate callback 未註冊",
  );
});
