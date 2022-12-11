import { config } from "https://deno.land/x/dotenv/mod.ts";
import { discordeno } from "@deps";
config({ export: true });

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
  token: Deno.env.get("discordBotToken")!,
  ytApiKey: Deno.env.get("ytApiKey")!,
  spotifyToken: Deno.env.get("spotifyToken")!,
  mongoDbUrl: Deno.env.get("mongoDbUrl")!,
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
          name: "由 Tab_Etuc#8844 編寫",
          type: discordeno.ActivityTypes.Streaming,
          createdAt: Date.now(),
        },
      ],
      status: "idle",
    },
  ],
};
