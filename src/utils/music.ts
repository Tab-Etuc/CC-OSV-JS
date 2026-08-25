import { BotClient } from "@base/CC-OSV-Client.ts";
import { discordeno, lavadeno } from "@deps";
import { CCOSVEmbed } from "@classes/embed.ts";
import { send } from "@utils/send.ts";

/** 播放目前佇列的第一首歌曲，歌曲結束後自動銜接下一首。 */
export async function playQueueUntilEnd(
  bot: BotClient,
  channelId: bigint,
  player: lavadeno.Player,
  guildId: bigint,
  deleteMsg: discordeno.Message | undefined,
): Promise<void> {
  if (deleteMsg) {
    await bot.helpers.deleteMessage(deleteMsg.channelId, deleteMsg.id).catch(
      () => undefined,
    );
  }

  const queue = bot.guildQueues.get(guildId);
  const current = queue?.[0];
  if (!current) {
    bot.guildCurrentTrack.delete(guildId);
    return;
  }

  try {
    await player.play(current.track);
    bot.guildCurrentTrack.set(guildId, current);
    const history = bot.guildHistory.get(guildId) ?? [];
    if (history.at(-1)?.track !== current.track) {
      history.push(current);
      if (history.length > 25) history.shift();
      bot.guildHistory.set(guildId, history);
    }
    await send(
      bot,
      channelId,
      new CCOSVEmbed().setDesc(`正在播放：[${current.title}](${current.link})`)
        .build(),
    );

    player.once("trackEnd", async () => {
      const activeQueue = bot.guildQueues.get(guildId);
      if (!activeQueue || activeQueue[0] !== current) return;
      if (player.trackRepeat) {
        await playQueueUntilEnd(bot, channelId, player, guildId, undefined);
        return;
      }
      if (player.queueRepeat) {
        const repeated = activeQueue.shift();
        if (repeated) activeQueue.push(repeated);
        await playQueueUntilEnd(bot, channelId, player, guildId, undefined);
        return;
      }
      activeQueue.shift();
      if (activeQueue.length === 0) {
        bot.guildQueues.delete(guildId);
        bot.guildCurrentTrack.delete(guildId);
        player.disconnect();
        await send(bot, channelId, "播放佇列已結束。");
        return;
      }
      await playQueueUntilEnd(bot, channelId, player, guildId, undefined);
    });
  } catch (error) {
    bot.guildCurrentTrack.delete(guildId);
    await send(bot, channelId, "播放歌曲時發生錯誤，已略過此歌曲。").catch(() =>
      undefined
    );
    queue.shift();
    if (queue.length === 0) bot.guildQueues.delete(guildId);
    else await playQueueUntilEnd(bot, channelId, player, guildId, undefined);
    console.error(error);
  }
}
