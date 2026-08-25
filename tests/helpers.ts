import type { BotClient } from "@base/CC-OSV-Client.ts";

export const GUILD_ID = 100000000000000001n;
export const USER_ID = 100000000000000002n;
export const CHANNEL_ID = 100000000000000003n;

export function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

export function assertEquals<T>(
  actual: T,
  expected: T,
  message?: string,
): void {
  if (Object.is(actual, expected)) return;
  throw new Error(
    message ?? `預期 ${String(expected)}，實際 ${String(actual)}`,
  );
}

export function assertDeepEquals(
  actual: unknown,
  expected: unknown,
  message = "值不相等",
): void {
  const stringify = (value: unknown) =>
    JSON.stringify(
      value,
      (_key, item) => typeof item === "bigint" ? `${item}n` : item,
    );
  if (stringify(actual) === stringify(expected)) return;
  throw new Error(
    `${message}：${stringify(actual)} !== ${stringify(expected)}`,
  );
}

export function createFakeBot(): BotClient & {
  sent: Array<{ channelId: bigint; payload: unknown }>;
  edited: Array<{ channelId: bigint; messageId: bigint; payload: unknown }>;
  deleted: Array<{ channelId: bigint; messageId: bigint }>;
} {
  const sent: Array<{ channelId: bigint; payload: unknown }> = [];
  const edited: Array<
    { channelId: bigint; messageId: bigint; payload: unknown }
  > = [];
  const deleted: Array<{ channelId: bigint; messageId: bigint }> = [];
  const bot = {
    id: 100000000000000004n,
    users: new Map(),
    guilds: new Map(),
    channels: new Map(),
    voiceStates: new Map(),
    guildPlayers: new Map(),
    guildCurrentTrack: new Map(),
    guildHistory: new Map(),
    guildQueues: new Map(),
    guildSelectCollectors: new Map(),
    guildPlaybackChannels: new Map(),
    helpers: {
      sendMessage: (channelId: bigint, payload: unknown) => {
        sent.push({ channelId, payload });
        return Promise.resolve({
          id: 100000000000000005n,
          channelId,
          ...payload as object,
        });
      },
      editMessage: (
        channelId: bigint,
        messageId: bigint,
        payload: unknown,
      ) => {
        edited.push({ channelId, messageId, payload });
        return Promise.resolve({
          id: messageId,
          channelId,
          ...payload as object,
        });
      },
      deleteMessage: (channelId: bigint, messageId: bigint) => {
        deleted.push({ channelId, messageId });
        return Promise.resolve();
      },
      getUser: () => Promise.resolve(undefined),
      getChannel: () => Promise.resolve(undefined),
    },
    musicNode: {
      idealNodes: [],
      createPlayer: () => undefined,
      destroyPlayer: () => true,
    },
    sent,
    edited,
    deleted,
  } as unknown as BotClient & {
    sent: Array<{ channelId: bigint; payload: unknown }>;
    edited: Array<{ channelId: bigint; messageId: bigint; payload: unknown }>;
    deleted: Array<{ channelId: bigint; messageId: bigint }>;
  };
  return bot;
}

export function createFakePlayer(overrides: Record<string, unknown> = {}) {
  const calls: Array<{ method: string; args: unknown[] }> = [];
  const player = {
    channelId: CHANNEL_ID as bigint | null,
    connected: true,
    paused: false,
    track: "encoded-track",
    trackRepeat: false,
    queueRepeat: false,
    volume: 100,
    filters: {},
    calls,
    connect(channelId: bigint) {
      calls.push({ method: "connect", args: [channelId] });
      this.channelId = channelId;
      this.connected = true;
      return this;
    },
    disconnect() {
      calls.push({ method: "disconnect", args: [] });
      this.channelId = null;
      this.connected = false;
      return this;
    },
    pause(value: boolean) {
      calls.push({ method: "pause", args: [value] });
      this.paused = value;
      return Promise.resolve(this);
    },
    play(track: string) {
      calls.push({ method: "play", args: [track] });
      this.track = track;
      return Promise.resolve(this);
    },
    once(event: string, listener: (...args: unknown[]) => unknown) {
      calls.push({ method: "once", args: [event, listener] });
      return this;
    },
    resume() {
      calls.push({ method: "resume", args: [] });
      this.paused = false;
      return Promise.resolve(this);
    },
    stop() {
      calls.push({ method: "stop", args: [] });
      return Promise.resolve(this);
    },
    seek(position: number) {
      calls.push({ method: "seek", args: [position] });
      return Promise.resolve(this);
    },
    setVolume(value: number) {
      calls.push({ method: "setVolume", args: [value] });
      this.volume = value;
      return Promise.resolve(this);
    },
    setTrackRepeat(value: boolean) {
      calls.push({ method: "setTrackRepeat", args: [value] });
      this.trackRepeat = value;
      if (value) this.queueRepeat = false;
      return this;
    },
    setEqualizer(value: unknown) {
      calls.push({ method: "setEqualizer", args: [value] });
      return Promise.resolve(this);
    },
    setFilters() {
      calls.push({ method: "setFilters", args: [] });
      return Promise.resolve(this);
    },
    ...overrides,
  };
  return player as typeof player & { channelId: bigint | null };
}

export function createFakeMessage(content = "") {
  return {
    id: 100000000000000006n,
    channelId: CHANNEL_ID,
    guildId: GUILD_ID,
    content,
    author: { id: USER_ID, username: "tester", globalName: "Tester" },
    timestamp: Date.now(),
  } as never;
}

export function createFakeInteraction(name: string, options: unknown[] = []) {
  const responses: unknown[] = [];
  const edits: unknown[] = [];
  const interaction = {
    id: 100000000000000007n,
    guildId: GUILD_ID,
    channelId: CHANNEL_ID,
    member: { id: USER_ID },
    user: { id: USER_ID },
    data: { name, options },
    acknowledged: false,
    responses,
    edits,
    respond(value: unknown) {
      responses.push(value);
      return Promise.resolve(value);
    },
    edit(value: unknown) {
      edits.push(value);
      return Promise.resolve(value);
    },
    defer() {
      interaction.acknowledged = true;
      return Promise.resolve();
    },
    deferEdit() {
      interaction.acknowledged = true;
      return Promise.resolve();
    },
  };
  return interaction as never;
}
