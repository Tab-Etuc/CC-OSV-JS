import { Bot } from "@base/CC-OSV-Client.ts";
import { snakelize } from "@utils/snakelize.ts";

export function setVoiceServerUpdateEvent() {
  Bot.events.voiceServerUpdate = function (_, data) {
    Bot.musicNode.handleVoiceUpdate(
      snakelize(data),
    );
  };
}
