import { addSlashCommand } from "@classes/command.ts";
import { CCOSVEmbed } from "@classes/embed.ts";
import { config, discordeno, hasGuildPermissions } from "@deps";
import { send } from "@utils/send.ts";
import { SongInfo } from "@interfaces/music.ts";
import * as YtAPI from "@internal/ytreqs.ts";
import * as SpotifyAPI from "@internal/spotify.ts";
import { playQueueUntilEnd } from "@utils/music.ts";
import { main } from "@utils/log.ts";

function msToTime(time: number) {
  const ms = time % 1e3,
    secs = (time = (time - ms) / 1e3) % 60,
    mins = (time = (time - secs) / 60) % 60,
    hrs = (time - mins) / 60;
  return (0 !== hrs ? hrs + ":" : "") + mins + ":" + secs;
}
let selectSong: discordeno.ActionRow[] = [];

export default addSlashCommand({
  name: "play",
  description: "play a music",
  nameLocalizations: { "zh-TW": "播放音樂" },
  descriptionLocalizations: { "zh-TW": "在語音頻道播放 YouTube 或 Spotify 音樂" },
  options: [
    {
      name: "歌曲",
      type: 3,
      required: true,
      description: "您想播放之歌曲的名稱或連結。",
    },
  ],
  acknowledge: true,
  run: async (bot, interaction) => {
    // Check if it's possible to see or join the VCs within this guild
    const hasPerms = hasGuildPermissions(bot, interaction.guildId!, bot.id, [
      "CONNECT",
      "VIEW_CHANNEL",
    ]);
    if (!hasPerms) {
      return await interaction.editReply({
        embeds: new CCOSVEmbed()
          .setDesc(
            ":x: I don't have permissions to connect or view the channel that you're in!",
          )
          .build(),
      });
    }

    // Get the guild, automatically try both cache and api if cache fails

    // Attempt to get the voice data (may not exist)
    const memberVoiceData = bot.guilds.get(interaction.guildId!)?.voiceStates
      .get(
        interaction!.member!.id,
      );

    // Handle the case in which the voice data doesn't exist
    if (!memberVoiceData || !memberVoiceData.channelId) {
      return await interaction.editReply({
        embeds: new CCOSVEmbed()
          .setDesc(
            ":x: You aren't in a voice channel!",
          )
          .build(),
      });
    }

    let player = bot.guildPlayers.get(interaction.guildId!);

    if (!player) {
      // Player doesn't exist - make a new one

      // BUG !!!! need to fix " throw new Error("No available nodes."); " ((還沒連接到node時
      player = bot.musicNode.createPlayer(interaction.guildId!);

      player.connect(memberVoiceData.channelId);

      // Set the player, will be used to skip & stop current queue
      bot.guildPlayers.set(interaction.guildId!, player);
    } else {
      if (!player.playing) {
        player.connect(memberVoiceData.channelId);
      }
    }

    const query = String(interaction.data!.options![0]!.value!);
    let didPreload = false;

    const songInfo: SongInfo[] = [];

    if (YtAPI.isYoutubeLink(query)) {
      // we have a video, potentially a playlist
      const playlistId = YtAPI.getPlaylistId(query);

      if (playlistId) {
        // we have a playlist; get the IDs & add them to queue
        const ids = await YtAPI.getPlaylistVideos(config.ytApiKey!, playlistId);
        if (!ids) {
          return await interaction.editReply({
            embeds: new CCOSVEmbed()
              .setDesc(
                ":x: Failed to get embed - are you sure you have a valid playlist?",
              )
              .build(),
          });
        }
        await interaction.editReply({
          embeds: new CCOSVEmbed()
            .setDesc(
              ":mag_right: Loading YouTube Playlist (Should take ~1 minute)",
            )
            .build(),
        });
        let failedLoads = 0;

        for (const id of ids) {
          const searched = await bot.musicNode.rest.loadTracks(
            `https://www.youtube.com/watch?v=${id}`,
          );

          if (searched.tracks[0]) {
            songInfo.push({
              track: searched.tracks[0].track,
              title: searched.tracks[0].info.title,
              link: searched.tracks[0].info.uri,
              queued: interaction!.member!.id,
            } as SongInfo);
          } else {
            failedLoads++;
          }

          if (songInfo.length == 5) {
            // Add the song(s) to queue, to give the user something to listen to while the rest load
            const currQueue = bot.guildQueues.get(interaction.guildId!);
            if (!currQueue) {
              bot.guildQueues.set(interaction.guildId!, songInfo);
              didPreload = true;
              // Begin playing
              await playQueueUntilEnd(
                bot,
                interaction.channelId!,
                player,
                interaction.guildId!,
                undefined,
              );
            }
          }
        }

        const successSuffix = (songInfo.length + 1 > 1) ? "s" : "";
        const failSuffix = (failedLoads > 1) ? "s" : "";
        if (failedLoads != 0) {
          await interaction.editReply({
            embeds: new CCOSVEmbed()
              .setDesc(
                `:exclamation: ${failedLoads} video${failSuffix} failed to load - they were either private, age restricted, blocked by your country.`,
              )
              .build(),
          });
        }
        await interaction.editReply({
          embeds: new CCOSVEmbed()
            .setDesc(
              `:white_check_mark: Added ${
                songInfo.length + 1
              } song${successSuffix} to queue`,
            )
            .build(),
        });
      } else {
        // we just have a normal youtube video; add it to the queue
        const vidId = YtAPI.getVideoId(query);

        if (!vidId) {
          return await interaction.editReply({
            embeds: new CCOSVEmbed()
              .setDesc(
                `:exclamation: Couldn't find video - is your link valid and not private?`,
              )
              .build(),
          });
        }
        const searched = await bot.musicNode.rest.loadTracks(
          `https://www.youtube.com/watch?v=${vidId}`,
        );

        if (searched?.tracks[0]) {
          songInfo.push({
            track: searched.tracks[0].track,
            title: searched.tracks[0].info.title,
            link: searched.tracks[0].info.uri,
            queued: interaction.member!.id,
          } as SongInfo);
          await interaction.editReply({
            embeds: new CCOSVEmbed()
              .setDesc(
                `:white_check_mark: Added ${
                  searched.tracks[0].info.title
                } to queue [<@${interaction.member!.id}>]`,
              )
              .build(),
          });
        } else {
          return await interaction.editReply({
            embeds: new CCOSVEmbed()
              .setDesc(
                `:exclamation: Couldn't find video - is your link valid and not private?`,
              )
              .build(),
          });
        }
      }
    } else {
      if (SpotifyAPI.isSpotifyLink(query)) {
        // Spotify link
        if (SpotifyAPI.isSpotifyTrack(query)) {
          const trackId = SpotifyAPI.getTrackId(query);
          if (!trackId) {
            return await interaction.editReply({
              embeds: new CCOSVEmbed()
                .setDesc(
                  `:exclamation: Malformed track link`,
                )
                .build(),
            });
          }

          const trackName = await SpotifyAPI.getPlaylistTracks(
            config.spotifyToken,
            trackId,
            true,
          );
          if (!trackName) {
            return await interaction.editReply({
              embeds: new CCOSVEmbed()
                .setDesc(
                  `:exclamation: Couldn't find track - is your link valid?`,
                )
                .build(),
            });
          }

          const searched = await bot.musicNode.rest.loadTracks(
            `ytsearch:${trackName}`,
          );

          if (searched.tracks[0]) {
            songInfo.push({
              track: searched.tracks[0].track,
              title: searched.tracks[0].info.title,
              link: searched.tracks[0].info.uri,
              queued: interaction.member!.id,
            } as SongInfo);

            send(
              bot,
              interaction.channelId!,
              new CCOSVEmbed()
                .setDesc(
                  `:white_check_mark: Added ${
                    searched.tracks[0].info.title
                  } to queue [<@${interaction.member!.id}>]`,
                )
                .build(),
            );
          } else {
            await interaction.editReply({
              embeds: new CCOSVEmbed()
                .setDesc(
                  ":exclamation: Couldn't find video - is your link valid and not private?",
                )
                .build(),
            });
          }
        } else {
          // playlist
          await interaction.editReply({
            embeds: new CCOSVEmbed()
              .setDesc(
                ":mag_right: Loading Spotify Playlist (Will take at least 1 minute!)",
              )
              .build(),
          });

          const playlistId = SpotifyAPI.getPlaylistId(query);

          if (!playlistId) {
            return await interaction.editReply({
              embeds: new CCOSVEmbed()
                .setDesc(
                  ":exclamation: Malformed track link",
                )
                .build(),
            });
          }

          const tracks = await SpotifyAPI.getPlaylistTracks(
            config.spotifyToken,
            playlistId,
            false,
          );
          if (!tracks) {
            return await interaction.editReply({
              embeds: new CCOSVEmbed()
                .setDesc(
                  ":exclamation: Couldn't find track - is your link valid?",
                )
                .build(),
            });
          }

          let failedLoads = 0;

          for (const track of tracks) {
            const searched = await bot.musicNode.rest.loadTracks(
              `ytsearch:${track}`,
            );

            if (searched.tracks[0]) {
              songInfo.push({
                track: searched.tracks[0].track,
                title: searched.tracks[0].info.title,
                link: searched.tracks[0].info.uri,
                queued: interaction.member!.id,
              } as SongInfo);
            } else {
              failedLoads++;
            }

            if (songInfo.length == 5) {
              // Add the song(s) to queue, to give the user something to listen to while the rest load
              const currQueue = bot.guildQueues.get(interaction.guildId!);
              if (!currQueue) {
                bot.guildQueues.set(interaction.guildId!, songInfo);
                didPreload = true;
                // Begin playing
                await playQueueUntilEnd(
                  bot,
                  interaction.channelId!,
                  player,
                  interaction.guildId!,
                  undefined,
                );
              }
            }
          }

          const successSuffix = (songInfo.length > 1) ? "s" : "";
          const failSuffix = (failedLoads > 1) ? "s" : "";
          if (failedLoads != 0) {
            await interaction.editReply({
              embeds: new CCOSVEmbed()
                .setDesc(
                  `:exclamation: ${failedLoads} video${failSuffix} failed to load - they were either private, age restricted, blocked by your country.`,
                )
                .build(),
            });
          }
          await interaction.editReply({
            embeds: new CCOSVEmbed()
              .setDesc(
                `:white_check_mark: Added ${songInfo.length} song${successSuffix} to queue`,
              )
              .build(),
          });
        }
      } else {
        // Query terms - look them up
        const searched = await bot.musicNode.rest.loadTracks(
          `ytsearch:${query}`,
        ).catch((err) => console.log(err));
        if (!searched) return;
        try {
          const selectData: discordeno.SelectOption[] = [];
          for (let i = 0; i < 5; i++) {
            selectData[i] = {
              "label": searched.tracks[i].info.title,
              "value": i.toString(),
              "description": msToTime(searched.tracks[i].info.length),
            };
          }
          selectSong = [
            {
              type: 1, // Action Row
              components: [
                {
                  type: 3, // 	String Select
                  customId: interaction.guildId + "-" + "select_song",
                  options: selectData,
                  placeholder: "選擇一首您欲播放的歌曲",
                  maxValues: 1,
                },
              ],
            },
            {
              type: 1, // Action Row
              components: [
                {
                  type: 2, //  Button
                  customId: "cancelPlay",
                  label: "取消播放",
                  style: 4,
                },
              ],
            },
          ];

          await interaction.editReply({
            components: selectSong,
          });
          const userSelectData: SongInfo[] = [];
          for (const i in selectData) {
            userSelectData.push({
              track: searched.tracks[i].track,
              title: searched.tracks[i].info.title,
              link: searched.tracks[i].info.uri,
              queued: interaction.member!.id,
            } as SongInfo);
          }
          bot.guildSelectCollectors.set(interaction.guildId!, userSelectData);
          return;
        } catch (err) {
          main.error(err);
          await interaction.editReply({
            embeds: new CCOSVEmbed()
              .setDesc(
                `:exclamation: Couldn't find video - is your link valid and not private?`,
              )
              .build(),
          });
        }
      }
    }

    // Add the song(s) to queue
    let currQueue = bot.guildQueues.get(interaction.guildId!);

    if (didPreload && currQueue) {
      currQueue = currQueue.slice(5, -1);
    }

    if (!currQueue) {
      bot.guildQueues.set(interaction.guildId!, songInfo);
      // Begin playing
      await playQueueUntilEnd(
        bot,
        interaction.channelId!,
        player,
        interaction.guildId!,
        undefined,
      );
    } else {
      currQueue.push(...songInfo);
    }
  },
});
