import { BotClient } from "@base/CC-OSV-Client.ts";

interface Reminder {
  id: string;
  channelId: bigint;
  userId: bigint;
  text: string;
  dueAt: number;
  timer: ReturnType<typeof setTimeout>;
}

const reminders = new Map<string, Reminder>();

export function parseDuration(value: string): number | undefined {
  const input = value.trim().toLowerCase();
  if (!/^\d+(?:\.\d+)?[smhd](?:\d+(?:\.\d+)?[smhd])*$/.test(input)) {
    return undefined;
  }
  const units: Record<string, number> = {
    s: 1_000,
    m: 60_000,
    h: 3_600_000,
    d: 86_400_000,
  };
  let milliseconds = 0;
  for (const match of input.matchAll(/(\d+(?:\.\d+)?)([smhd])/g)) {
    milliseconds += Number(match[1]) * (units[match[2]!] ?? 0);
  }
  return milliseconds > 0 && milliseconds <= 7 * 86_400_000
    ? milliseconds
    : undefined;
}

export function formatDuration(milliseconds: number): string {
  const totalSeconds = Math.ceil(milliseconds / 1_000);
  const days = Math.floor(totalSeconds / 86_400);
  const hours = Math.floor(totalSeconds % 86_400 / 3_600);
  const minutes = Math.floor(totalSeconds % 3_600 / 60);
  const seconds = totalSeconds % 60;
  return [
    days ? `${days}天` : "",
    hours ? `${hours}小時` : "",
    minutes ? `${minutes}分` : "",
    seconds ? `${seconds}秒` : "",
  ]
    .filter(Boolean).join(" ") || "0秒";
}

export function scheduleReminder(
  bot: BotClient,
  channelId: bigint,
  userId: bigint,
  delay: number,
  text: string,
): string {
  const id = crypto.randomUUID().slice(0, 8);
  const dueAt = Date.now() + delay;
  const timer = setTimeout(() => {
    reminders.delete(id);
    void bot.helpers.sendMessage(channelId, {
      content: `<@${userId}> 提醒你：${text}`,
    });
  }, delay);
  reminders.set(id, { id, channelId, userId, text, dueAt, timer });
  return id;
}

export function listReminders(
  userId: bigint,
): Array<{ id: string; text: string; dueAt: number }> {
  return [...reminders.values()]
    .filter((item) => item.userId === userId)
    .sort((a, b) => a.dueAt - b.dueAt)
    .map(({ id, text, dueAt }) => ({ id, text, dueAt }));
}

export function cancelReminder(userId: bigint, id: string): boolean {
  const reminder = reminders.get(id);
  if (!reminder || reminder.userId !== userId) return false;
  clearTimeout(reminder.timer);
  reminders.delete(id);
  return true;
}
