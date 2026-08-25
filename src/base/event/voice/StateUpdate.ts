import { Bot } from "@base/CC-OSV-Client.ts";
import { discordeno } from "@deps";
import { snakelize } from "@utils/snakelize.ts";
import { cacheVoiceState } from "@utils/cache.ts";

export function setVoiceStateUpdateEvent(): void {
  Bot.events.voiceStateUpdate = (rawData) => {
    const data = rawData as unknown as discordeno.VoiceState;
    cacheVoiceState(Bot, data);
    void Bot.musicNode.handleVoiceUpdate(snakelize(data));
  };
}
