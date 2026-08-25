import { discordeno } from "@deps";
import { BotClient } from "@base/CC-OSV-Client.ts";
import { enqueueMusic } from "@services/music.ts";

export async function executeSelectMenu(
  bot: BotClient,
  interaction: discordeno.Interaction,
): Promise<void> {
  const customId = interaction.data?.customId;
  const value = interaction.data?.values?.[0];
  if (
    !customId || value === undefined || !customId.startsWith("music-select:")
  ) return;

  const [, guildText, userText] = customId.split(":");
  const guildId = BigInt(guildText ?? "0");
  const userId = BigInt(userText ?? "0");
  const selectedUser = interaction.member?.id ?? interaction.user?.id;
  if (selectedUser !== userId) {
    await interaction.respond("這個歌曲選單不是給你使用的。");
    return;
  }

  const songs = bot.guildSelectCollectors.get(customId);
  const position = Number(value);
  const song = songs?.[position];
  const player = bot.guildPlayers.get(guildId);
  if (!songs || !song || !player || !interaction.channelId) {
    bot.guildSelectCollectors.delete(customId);
    await interaction.respond("歌曲選擇已失效，請重新搜尋。");
    return;
  }

  bot.guildSelectCollectors.delete(customId);
  await interaction.deferEdit();
  await enqueueMusic(bot, guildId, interaction.channelId, [song], player);
  await bot.helpers.editMessage(
    interaction.channelId,
    interaction.message?.id ?? 0n,
    {
      content: `已加入歌曲：${song.title}`,
      components: [],
    },
  );
}
