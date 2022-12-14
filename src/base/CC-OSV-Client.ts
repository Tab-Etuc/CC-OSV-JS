import { config, ddPlugins, discordeno, lavadeno, mongo } from "@deps";
import { SongInfo } from "@interfaces/music.ts";
import { setupEventHandlers } from "@base/event/mod.ts";
import { lavalink } from "@utils/log.ts";
import { customizeInteractionTransformer } from "@typings/discordeno.ts";
import "@utils/stringFormat.ts";

const bot = discordeno.createBot({
  token: config.token,
  intents: discordeno.GatewayIntents.GuildMessages |
    discordeno.GatewayIntents.GuildVoiceStates |
    discordeno.GatewayIntents.Guilds |
    discordeno.GatewayIntents.MessageContent,
});

ddPlugins.enableHelpersPlugin(bot);
ddPlugins.enableCachePlugin(bot);
ddPlugins.enableCacheSweepers(bot as ddPlugins.BotWithCache);
ddPlugins.enablePermissionsPlugin(bot as ddPlugins.BotWithCache);

export interface BotClient
  extends ddPlugins.BotWithCache<ddPlugins.BotWithHelpersPlugin> {
  musicNode: lavadeno.Cluster;
  guildPlayers: Map<bigint, lavadeno.Player>;
  guildCurrentTrack: Map<bigint, SongInfo>;
  guildQueues: Map<bigint, SongInfo[]>;
  guildSelectCollectors: Map<bigint, SongInfo[]>;
}
export const Bot = bot as BotClient;
export const MongoDB = new mongo.MongoClient();

setupEventHandlers();
Bot.guildPlayers = new Map<bigint, lavadeno.Player>();
Bot.guildCurrentTrack = new Map<bigint, SongInfo>();
Bot.guildQueues = new Map<bigint, SongInfo[]>();
Bot.guildSelectCollectors = new Map<bigint, SongInfo[]>();
Bot.musicNode = new lavadeno.Cluster({
  nodes: [{
    id: "main",
    host: "lavalink4africa.islantay.tk",
    port: 8880,
    password: "AmeliaWatsonisTheBest**!",
  }],

  sendGatewayPayload: (id: bigint, payload: lavadeno.UpdateVoiceStatus) =>
    sendGatewayPayload(Bot.gateway, id, payload),

  userId: Bot.id,
});

Bot.musicNode
  .on("nodeDisconnect", (node, code, reason) => {
    lavalink.info(
      `[bot] (node ${node.id}) disconnected, code=${code}, reason=${
        reason ? `"${reason}"` : "unknown"
      }`,
    );
  })
  .on("nodeError", (_, error) => {
    void error;
  })
  .on("nodeConnect", (node, reconnect) => {
    lavalink.info(
      `(Node: ${node.id}) ${reconnect ? "re" : ""}connected to node.`,
    );
  });
customizeInteractionTransformer(Bot);
function sendGatewayPayload(
  gateway: discordeno.GatewayManager,
  id: bigint,
  payload: lavadeno.UpdateVoiceStatus,
) {
  const shardId = Number(id >> 22n) % gateway.manager.totalShards;
  if (shardId !== undefined) {
    gateway.manager.shards.find((s) => s.id == shardId)?.send(payload);
  }
}
