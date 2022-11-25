import { config } from "https://deno.land/x/dotenv@v3.2.0/mod.ts";
import { discordeno } from "@deps";
const env = config({ export: true, path: "./.env" });

interface Config {
  token: string;
  ytApiKey: string;
  spotifyToken: string;
  mongoDbUrl: string;
  description: string;
  owners: string[];
  prefixes: string[];
  statuses: discordeno.StatusUpdate[];
}
export const CCOSVConfig: Config = {
  token: env.discordBotToken,
  ytApiKey: env.ytApiKey,
  spotifyToken: env.spotifyToken,
  mongoDbUrl: env.mongoDbUrl,
  description: "A discord bot make with discordeno",
  owners: ["806346991730819121"],
  prefixes: ["B"],
  statuses: [
    {
      activities: [
        {
          name: `正服務 {0} 個伺服器 和 {1} 位使用者`,
          type: discordeno.ActivityTypes.Listening,
          createdAt: Date.now(),
        },
      ],
      status: "idle",
    },
    {
      activities: [
        {
          name: "CC-OSV 測試版",
          type: discordeno.ActivityTypes.Watching,
          createdAt: Date.now(),
        },
      ],
      status: "idle",
    },
    {
      activities: [
        {
          name: "由 CC_#8844 編寫",
          type: discordeno.ActivityTypes.Streaming,
          createdAt: Date.now(),
        },
      ],
      status: "idle",
    },
  ],
};
