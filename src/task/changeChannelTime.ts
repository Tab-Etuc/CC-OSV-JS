import { time } from "../../time.ts/mod.ts";
import { MongoDB } from "@base/CC-OSV-Client.ts";
import { BotClient } from "@base/CC-OSV-Client.ts";
import { discordeno } from "../../deps.ts";
import { main } from "@utils/log.ts";
export function ChangeTime(bot: BotClient) {
  setInterval(async () => {
    try {
      const db = MongoDB.database("Beta"),
        Guilds = db.collection("Guilds");
      const GuildsData = await Guilds.find().toArray();
      const servers = GuildsData.map((g) => g._id);
      servers.forEach(async (a) => {
        const server = await Guilds.findOne({ _id: a });
        if (!server) return;
        const ClockTime_Array = server.ClockTime;
        const ClockDate_Array = server.ClockDate;
        ClockTime_Array &&
          ChangeClockTime(bot, ClockTime_Array);

        ClockDate_Array &&
          ChangeClockDate(bot, ClockDate_Array);
      });
    } catch (err) {
      main.error(err);
    }
  }, 3e4); // 30s = 30000ms :D
}

function ChangeClockTime(bot: BotClient, ClockTime_Array: string[]) {
  let channelName = "";
  const TimeHour = time()
    .tz("Asia/Taipei")
    .getHour();

  for (const i in ClockTime_Array) {
    const channel = bot.channels.get(BigInt(ClockTime_Array[i]));
    if (!channel) return;
    channelName = channel.name!;
    channelName = channelName.replace(/🕠現在時刻：|點/g, "");
    if (channelName !== TimeHour) {
      bot.rest.runMethod<discordeno.DiscordChannel>(
        bot.rest,
        "PATCH",
        bot.constants.routes.CHANNEL(channel.id),
        {
          name: "🕠現在時刻：" + TimeHour + "點",
        },
      ).then((channel) => {
        if (channel.name == "🕠現在時刻：" + TimeHour + "點") main.info("已更換頻道時間");
      });
    }
  }
}
function ChangeClockDate(bot: BotClient, ClockDate_Array: string[]) {
  let channelName = "";
  const Time = time()
    .tz("Asia/Taipei")
    .getDate();
  const TimeMonth = Time[1];
  const TimeDate = Time[2];
  for (const i in ClockDate_Array) {
    const channel = bot.channels.get(BigInt(ClockDate_Array[i]));
    if (!channel) return;
    channelName = channel.name!;
    channelName = channelName.replace(/📅貳年●|月|日●/g, "");

    if (channelName !== TimeMonth.toString() + TimeDate.toString()) {
      discordeno.editChannel(bot, channel.id, {
        name: "📅貳年●" + TimeMonth + "月" + TimeDate + "日●",
      });
      main.info("已更換頻道日期");
    }
  }
}
