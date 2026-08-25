import { discordeno } from "@deps";
import { BotClient } from "@base/CC-OSV-Client.ts";

function voiceStateKey(guildId: bigint, userId: bigint): string {
  return `${guildId}:${userId}`;
}

export function cacheUser(bot: BotClient, user: discordeno.User): void {
  bot.users.set(user.id, user);
}

/** 將 Gateway 收到的資料放入本專案的最小快取。 */
export function cacheGuild(bot: BotClient, guild: discordeno.Guild): void {
  bot.guilds.set(guild.id, guild);
  guild.members?.forEach((member) => {
    if (member.user) bot.users.set(member.user.id, member.user);
  });
  guild.voiceStates?.forEach((state) => {
    bot.voiceStates.set(voiceStateKey(state.guildId, state.userId), state);
  });
}

/** 快取使用者、頻道與訊息中附帶的成員資料。 */
export function cacheMessage(
  bot: BotClient,
  message: discordeno.Message,
): void {
  bot.users.set(message.author.id, message.author);
  if (message.member?.user) {
    bot.users.set(message.member.user.id, message.member.user);
  }
}

export function cacheVoiceState(
  bot: BotClient,
  state: discordeno.VoiceState,
): void {
  const key = voiceStateKey(state.guildId, state.userId);
  if (state.channelId) {
    bot.voiceStates.set(key, state);
  } else {
    bot.voiceStates.delete(key);
  }
}

export function getVoiceState(
  bot: BotClient,
  guildId: bigint,
  userId: bigint,
): discordeno.VoiceState | undefined {
  return bot.voiceStates.get(voiceStateKey(guildId, userId));
}
