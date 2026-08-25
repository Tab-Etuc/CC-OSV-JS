import { config, discordeno, lavadeno, mongo } from "@deps";
import { SongInfo } from "@interfaces/music.ts";
import { setupEventHandlers } from "@base/event/mod.ts";
import { lavalink } from "@utils/log.ts";

/**
 * 專案使用的 Discordeno 快取與音樂狀態。
 * Discordeno 21 不再內建舊版 cache plugin，因此只保留本專案實際需要的資料。
 */
export interface BotClient extends discordeno.Bot {
  guilds: Map<bigint, discordeno.Guild>;
  users: Map<bigint, discordeno.User>;
  channels: Map<bigint, discordeno.Channel>;
  voiceStates: Map<string, discordeno.VoiceState>;
  musicNode: lavadeno.Cluster;
  guildPlayers: Map<bigint, lavadeno.Player>;
  guildCurrentTrack: Map<bigint, SongInfo>;
  guildHistory: Map<bigint, SongInfo[]>;
  guildQueues: Map<bigint, SongInfo[]>;
  guildSelectCollectors: Map<string, SongInfo[]>;
  guildPlaybackChannels: Map<bigint, bigint>;
  discordenoVersion: string;
}

const bot = discordeno.createBot({
  token: config.token,
  intents: discordeno.GatewayIntents.GuildMessages |
    discordeno.GatewayIntents.GuildVoiceStates |
    discordeno.GatewayIntents.Guilds |
    discordeno.GatewayIntents.MessageContent,
  desiredProperties: {
    channel: {
      id: true,
      name: true,
      nsfw: true,
      permissions: true,
      type: true,
    },
    guild: {
      id: true,
      name: true,
      iconHash: true,
      memberCount: true,
      members: true,
      voiceStates: true,
      channels: true,
      ownerId: true,
    },
    interaction: {
      id: true,
      applicationId: true,
      type: true,
      guildId: true,
      channelId: true,
      member: true,
      user: true,
      token: true,
      data: true,
      message: true,
    },
    member: {
      id: true,
      guildId: true,
      user: true,
      roles: true,
      permissions: true,
    },
    message: {
      id: true,
      channelId: true,
      content: true,
      guildId: true,
      author: true,
      member: true,
      timestamp: true,
      components: true,
    },
    user: {
      id: true,
      username: true,
      globalName: true,
      avatar: true,
    },
    voiceState: {
      guildId: true,
      userId: true,
      channelId: true,
      sessionId: true,
    },
  },
});

export const Bot = bot as unknown as BotClient;
export const MongoDB = new mongo.MongoClient();
export let MongoDBReady = false;

export function markMongoDBReady(): void {
  MongoDBReady = true;
}

Bot.guilds = new Map();
Bot.users = new Map();
Bot.channels = new Map();
Bot.voiceStates = new Map();
Bot.guildPlayers = new Map();
Bot.guildCurrentTrack = new Map();
Bot.guildHistory = new Map();
Bot.guildQueues = new Map();
Bot.guildSelectCollectors = new Map();
Bot.guildPlaybackChannels = new Map();
Bot.discordenoVersion = "21.0.0";

const nodeOptions = config.lavalink
  ? [{
    id: "main",
    host: config.lavalink.host,
    port: config.lavalink.port,
    password: config.lavalink.password,
    secure: config.lavalink.secure,
  }]
  : [];

Bot.musicNode = new lavadeno.Cluster({
  nodes: nodeOptions,
  sendGatewayPayload: (id: bigint, payload: lavadeno.UpdateVoiceStatus) => {
    const shardId = Bot.gateway.calculateShardId(id);
    void Bot.gateway.sendPayload(shardId, payload);
  },
  userId: Bot.id,
});

Bot.musicNode
  .on("nodeDisconnect", (node, code, reason) => {
    lavalink.info(
      `節點 ${node.id} 已斷線，代碼=${code}，原因=${reason || "未知"}`,
    );
  })
  .on("nodeError", (node, error) => {
    lavalink.error(`節點 ${node.id} 發生錯誤：`, error);
  })
  .on("nodeConnect", (node, reconnect) => {
    lavalink.info(`節點 ${node.id} 已${reconnect ? "重新" : ""}連線。`);
  });

setupEventHandlers();
