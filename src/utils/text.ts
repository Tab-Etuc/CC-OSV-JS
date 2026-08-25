/** 移除 Discord 自訂 emoji、emoji short code 與 Unicode emoji。 */
export function stripEmoji(value: string): string {
  return value
    .replace(/<a?:[\w+\-~]+:\d+>/g, "")
    .replace(/:[a-zA-Z0-9_+\-]+:/g, "")
    .replace(/[#*0-9]\uFE0F?\u20E3/gu, "")
    .replace(
      /[\p{Extended_Pictographic}\p{Regional_Indicator}\uFE0F\u200D]/gu,
      "",
    )
    .replace(/ {2,}/g, " ")
    .trim();
}

function sanitizeValue(value: unknown): unknown {
  if (typeof value === "string") return stripEmoji(value);
  if (Array.isArray(value)) return value.map(sanitizeValue);
  if (!value || typeof value !== "object") return value;

  return Object.fromEntries(
    Object.entries(value).map(([key, item]) => [key, sanitizeValue(item)]),
  );
}

export function sanitizeMessage<T>(value: T): T {
  return sanitizeValue(value) as T;
}
