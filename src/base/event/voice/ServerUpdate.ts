import { Bot } from "@base/CC-OSV-Client.ts";
import { lavadeno } from "@deps";
import { snakelize } from "@utils/snakelize.ts";

export function setVoiceServerUpdateEvent(): void {
  Bot.events.voiceServerUpdate = (rawData) => {
    const data = rawData as unknown as lavadeno.DiscordVoiceServer;
    void Bot.musicNode.handleVoiceUpdate(snakelize(data));
  };
}
