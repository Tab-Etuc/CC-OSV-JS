const Guilds = require('../../models/mongoDB/Guilds.js')
const Users = require('../../models/mongoDB/Users.js')
const Prizes = require('../../models/mongoDB/Prizes.js')

const Controller = require('../../models/Controller')

module.exports = {
  name: 'interactionCreate',
  once: false,
  async execute (bot, interaction) {
    // 指令
    if (interaction.isCommand()) {
      if (!interaction.guildId) return

      
      let GuildData = await Guilds.findOne({
        _id: interaction.guildId
      })
      // 如果沒有伺服器資料，則創建
      if (!GuildData) {
        let newGuild = new Guilds({
          _id: interaction.guildId,
          prefix: bot.config.DefaultPrefix
        }).save()
      }

      let rankData = await Prizes.findOne({
        guildId: interaction.guildId
      })
      // 如果沒有伺服器資料，則創建
      if (!rankData) {
        let newRank = new Prizes({
          guildId: interaction.guildId
        }).save()
      }

      let userData = await Users.findOne({
        guildId: message.guildId,
        userId: message.author.id
      })
      // 如果沒有玩家資料，則創建
      if (!userData) {
        let newLevel = new Users({
          guildId: message.guildId,
          userId: message.author.id,
          userName: message.author.username
        }).save()
      }



      await bot.application?.commands
        .fetch(interaction.commandId)
        .catch(() => null)

      try {
        const command = bot.slashCommands.get(interaction.command?.name ?? '')

        if (!command) return
        if (!interaction.commandId) return
        if (command.permission) {
          const isAdmin = interaction.guild.members.cache
            .find(member => member.id === interaction.member.id)
            .permissions.has('ADMINISTRATOR')
          if (!isAdmin) {
            return interaction.reply(`· · · ────── ·✘· ────── · · ·
            <@${interaction.member}>, 權限不足!!
            

            ✅ 此指令需有「管理員」權限的身分組，才得以使用。
            · · · ────── ·✘· ────── · · ·`)
          }
        }
        // if (
        //   (command.category === 'botowner' || command.ownerOnly === true) &&
        //   !process.env.OWNER.includes(interaction?.user.id)
        // )
        //   return bot.say.errorMessage(
        //     interaction,
        //     '此指令只允許機器人擁有者使用。'
        //   )

        await command?.execute(bot, interaction)
        let guild = await Guilds.findOne({ guildId: interaction.guildId })
        guild.CommandsRan++
        await guild.save()
      } catch (err) {
        bot.say.errorMessage(
          interaction,
          '發生了一點錯誤。抱歉為您帶來糟糕的體驗。'
        )
        return bot.utils.sendErrorLog(bot, err, 'error')
      }
      // 按鈕
    } else if (interaction.isButton()) {
      if (interaction.customId.startsWith('controller'))
        Controller(bot, interaction)
    }
  }
}
