module.exports = {
  name: "interactionCreate",
  async execute(bot, interaction) {
    if (!interaction.isCommand()) return;



    await bot.application?.commands.fetch(interaction.commandId).catch(() => null);

    if (!interaction.guildId) return;

    try {
      const command = bot.commands.get(interaction.command?.name ?? "")

      if (!command) return;
      if (!interaction.commandId) return;
      if (command.permission) {
        const isAdmin = interaction.guild.members.cache
          .find((member) => member.id === interaction.member.id)
          .permissions.has('ADMINISTRATOR');
        if (!isAdmin) {
          return interaction.reply(`· · · ────── ·✘· ────── · · ·
            <@${interaction.member}>, 權限不足!!
            

            ✅ 此指令需有「管理員」權限的身分組，才得以使用。
            · · · ────── ·✘· ────── · · ·`)
        }
      }
      if ((command.category === "botowner" || command.ownerOnly === true) && !process.env.OWNER.includes(interaction?.user.id))
        return bot.say.errorMessage(interaction, "此指令只允許機器人擁有者使用。");

      await command?.execute(bot, interaction);
    } catch (err) {
      bot.say.errorMessage(interaction, "發生了一點錯誤。抱歉為您帶來糟糕的體驗。");
      return bot.utils.sendErrorLog(bot, err, "error");
    }
  }
};