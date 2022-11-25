import { BotClient, MongoDB } from "@base/CC-OSV-Client.ts";
import { checkGuildData } from "@base/database.ts";
import { discordeno } from "@deps";
import { CCOSVEmbed } from "@classes/embed.ts";
import { COLORS } from "@const/colors.ts";

export async function chatLevelSystem(
  bot: BotClient,
  message: discordeno.Message,
) {
  const db = MongoDB.database("Beta"),
    Users = db.collection("Users"),
    user = await Users.findOne({
      _id: message.authorId.toString(),
      GuildId: message.guildId!.toString(),
    });
  if (!user) return checkGuildData(message.guildId!, message.authorId);
  const addedXp = Math.floor(Math.random() * 4 + 1),
    xpToLevel = user.Level ** 2 + user.Level * Math.abs(100 - user.Level);
  if (user.Xp + addedXp >= xpToLevel) {
    await Users.updateOne(
      {
        _id: message.authorId.toString(),
        GuildId: message.guildId!.toString(),
      },
      {
        $inc: { "Level": 1 },
        $set: { "Xp": user.Xp + addedXp - xpToLevel },
      },
    );
    const Guild = bot.guilds.get(message.guildId!);
    if (!Guild) return;
    const guildIconURL = bot.helpers.getGuildIconURL(
      message.guildId!,
      Guild.icon,
    );
    bot.helpers.sendMessage(message.channelId, {
      embeds: new CCOSVEmbed()
        .setAuthor(Guild.name, guildIconURL).setThumb(
          guildIconURL!,
        )
        .setDesc(
          `恭喜 <@${message.authorId}> 升級
          ʚ・⋯⋯⋯⋯⋯・୨୧・⋯⋯⋯⋯⋯・ɞ
          您現在是等級 **${user.Level + 1}**
          繼續聊天可解鎖更多等級身份
          ʚ・⋯⋯⋯⋯⋯・୨୧・⋯⋯⋯⋯⋯・ɞ`,
        ).setColor(COLORS.BLUE).build(),
    });
  } else {
    await Users.updateOne(
      {
        _id: message.authorId.toString(),
        GuildId: message.guildId!.toString(),
      },
      {
        $inc: { "Xp": addedXp },
      },
    );
  }
}
