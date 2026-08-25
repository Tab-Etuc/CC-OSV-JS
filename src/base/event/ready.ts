import { config, discordeno } from "@deps";
import { database, main } from "@utils/log.ts";
import { Bot, markMongoDBReady, MongoDB } from "@base/CC-OSV-Client.ts";
import { ChangeTime } from "../../task/changeChannelTime.ts";
import { refreshCommand, syncSlashCommands } from "@classes/command.ts";
import { cacheGuild, cacheUser } from "@utils/cache.ts";

export let BotUptime = 0;
let statusInterval: ReturnType<typeof setInterval> | undefined;

function buildStatusName(name: string): string {
  return name
    .replace("{0}", String(Bot.guilds.size))
    .replace(
      "{1}",
      String(
        [...Bot.guilds.values()].reduce(
          (total, guild) => total + (guild.memberCount ?? 0),
          0,
        ),
      ),
    );
}

async function connectDatabase(): Promise<boolean> {
  if (!config.mongoDbUrl) {
    database.warn("未設定 MongoDB，略過資料庫連線。需要資料庫的功能將不啟用。");
    return false;
  }

  try {
    await MongoDB.connect(config.mongoDbUrl);
    markMongoDBReady();
    database.info("MongoDB 已連線。");
    return true;
  } catch (error) {
    database.error("MongoDB 連線失敗：", error);
    return false;
  }
}

export function setReadyEvent(): void {
  Bot.events.guildCreate = (rawGuild) => {
    cacheGuild(Bot, rawGuild as unknown as discordeno.Guild);
  };
  Bot.events.guildUpdate = (rawGuild) => {
    cacheGuild(Bot, rawGuild as unknown as discordeno.Guild);
  };
  Bot.events.guildDelete = (guildId) => {
    Bot.guilds.delete(guildId);
  };

  Bot.events.ready = async (rawPayload) => {
    const payload = rawPayload as unknown as { user: discordeno.User };
    cacheUser(Bot, payload.user);
    BotUptime = Date.now();

    if (config.lavalink) {
      Bot.musicNode.init(Bot.id);
    } else {
      main.warn("未設定 Lavalink，音樂功能將暫停。");
    }

    const databaseReady = await connectDatabase();
    if (databaseReady) ChangeTime(Bot);

    await refreshCommand();
    await syncSlashCommands();

    const status = config.statuses[
      Math.floor(Math.random() * config.statuses.length)
    ];
    if (status) {
      const activities = status.activities?.map((activity) => ({
        ...activity,
        name: buildStatusName(activity.name),
      }));
      await Bot.gateway.editBotStatus({
        activities,
        status: status.status,
      });
    }

    if (statusInterval) clearInterval(statusInterval);
    statusInterval = setInterval(() => {
      const activity = config.statuses[0]?.activities?.[0];
      if (!activity) return;
      void Bot.gateway.editBotStatus({
        activities: [{
          ...activity,
          name: buildStatusName(activity.name),
        }],
        status: config.statuses[0]?.status ?? "online",
      });
    }, 60_000);

    main.info("機器人已準備完成。");
  };
}
