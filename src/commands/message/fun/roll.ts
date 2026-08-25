import { addMsgCommand } from "@classes/command.ts";
import { send } from "@utils/send.ts";

export function rollDice(
  input: string,
): { total: number; rolls: number[] } | undefined {
  const match = /^(\d{1,2})d(\d{1,4})$/i.exec(input.trim());
  if (!match) return undefined;
  const count = Number(match[1]);
  const sides = Number(match[2]);
  if (count < 1 || count > 20 || sides < 2 || sides > 1000) return undefined;
  const rolls = Array.from(
    { length: count },
    () => Math.floor(Math.random() * sides) + 1,
  );
  return { total: rolls.reduce((sum, value) => sum + value, 0), rolls };
}

export default addMsgCommand({
  name: "roll",
  mod: "fun",
  description: "擲骰子，例如 2d6",
  aliases: ["dice"],
  usage: "[NdM]",
  run: async (bot, message, args) => {
    const result = rollDice(args[0] ?? "1d6");
    if (!result) {
      await send(
        bot,
        message.channelId,
        "格式不正確，請使用 NdM（例如 2d6，最多 20 顆骰子）。",
      );
      return;
    }
    await send(
      bot,
      message.channelId,
      `擲骰結果：${result.rolls.join(", ")}\n總和：${result.total}`,
    );
  },
});
