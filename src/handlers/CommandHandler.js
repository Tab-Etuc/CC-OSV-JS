const glob = require("glob");

module.exports = async function loadCommands(bot) {
  const commandFiles = glob.sync("./src/slash-commands/**/*.js");
  // const commandFiles = glob.sync("./Source/Slash-commands/utility/*.js")
  for (const file of commandFiles) {
    const command = require(`../../${file}`);

    const data = {
      name: command.name,
      description: command?.description ?? "Empty description",
      options: command?.options ?? []
    };

    await bot.application?.commands.create(data);

    delete require.cache[require.resolve(`../../${file}`)];

    

    bot.ittCommands.set(command.name, command);

    // debug
    bot.logger.log("commands", `Loaded Command: ${command.name}`);
  }
};
