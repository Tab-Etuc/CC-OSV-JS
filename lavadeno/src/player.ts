// deno-lint-ignore-file camelcase

import constants from "./util/constants.ts";
import { snowflakeToBigint } from "./util/functions.ts";
import { EventEmitter, Lavalink } from "../deps.ts";

import type { Node, Snowflake } from "./node.ts";

export interface VoiceUpdateData {
  sessionId: string;
  event: VoiceServerEvent;
}

export interface VoiceServerEvent {
  token: string;
  guild_id: string;
  endpoint: string;
}

export class Player<N extends Node = Node> extends EventEmitter<PlayerEvents> {
  readonly node: N;
  readonly guildId: bigint;

  /**
   * ID of the voice channel we're connected to, or null if we're not connected to anything.
   */
  channelId: bigint | null = null;

  /**
   * The position of the current track, or null if nothing is playing.
   */
  position: number | null = null;

  /**
   * The track that is currently playing, or null if nothing is playing.
   */
  track: string | null = null;

  /**
   * Whether the queue repeats the track.
   */
  trackRepeat = false;

  /**
   * Whether the queue repeats the queue.
   */
  queueRepeat = false;

  /**
   * Whether a track is currently playing.
   */
  playing = false;

  /**
   * Timestamp of when the player started playing, or null if nothing is playing.
   */
  playingSince: number | null = null;

  /**
   * Whether playback is paused.
   */
  paused = false;

  /**
   * Whether we're connected to a voice channel.
   */
  connected = false;

  /**
   * The filters that are currently configured.
   */
  filters: Partial<Lavalink.FilterData> = {};

  #_voiceUpdate: Partial<VoiceUpdateData> = {};
  #_volume = 100;

  constructor(node: N, guildId: bigint) {
    super(constants.maxEvents);

    this.node = node;
    this.guildId = guildId;
  }

  /**
   * The volume of this player.
   */
  get volume() {
    return constants.useFilters
      ? (this.filters.volume ?? 1) * 100
      : this.#_volume;
  }

  /**
   * Connects to the supplied VC or disconnects from the current VC.
   * @param channel ID of the VC to connect to, or null to disconnect.
   * @param options Connect options.
   * @returns the player, useful for chaining.
   */
  connect(
    channel: Snowflake | { id: Snowflake } | null,
    options: ConnectOptions = {},
  ): this {
    this.#_voiceUpdate = {};

    /* parse the snowflake. */
    channel = (typeof channel === "object" ? channel?.id : channel) ?? null;

    /* send the voice status update payload. */
    this.node.debug(
      "voice",
      `updating voice status in guild=${this.guildId}, channel=${channel}`,
      this,
    );

    this.node.sendGatewayPayload(this.guildId, {
      op: 4,
      d: {
        guild_id: `${this.guildId}`,
        channel_id: channel ? `${channel}` : null,
        self_mute: options.muted ?? false,
        self_deaf: options.deafen ?? false,
      },
    });

    return this;
  }

  /**
   * Disconnects from the current voice channel.
   * @returns the player, useful for chaining.
   */
  disconnect(): this {
    this.connect(null);
    this.channelId = null;
    return this;
  }

  /**
   * Plays the specified track.
   * @param track Track to play.
   * @param options Options for track playback.
   * @returns the player, useful for chaining?
   */
  async play(
    track: string | { track: string },
    options: PlayOptions = {},
  ): Promise<this> {
    await this.node.send({
      op: "play",
      track: typeof track === "string" ? track : track.track,
      guildId: `${this.guildId}`,
      ...options,
    });

    return this;
  }

  /**
   * Stops the current track.
   * @returns the player, useful for chaining?
   */
  async stop(): Promise<this> {
    await this.node.send({ op: "stop", guildId: `${this.guildId}` });
    return this;
  }

  /**
   * Configures the pause state of the player.
   * @param state The pause state.
   * @returns the player, useful for chaining?
   */
  async pause(state = true): Promise<this> {
    this.paused = state;
    await this.node.send({
      op: "pause",
      guildId: `${this.guildId}`,
      pause: state,
    });

    return this;
  }

  /**
   * Resumes playback
   * @returns the player, useful for chaining?
   */
  resume(): Promise<this> {
    return this.pause(false);
  }

  /**
   * Seeks to a position in the player.
   * @param to Position to seek to, in milliseconds.
   * @returns the player, useful for chaining?
   */
  async seek(to: number): Promise<this> {
    await this.node.send({
      op: "seek",
      guildId: `${this.guildId}`,
      position: to,
    });

    return this;
  }

  /**
   * Destroys this player.
   * @returns the player, useful for chaining?
   */
  async destroy(): Promise<this> {
    await this.node.send({ op: "destroy", guildId: `${this.guildId}` });
    return this;
  }

  /**
   * Changes the current volume of the player.
   * @param volume The volume to use.
   * @returns the player, useful for chaining?
   */
  async setVolume(volume = 100): Promise<this> {
    if (constants.useFilters) {
      await this.setFilters(
        Lavalink.Filter.Volume,
        volume > 1 ? volume / 100 : volume,
      );
    } else {
      await this.node.send({
        op: "volume",
        guildId: this.guildId.toString(),
        volume,
      });
      this.#_volume = volume;
    }

    return this;
  }

  /**
   * Sets the track repeat.
   * @param repeat
   */
  setTrackRepeat(repeat: boolean): this {
    if (typeof repeat !== "boolean") {
      throw new TypeError('Repeat can only be "true" or "false".');
    }

    if (repeat) {
      this.trackRepeat = true;
      this.queueRepeat = false;
    } else {
      this.trackRepeat = false;
      this.queueRepeat = false;
    }

    return this;
  }

  /**
   * Configures the equalizer for this player.
   * @param bands The gains to use, the element index is used as the band number.
   * @returns the player, useful for chaining?
   */
  setEqualizer(gains: number[]): Promise<this>;

  /**
   * Configures the equalizer for this player.
   * @param bands The gains to use, the element index is used as the band number.
   * @returns the player, useful for chaining?
   */
  setEqualizer(...gains: number[]): Promise<this>;

  /**
   * Configures the equalizer for this player.
   * @param bands The band objects to use.
   * @returns the player, useful for chaining?
   */
  setEqualizer(bands: Lavalink.EqualizerBand[]): Promise<this>;

  /**
   * Configures the equalizer for this player.
   * @param bands The band objects to use.
   * @returns the player, useful for chaining?
   */
  setEqualizer(...bands: Lavalink.EqualizerBand[]): Promise<this>;
  async setEqualizer(
    arg0: number | Lavalink.EqualizerBand | (Lavalink.EqualizerBand | number)[],
    ...arg1: (number | Lavalink.EqualizerBand)[]
  ): Promise<this> {
    const bands: Lavalink.EqualizerBand[] = [];
    if (Array.isArray(arg0)) {
      arg0.forEach((value, index) => {
        bands.push(
          typeof value === "number" ? { gain: value, band: index } : value,
        );
      });
    } else {
      bands.push(typeof arg0 === "number" ? { gain: arg0, band: 0 } : arg0);
      arg1.forEach((value) => {
        const band = typeof value === "number"
          ? { gain: value, band: bands.length }
          : value;
        bands.push(band);
      });
    }

    const duplicateBand = bands.find(
      (a) => bands.filter((b) => a.band === b.band).length > 1,
    )?.band;
    if (duplicateBand) {
      throw new Error(`Band ${duplicateBand} is duplicated 1 or more times.`);
    }

    /* apply the equalizer */
    (await constants.useFilters)
      ? this.setFilters(Lavalink.Filter.Equalizer, bands)
      : this.node.send({
        op: "equalizer",
        guildId: `${this.guildId}`,
        bands,
      });

    return this;
  }

  /**
   * Applies the currently configured filters.
   * @returns the player, useful for chaining?
   */
  setFilters(): Promise<this>;

  /**
   * Overwrites the currently configured filters.
   * @param filters The filters to apply.
   * @returns the player, useful for chaining?
   */

  setFilters(filters: Partial<Lavalink.FilterData>): Promise<this>;

  /**
   * Configures the specified filter.
   * @param filter The filter to configure.
   * @param data The filters data.
   */
  setFilters<F extends Lavalink.Filter>(
    filter: F,
    data: Lavalink.FilterData[F],
  ): Promise<this>;
  async setFilters<F extends Lavalink.Filter>(
    arg0?: Partial<Lavalink.FilterData> | F,
    arg1?: Lavalink.FilterData[F],
  ): Promise<this> {
    if (typeof arg0 === "string") {
      this.filters[arg0] = arg1;
    } else if (arg0) {
      this.filters = arg0;
    }

    await this.node.send({
      op: "filters",
      guildId: `${this.guildId}`,
      ...this.filters,
    });

    return this;
  }

  /**
   * Handles a discord voice state or server update.
   * @param update The voice server or state update that the discord gateway sent.
   */
  async handleVoiceUpdate(
    update: DiscordVoiceState | DiscordVoiceServer,
  ): Promise<this> {
    /* update our local voice state or server data. */
    if ("token" in update) {
      if (this.#_voiceUpdate.event === update) {
        return this;
      }

      this.#_voiceUpdate.event = update;
    } else {
      /* check if this voice state is for us and not some random user. */
      if (snowflakeToBigint(update.user_id) !== this.node.userId) {
        return this;
      }

      const channel = snowflakeToBigint(update.channel_id!);
      if (!channel && this.channelId) {
        this.emit("channelLeave", this.channelId);
        this.channelId = null;
        this.#_voiceUpdate = {};
      } else if (channel && !this.channelId) {
        this.channelId = channel;
        this.emit("channelJoin", channel);
      } else if (channel !== this.channelId) {
        this.emit("channelMove", this.channelId!, channel);
        this.channelId = channel;
      }

      this.#_voiceUpdate.sessionId = update.session_id;
    }

    /* check if we have everything. */
    if (this.#_voiceUpdate.event && this.#_voiceUpdate.sessionId) {
      /* send the voice update to the node. */
      this.node.debug("voice", "submitting voice update", this);
      this.#_voiceUpdate.event.guild_id = this.#_voiceUpdate.event.guild_id
        .toString();
      await this.node.send({
        op: "voiceUpdate",
        guildId: `${this.guildId}`,
        ...(this.#_voiceUpdate as Lavalink.VoiceUpdateData),
      });

      this.connected = true;
    }

    return this;
  }

  /**
   * Handles any player event sent by the lavalink node.
   * @param event The received player event.
   */
  handleEvent(event: Lavalink.PlayerEvent) {
    switch (event.type) {
      case "TrackStartEvent":
        this.playing = true;
        this.playingSince = Date.now();
        this.track = event.track;
        this.emit("trackStart", event.track);
        break;
      case "TrackEndEvent":
        if (event.reason !== Lavalink.TrackEndReason.Replaced) {
          this.playing = false;
          this.playingSince = null;
        }
        this.track = null;
        this.emit("trackEnd", event.track, event.reason);
        break;
      case "TrackStuckEvent":
        this.emit("trackStuck", event.track, event.thresholdMs);
        break;
      case "TrackExceptionEvent":
        this.emit("trackException", event.track, new Error(event.error));
        break;
      case "WebSocketClosedEvent":
        this.emit("disconnected", event.code, event.reason, event.byRemote);
        break;
    }
  }
}

export type PlayOptions = Omit<Lavalink.PlayData, "track">;

export type PlayerEvents = {
  trackStart: [track: string | null];
  trackEnd: [track: string | null, reason: Lavalink.TrackEndReason];
  trackException: [track: string | null, error: Error];
  trackStuck: [track: string | null, thresholdMs: number];
  disconnected: [code: number, reason: string, byRemote: boolean];
  channelJoin: [joined: bigint];
  channelLeave: [left: bigint];
  channelMove: [from: bigint, to: bigint];
};

export interface ConnectOptions {
  deafen?: boolean;
  muted?: boolean;
}

export interface DiscordVoiceServer {
  token: string;
  endpoint: string;
  guild_id: `${bigint}`;
}

export interface DiscordVoiceState {
  session_id: string;
  channel_id: `${bigint}` | null;
  guild_id: `${bigint}`;
  user_id: `${bigint}`;
}
