import { BotClient } from "@base/CC-OSV-Client.ts";
import { discordeno } from "@deps";
import { CCOSVEmbed } from "@classes/embed.ts";
import {
  ensureMusicPlayer,
  ensureVoiceChannel,
  skipMusic,
} from "@services/music.ts";

export type MusicLoopMode = "off" | "track" | "queue";

function getPlayer(bot: BotClient, guildId: bigint) {
  return bot.guildPlayers.get(guildId);
}

function parseTime(value: string): number | undefined {
  const input = value.trim().toLowerCase();
  if (!input) return undefined;

  if (/^\d+$/.test(input)) return Number(input) * 1000;
  if (/^\d+(?:\.\d+)?[smhd](?:\d+(?:\.\d+)?[smhd])*$/.test(input)) {
    const units: Record<string, number> = {
      s: 1_000,
      m: 60_000,
      h: 3_600_000,
      d: 86_400_000,
    };
    let total = 0;
    for (const match of input.matchAll(/(\d+(?:\.\d+)?)([smhd])/g)) {
      total += Number(match[1]) * (units[match[2]!] ?? 0);
    }
    return total > 0 ? total : undefined;
  }

  const parts = input.split(":");
  if (
    parts.length >= 2 && parts.length <= 3 &&
    parts.every((part) => /^\d+$/.test(part))
  ) {
    const numbers = parts.map(Number);
    const seconds = numbers.length === 2
      ? numbers[0]! * 60 + numbers[1]!
      : numbers[0]! * 3_600 + numbers[1]! * 60 + numbers[2]!;
    return seconds >= 0 ? seconds * 1000 : undefined;
  }
  return undefined;
}

export function formatMusicTime(
  milliseconds: number | null | undefined,
): string {
  if (milliseconds === null || milliseconds === undefined || milliseconds < 0) {
    return "未知";
  }
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3_600);
  const minutes = Math.floor(totalSeconds % 3_600 / 60);
  const seconds = totalSeconds % 60;
  return hours > 0
    ? `${hours}:${String(minutes).padStart(2, "0")}:${
      String(seconds).padStart(2, "0")
    }`
    : `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function buildPlayerComponents(
  bot: BotClient,
  guildId: bigint,
): discordeno.CreateMessageOptions["components"] {
  const player = getPlayer(bot, guildId);
  const paused = player?.paused ?? false;
  return [{
    type: 1,
    components: [
      {
        type: 2,
        style: 2,
        label: paused ? "繼續" : "暫停",
        customId: "music:pause",
      },
      { type: 2, style: 1, label: "跳過", customId: "music:skip" },
      { type: 2, style: 2, label: "隨機", customId: "music:shuffle" },
      { type: 2, style: 2, label: "循環", customId: "music:loop" },
      { type: 2, style: 4, label: "停止", customId: "music:stop" },
    ],
  }] as unknown as discordeno.CreateMessageOptions["components"];
}

export function joinMusic(
  bot: BotClient,
  guildId: bigint,
  userId: bigint,
): string {
  const channelId = ensureVoiceChannel(bot, guildId, userId);
  const player = ensureMusicPlayer(bot, guildId, channelId);
  if (player.connected && player.channelId === channelId) {
    return "已經在你的語音頻道中。";
  }
  player.connect(channelId);
  return "已加入語音頻道。";
}

export function leaveMusic(bot: BotClient, guildId: bigint): string {
  const player = bot.guildPlayers.get(guildId);
  if (!player) return "目前沒有加入語音頻道。";
  player.disconnect();
  bot.musicNode.destroyPlayer(guildId);
  bot.guildPlayers.delete(guildId);
  bot.guildQueues.delete(guildId);
  bot.guildCurrentTrack.delete(guildId);
  bot.guildPlaybackChannels.delete(guildId);
  return "已離開語音頻道。";
}

export function setMusicLoop(
  bot: BotClient,
  guildId: bigint,
  requested?: string,
): string {
  const player = getPlayer(bot, guildId);
  if (!player?.track) return "目前沒有播放中的歌曲。";

  const input = requested?.trim().toLowerCase();
  const mode: MusicLoopMode =
    input === "track" || input === "song" || input === "one"
      ? "track"
      : input === "queue" || input === "all"
      ? "queue"
      : input === "off" || input === "none" || input === "0"
      ? "off"
      : player.trackRepeat
      ? "queue"
      : player.queueRepeat
      ? "off"
      : "track";

  player.setTrackRepeat(mode === "track");
  player.queueRepeat = mode === "queue";
  return mode === "track"
    ? "已啟用單曲循環。"
    : mode === "queue"
    ? "已啟用整個佇列循環。"
    : "已關閉循環播放。";
}

export async function toggleNightcore(
  bot: BotClient,
  guildId: bigint,
): Promise<string> {
  const player = bot.guildPlayers.get(guildId);
  if (!player?.track) return "目前沒有播放中的歌曲。";
  const enabled = player.filters.timescale?.rate !== 1.09;
  player.filters.timescale = enabled
    ? { rate: 1.09, pitch: 1.125, speed: 1 }
    : { rate: 1, pitch: 1, speed: 1 };
  await player.setFilters();
  return enabled ? "已啟用 Nightcore。" : "已關閉 Nightcore。";
}

export async function setBassBoost(
  bot: BotClient,
  guildId: bigint,
  value = "1",
): Promise<string> {
  const player = getPlayer(bot, guildId);
  if (!player?.track) return "目前沒有播放中的歌曲。";
  const level = Number(value);
  if (!Number.isFinite(level) || level < 0 || level > 2) {
    return "Bassboost 強度必須是 0 到 2。";
  }
  const bands = Array.from({ length: 15 }, (_, band) => ({
    band,
    gain: band < 6 ? Math.min(1, level * (1 - band / 8)) : 0,
  }));
  await player.setEqualizer(bands);
  return level === 0 ? "已關閉 Bassboost。" : `Bassboost 已設定為 ${level}。`;
}

export async function setPlaybackSpeed(
  bot: BotClient,
  guildId: bigint,
  value: string,
): Promise<string> {
  const player = getPlayer(bot, guildId);
  if (!player?.track) return "目前沒有播放中的歌曲。";
  const speed = Number(value);
  if (!Number.isFinite(speed) || speed < 0.5 || speed > 2) {
    return "播放速度必須介於 0.5 到 2 之間。";
  }
  player.filters.timescale = {
    rate: speed,
    pitch: player.filters.timescale?.pitch ?? 1,
    speed: 1,
  };
  await player.setFilters();
  return `播放速度已調整為 ${speed}x。`;
}

export async function toggleVaporwave(
  bot: BotClient,
  guildId: bigint,
): Promise<string> {
  const player = getPlayer(bot, guildId);
  if (!player?.track) return "目前沒有播放中的歌曲。";
  const enabled = player.filters.timescale?.pitch !== 0.8;
  player.filters.timescale = enabled
    ? { rate: 0.8, pitch: 0.8, speed: 1 }
    : { rate: 1, pitch: 1, speed: 1 };
  await player.setFilters();
  return enabled ? "已啟用 Vaporwave。" : "已關閉 Vaporwave。";
}

export async function pauseMusic(
  bot: BotClient,
  guildId: bigint,
): Promise<string> {
  const player = bot.guildPlayers.get(guildId);
  if (!player?.track) return "目前沒有播放中的歌曲。";
  if (player.paused) return "歌曲已經暫停。";
  await player.pause(true);
  return "歌曲已暫停。";
}

export async function resumeMusic(
  bot: BotClient,
  guildId: bigint,
): Promise<string> {
  const player = bot.guildPlayers.get(guildId);
  if (!player?.track) return "目前沒有播放中的歌曲。";
  if (!player.paused) return "歌曲目前正在播放。";
  await player.resume();
  return "歌曲已恢復播放。";
}

export function togglePauseMusic(
  bot: BotClient,
  guildId: bigint,
): Promise<string> {
  const player = getPlayer(bot, guildId);
  return player?.paused ? resumeMusic(bot, guildId) : pauseMusic(bot, guildId);
}

export async function skipCurrentMusic(
  bot: BotClient,
  guildId: bigint,
): Promise<string> {
  return await skipMusic(bot, guildId)
    ? "已跳過目前歌曲。"
    : "目前沒有播放中的歌曲。";
}

export async function setMusicVolume(
  bot: BotClient,
  guildId: bigint,
  value: string,
): Promise<string> {
  const volume = Number(value);
  const player = bot.guildPlayers.get(guildId);
  if (!player?.track) return "目前沒有播放中的歌曲。";
  if (!Number.isInteger(volume) || volume < 0 || volume > 1000) {
    return "音量必須是 0 到 1000 的整數。";
  }
  await player.setVolume(volume);
  return `音量已調整為 ${volume}。`;
}

export function queueMusic(
  bot: BotClient,
  guildId: bigint,
  page = 1,
): string | ReturnType<CCOSVEmbed["build"]> {
  const queue = bot.guildQueues.get(guildId) ?? [];
  if (queue.length === 0) return "目前佇列是空的。";

  const pageSize = 10;
  const pageCount = Math.max(1, Math.ceil((queue.length - 1) / pageSize));
  const current = queue[0]!;
  const requestedPage = Number.isInteger(page) && page > 0 ? page : 1;
  const safePage = Math.min(requestedPage, pageCount);
  const start = 1 + (safePage - 1) * pageSize;
  const upcoming = queue.slice(start, start + pageSize);
  const lines = upcoming.length === 0
    ? "沒有其他待播歌曲。"
    : upcoming.map((song, index) =>
      `**${start + index}.** [${song.title}](${song.link}) · <@${song.queued}>`
    ).join("\n");

  return new CCOSVEmbed()
    .setTitle("播放佇列")
    .setDesc(`目前播放：[${current.title}](${current.link})\n\n${lines}`)
    .addField("歌曲數量", `${queue.length - 1} 首待播`, true)
    .addField("頁數", `${safePage}/${pageCount}`, true)
    .build();
}

export function historyMusic(
  bot: BotClient,
  guildId: bigint,
): string | ReturnType<CCOSVEmbed["build"]> {
  const history = bot.guildHistory.get(guildId) ?? [];
  if (history.length === 0) return "目前還沒有播放紀錄。";
  const lines = [...history].reverse().slice(0, 10).map((song, index) =>
    `${index + 1}. [${song.title}](${song.link})`
  ).join("\n");
  return new CCOSVEmbed()
    .setTitle("最近播放")
    .setDesc(lines)
    .addField("保留紀錄", `${history.length}/25 首`, true)
    .build();
}

export function shuffleMusic(bot: BotClient, guildId: bigint): string {
  const queue = bot.guildQueues.get(guildId);
  if (!queue || queue.length < 3) return "待播歌曲不足，無法隨機排序。";
  for (let index = queue.length - 1; index > 1; index--) {
    const target = Math.floor(Math.random() * (index - 1)) + 1;
    [queue[index], queue[target]] = [queue[target]!, queue[index]!];
  }
  return `已隨機排序 ${queue.length - 1} 首待播歌曲。`;
}

export function removeMusic(
  bot: BotClient,
  guildId: bigint,
  value: string,
): string {
  const queue = bot.guildQueues.get(guildId);
  const position = Number(value);
  if (!queue || queue.length < 2) return "目前沒有待播歌曲。";
  if (!Number.isInteger(position) || position < 1 || position >= queue.length) {
    return `位置必須是 1 到 ${queue.length - 1}。`;
  }
  const [removed] = queue.splice(position, 1);
  return removed
    ? `已移除第 ${position} 首：${removed.title}`
    : "找不到該歌曲。";
}

export function clearMusic(bot: BotClient, guildId: bigint): string {
  const queue = bot.guildQueues.get(guildId);
  if (!queue || queue.length < 2) return "目前沒有待播歌曲。";
  const count = queue.length - 1;
  queue.splice(1);
  return `已清除 ${count} 首待播歌曲，目前歌曲會繼續播放。`;
}

export async function stopMusic(
  bot: BotClient,
  guildId: bigint,
): Promise<string> {
  const player = getPlayer(bot, guildId);
  if (!player) return "目前沒有播放中的歌曲。";
  await player.stop().catch(() => undefined);
  player.disconnect();
  bot.musicNode.destroyPlayer(guildId);
  bot.guildPlayers.delete(guildId);
  bot.guildQueues.delete(guildId);
  bot.guildCurrentTrack.delete(guildId);
  bot.guildPlaybackChannels.delete(guildId);
  return "已停止播放、清空佇列並離開語音頻道。";
}

export async function seekMusic(
  bot: BotClient,
  guildId: bigint,
  value: string,
): Promise<string> {
  const player = getPlayer(bot, guildId);
  if (!player?.track) return "目前沒有播放中的歌曲。";
  const position = parseTime(value);
  if (position === undefined) {
    return "時間格式不正確，請使用秒數、mm:ss、hh:mm:ss 或 1h2m3s。";
  }
  await player.seek(position);
  return `已跳轉到 ${formatMusicTime(position)}。`;
}

export async function replayMusic(
  bot: BotClient,
  guildId: bigint,
): Promise<string> {
  const player = getPlayer(bot, guildId);
  if (!player?.track) return "目前沒有播放中的歌曲。";
  await player.seek(0);
  return "已從頭播放目前歌曲。";
}

export function moveMusic(
  bot: BotClient,
  guildId: bigint,
  fromValue: string,
  toValue: string,
): string {
  const queue = bot.guildQueues.get(guildId);
  const from = Number(fromValue);
  const to = Number(toValue);
  if (!queue || queue.length < 2) return "目前沒有待播歌曲。";
  if (
    !Number.isInteger(from) || !Number.isInteger(to) || from < 1 ||
    to < 1 || from >= queue.length || to >= queue.length
  ) {
    return `位置必須是 1 到 ${queue.length - 1}。`;
  }
  const [song] = queue.splice(from, 1);
  if (!song) return "找不到來源歌曲。";
  queue.splice(to, 0, song);
  return `已將歌曲從第 ${from} 位移至第 ${to} 位。`;
}

export function nowPlaying(
  bot: BotClient,
  guildId: bigint,
): string | ReturnType<CCOSVEmbed["build"]> {
  const current = bot.guildCurrentTrack.get(guildId) ??
    bot.guildQueues.get(guildId)?.[0];
  if (!current) return "目前沒有播放中的歌曲。";
  const player = getPlayer(bot, guildId);
  const queue = bot.guildQueues.get(guildId) ?? [];
  const loop = player?.trackRepeat
    ? "單曲"
    : player?.queueRepeat
    ? "佇列"
    : "關閉";
  return new CCOSVEmbed()
    .setTitle("正在播放")
    .setDesc(`[${current.title}](${current.link})`)
    .addField("音量", `${Math.round(player?.volume ?? 100)}%`, true)
    .addField("循環", loop, true)
    .addField("待播", `${Math.max(0, queue.length - 1)} 首`, true)
    .build();
}

export function nowPlayingResponse(
  bot: BotClient,
  guildId: bigint,
): string | discordeno.CreateMessageOptions {
  const result = nowPlaying(bot, guildId);
  return typeof result === "string"
    ? result
    : { embeds: result, components: buildPlayerComponents(bot, guildId) };
}
