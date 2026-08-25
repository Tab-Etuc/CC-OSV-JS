import { config, discordeno, lavadeno } from "@deps";
import { BotClient } from "@base/CC-OSV-Client.ts";
import { SongInfo } from "@interfaces/music.ts";
import { getVoiceState } from "@utils/cache.ts";
import * as SpotifyAPI from "@internal/spotify.ts";
import * as YtAPI from "@internal/ytreqs.ts";
import { playQueueUntilEnd } from "@utils/music.ts";

export interface MusicSearchResult {
  tracks: SongInfo[];
  selection: boolean;
}

function toSong(
  track: { track: string; info: { title: string; uri?: string } },
  queued: bigint,
): SongInfo {
  return {
    track: track.track,
    title: track.info.title,
    link: track.info.uri ?? "",
    queued,
  };
}

function getRest(bot: BotClient) {
  if (!config.lavalink || bot.musicNode.idealNodes.length === 0) {
    throw new Error("Lavalink 尚未連線，暫時無法播放音樂。");
  }
  return bot.musicNode.rest;
}

export function getVoiceChannel(
  bot: BotClient,
  guildId: bigint,
  userId: bigint,
): bigint | undefined {
  return getVoiceState(bot, guildId, userId)?.channelId ?? undefined;
}

export function ensureVoiceChannel(
  bot: BotClient,
  guildId: bigint,
  userId: bigint,
): bigint {
  const channelId = getVoiceChannel(bot, guildId, userId);
  if (!channelId) throw new Error("請先加入語音頻道。");
  return channelId;
}

export function ensureMusicPlayer(
  bot: BotClient,
  guildId: bigint,
  channelId: bigint,
): lavadeno.Player {
  getRest(bot);
  let player = bot.guildPlayers.get(guildId);
  if (!player) {
    player = bot.musicNode.createPlayer(guildId);
    bot.guildPlayers.set(guildId, player);
  }
  if (player.channelId !== channelId) player.connect(channelId);
  return player;
}

async function loadDirect(
  bot: BotClient,
  identifier: string,
  queuedBy: bigint,
): Promise<SongInfo[]> {
  const result = await getRest(bot).loadTracks(identifier);
  return result.tracks.map((track) => toSong(track, queuedBy));
}

async function loadSpotify(
  bot: BotClient,
  query: string,
  queuedBy: bigint,
): Promise<SongInfo[]> {
  if (!config.spotifyToken) {
    throw new Error("未設定 Spotify API，無法解析此連結。");
  }
  const isTrack = SpotifyAPI.isSpotifyTrack(query);
  const id = isTrack
    ? SpotifyAPI.getTrackId(query)
    : SpotifyAPI.getPlaylistId(query);
  if (!id) throw new Error("Spotify 連結格式不正確。");
  const terms = await SpotifyAPI.getPlaylistTracks(
    config.spotifyToken,
    id,
    isTrack,
  );
  if (!terms?.length) throw new Error("找不到 Spotify 音樂。");

  const songs: SongInfo[] = [];
  for (const term of terms) {
    const result = await loadDirect(bot, `ytsearch:${term}`, queuedBy);
    const first = result[0];
    if (first) songs.push(first);
  }
  return songs;
}

export async function searchMusic(
  bot: BotClient,
  query: string,
  queuedBy: bigint,
): Promise<MusicSearchResult> {
  const normalized = query.trim();
  if (!normalized) throw new Error("請提供歌曲名稱或連結。");
  if (YtAPI.isYoutubeLink(normalized)) {
    return {
      tracks: await loadDirect(bot, normalized, queuedBy),
      selection: false,
    };
  }
  if (SpotifyAPI.isSpotifyLink(normalized)) {
    return {
      tracks: await loadSpotify(bot, normalized, queuedBy),
      selection: false,
    };
  }
  const tracks = (await loadDirect(bot, `ytsearch:${normalized}`, queuedBy))
    .slice(0, 5);
  return { tracks, selection: tracks.length > 1 };
}

export interface MusicPlaybackResult {
  tracks: SongInfo[];
  selectionId?: string;
}

/** 搜尋、建立播放器並將結果入列；訊息與 slash 指令共用這個核心流程。 */
export async function prepareMusicPlayback(
  bot: BotClient,
  guildId: bigint,
  userId: bigint,
  channelId: bigint,
  query: string,
): Promise<MusicPlaybackResult> {
  const voiceChannelId = ensureVoiceChannel(bot, guildId, userId);
  const player = ensureMusicPlayer(bot, guildId, voiceChannelId);
  const result = await searchMusic(bot, query, userId);
  if (result.selection) {
    const selectionId = createSelectionId(guildId, userId);
    storeSearchSelection(bot, selectionId, result.tracks);
    return { tracks: result.tracks, selectionId };
  }
  await enqueueMusic(bot, guildId, channelId, result.tracks, player);
  return { tracks: result.tracks };
}

export function buildSearchComponents(
  customId: string,
  tracks: SongInfo[],
): discordeno.CreateMessageOptions["components"] {
  const options = tracks.map((song, index) => ({
    label: song.title.slice(0, 100),
    value: String(index),
    description: "選擇這首歌曲",
  }));
  return [{
    type: 1,
    components: [{
      type: 3,
      customId,
      options,
      placeholder: "選擇要播放的歌曲",
      maxValues: 1,
      minValues: 1,
    }],
  }] as unknown as discordeno.CreateMessageOptions["components"];
}

export async function enqueueMusic(
  bot: BotClient,
  guildId: bigint,
  channelId: bigint,
  songs: SongInfo[],
  player: lavadeno.Player,
): Promise<void> {
  if (songs.length === 0) throw new Error("找不到可播放的歌曲。");
  const queue = bot.guildQueues.get(guildId);
  const shouldStart = !queue || queue.length === 0;
  if (queue) queue.push(...songs);
  else bot.guildQueues.set(guildId, [...songs]);
  bot.guildPlaybackChannels.set(guildId, channelId);
  if (shouldStart) {
    await playQueueUntilEnd(bot, channelId, player, guildId, undefined);
  }
}

export async function skipMusic(
  bot: BotClient,
  guildId: bigint,
): Promise<boolean> {
  const player = bot.guildPlayers.get(guildId);
  const queue = bot.guildQueues.get(guildId);
  if (!player || !queue?.length) return false;
  queue.shift();
  await player.stop();
  const next = queue[0];
  const channelId = bot.guildPlaybackChannels.get(guildId);
  if (next && channelId) {
    await playQueueUntilEnd(bot, channelId, player, guildId, undefined);
  } else if (!next) {
    bot.guildQueues.delete(guildId);
    bot.guildCurrentTrack.delete(guildId);
  }
  return true;
}

export function createSelectionId(guildId: bigint, userId: bigint): string {
  return `music-select:${guildId}:${userId}:${crypto.randomUUID()}`;
}

/** 暫存搜尋結果並在五分鐘後自動清理，避免互動選單造成記憶體累積。 */
export function storeSearchSelection(
  bot: BotClient,
  customId: string,
  songs: SongInfo[],
): void {
  bot.guildSelectCollectors.set(customId, songs);
  setTimeout(() => {
    if (bot.guildSelectCollectors.get(customId) === songs) {
      bot.guildSelectCollectors.delete(customId);
    }
  }, 5 * 60_000);
}
