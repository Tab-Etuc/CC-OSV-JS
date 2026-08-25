function parseUrl(value: string): URL | undefined {
  try {
    return new URL(value);
  } catch {
    return undefined;
  }
}

function isYoutubeHost(hostname: string): boolean {
  const host = hostname.toLowerCase();
  return host === "youtu.be" || host === "youtube.com" ||
    host.endsWith(".youtube.com");
}

export function isYoutubeLink(link: string): boolean {
  const url = parseUrl(link);
  return Boolean(url && isYoutubeHost(url.hostname));
}
