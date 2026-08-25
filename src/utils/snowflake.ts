import { SnowflakeError } from "@const/errors.ts";

export function snowflake(DiscordID: string | bigint): Date {
  const raw = DiscordID.toString();
  if (!/^\d{17,19}$/.test(raw)) {
    throw new SnowflakeError("Invalid ID");
  }
  return new Date(snowflakeToTimestamp(BigInt(raw)));
}

export function snowflakeToTimestamp(id: bigint) {
  return Number(id / 4194304n + 1420070400000n);
}

export function createdAt(DiscordID: bigint): string {
  return snowflake(DiscordID).toLocaleString("zh-TW");
}
