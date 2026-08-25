import {
  addSlashCommand,
  findMsgCommand,
  findSlashCommand,
  globalMsgCommand,
  globalSlashCommand,
  MsgCommandHandler,
  refreshCommand,
} from "@classes/command.ts";
import {
  interactionUserId,
  runMessageGuildAction,
  runSlashGuildAction,
  slashOption,
} from "@services/commandAdapters.ts";
import { executeSlashCommand } from "@base/event/interactions/command.ts";
import { executeButtonClick } from "@base/event/interactions/button.ts";
import { executeSelectMenu } from "@base/event/interactions/selectMenu.ts";
import { setInteractionCreateEvent } from "@base/event/interactions/mod.ts";
import { Bot } from "@base/CC-OSV-Client.ts";
import {
  assert,
  assertDeepEquals,
  assertEquals,
  CHANNEL_ID,
  createFakeBot,
  createFakeInteraction,
  createFakeMessage,
  GUILD_ID,
  USER_ID,
} from "./helpers.ts";

Deno.test("所有 message/slash command 都能載入並具備 metadata", async () => {
  await refreshCommand();
  assertEquals(globalMsgCommand.size, 50);
  assertEquals(globalSlashCommand.size, 28);
  for (const command of globalMsgCommand.values()) {
    assert(command.name.length > 0, "message command 缺少 name");
    assert(command.description.length > 0, `${command.name} 缺少 description`);
    assert(typeof command.run === "function", `${command.name} 缺少 run`);
    assert(Array.isArray(command.aliases), `${command.name} aliases 不是陣列`);
  }
  for (const command of globalSlashCommand.values()) {
    assert(command.name.length > 0, "slash command 缺少 name");
    assert(command.description.length > 0, `${command.name} 缺少 description`);
    assert(typeof command.run === "function", `${command.name} 缺少 run`);
  }
  assertEquals(findMsgCommand("Q")?.name, "queue");
  assertEquals(findSlashCommand("QUEUE")?.name, "queue");
  assertEquals(findSlashCommand(), undefined);
});

Deno.test("每個 message command 至少執行一次無伺服器／無參數安全分支", async () => {
  await refreshCommand();
  const bot = createFakeBot();
  const baseMessage = createFakeMessage() as unknown as Record<string, unknown>;
  const message = { ...baseMessage, guildId: undefined } as never;
  const originalFetch = globalThis.fetch;
  globalThis.fetch = () =>
    Promise.resolve(
      new Response(
        JSON.stringify({
          data: { children: [] },
        }),
        { status: 200 },
      ),
    );
  try {
    for (const command of globalMsgCommand.values()) {
      await command.run(bot, message, []);
    }
  } catch (error) {
    throw new Error(`message command 安全分支失敗：${error}`);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

Deno.test("每個 slash command 至少執行一次無伺服器安全分支", async () => {
  await refreshCommand();
  const bot = createFakeBot();
  const baseInteraction = createFakeInteraction("test") as unknown as Record<
    string,
    unknown
  >;
  const interaction = { ...baseInteraction, guildId: undefined } as never;
  for (const command of globalSlashCommand.values()) {
    await command.run(bot, interaction);
  }
});

Deno.test("command adapter 會統一 message/slash 回覆與參數解析", async () => {
  const bot = createFakeBot();
  const message = createFakeMessage();
  await runMessageGuildAction(
    bot,
    message,
    (_bot, guildId, args) => `${guildId}:${args.join(",")}`,
    ["a", "b"],
  );
  assertDeepEquals(bot.sent[0]?.payload, {
    content: `${GUILD_ID}:a,b`,
    messageReference: {
      messageId: 100000000000000006n,
      channelId: CHANNEL_ID,
      guildId: GUILD_ID,
      failIfNotExists: true,
    },
  });

  const interaction = createFakeInteraction("test", [
    { name: "named", value: "value" },
  ]) as unknown as {
    data: { options: Array<{ name: string; value: string }> };
    responses: unknown[];
    guildId: bigint;
    member: { id: bigint };
    user: { id: bigint };
  };
  await runSlashGuildAction(
    bot,
    interaction as never,
    (_bot, guildId) => ({ embeds: [{ title: `${guildId}` }] } as never),
  );
  assertEquals(
    (interaction.responses[0] as { embeds: unknown[] }).embeds.length,
    1,
  );
  assertEquals(slashOption(interaction as never, "named"), "value");
  assertEquals(interactionUserId(interaction as never), USER_ID);
});

Deno.test("訊息指令 handler 會處理前綴、別名、必要參數與未知指令", async () => {
  await refreshCommand();
  const bot = createFakeBot();
  assert(
    await MsgCommandHandler(bot, createFakeMessage("Bq")),
    "別名指令應被處理",
  );
  assertDeepEquals(bot.sent[0]?.payload, {
    content: "目前佇列是空的。",
    messageReference: {
      messageId: 100000000000000006n,
      channelId: CHANNEL_ID,
      guildId: GUILD_ID,
      failIfNotExists: true,
    },
  });
  assert(
    await MsgCommandHandler(bot, createFakeMessage("Bplay")),
    "缺參數指令應被處理",
  );
  assertDeepEquals(bot.sent[1]?.payload, { content: "請提供必要的參數。" });
  assert(
    !await MsgCommandHandler(bot, createFakeMessage("Bdoes-not-exist")),
    "未知指令不應被處理",
  );
  assert(
    !await MsgCommandHandler(bot, createFakeMessage("hello")),
    "無前綴訊息不應被處理",
  );
});

Deno.test("slash command executor 會處理未知、成功與錯誤指令", async () => {
  const bot = createFakeBot();
  addSlashCommand({
    name: "ci-success",
    description: "test",
    run: async (_bot, interaction) => await interaction.respond("ok"),
  });
  addSlashCommand({
    name: "ci-error",
    description: "test",
    run: () => {
      throw new Error("expected");
    },
  });
  const success = createFakeInteraction("ci-success") as never;
  await executeSlashCommand(bot, success);
  assertEquals((success as { responses: unknown[] }).responses[0], "ok");
  const unknown = createFakeInteraction("missing") as never;
  await executeSlashCommand(bot, unknown);
  assertEquals(
    (unknown as { responses: unknown[] }).responses[0],
    "找不到此 slash 指令。",
  );
  const failure = createFakeInteraction("ci-error") as never;
  await executeSlashCommand(bot, failure);
  assertEquals(
    (failure as { responses: unknown[] }).responses[0],
    "指令執行時發生錯誤，請稍後再試。",
  );
});

Deno.test("button/select interaction 會處理安全分支", async () => {
  const bot = createFakeBot();
  const button = createFakeInteraction("button") as never;
  (button as { data: { customId: string }; message: { id: bigint } }).data = {
    customId: "deleteMsg",
  };
  (button as { message: { id: bigint } }).message = { id: 1n };
  await executeButtonClick(bot, button);
  assertEquals(bot.deleted.length, 1);

  const musicButton = createFakeInteraction("button") as never;
  (musicButton as { data: { customId: string }; message: { id: bigint } })
    .data = { customId: "music:pause" };
  (musicButton as { message: { id: bigint } }).message = { id: 2n };
  await executeButtonClick(bot, musicButton);
  assertEquals(
    (musicButton as { responses: unknown[] }).responses[0],
    "目前沒有播放中的歌曲。",
  );

  const select = createFakeInteraction("select") as never;
  (select as { data: { customId: string; values: string[] } }).data = {
    customId: `music-select:${GUILD_ID}:${USER_ID}:test`,
    values: ["0"],
  };
  await executeSelectMenu(bot, select);
  assertEquals(
    (select as { responses: unknown[] }).responses[0],
    "歌曲選擇已失效，請重新搜尋。",
  );
});

Deno.test("interaction event handler 會被註冊", () => {
  setInteractionCreateEvent();
  assert(
    typeof Bot.events.interactionCreate === "function",
    "interactionCreate 未註冊",
  );
  assert(CHANNEL_ID > 0n, "測試 fixture 不完整");
});
