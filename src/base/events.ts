import { config, discordeno } from "@deps";
import {
  findSlashCommand,
  MsgCommandHandler,
  refreshCommand,
  SlashCommandHandler,
} from "@classes/command.ts";
import { checkGuildData } from "@base/database.ts";
import { database, main } from "@utils/log.ts";
import { BotClient, MongoDB } from "@base/CC-OSV-Client.ts";
import { CCOSVEmbed } from "@classes/embed.ts";
import { playQueueUntilEnd } from "@utils/music.ts";
import { ChangeTime } from "../task/changeChannelTime.ts";
import { chatLevelSystem } from "@utils/chatLevelSystem.ts";
export let BotUptime: number;

function isConvertableObject(obj: unknown) {
  return obj === Object(obj) && !Array.isArray(obj) &&
    typeof obj !== "function" && !(obj instanceof Blob);
}

function camelToSnakeCase(text: string) {
  return text.replace(/[A-Z]/g, ($1) => `_${$1.toLowerCase()}`);
}

function snakelize<T>(
  // deno-lint-ignore no-explicit-any
  obj: Record<string, any> | Record<string, any>[],
): T {
  if (isConvertableObject(obj)) {
    // deno-lint-ignore no-explicit-any
    const convertedObject: Record<string, any> = {};

    Object.keys(obj).forEach((key) => {
      convertedObject[camelToSnakeCase(key)] = snakelize(
        // deno-lint-ignore no-explicit-any
        (obj as Record<string, any>)[key],
      );
    });

    return convertedObject as T;
  } else if (Array.isArray(obj)) {
    obj = obj.map((element) => snakelize(element));
  }

  return obj as T;
}

export interface VoiceState {
  toggles: discordeno.VoiceStateToggles;
  requestToSpeakTimestamp: number | undefined;
  session_id: string | undefined;
  guild_id: bigint | undefined;
  channel_id: bigint | undefined;
  user_id: bigint | undefined;
}
export const CCOSVEvent = {
  async ready(bot: BotClient) {
    bot.musicNode.init();
    await MongoDB
      .connect(config.mongoDbUrl)
      .then(() => {
        database.info(`Connected to the Mongodb database.`);
      })
      .catch((err: string) => {
        database.error(
          `Unable to connect to the Mongodb database. ` + err,
        );
      });
    BotUptime = Date.now();
    main.info("I'm ready!");
    ChangeTime(bot);
    const status =
      config.statuses[Math.floor(Math.random() * config.statuses.length)];
    if (status.activities[0].name.includes("{0}")) {
      status.activities[0].name = status.activities[0].name.format(
        bot.guilds.size,
        bot.guilds.reduce((a, g) => a + g.memberCount, 0),
      );
    }
    setInterval(() => {
      bot.helpers.editBotStatus(status);
    }, 6e4); // 60s = 60000ms :D
    refreshCommand();
  },

  messageCreate(
    bot: BotClient,
    message: discordeno.Message,
  ): void {
    if (message.isFromBot) {
      return;
    }
    checkGuildData(message.guildId!, message.authorId);
    chatLevelSystem(bot, message);
    MsgCommandHandler(bot, message);
  },

  // messageDelete(
  //   bot: BotClient,
  //   payload: Payload,
  //   message: discordeno.Message,
  // ) {
  //   ghostPingD(bot, payload, message);
  // },

  // messageUpdate(
  //   bot: BotClient,
  //   message: discordeno.Message,
  //   oldMessage?: discordeno.Message,
  // ) {
  //   ghostPingU(bot, message, oldMessage);
  // },

  async interactionCreate(
    bot: BotClient,
    interaction: discordeno.Interaction,
  ): Promise<void> {
    if (!interaction.data) return;
    checkGuildData(interaction.guildId!, interaction.member!.user!.id);
    switch (interaction.type) {
      case discordeno.InteractionTypes.ApplicationCommand: {
        const command = findSlashCommand(interaction.data.name);
        if (!command) return;
        if (interaction.guildId) {
          await bot.helpers.sendInteractionResponse(
            interaction.id,
            interaction.token,
            {
              type: discordeno.InteractionResponseTypes
                .DeferredChannelMessageWithSource,
            },
          );
        }

        SlashCommandHandler(bot, interaction);
        break;
      }
      case discordeno.InteractionTypes.MessageComponent:
        if (interaction.data?.customId == "deleteMsg") {
          bot.helpers.deleteMessage(
            interaction.channelId as bigint,
            interaction.message?.id as bigint,
          );
        } else if (interaction.data.customId!.includes("-select_song")) {
          bot.helpers.deleteMessage(
            interaction.channelId as bigint,
            interaction.message?.id as bigint,
          );
          const guildId = BigInt(
            interaction.data.customId!.replace("-select_song", ""),
          );
          let player = bot.guildPlayers.get(guildId);
          if (!player) {
            // Player doesn't exist - make a new one

            // BUG !!!! need to fix " throw new Error("No available nodes."); " ((還沒連接到node時
            player = bot.musicNode.createPlayer(guildId);

            // Set the player, will be used to skip & stop current queue
            bot.guildPlayers.set(guildId, player);
          }

          const Selected = bot.guildSelectCollectors.get(guildId);
          if (!Selected) return;

          await bot.helpers.sendInteractionResponse(
            interaction.id,
            interaction.token,
            {
              type: discordeno.InteractionResponseTypes
                .DeferredUpdateMessage,
            },
          );

          const currQueue = bot.guildQueues.get(guildId);
          const position = Number(interaction.data.values![0]);

          if (!currQueue) {
            bot.guildQueues.set(guildId, Array(Selected[position]));

            // Begin playing
            await playQueueUntilEnd(
              bot,
              interaction.channelId!,
              player,
              guildId,
              undefined,
            );
          } else {
            bot.guildQueues.set(guildId, Array(Selected[position]));
            bot.helpers.sendMessage(BigInt(interaction.channelId!), {
              content: "",
              embeds: new CCOSVEmbed()
                .setDesc(
                  `:white_check_mark: Added ${
                    Selected[position].title
                  } to queue [<@${interaction.member!.id}>]`,
                )
                .build(),
            });
          }
        } else if (interaction.data.customId! == "cancelPlay") {
          const em = new CCOSVEmbed().setTitle(":x: | 操作取消").setColor(
            "#ff6464",
          ).build();

          bot.helpers.editMessage(
            interaction.channelId as bigint,
            interaction.message?.id as bigint,
            {
              content: "",
              embeds: em,
              components: [],
            },
          );
        }
        break;
    }
  },
  // guildMemberUpdate(
  //   bot: BotClient,
  //   member: discordeno.Member,
  //   user: discordeno.User,
  // ) {
  //   nicknameOnJoin(bot, member, user);
  //   // for who has passed the membership screening
  //   autorole(bot, member, user);
  // },

  // guildMemberAdd(
  //   bot: BotClient,
  //   member: discordeno.Member,
  //   user: discordeno.User,
  // ) {
  //   nicknameOnJoin(bot, member, user);
  // },

  voiceServerUpdate(
    bot: BotClient,
    data: discordeno.DiscordGatewayPayload,
  ): void {
    bot.musicNode.handleVoiceUpdate(
      snakelize(data),
    );
  },

  voiceStateUpdate(
    bot: BotClient,
    data: discordeno.DiscordGatewayPayload,
  ): void {
    bot.musicNode.handleVoiceUpdate(
      snakelize(data),
    );
  },
} as unknown as Partial<discordeno.EventHandlers>;
