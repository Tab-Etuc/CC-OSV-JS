import { addMsgCommand } from "@classes/command.ts";
import { send } from "@utils/send.ts";
import { CCOSVEmbed } from "@classes/embed.ts";

function isValidIp(value: string): boolean {
  const ipv4 = value.split(".");
  if (ipv4.length === 4 && ipv4.every((part) => /^\d{1,3}$/.test(part))) {
    return ipv4.every((part) => Number(part) <= 255);
  }
  return value.includes(":") && /^[0-9a-f:]+$/i.test(value);
}

interface IpInfo {
  ip?: string;
  city?: string;
  region?: string;
  country?: string;
  loc?: string;
  timezone?: string;
  postal?: string;
  error?: boolean;
}

export default addMsgCommand({
  name: "ip",
  mod: "fun",
  description: "查詢 IP 資訊",
  usage: "<IP>",
  aliases: ["ipinfo"],
  requiredArgs: true,
  run: async (bot, message, args) => {
    const ip = args[0];
    if (!ip || !isValidIp(ip)) {
      await send(bot, message.channelId, "請提供有效的 IP 位址。");
      return;
    }
    const response = await fetch(
      `https://ipinfo.io/${encodeURIComponent(ip)}/geo`,
    );
    if (!response.ok) {
      await send(bot, message.channelId, "IP 資訊服務目前無法使用。");
      return;
    }
    const info = await response.json() as IpInfo;
    if (info.error || !info.ip) {
      await send(bot, message.channelId, "找不到此 IP 的資訊。");
      return;
    }
    const embed = new CCOSVEmbed()
      .setTitle(`IP：${info.ip}`)
      .setDesc(
        `城市：${info.city ?? "未知"}\n地區：${info.region ?? "未知"}\n國家：${
          info.country ?? "未知"
        }\n位置：${info.loc ?? "未知"}\n時區：${
          info.timezone ?? "未知"
        }\n郵遞區號：${info.postal ?? "未知"}`,
      );
    await send(bot, message.channelId, embed.build());
  },
});
