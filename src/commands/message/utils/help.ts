import {
  addMsgCommand,
  findMsgCommand,
  globalMsgCommand,
} from "@classes/command.ts";
import { CCOSVEmbed } from "@classes/embed.ts";
import { send } from "@utils/send.ts";
import { avatarURL } from "@utils/avatarURL.ts";

export default addMsgCommand({
  name: "help",
  mod: "utils",
  description: "Show list of avaliable commands",
  aliases: ["h"],
  usage: "[command]",
  run: async (bot, message, args) => {
    const BLACKLIST_COMMAND = ["help", "eval", "unwarnall", "setlevel"];
    if (args[0]?.length > 0) {
      const cmd = findMsgCommand(args[0]);
      if (!cmd) {
        return send(
          bot,
          message.channelId,
          "Cannot find that command",
        ) as unknown as void;
      }
      const cmdE = new CCOSVEmbed().command(cmd);
      send(bot, message.channelId, cmdE);
      return;
    }
    const avatar = await avatarURL(bot, bot.id);
    const em = new CCOSVEmbed().setTitle("Help command").setThumb(avatar);
    const categories = new Set(
      globalMsgCommand.filter((e) => !BLACKLIST_COMMAND.includes(e.name))
        .map(
          (e) => e.mod,
        ),
    );
    for (const name of categories) {
      em.addField(
        `★ ${name.toUpperCase()}`,
        globalMsgCommand.filter((m) =>
          m.mod == name && !BLACKLIST_COMMAND.includes(m.name)
        )
          .map((_, m) => `\`${m}\``).join(", "),
      );
    }
    send(bot, message.channelId, em.build());
  },
});
