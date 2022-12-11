import { Bot } from "@base/CC-OSV-Client.ts";
import { snakelize } from "@utils/snakelize.ts";

export function setVoiceStateUpdateEvent() {
  Bot.events.voiceStateUpdate = function (_, data) {
    Bot.musicNode.handleVoiceUpdate(
      snakelize(data),
    );
  };
}
