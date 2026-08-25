import {
  buildSearchComponents,
  createSelectionId,
  ensureVoiceChannel,
  getVoiceChannel,
  prepareMusicPlayback,
  searchMusic,
  skipMusic,
  storeSearchSelection,
} from "@services/music.ts";
import {
  assert,
  assertEquals,
  CHANNEL_ID,
  createFakeBot,
  createFakePlayer,
  GUILD_ID,
  USER_ID,
} from "./helpers.ts";
import { playQueueUntilEnd } from "@utils/music.ts";

Deno.test("音樂搜尋、播放器建立與入列流程可用 mock Lavalink 驗證", async () => {
  const bot = createFakeBot();
  const player = createFakePlayer();
  bot.voiceStates.set(`${GUILD_ID}:${USER_ID}`, {
    guildId: GUILD_ID,
    userId: USER_ID,
    channelId: CHANNEL_ID,
  } as never);
  bot.musicNode = {
    idealNodes: [{}],
    rest: {
      loadTracks: (identifier: string) => ({
        loadType: "search",
        tracks: identifier.startsWith("ytsearch:")
          ? [
            { track: "a", info: { title: "A", uri: "https://a" } },
            { track: "b", info: { title: "B", uri: "https://b" } },
          ]
          : [{ track: "direct", info: { title: "Direct", uri: identifier } }],
      }),
    },
    createPlayer: () => player,
    destroyPlayer: () => true,
  } as never;

  assertEquals(getVoiceChannel(bot, GUILD_ID, USER_ID), CHANNEL_ID);
  let failed = false;
  try {
    ensureVoiceChannel(bot, GUILD_ID, 999n);
  } catch (error) {
    failed = error instanceof Error && error.message === "請先加入語音頻道。";
  }
  assert(failed, "未加入語音頻道應失敗");

  const direct = await searchMusic(bot, "https://youtu.be/abc", USER_ID);
  assertEquals(direct.selection, false);
  assertEquals(direct.tracks[0]?.title, "Direct");
  const search = await searchMusic(bot, "test song", USER_ID);
  assertEquals(search.selection, true);
  assertEquals(search.tracks.length, 2);

  const prepared = await prepareMusicPlayback(
    bot,
    GUILD_ID,
    USER_ID,
    CHANNEL_ID,
    "https://youtu.be/abc",
  );
  assertEquals(prepared.tracks.length, 1);
  assertEquals(bot.guildQueues.get(GUILD_ID)?.length, 1);
  assert(bot.sent.length > 0, "播放開始時應送出訊息");

  const selection = await prepareMusicPlayback(
    bot,
    GUILD_ID,
    USER_ID,
    CHANNEL_ID,
    "another search",
  );
  assert(selection.selectionId !== undefined, "多筆搜尋應建立選擇器");
  assert(
    bot.guildSelectCollectors.has(selection.selectionId!),
    "選擇結果未暫存",
  );
  bot.guildSelectCollectors.delete(selection.selectionId!);
});

Deno.test("音樂選單、跳過與錯誤輸入處理", async () => {
  const bot = createFakeBot();
  const player = createFakePlayer();
  bot.guildPlayers.set(GUILD_ID, player as never);
  bot.guildQueues.set(GUILD_ID, [
    { track: "a", title: "A", link: "https://a", queued: USER_ID },
    { track: "b", title: "B", link: "https://b", queued: USER_ID },
  ]);
  bot.guildPlaybackChannels.set(GUILD_ID, CHANNEL_ID);
  assertEquals(await skipMusic(bot, GUILD_ID), true);
  assertEquals(bot.guildQueues.get(GUILD_ID)?.[0]?.track, "b");
  assertEquals(
    buildSearchComponents("music-select:test", [
      { track: "a", title: "A", link: "https://a", queued: USER_ID },
    ])?.length,
    1,
  );
  const id = createSelectionId(GUILD_ID, USER_ID);
  assert(
    id.startsWith(`music-select:${GUILD_ID}:${USER_ID}:`),
    "selection id 格式錯誤",
  );
  storeSearchSelection(bot, id, []);
  assert(bot.guildSelectCollectors.has(id), "selection 沒有暫存");
  bot.guildSelectCollectors.delete(id);

  let invalid = false;
  try {
    await searchMusic(bot, "", USER_ID);
  } catch (error) {
    invalid = error instanceof Error &&
      error.message === "請提供歌曲名稱或連結。";
  }
  assert(invalid, "空搜尋應失敗");
});

Deno.test("播放佇列會處理結束、循環、空佇列與播放錯誤", async () => {
  const bot = createFakeBot();
  const first = { track: "a", title: "A", link: "https://a", queued: USER_ID };
  const second = { track: "b", title: "B", link: "https://b", queued: USER_ID };
  let ended: ((...args: unknown[]) => unknown) | undefined;
  const player = createFakePlayer({
    once: (_event: string, listener: (...args: unknown[]) => unknown) => {
      ended = listener;
      return player;
    },
  });
  bot.guildQueues.set(GUILD_ID, [first, second]);
  await playQueueUntilEnd(
    bot,
    CHANNEL_ID,
    player as never,
    GUILD_ID,
    undefined,
  );
  assertEquals(bot.guildCurrentTrack.get(GUILD_ID), first as never);
  await ended?.();
  assertEquals(bot.guildQueues.get(GUILD_ID)?.[0], second as never);

  bot.guildQueues.set(GUILD_ID, [first]);
  player.trackRepeat = true;
  await playQueueUntilEnd(
    bot,
    CHANNEL_ID,
    player as never,
    GUILD_ID,
    undefined,
  );
  await ended?.();
  assert(bot.guildQueues.has(GUILD_ID), "單曲循環不應清空佇列");

  player.trackRepeat = false;
  player.queueRepeat = true;
  bot.guildQueues.set(GUILD_ID, [first, second]);
  await playQueueUntilEnd(
    bot,
    CHANNEL_ID,
    player as never,
    GUILD_ID,
    undefined,
  );
  await ended?.();
  assertEquals(bot.guildQueues.get(GUILD_ID)?.at(-1), first as never);

  const broken = createFakePlayer({
    play: () => Promise.reject(new Error("broken")),
  });
  bot.guildQueues.set(GUILD_ID, [first]);
  await playQueueUntilEnd(
    bot,
    CHANNEL_ID,
    broken as never,
    GUILD_ID,
    undefined,
  );
  assert(!bot.guildQueues.has(GUILD_ID), "播放錯誤後應移除歌曲");
});
