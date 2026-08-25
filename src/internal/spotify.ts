import { lavalink } from "@utils/log.ts";

const keyLifetimeSeconds = 3600;
let currentAuthKey = "";
let lastRefresh = 0;

function parseUrl(value: string): URL | undefined {
  try {
    return new URL(value);
  } catch {
    return undefined;
  }
}

export function isSpotifyLink(link: string): boolean {
  const url = parseUrl(link);
  const host = url?.hostname.toLowerCase();
  return Boolean(
    host && (host === "spotify.com" || host.endsWith(".spotify.com")),
  );
}

export function isSpotifyTrack(link: string): boolean {
  return parseUrl(link)?.pathname.split("/").includes("track") ?? false;
}

export function getPlaylistId(link: string): string | undefined {
  const url = parseUrl(link);
  const parts = url?.pathname.split("/").filter(Boolean) ?? [];
  const index = parts.indexOf("playlist");
  return index >= 0 ? parts[index + 1] : undefined;
}

export function getTrackId(link: string): string | undefined {
  const url = parseUrl(link);
  const parts = url?.pathname.split("/").filter(Boolean) ?? [];
  const index = parts.indexOf("track");
  return index >= 0 ? parts[index + 1] : undefined;
}

export async function getAuthCode(
  spotifyToken: string,
): Promise<string | undefined> {
  const elapsed = (Date.now() - lastRefresh) / 1000;
  if (currentAuthKey && elapsed <= keyLifetimeSeconds) return currentAuthKey;

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${spotifyToken}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  if (!response.ok) {
    lavalink.error(`Spotify 授權失敗：${response.status}`);
    return undefined;
  }

  const data = await response.json() as { access_token?: string };
  if (!data.access_token) {
    lavalink.error("Spotify 回應中沒有授權金鑰。");
    return undefined;
  }
  currentAuthKey = data.access_token;
  lastRefresh = Date.now();
  return currentAuthKey;
}

interface SpotifyTrack {
  name?: string;
  artists?: { name?: string }[];
}

interface PlaylistTracksResponse {
  items?: { track?: SpotifyTrack | null }[];
  next?: string | null;
}

function toQuery(track: SpotifyTrack | null | undefined): string | undefined {
  if (!track?.name) return undefined;
  const artists = (track.artists ?? [])
    .map((artist) => artist.name)
    .filter((name): name is string => Boolean(name));
  return `${artists.join(" ")} - ${track.name}`;
}

async function fetchSpotify(
  url: string,
  key: string,
): Promise<Response | undefined> {
  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${key}`,
    },
  });
  if (!response.ok) {
    lavalink.error(`Spotify API 回應失敗：${response.status}`);
    return undefined;
  }
  return response;
}

/** 取得單曲或播放清單的搜尋字串，播放清單會逐頁讀取。 */
export async function getPlaylistTracks(
  spotifyToken: string,
  playlistId: string,
  isSingle: boolean,
): Promise<string[] | undefined> {
  const key = await getAuthCode(spotifyToken);
  if (!key) return undefined;

  if (isSingle) {
    const response = await fetchSpotify(
      `https://api.spotify.com/v1/tracks/${encodeURIComponent(playlistId)}`,
      key,
    );
    if (!response) return undefined;
    const data = await response.json() as SpotifyTrack;
    const query = toQuery(data);
    return query ? [query] : undefined;
  }

  const queries: string[] = [];
  let nextUrl: string | null = `https://api.spotify.com/v1/playlists/${
    encodeURIComponent(playlistId)
  }/tracks?limit=100`;
  while (nextUrl && queries.length < 500) {
    const response = await fetchSpotify(nextUrl, key);
    if (!response) return undefined;
    const data = await response.json() as PlaylistTracksResponse;
    for (const item of data.items ?? []) {
      const query = toQuery(item.track);
      if (query) queries.push(query);
    }
    nextUrl = data.next ?? null;
  }
  return queries.length > 0 ? queries : undefined;
}
