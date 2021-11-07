const { MessageEmbed } = require('discord.js')
const _ = require('lodash')

module.exports = {
  name: 'queue',
  description: '🎵顯示所有目前播放列中的歌曲',
  usage: '',
  permissions: {
    channel: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'EMBED_LINKS'],
    member: []
  },
  aliases: ['q'],

  /*
    options: [
      {
          name: "page",
          value: "[page]",
          type: 4,
          required: false,
          description: "Enter the page of the queue you would like to view",
      },
  ],
  */
  /**
   * @param {import("../base/CC-OSV-Client")} bot
   * @param {import("discord.js").Message} interaction
   */
  async execute (bot, interaction) {
    await interaction.deferReply()
    try {
      let player = bot.manager.players.get(interaction.guild.id)
      if (!player)
        return bot.say.errorMessage(
          interaction,
          '❌ | **目前沒有播放任何音樂...**'
        )
        const channelId = '851788198467338242';
        const channel = (bot.channels.cache.get(channelId) ||
      (await bot.channels.fetch(channelId)));
    const webhooks = await channel.fetchWebhooks();
    const hook = webhooks.first();

    
  try {
      jsonString = JSON.stringify(player.queue, null, 2);
    } catch {
      jsonString = "";
    }

    if (jsonString?.length >= 4096) {
      jsonString = jsonString ? `${jsonString?.substr(0, 4090)}...` : "";
    }

    const { codeBlock } = require("@discordjs/builders");
    const embed = new MessageEmbed()
      .setTitle("日誌")
      .addField("時間點", bot.logger.now, true)
      .addField("請求數據", codeBlock(jsonString?.substr(0, 1020)))
      .setColor("ORANGE");

    await hook.send({ embeds: [embed] });
      

      if (!player.queue || !player.queue.length || player.queue === 0) {
        let QueueEmbed = new MessageEmbed()
          .setAuthor('目前正在播放', bot.config.IconURL)
          .setColor(bot.config.EmbedColor)
          .setDescription(
            `[${player.queue.current.title}](${player.queue.current.uri})`
          )
          .addField('請求者', `${player.queue.current.requester}`, true)
          .addField(
            '持續時間',
            `${
              bot.ProgressBar(
                player.position,
                player.queue.current.duration,
                15
              ).Bar
            } \`[${bot.ms(player.position, {
              colonNotation: true
            })} / ${bot.ms(player.queue.current.duration, {
              colonNotation: true
            })}]\``
          )
          .setThumbnail(player.queue.current.displayThumbnail())
        return interaction.editReply({ embeds: [QueueEmbed] })
      }

      let Songs = player.queue.map((t, index) => {
        t.index = index
        return t
      })

      let ChunkedSongs = _.chunk(Songs, 10) //How many songs to show per-page

      let Pages = ChunkedSongs.map(Tracks => {
        let SongsDescription = Tracks.map(
          t =>
            `\`${t.index + 1}.\` [${t.title}](${
              t.uri
            }) \n\`${bot.ms(t.duration, {
              colonNotation: true
            })}\` **|** 請求者: ${t.requester}\n`
        ).join('\n')

        let Embed = new MessageEmbed()
          .setAuthor('播放列', bot.config.IconURL)
          .setColor(bot.config.EmbedColor)
          .setDescription(
            `**目前正在播放:** \n[${player.queue.current.title}](${player.queue.current.uri}) \n\n**Up Next:** \n${SongsDescription}\n\n`
          )
          .addField('總計曲目數 \n', `\`${player.queue.totalSize - 1}\``, true)
          .addField(
            '總計長度 \n',
            `\`${bot.ms(player.queue.duration, {
              colonNotation: true
            })}\``,
            true
          )
          .addField('請求者:', `${player.queue.current.requester}`, true)
          .addField(
            '當前之歌曲持續時間:',
            `${
              bot.ProgressBar(
                player.position,
                player.queue.current.duration,
                15
              ).Bar
            } \`[${bot.ms(player.position, {
              colonNotation: true
            })} / ${bot.ms(player.queue.current.duration, {
              colonNotation: true
            })}]\``
          )
          .setThumbnail(player.queue.current.displayThumbnail())

        return Embed
      })

      if (!Pages.length || Pages.length === 1)
        return interaction.editReply({ embeds: Pages[0] })
      else bot.Pagination(interaction, Pages)
    } catch (error) {
      bot.utils.sendErrorLog(bot, error, 'error')
    }
  }
}
