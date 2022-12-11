import { setInteractionCreateEvent } from "@base/event/interactions/mod.ts";
import { setMessageCreateEvent } from "@base/event/messages/create.ts";
import { setReadyEvent } from "@base/event/ready.ts";
import { setVoiceStateUpdateEvent } from "@base/event/voice/StateUpdate.ts";
import { setVoiceServerUpdateEvent } from "@base/event/voice/ServerUpdate.ts";

export function setupEventHandlers() {
  setInteractionCreateEvent();
  setReadyEvent();
  setMessageCreateEvent();
  setVoiceStateUpdateEvent();
  setVoiceServerUpdateEvent();
}
