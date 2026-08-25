import { Player } from "../lavadeno/src/player.ts";
import { assert, assertEquals } from "./helpers.ts";

Deno.test("Lavadeno Player 的播放、音量、filter 與事件流程", async () => {
  const sent: unknown[] = [];
  const gateway: unknown[] = [];
  const node = {
    userId: 100000000000000010n,
    send: (payload: unknown) => {
      sent.push(payload);
      return Promise.resolve();
    },
    debug: () => undefined,
    sendGatewayPayload: (_id: bigint, payload: unknown) => {
      gateway.push(payload);
    },
  };
  const player = new Player(node as never, 100000000000000011n);

  player.connect(100000000000000012n);
  assertEquals(gateway.length, 1);
  await player.play("track-a");
  await player.stop();
  await player.pause();
  await player.resume();
  await player.seek(12_345);
  await player.setVolume(80);
  assertEquals(player.volume, 80);
  player.setTrackRepeat(true);
  assertEquals(player.trackRepeat, true);
  assertEquals(player.queueRepeat, false);
  player.setTrackRepeat(false);
  assertEquals(player.trackRepeat, false);
  await player.setEqualizer([{ band: 1, gain: 0.5 }]);
  await player.setFilters({ timescale: { speed: 1, rate: 1, pitch: 1 } });
  await player.destroy();
  player.disconnect();
  assert(sent.length >= 8, "Player 沒有發送完整的 Lavalink payload");

  let typeFailed = false;
  try {
    player.setTrackRepeat("true" as never);
  } catch (error) {
    typeFailed = error instanceof TypeError;
  }
  assert(typeFailed, "非 boolean repeat 應失敗");

  let duplicateFailed = false;
  try {
    await player.setEqualizer([{ band: 1, gain: 0 }, { band: 1, gain: 1 }]);
  } catch (error) {
    duplicateFailed = error instanceof Error;
  }
  assert(duplicateFailed, "重複 equalizer band 應失敗");
});

Deno.test("Lavadeno Player voice update 與 track events 會更新狀態", async () => {
  const sent: unknown[] = [];
  const events: string[] = [];
  const node = {
    userId: 100000000000000020n,
    send: (payload: unknown) => {
      sent.push(payload);
      return Promise.resolve();
    },
    debug: () => undefined,
    sendGatewayPayload: () => undefined,
  };
  const player = new Player(node as never, 100000000000000021n);
  player.on("channelJoin", () => events.push("join"));
  player.on("channelLeave", () => events.push("leave"));
  player.on("trackStart", () => events.push("start"));
  player.on("trackEnd", () => events.push("end"));
  await player.handleVoiceUpdate({
    token: "voice-token",
    guild_id: "100000000000000021",
    endpoint: "voice.example",
  });
  await player.handleVoiceUpdate({
    session_id: "session",
    channel_id: "100000000000000022",
    guild_id: "100000000000000021",
    user_id: "100000000000000020",
  });
  assertEquals(player.connected, true);
  assertEquals(player.channelId, 100000000000000022n);
  assert(events.includes("join"), "voice join event 未觸發");
  assert(
    sent.some((payload) => (payload as { op?: string }).op === "voiceUpdate"),
    "voiceUpdate 未送出",
  );
  player.handleEvent({ type: "TrackStartEvent", track: "track-a" } as never);
  assertEquals(player.playing, true);
  assertEquals(player.track, "track-a");
  player.handleEvent(
    { type: "TrackEndEvent", track: "track-a", reason: "finished" } as never,
  );
  assertEquals(player.playing, false);
  assertEquals(player.track, null);
  assert(events.includes("end"), "track end event 未觸發");
  await player.handleVoiceUpdate({
    session_id: "session",
    channel_id: null,
    guild_id: "100000000000000021",
    user_id: "100000000000000020",
  });
  assert(events.includes("leave"), "voice leave event 未觸發");
});
