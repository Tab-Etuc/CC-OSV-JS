import { lavalink } from "@utils/log.ts";
// Finds ALL songs in a given playlist

export function isYoutubeLink(link: string): boolean {
  const regex = /(youtube\.com|youtu\.?be)\//gm;
  return regex.test(link);
}

export function getVideoId(link: string): string | undefined {
  const regex1 = /youtube\.com\/\w+\?v=([^&]+)/gm;
  const regex2 = /youtu\.?be\/([^&]+)/gm;
  const matches1 = regex1.exec(link);
  const matches2 = regex2.exec(link);
  if (!matches1 || !matches1[1]) {
    if (!matches2 || !matches2[1]) {
      return undefined;
    } else {
      return matches2[1].toString();
    }
  } else {
    return matches1[1].toString();
  }
}

export function getPlaylistId(link: string): string | undefined {
  const regex = /&?list=([^&]+)/gm;
  const matches = regex.exec(link);
  if (!matches || !matches[1]) {
    return undefined;
  } else {
    return matches[1].toString();
  }
}

export async function getPlaylistVideos(
  apiKey: string,
  playlistId: string,
): Promise<string[] | undefined> {
  const endpoint =
    `https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${apiKey}`;

  const response = await fetch(endpoint);
  const json = await response.json();

  if (!json) {
    return undefined;
  } else {
    const ids: string[] = [];

    if (json.error) {
      lavalink.error(`ERROR: ${json.error.code}: ${json.error.message}`);
      return undefined;
    }

    for (const item of json.items) {
      ids.push(item.snippet.resourceId.videoId);
    }

    if (json.pageInfo.totalResults <= 50) {
      return ids;
    }

    let nextPageToken = json.nextPageToken;

    if (nextPageToken) {
      let pageData = json.items;

      if (!pageData) {
        return undefined;
      }

      do {
        // Request again, with the next page token
        const nextPageEndpoint =
          `https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&pageToken=${nextPageToken}&key=${apiKey}`;

        const nextPageData = await fetch(nextPageEndpoint);
        const nextPageJson = await nextPageData.json();

        if (!nextPageJson) {
          lavalink.error("next page is null!");
          break;
        }

        pageData = nextPageJson.items;
        nextPageToken = nextPageJson.nextPageToken;

        for (const item of pageData) {
          ids.push(item.snippet.resourceId.videoId);
        }
      } while (nextPageToken);
    } else {
      for (const item of json.items) {
        ids.push(item.snippet.resourceId.videoId);
      }
    }

    return ids;
  }
}
