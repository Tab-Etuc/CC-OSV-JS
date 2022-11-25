import { config, discordeno, hasGuildPermissions } from "@deps";
import { addMsgCommand, CCOSVMsgCommand } from "@classes/command.ts";
import { send } from "@utils/send.ts";
import { CCOSVEmbed } from "@classes/embed.ts";
import { BotClient } from "@base/CC-OSV-Client.ts";
import { SongInfo } from "@interfaces/music.ts";
import * as YtAPI from "@internal/ytreqs.ts";
import * as SpotifyAPI from "@internal/spotify.ts";
import { playQueueUntilEnd } from "@utils/music.ts";
import { main } from "@utils/log.ts";

class BotInfo extends CCOSVMsgCommand {
  private selectSong: discordeno.ActionRow[];
  constructor() {
    super("play", "music", {
      aliases: ["p"],
      description: "play music",
    });
    this.selectSong = [];
  }

  private msToTime(time: number) {
    const ms = time % 1e3,
      secs = (time = (time - ms) / 1e3) % 60,
      mins = (time = (time - secs) / 60) % 60,
      hrs = (time - mins) / 60;
    return (0 !== hrs ? hrs + ":" : "") + mins + ":" + secs;
  }

  override async run(
    bot: BotClient,
    message: discordeno.Message,
    args: string[],
  ): Promise<void> {
    const msg_ = await bot.helpers.sendMessage(message.channelId, {
      content: ":mag_right: | 搜尋中...",
      messageReference: {
        messageId: message.id,
        channelId: message.channelId,
        guildId: message.guildId,
        failIfNotExists: true,
      },
    });
    // Check if it's possible to see or join the VCs within this guild
    const hasPerms = hasGuildPermissions(bot, message.guildId!, bot.id, [
      "CONNECT",
      "VIEW_CHANNEL",
    ]);
    if (!hasPerms) {
      bot.helpers.editMessage(msg_.channelId, msg_.id, {
        content: "",
        embeds: new CCOSVEmbed()
          .setDesc(
            ":x: I don't have permissions to connect or view the channel that you're in!",
          )
          .build(),
      });
      return;
    }

    // Check if they've supplied some sort of query term
    if (args.length < 1) {
      bot.helpers.editMessage(msg_.channelId, msg_.id, {
        content: "",
        embeds: new CCOSVEmbed()
          .setDesc(":x: You didn't enter a link / video title!")
          .build(),
      });
      return;
    }

    // Get the guild, automatically try both cache and api if cache fails

    // Attempt to get the voice data (may not exist)
    const memberVoiceData = bot.guilds.get(message.guildId!)?.voiceStates.get(
      message.authorId,
    );

    // Handle the case in which the voice data doesn't exist
    if (!memberVoiceData || !memberVoiceData.channelId) {
      bot.helpers.editMessage(msg_.channelId, msg_.id, {
        content: "",
        embeds: new CCOSVEmbed()
          .setDesc(":x: You aren't in a voice channel!")
          .build(),
      });
      return;
    }

    let player = bot.guildPlayers.get(message.guildId!);

    if (!player) {
      // Player doesn't exist - make a new one

      // BUG !!!! need to fix " throw new Error("No available nodes."); " ((還沒連接到node時
      player = bot.musicNode.createPlayer(message.guildId!);

      player.connect(memberVoiceData.channelId);

      // Set the player, will be used to skip & stop current queue
      bot.guildPlayers.set(message.guildId!, player);
    } else {
      if (!player.playing) {
        player.connect(memberVoiceData.channelId);
      }
    }

    const query = args.join(" ");
    let didPreload = false;

    const songInfo: SongInfo[] = [];

    if (YtAPI.isYoutubeLink(query)) {
      // we have a video, potentially a playlist
      const playlistId = YtAPI.getPlaylistId(query);

      if (playlistId) {
        // we have a playlist; get the IDs & add them to queue
        const ids = await YtAPI.getPlaylistVideos(config.ytApiKey!, playlistId);
        if (!ids) {
          bot.helpers.editMessage(msg_.channelId, msg_.id, {
            content: "",
            embeds: new CCOSVEmbed()
              .setDesc(
                ":x: Failed to get embed - are you sure you have a valid playlist?",
              )
              .build(),
          });
          return;
        }

        bot.helpers.editMessage(msg_.channelId, msg_.id, {
          content: "",
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
              queued: message.authorId,
            } as SongInfo);
          } else {
            failedLoads++;
          }

          if (songInfo.length == 5) {
            // Add the song(s) to queue, to give the user something to listen to while the rest load
            const currQueue = bot.guildQueues.get(message.guildId!);
            if (!currQueue) {
              bot.guildQueues.set(message.guildId!, songInfo);
              didPreload = true;
              // Begin playing
              await playQueueUntilEnd(
                bot,
                message.channelId,
                player,
                message.guildId!,
                msg_,
              );
            }
          }
        }

        const successSuffix = (songInfo.length + 1 > 1) ? "s" : "";
        const failSuffix = (failedLoads > 1) ? "s" : "";
        if (failedLoads != 0) {
          bot.helpers.editMessage(msg_.channelId, msg_.id, {
            content: "",
            embeds: new CCOSVEmbed()
              .setDesc(
                `:exclamation: ${failedLoads} video${failSuffix} failed to load - they were either private, age restricted, blocked by your country.`,
              )
              .build(),
          });
        }
        bot.helpers.editMessage(msg_.channelId, msg_.id, {
          content: "",
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
          bot.helpers.editMessage(msg_.channelId, msg_.id, {
            content: "",
            embeds: new CCOSVEmbed()
              .setDesc(
                `:exclamation: Couldn't find video - is your link valid and not private?`,
              )
              .build(),
          });

          return;
        }
        const searched = await bot.musicNode.rest.loadTracks(
          `https://www.youtube.com/watch?v=${vidId}`,
        );

        if (searched?.tracks[0]) {
          songInfo.push({
            track: searched.tracks[0].track,
            title: searched.tracks[0].info.title,
            link: searched.tracks[0].info.uri,
            queued: message.authorId,
          } as SongInfo);
          bot.helpers.editMessage(msg_.channelId, msg_.id, {
            content: "",
            embeds: new CCOSVEmbed()
              .setDesc(
                `:white_check_mark: Added ${
                  searched.tracks[0].info.title
                } to queue [<@${message.authorId}>]`,
              )
              .build(),
          });
        } else {
          bot.helpers.editMessage(msg_.channelId, msg_.id, {
            content: "",
            embeds: new CCOSVEmbed()
              .setDesc(
                `:exclamation: Couldn't find video - is your link valid and not private?`,
              )
              .build(),
          });

          return;
        }
      }
    } else {
      if (SpotifyAPI.isSpotifyLink(query)) {
        // Spotify link
        if (SpotifyAPI.isSpotifyTrack(query)) {
          const trackId = SpotifyAPI.getTrackId(query);
          if (!trackId) {
            bot.helpers.editMessage(msg_.channelId, msg_.id, {
              content: "",
              embeds: new CCOSVEmbed()
                .setDesc(`:exclamation: Malformed track link`)
                .build(),
            });

            return;
          }

          const trackName = await SpotifyAPI.getPlaylistTracks(
            config.spotifyToken,
            trackId,
            true,
          );
          if (!trackName) {
            bot.helpers.editMessage(msg_.channelId, msg_.id, {
              content: "",
              embeds: new CCOSVEmbed()
                .setDesc(
                  `:exclamation: Couldn't find track - is your link valid?`,
                )
                .build(),
            });

            return;
          }

          const searched = await bot.musicNode.rest.loadTracks(
            `ytsearch:${trackName}`,
          );

          if (searched.tracks[0]) {
            songInfo.push({
              track: searched.tracks[0].track,
              title: searched.tracks[0].info.title,
              link: searched.tracks[0].info.uri,
              queued: message.authorId,
            } as SongInfo);

            send(
              bot,
              message.channelId,
              new CCOSVEmbed()
                .setDesc(
                  `:white_check_mark: Added ${
                    searched.tracks[0].info.title
                  } to queue [<@${message.authorId}>]`,
                )
                .build(),
            );
          } else {
            bot.helpers.editMessage(msg_.channelId, msg_.id, {
              content: "",
              embeds: new CCOSVEmbed()
                .setDesc(
                  ":exclamation: Couldn't find video - is your link valid and not private?",
                )
                .build(),
            });
          }
        } else {
          // playlist
          bot.helpers.editMessage(msg_.channelId, msg_.id, {
            content: "",
            embeds: new CCOSVEmbed()
              .setDesc(
                ":mag_right: Loading Spotify Playlist (Will take at least 1 minute!)",
              )
              .build(),
          });

          const playlistId = SpotifyAPI.getPlaylistId(query);

          if (!playlistId) {
            bot.helpers.editMessage(msg_.channelId, msg_.id, {
              content: "",
              embeds: new CCOSVEmbed()
                .setDesc(
                  ":exclamation: Malformed track link",
                )
                .build(),
            });
            return;
          }

          const tracks = await SpotifyAPI.getPlaylistTracks(
            config.spotifyToken,
            playlistId,
            false,
          );
          if (!tracks) {
            bot.helpers.editMessage(msg_.channelId, msg_.id, {
              content: "",
              embeds: new CCOSVEmbed()
                .setDesc(
                  ":exclamation: Couldn't find track - is your link valid?",
                )
                .build(),
            });

            return;
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
                queued: message.authorId,
              } as SongInfo);
            } else {
              failedLoads++;
            }

            if (songInfo.length == 5) {
              // Add the song(s) to queue, to give the user something to listen to while the rest load
              const currQueue = bot.guildQueues.get(message.guildId!);
              if (!currQueue) {
                bot.guildQueues.set(message.guildId!, songInfo);
                didPreload = true;
                // Begin playing
                await playQueueUntilEnd(
                  bot,
                  message.channelId,
                  player,
                  message.guildId!,
                  msg_,
                );
              }
            }
          }

          const successSuffix = (songInfo.length > 1) ? "s" : "";
          const failSuffix = (failedLoads > 1) ? "s" : "";
          if (failedLoads != 0) {
            bot.helpers.editMessage(msg_.channelId, msg_.id, {
              content: "",
              embeds: new CCOSVEmbed()
                .setDesc(
                  `:exclamation: ${failedLoads} video${failSuffix} failed to load - they were either private, age restricted, blocked by your country.`,
                )
                .build(),
            });
          }
          bot.helpers.editMessage(msg_.channelId, msg_.id, {
            content: "",
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
        ).catch();
        try {
          const selectData: discordeno.SelectOption[] = [];
          for (let i = 0; i < 5; i++) {
            selectData[i] = {
              "label": searched.tracks[i].info.title,
              "value": i.toString(),
              "description": this.msToTime(searched.tracks[i].info.length),
            };
          }
          this.selectSong = [
            {
              type: 1, // Action Row
              components: [
                {
                  type: 3, // 	String Select
                  customId: message.guildId + "-" + "select_song",
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
          bot.helpers.deleteMessage(message.channelId, msg_.id);
          bot.helpers.sendMessage(message.channelId, {
            components: this.selectSong,
            messageReference: { messageId: message.id, failIfNotExists: true },
          });
          const userSelectData: SongInfo[] = [];
          for (const i in selectData) {
            userSelectData.push({
              track: searched.tracks[i].track,
              title: searched.tracks[i].info.title,
              link: searched.tracks[i].info.uri,
              queued: message.authorId,
            } as SongInfo);
          }
          bot.guildSelectCollectors.set(message.guildId!, userSelectData);

          return;
        } catch (err) {
          main.error(err);
          bot.helpers.editMessage(msg_.channelId, msg_.id, {
            content: "",
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
    let currQueue = bot.guildQueues.get(message.guildId!);

    if (didPreload && currQueue) {
      currQueue = currQueue.slice(5, -1);
    }

    if (!currQueue) {
      bot.guildQueues.set(message.guildId!, songInfo);
      // Begin playing
      await playQueueUntilEnd(
        bot,
        message.channelId,
        player,
        message.guildId!,
        msg_,
      );
    } else {
      currQueue.push(...songInfo);
    }
  }
}

addMsgCommand(new BotInfo());
