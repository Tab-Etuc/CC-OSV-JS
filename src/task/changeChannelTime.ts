import { MongoDB } from "@base/CC-OSV-Client.ts";
import { BotClient } from "@base/CC-OSV-Client.ts";
import { discordeno } from "@deps";
import { main } from "@utils/log.ts";

const timeFormatter = new Intl.DateTimeFormat("zh-TW", {
  timeZone: "Asia/Taipei",
  hour: "2-digit",
  hour12: false,
});
const dateFormatter = new Intl.DateTimeFormat("zh-TW", {
  timeZone: "Asia/Taipei",
  month: "2-digit",
  day: "2-digit",
});

function getTimeName(): string {
  const hour =
    timeFormatter.formatToParts(new Date()).find((part) => part.type === "hour")
      ?.value ?? "00";
  return `現在時間：${Number(hour)}點`;
}

function getDateName(): string {
  const parts = dateFormatter.formatToParts(new Date());
  const month = parts.find((part) => part.type === "month")?.value ?? "01";
  const day = parts.find((part) => part.type === "day")?.value ?? "01";
  return `日期：${Number(month)}月${Number(day)}日`;
}

async function updateChannels(bot: BotClient, ids: string[], name: string) {
  await Promise.all(ids.map(async (id) => {
    const channelId = BigInt(id);
    const channel = bot.channels.get(channelId) ??
      await bot.helpers.getChannel(channelId);
    const current = channel as unknown as discordeno.Channel | undefined;
    if (!current || current.name === name) return;
    await bot.helpers.editChannel(current.id, { name });
    bot.channels.set(current.id, { ...current, name });
  }));
}

/** 每 30 秒更新已設定的時間與日期頻道，並避免前一次工作尚未完成時重入。 */
export function ChangeTime(bot: BotClient): void {
  let running = false;
  const tick = async () => {
    if (running) return;
    running = true;
    try {
      const guilds = MongoDB.database("Beta").collection("Guilds");
      const records = await guilds.find().toArray();
      await Promise.all(records.map(async (record) => {
        const clockTime = record.ClockTime ?? record.ChannelClockTime;
        const clockDate = record.ClockDate ?? record.ChannelClockDate;
        if (Array.isArray(clockTime)) {
          await updateChannels(bot, clockTime, getTimeName());
        }
        if (Array.isArray(clockDate)) {
          await updateChannels(bot, clockDate, getDateName());
        }
      }));
    } catch (error) {
      main.error("更新時間頻道失敗：", error);
    } finally {
      running = false;
    }
  };

  void tick();
  setInterval(tick, 30_000);
}
