import * as discordeno from "@discordeno/bot";

export interface LavalinkConfig {
  host: string;
  port: number;
  password: string;
  secure: boolean;
}

export interface Config {
  token: string;
  spotifyToken: string;
  mongoDbUrl: string;
  description: string;
  prefixes: string[];
  statuses: discordeno.StatusUpdate[];
  lavalink?: LavalinkConfig;
}

function readRequired(name: string): string {
  const value = Deno.env.get(name)?.trim();
  if (!value) {
    throw new Error(`缺少必要環境變數：${name}`);
  }
  return value;
}

function readOptional(name: string): string | undefined {
  const value = Deno.env.get(name)?.trim();
  return value || undefined;
}

function readBoolean(name: string, fallback: boolean): boolean {
  const value = readOptional(name);
  if (!value) return fallback;
  return value.toLowerCase() === "true";
}

const lavalinkHost = readOptional("lavalinkHost");
const lavalinkPort = Number(readOptional("lavalinkPort") ?? "2333");
const lavalink = lavalinkHost
  ? {
    host: lavalinkHost,
    port: Number.isFinite(lavalinkPort) ? lavalinkPort : 2333,
    password: readOptional("lavalinkPassword") ?? "youshallnotpass",
    secure: readBoolean("lavalinkSecure", false),
  }
  : undefined;

export const CCOSVConfig: Config = {
  token: readRequired("discordBotToken"),
  spotifyToken: readOptional("spotifyToken") ?? "",
  mongoDbUrl: readOptional("mongoDbUrl") ?? "",
  description: "A discord bot make with discordeno",
  prefixes: ["B", "b"],
  statuses: [
    {
      activities: [
        {
          name: `正服務 {0} 個伺服器 和 {1} 位使用者`,
          type: discordeno.ActivityTypes.Listening,
        },
      ],
      status: "idle",
    },
    {
      activities: [
        {
          name: "CC-OSV 測試版",
          type: discordeno.ActivityTypes.Watching,
        },
      ],
      status: "idle",
    },
    {
      activities: [
        {
          name: "由 Tab_Etuc#8844 編寫",
          type: discordeno.ActivityTypes.Streaming,
        },
      ],
      status: "idle",
    },
  ],
  lavalink,
};
