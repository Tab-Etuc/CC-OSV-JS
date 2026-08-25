import { avatarURL } from "@utils/avatarURL.ts";
import {
  cacheGuild,
  cacheMessage,
  cacheUser,
  cacheVoiceState,
  getVoiceState,
} from "@utils/cache.ts";
import { parseUserId, resolveUser, userName } from "@utils/discord.ts";
import { send } from "@utils/send.ts";
import { snakelize } from "@utils/snakelize.ts";
import { snowflake, snowflakeToTimestamp } from "@utils/snowflake.ts";
import { sanitizeMessage, stripEmoji } from "@utils/text.ts";
import { hasGuildPermissions } from "@utils/permissions.ts";
import { EmptyError, SnowflakeError } from "@const/errors.ts";
import {
  assert,
  assertDeepEquals,
  assertEquals,
  CHANNEL_ID,
  createFakeBot,
  GUILD_ID,
} from "./helpers.ts";

Deno.test("文字清理會處理巢狀 payload 並保留一般內容", () => {
  assertEquals(stripEmoji(" 測試 🏓 <a:spin:123> :heart:  "), "測試");
  assertDeepEquals(
    sanitizeMessage({
      content: "hi 🏓",
      embeds: [{ title: "標題 :ok:" }],
      components: [["safe"]],
    }),
    {
      content: "hi",
      embeds: [{ title: "標題" }],
      components: [["safe"]],
    },
  );
});

Deno.test("snakelize 會遞迴轉換物件與陣列", () => {
  assertDeepEquals(snakelize({ userId: 1, nestedValue: { isReady: true } }), {
    user_id: 1,
    nested_value: { is_ready: true },
  });
  assertDeepEquals(snakelize([{ voiceState: 1 }, { channelId: 2 }]), [
    { voice_state: 1 },
    { channel_id: 2 },
  ]);
});

Deno.test("Snowflake 解析與錯誤處理", () => {
  const timestamp = 1_700_000_000_000;
  const id = BigInt(timestamp - 1_420_070_400_000) * 4_194_304n;
  assertEquals(snowflakeToTimestamp(id), timestamp);
  assertEquals(snowflake(id).getTime(), timestamp);
  let failed = false;
  try {
    snowflake("not-an-id");
  } catch (error) {
    failed = error instanceof SnowflakeError;
  }
  assert(failed, "無效 snowflake 應拋出 SnowflakeError");
});

Deno.test("Discord 使用者 ID 與名稱解析", async () => {
  assertEquals(parseUserId("<@123456789012345678>"), 123456789012345678n);
  assertEquals(parseUserId("<@!123456789012345678>"), 123456789012345678n);
  assertEquals(parseUserId("123456789012345678"), 123456789012345678n);
  assertEquals(parseUserId("bad"), undefined);

  const bot = createFakeBot();
  const user = { id: 123n, username: "fallback", globalName: "Display" };
  bot.users.set(123n, user as never);
  assertEquals(await resolveUser(bot, "<@123>"), user as never);
  assertEquals(await resolveUser(bot, "bad", user as never), user as never);
  assertEquals(userName(user as never), "Display");
  assertEquals(userName({ id: 124n, username: "name" } as never), "name");
});

Deno.test("快取會處理 guild、message 與 voice state", () => {
  const bot = createFakeBot();
  const user = { id: 11n, username: "member" };
  const guild = {
    id: GUILD_ID,
    members: new Map([[11n, { user }]]),
    voiceStates: new Map([["state", {
      guildId: GUILD_ID,
      userId: 11n,
      channelId: CHANNEL_ID,
    }]]),
  };
  cacheGuild(bot, guild as never);
  assertEquals(bot.guilds.get(GUILD_ID), guild as never);
  assertEquals(bot.users.get(11n), user);
  assertEquals(getVoiceState(bot, GUILD_ID, 11n)?.channelId, CHANNEL_ID);
  cacheUser(bot, { id: 12n, username: "cached" } as never);
  cacheMessage(bot, {
    author: { id: 13n },
    member: { user: { id: 14n } },
  } as never);
  assert(bot.users.has(12n), "cacheUser 未寫入");
  assert(bot.users.has(13n) && bot.users.has(14n), "cacheMessage 未寫入");
  cacheVoiceState(bot, {
    guildId: GUILD_ID,
    userId: 11n,
    channelId: undefined,
  } as never);
  assertEquals(getVoiceState(bot, GUILD_ID, 11n), undefined);
});

Deno.test("avatar URL 與訊息輸出會套用快取與清理", async () => {
  const bot = createFakeBot();
  bot.users.set(123n, { id: 123n, avatar: "hash" } as never);
  assertEquals(
    await avatarURL(bot, 123n),
    "https://cdn.discordapp.com/avatars/123/hash.png?size=256",
  );
  assertEquals(
    await avatarURL(bot, 126n),
    "https://cdn.discordapp.com/embed/avatars/1.png",
  );
  assertEquals(
    await avatarURL(bot, { id: 124n, username: "no-avatar" } as never),
    "https://cdn.discordapp.com/embed/avatars/4.png",
  );
  await send(bot, CHANNEL_ID, "hello 🏓");
  assertDeepEquals(bot.sent[0]?.payload, { content: "hello" });
  let failed = false;
  try {
    send(bot, CHANNEL_ID, "");
  } catch (error) {
    failed = error instanceof EmptyError;
  }
  assert(failed, "空訊息應拋出 EmptyError");
});

Deno.test("權限檢查支援 owner、administrator 與指定權限", () => {
  const bot = createFakeBot();
  bot.guilds.set(GUILD_ID, {
    id: GUILD_ID,
    ownerId: 1n,
    members: new Map([[2n, {
      permissions: {
        has: (value: string) => value === "ADMINISTRATOR",
        hasAll: () => false,
      },
    }]]),
  } as never);
  assert(hasGuildPermissions(bot, GUILD_ID, 1n, ["CONNECT"]), "owner 應通過");
  assert(hasGuildPermissions(bot, GUILD_ID, 2n, ["CONNECT"]), "admin 應通過");
  assert(
    !hasGuildPermissions(bot, GUILD_ID, 3n, ["CONNECT"]),
    "未知成員不應通過",
  );
});
