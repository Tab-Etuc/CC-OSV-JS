import { BotClient } from "@base/CC-OSV-Client.ts";
import { discordeno, lavadeno } from "@deps";
import { CCOSVEmbed } from "@classes/embed.ts";
import { send } from "@utils/send.ts";
import * as YtAPI from "@internal/ytreqs.ts";
import { lavalink } from "@utils/log.ts";

export async function playQueueUntilEnd(
  bot: BotClient,
  channelId: bigint,
  player: lavadeno.Player,
  guildId: bigint,
  deleteMsg: discordeno.Message | undefined,
) {
  deleteMsg && bot.helpers.deleteMessage(deleteMsg.channelId, deleteMsg.id);
  const queue = bot.guildQueues.get(guildId);
  if (!queue || queue.length === 0) {
    const em = new CCOSVEmbed()
      .setDesc(":x: Something went wrong...")
      .build();
    send(bot, channelId, em);
    return;
  }

  try {
    const connection = await player.play(queue[0].track);

    const link = YtAPI.getVideoId(queue[0].link) || queue[0].link;
    const em = new CCOSVEmbed()
      .setDesc(
        `<a:loading:1034440004098863104>  [Now Playing: ${
          queue[0].title
        }](https://www.youtube.com/watch?v=${link}}) [<@${queue[0].queued}>]`,
      )
      .build();
    send(bot, channelId, em);
    bot.guildCurrentTrack.set(guildId, queue[0]);

    connection
      .once("trackEnd", async () => {
        const queue = bot.guildQueues.get(guildId);
        if (!queue) {
          const em = new CCOSVEmbed()
            .setDesc(":x: Something went wrong...")
            .build();
          send(bot, channelId, em);
          return;
        }
        // If we have no more songs, and not loop mode, end the queue
        if (player.trackRepeat) {
          await playQueueUntilEnd(bot, channelId, player, guildId, undefined);
          return;
        } else {
          queue.shift();
        }
        if (queue.length < 1) {
          const em = new CCOSVEmbed()
            .setDesc(":white_check_mark: Finished the queue!")
            .build();
          send(bot, channelId, em);

          player.disconnect();
          bot.guildQueues.delete(guildId);
        } else {
          // Recursively play until we're done
          await playQueueUntilEnd(bot, channelId, player, guildId, undefined);
        }
      });
  } catch (err) {
    lavalink.error("Player failed to play (abrupt stop?): " + err);
    player.disconnect();
    bot.musicNode.destroyPlayer(guildId);
  }
}
