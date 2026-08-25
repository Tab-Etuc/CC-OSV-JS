import {
  getAuthCode,
  getPlaylistId,
  getPlaylistTracks,
  getTrackId,
  isSpotifyLink,
  isSpotifyTrack,
} from "@internal/spotify.ts";
import { isYoutubeLink } from "@internal/ytreqs.ts";
import { REST } from "../lavadeno/src/rest.ts";
import { Node } from "../lavadeno/src/node.ts";
import { Cluster } from "../lavadeno/src/cluster.ts";
import { Connection } from "../lavadeno/src/connection.ts";
import { backoff } from "../lavadeno/src/util/backoff.ts";
import { delay, snowflakeToBigint } from "../lavadeno/src/util/functions.ts";
import { NodeState } from "../lavadeno/src/util/nodestate.ts";
import { assert, assertDeepEquals, assertEquals } from "./helpers.ts";

Deno.test("Spotify 與 YouTube URL parser 會拒絕相似惡意網域", () => {
  assert(
    isSpotifyLink("https://open.spotify.com/track/abc"),
    "Spotify track 應通過",
  );
  assert(
    !isSpotifyLink("https://spotify.com.evil.example/track/abc"),
    "惡意 Spotify 網域不應通過",
  );
  assert(
    isSpotifyTrack("https://open.spotify.com/track/abc"),
    "track path 應通過",
  );
  assertEquals(getTrackId("https://open.spotify.com/track/abc"), "abc");
  assertEquals(getPlaylistId("https://open.spotify.com/playlist/xyz"), "xyz");
  assert(
    isYoutubeLink("https://www.youtube.com/watch?v=abc"),
    "YouTube 應通過",
  );
  assert(isYoutubeLink("https://youtu.be/abc"), "youtu.be 應通過");
  assert(
    !isYoutubeLink("https://youtube.com.evil.example/watch?v=abc"),
    "惡意 YouTube 網域不應通過",
  );
});

Deno.test("Spotify API 可以用 mock fetch 測試授權、單曲與播放清單", async () => {
  const originalFetch = globalThis.fetch;
  const urls: string[] = [];
  globalThis.fetch = (input) => {
    const url = String(input);
    urls.push(url);
    if (url.includes("accounts.spotify.com")) {
      return Promise.resolve(
        new Response(JSON.stringify({ access_token: "test-access" }), {
          status: 200,
        }),
      );
    }
    if (url.includes("/tracks/")) {
      return Promise.resolve(
        new Response(
          JSON.stringify({
            name: "Song",
            artists: [{ name: "Artist" }],
          }),
          { status: 200 },
        ),
      );
    }
    return Promise.resolve(
      new Response(
        JSON.stringify({
          items: [
            { track: { name: "One", artists: [{ name: "A" }] } },
            { track: null },
          ],
          next: null,
        }),
        { status: 200 },
      ),
    );
  };
  try {
    assertEquals(await getAuthCode("token"), "test-access");
    assertDeepEquals(await getPlaylistTracks("token", "track-id", true), [
      "Artist - Song",
    ]);
    assertDeepEquals(await getPlaylistTracks("token", "playlist-id", false), [
      "A - One",
    ]);
    assert(
      urls.some((url) => url.includes("playlist-id")),
      "播放清單 API 未被呼叫",
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
});

Deno.test("Lavalink REST 會正確組 URL、授權標頭並統計請求", async () => {
  const originalFetch = globalThis.fetch;
  let request: Request | undefined;
  globalThis.fetch = (input, init) => {
    request = new Request(input, init);
    return Promise.resolve(
      new Response(JSON.stringify({ loadType: "empty", tracks: [] }), {
        status: 200,
      }),
    );
  };
  const node = {
    connection: {
      info: {
        secure: true,
        address: "lavalink.example:443",
        password: "secret",
      },
      address: "lavalink.example:443",
    },
    debug: () => undefined,
  };
  try {
    const rest = new REST(node as never);
    const response = await rest.loadTracks("ytsearch:hello world");
    assertEquals(response.loadType, "empty");
    assertEquals(rest.requests, 1);
    assertEquals(
      request?.url,
      "https://lavalink.example/loadtracks?identifier=ytsearch%3Ahello%20world",
    );
    assertEquals(request?.headers.get("Authorization"), "secret");
  } finally {
    globalThis.fetch = originalFetch;
  }
});

Deno.test("Lavalink utility 函式與狀態列舉", async () => {
  const next = backoff({ initialDelay: 10, maxDelay: 25 });
  assertEquals(next(), 10);
  assertEquals(next(), 20);
  assertEquals(next(), 25);
  assertEquals(snowflakeToBigint("123"), 123n);
  assertEquals(snowflakeToBigint(456n), 456n);
  assertEquals(NodeState.Idle, 0);
  await delay(0);
});

Deno.test("Lavadeno Node、Cluster 與 Connection 基本狀態可建立", () => {
  assertEquals(Connection.getReconnectOptions("basic")?.type, "basic");
  assertEquals(
    Connection.getReconnectOptions("exponential")?.type,
    "exponential",
  );
  const basic = Connection.getReconnectOptions({
    type: "basic",
    delay: 5,
    tries: 1,
  });
  assert(basic?.type === "basic", "basic reconnect 設定未建立");
  assertEquals(basic.delay, 5);

  const node = new Node({
    connection: { host: "localhost", port: 2333, password: "x", secure: false },
    sendGatewayPayload: () => undefined,
    userId: 100000000000000040n,
  });
  assertEquals(node.connection.address, "localhost:2333");
  assertEquals(node.connected, false);
  assert(node.penalties >= 0, "Node penalty 應可計算");
  assertEquals(
    node.createPlayer(100000000000000041n),
    node.players.get(100000000000000041n),
  );

  const cluster = new Cluster({
    nodes: [],
    sendGatewayPayload: () => undefined,
  });
  assertEquals(cluster.idealNodes.length, 0);
  assertEquals(cluster.players.size, 0);
  let restFailed = false;
  try {
    cluster.rest;
  } catch (error) {
    restFailed = error instanceof Error;
  }
  assert(restFailed, "沒有節點時 rest 應失敗");
});
