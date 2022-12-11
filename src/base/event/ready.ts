import { config } from "@deps";
import { database, main } from "@utils/log.ts";
import { Bot, MongoDB } from "@base/CC-OSV-Client.ts";
import { ChangeTime } from "../../task/changeChannelTime.ts";
import { refreshCommand } from "@classes/command.ts";

export let BotUptime: number;

export function setReadyEvent() {
  Bot.events.ready = async function () {
    Bot.musicNode.init();
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
    ChangeTime(Bot);
    const status =
      config.statuses[Math.floor(Math.random() * config.statuses.length)];
    if (status.activities[0].name.includes("{0}")) {
      status.activities[0].name = status.activities[0].name.format(
        Bot.guilds.size,
        Bot.guilds.reduce((a, g) => a + g.memberCount, 0),
      );
    }
    setInterval(async () => {
      await Bot.helpers.editBotStatus(status);
    }, 6e4); // 60s = 60000ms :D
    refreshCommand();
  };
}
