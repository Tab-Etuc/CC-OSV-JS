import {
  cancelReminder,
  formatDuration,
  listReminders,
  parseDuration,
  scheduleReminder,
} from "@services/reminders.ts";
import {
  economyUserLabel,
  formatCoins,
  formatCooldown,
} from "@services/economy.ts";
import { displayLevelUser, xpForNextLevel } from "@services/leveling.ts";
import {
  balanceResponse,
  dailyResponse,
  joinResponse,
  leaderboardResponse,
  rankResponse,
  reminderResponse,
} from "@services/commandResponses.ts";
import {
  buildPlayerComponents,
  clearMusic,
  formatMusicTime,
  historyMusic,
  moveMusic,
  nowPlaying,
  nowPlayingResponse,
  queueMusic,
  removeMusic,
  setBassBoost,
  setMusicLoop,
  setMusicVolume,
  setPlaybackSpeed,
  shuffleMusic,
  skipCurrentMusic,
  toggleNightcore,
  togglePauseMusic,
  toggleVaporwave,
} from "@services/musicCommands.ts";
import { stopMusic } from "@services/musicCommands.ts";
import {
  assert,
  assertEquals,
  CHANNEL_ID,
  createFakeBot,
  createFakePlayer,
  GUILD_ID,
  USER_ID,
} from "./helpers.ts";

Deno.test("提醒時間解析、格式化、列出與取消", () => {
  assertEquals(parseDuration("10m"), 600_000);
  assertEquals(parseDuration("1h30m"), 5_400_000);
  assertEquals(parseDuration("7d"), 7 * 86_400_000);
  assertEquals(parseDuration("0s"), undefined);
  assertEquals(parseDuration("8d"), undefined);
  assertEquals(parseDuration("bad"), undefined);
  assertEquals(formatDuration(90_061), "1分 31秒");

  const bot = createFakeBot();
  const id = scheduleReminder(bot, CHANNEL_ID, USER_ID, 60_000, "drink water");
  assert(listReminders(USER_ID).some((item) => item.id === id), "提醒未被列出");
  assert(!cancelReminder(USER_ID + 1n, id), "其他使用者不應取消提醒");
  assert(cancelReminder(USER_ID, id), "提醒應可取消");
  assert(!cancelReminder(USER_ID, id), "提醒取消後不應重複成功");
});

Deno.test("經濟與等級純函式", () => {
  assertEquals(formatCoins(1234.9), "1,234 coins");
  assertEquals(formatCoins(-1), "0 coins");
  assertEquals(formatCooldown(30_000), "1 分鐘");
  assertEquals(formatCooldown(3_660_000), "1 小時 1 分鐘");
  assertEquals(xpForNextLevel(1), 100);
  assertEquals(xpForNextLevel(100), 10_000);

  const bot = createFakeBot();
  bot.users.set(
    USER_ID,
    { id: USER_ID, username: "tester", globalName: "Test User" } as never,
  );
  assertEquals(economyUserLabel(bot, USER_ID.toString()), "Test User");
  assertEquals(displayLevelUser(bot, "999"), "<@999>");
});

Deno.test("共用 command response 在沒有資料庫時回傳可用錯誤", async () => {
  const bot = createFakeBot();
  assertEquals(
    await balanceResponse(GUILD_ID, USER_ID, "Tester"),
    "此功能需要設定 MongoDB。",
  );
  assertEquals(
    await dailyResponse(GUILD_ID, USER_ID),
    "此功能需要設定 MongoDB。",
  );
  assertEquals(
    await leaderboardResponse(bot, GUILD_ID, false),
    "此功能需要設定 MongoDB。",
  );
  assertEquals(
    await rankResponse(GUILD_ID, USER_ID, "Tester"),
    "此功能需要設定 MongoDB。",
  );
  assertEquals(
    joinResponse(bot, GUILD_ID, USER_ID),
    "機器人沒有加入語音頻道所需的權限。",
  );
  const reminder = reminderResponse(bot, CHANNEL_ID, USER_ID, 60_000, "test");
  assert(reminder.includes("提醒已設定"), "提醒 response 不正確");
  const id = listReminders(USER_ID).find((item) => item.text === "test")?.id;
  assert(id !== undefined, "共用提醒沒有建立紀錄");
  cancelReminder(USER_ID, id);
});

Deno.test("音樂時間、佇列與播放資訊純函式", () => {
  assertEquals(formatMusicTime(undefined), "未知");
  assertEquals(formatMusicTime(0), "0:00");
  assertEquals(formatMusicTime(65_000), "1:05");
  assertEquals(formatMusicTime(3_665_000), "1:01:05");

  const bot = createFakeBot();
  const first = { track: "a", title: "A", link: "https://a", queued: USER_ID };
  const second = { track: "b", title: "B", link: "https://b", queued: USER_ID };
  const third = { track: "c", title: "C", link: "https://c", queued: USER_ID };
  bot.guildQueues.set(GUILD_ID, [first, second, third]);
  assert(typeof queueMusic(bot, GUILD_ID) !== "string", "佇列應產生 embed");
  assertEquals(
    clearMusic(bot, GUILD_ID),
    "已清除 2 首待播歌曲，目前歌曲會繼續播放。",
  );
  assertEquals(bot.guildQueues.get(GUILD_ID)?.length, 1);
  bot.guildQueues.set(GUILD_ID, [first, second, third]);
  assert(
    moveMusic(bot, GUILD_ID, "1", "2").includes("移至第 2 位"),
    "move 失敗",
  );
  assert(removeMusic(bot, GUILD_ID, "1").includes("已移除"), "remove 失敗");
  assert(shuffleMusic(bot, GUILD_ID).includes("隨機排序"), "shuffle 失敗");
  assertEquals(historyMusic(bot, GUILD_ID), "目前還沒有播放紀錄。");
  bot.guildHistory.set(GUILD_ID, [first]);
  assert(
    typeof historyMusic(bot, GUILD_ID) !== "string",
    "history 應產生 embed",
  );
  const current = nowPlaying(bot, GUILD_ID);
  assert(Array.isArray(current), "now playing 應產生 embed");
});

Deno.test("音樂播放控制在沒有歌曲與有歌曲時都能回應", async () => {
  const bot = createFakeBot();
  const player = createFakePlayer();
  bot.guildPlayers.set(GUILD_ID, player as never);
  assertEquals(await skipCurrentMusic(bot, GUILD_ID), "目前沒有播放中的歌曲。");
  assertEquals(await setMusicVolume(bot, GUILD_ID, "50"), "音量已調整為 50。");
  assertEquals(
    await setPlaybackSpeed(bot, GUILD_ID, "1.5"),
    "播放速度已調整為 1.5x。",
  );
  assertEquals(
    await setBassBoost(bot, GUILD_ID, "0.5"),
    "Bassboost 已設定為 0.5。",
  );
  assertEquals(await toggleNightcore(bot, GUILD_ID), "已啟用 Nightcore。");
  assertEquals(await toggleVaporwave(bot, GUILD_ID), "已啟用 Vaporwave。");
  assertEquals(await togglePauseMusic(bot, GUILD_ID), "歌曲已暫停。");
  assertEquals(await togglePauseMusic(bot, GUILD_ID), "歌曲已恢復播放。");
  assertEquals(setMusicLoop(bot, GUILD_ID, "track"), "已啟用單曲循環。");
  assertEquals(
    await setMusicVolume(bot, GUILD_ID, "bad"),
    "音量必須是 0 到 1000 的整數。",
  );
  assertEquals(
    await setPlaybackSpeed(bot, GUILD_ID, "3"),
    "播放速度必須介於 0.5 到 2 之間。",
  );
  assertEquals(
    await setBassBoost(bot, GUILD_ID, "3"),
    "Bassboost 強度必須是 0 到 2。",
  );

  bot.guildCurrentTrack.set(GUILD_ID, {
    track: "a",
    title: "A",
    link: "https://a",
    queued: USER_ID,
  });
  const response = nowPlayingResponse(bot, GUILD_ID);
  assert(
    typeof response !== "string" && response.components,
    "now playing response 不完整",
  );
  assert(buildPlayerComponents(bot, GUILD_ID)?.length === 1, "控制按鈕未建立");
  await stopMusic(bot, GUILD_ID);
  assert(!bot.guildPlayers.has(GUILD_ID), "stop 應清除 player");
});
