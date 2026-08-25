import { discordeno } from "@deps";
import { BotClient } from "@base/CC-OSV-Client.ts";
import { getVoiceState } from "@utils/cache.ts";
import {
  buildPlayerComponents,
  clearMusic,
  queueMusic,
  seekMusic,
  setMusicLoop,
  shuffleMusic,
  skipCurrentMusic,
  stopMusic,
  togglePauseMusic,
} from "@services/musicCommands.ts";

export async function executeButtonClick(
  bot: BotClient,
  interaction: discordeno.Interaction,
): Promise<void> {
  const customId = interaction.data?.customId;
  const messageId = interaction.message?.id;
  if (!customId || !interaction.channelId || !messageId) return;

  if (customId === "deleteMsg") {
    await interaction.deferEdit();
    await bot.helpers.deleteMessage(interaction.channelId, messageId);
    return;
  }

  if (customId === "cancelPlay") {
    await interaction.deferEdit();
    await bot.helpers.editMessage(interaction.channelId, messageId, {
      content: "操作已取消。",
      components: [],
    });
    return;
  }

  if (!customId.startsWith("music:")) return;
  const guildId = interaction.guildId;
  const userId = interaction.member?.id ?? interaction.user?.id;
  if (!guildId || !userId) return;

  const player = bot.guildPlayers.get(guildId);
  if (!player) {
    await interaction.respond("目前沒有播放中的歌曲。");
    return;
  }
  const voiceChannel = getVoiceState(bot, guildId, userId)?.channelId;
  if (player.channelId && voiceChannel !== player.channelId) {
    await interaction.respond("你必須和機器人在同一個語音頻道才能操作。");
    return;
  }

  let response: string;
  switch (customId) {
    case "music:pause":
      response = await togglePauseMusic(bot, guildId);
      break;
    case "music:skip":
      response = await skipCurrentMusic(bot, guildId);
      break;
    case "music:shuffle":
      response = shuffleMusic(bot, guildId);
      break;
    case "music:loop":
      response = setMusicLoop(bot, guildId);
      break;
    case "music:stop":
      response = await stopMusic(bot, guildId);
      break;
    case "music:clear":
      response = clearMusic(bot, guildId);
      break;
    case "music:queue":
      {
        const queue = queueMusic(bot, guildId);
        await interaction.respond(
          typeof queue === "string" ? queue : { embeds: queue },
        );
      }
      return;
    case "music:seek0":
      response = await seekMusic(bot, guildId, "0");
      break;
    default:
      return;
  }

  await interaction.respond(response);
  if (interaction.channelId && messageId && customId !== "music:stop") {
    await bot.helpers.editMessage(interaction.channelId, messageId, {
      components: buildPlayerComponents(bot, guildId),
    }).catch(() => undefined);
  }
}
