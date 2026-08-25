import { BotClient } from "@base/CC-OSV-Client.ts";
import { CCOSVEmbed } from "@classes/embed.ts";
import { joinMusic } from "@services/musicCommands.ts";
import {
  claimDaily,
  economyUserLabel,
  formatCoins,
  formatCooldown,
  getEconomyLeaderboard,
  getEconomyUser,
} from "@services/economy.ts";
import {
  displayLevelUser,
  getLevelLeaderboard,
  getLevelUser,
  xpForNextLevel,
} from "@services/leveling.ts";
import { formatDuration, scheduleReminder } from "@services/reminders.ts";
import { hasGuildPermissions } from "@utils/permissions.ts";

type EmbedResponse = ReturnType<CCOSVEmbed["build"]>;

export function joinResponse(
  bot: BotClient,
  guildId: bigint,
  userId: bigint,
): string {
  if (!hasGuildPermissions(bot, guildId, bot.id, ["CONNECT", "VIEW_CHANNEL"])) {
    return "機器人沒有加入語音頻道所需的權限。";
  }
  try {
    return joinMusic(bot, guildId, userId);
  } catch (error) {
    return error instanceof Error ? error.message : "加入語音頻道失敗。";
  }
}

export async function balanceResponse(
  guildId: bigint,
  userId: bigint,
  label: string,
): Promise<string | EmbedResponse> {
  try {
    const data = await getEconomyUser(guildId, userId);
    if (!data) return "找不到經濟資料。";
    return new CCOSVEmbed()
      .setTitle(`帳戶：${label}`)
      .addField("錢包", formatCoins(data.CoinsInWallet), true)
      .addField("銀行", formatCoins(data.CoinsInBank), true)
      .addField(
        "總資產",
        formatCoins(data.CoinsInWallet + data.CoinsInBank),
        true,
      )
      .build();
  } catch (error) {
    return error instanceof Error ? error.message : "經濟功能目前無法使用。";
  }
}

export async function dailyResponse(
  guildId: bigint,
  userId: bigint,
): Promise<string> {
  try {
    const result = await claimDaily(guildId, userId);
    return result.ok
      ? `每日獎勵已領取：${formatCoins(result.amount)}，明天再來。`
      : `你今天已領取過了，還要等 ${formatCooldown(result.remainingMs)}。`;
  } catch (error) {
    return error instanceof Error ? error.message : "每日獎勵目前無法使用。";
  }
}

export async function leaderboardResponse(
  bot: BotClient,
  guildId: bigint,
  economy: boolean,
): Promise<string | EmbedResponse> {
  try {
    if (economy) {
      const rows = await getEconomyLeaderboard(guildId);
      const lines = rows.length
        ? rows.map((row, index) =>
          `${index + 1}. **${economyUserLabel(bot, row.UserId)}** — ${
            formatCoins(row.CoinsInWallet + row.CoinsInBank)
          }`
        ).join("\n")
        : "目前沒有資料。";
      return new CCOSVEmbed().setTitle("財富排行榜").setDesc(lines).build();
    }
    const rows = await getLevelLeaderboard(guildId);
    const lines = rows.length
      ? rows.map((row, index) =>
        `${index + 1}. **${
          displayLevelUser(bot, row.UserId)
        }** — Lv.${row.Level}（${row.Xp} XP）`
      ).join("\n")
      : "目前沒有資料。";
    return new CCOSVEmbed().setTitle("等級排行榜").setDesc(lines).build();
  } catch (error) {
    return error instanceof Error ? error.message : "排行榜目前無法使用。";
  }
}

export async function rankResponse(
  guildId: bigint,
  userId: bigint,
  label: string,
): Promise<string | EmbedResponse> {
  try {
    const data = await getLevelUser(guildId, userId);
    if (!data) return "找不到這位使用者的等級資料。";
    const required = xpForNextLevel(data.Level);
    return new CCOSVEmbed()
      .setTitle(`等級資料：${label}`)
      .setDesc(`<@${userId}> 目前等級為 **${data.Level}**`)
      .addField("經驗值", `${data.Xp}/${required}`, true)
      .addField("距離升級", `${Math.max(0, required - data.Xp)} XP`, true)
      .addField(
        "進度",
        `${Math.min(100, Math.floor(data.Xp / required * 100))}%`,
        true,
      )
      .build();
  } catch (error) {
    return error instanceof Error ? error.message : "等級功能目前無法使用。";
  }
}

export function reminderResponse(
  bot: BotClient,
  channelId: bigint,
  userId: bigint,
  delay: number,
  text: string,
): string {
  const id = scheduleReminder(bot, channelId, userId, delay, text);
  return `提醒已設定（${id}），${formatDuration(delay)}後提醒你。`;
}
