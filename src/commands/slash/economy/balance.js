const { MessageEmbed } = require('discord.js')
const Users = require('../../../models/mongoDB/Users')

module.exports = {
  name: '餘額',
  description: '查看您的餘額。',
  category: '經濟',
  options: [
    {
      name: '玩家',
      type: 'USER',
      description: '您欲搜尋之用戶個人資料(註：選填。)',
      required: false
    }
  ],
  async execute (bot, interaction) {
    const member =
      interaction.options.getString('指令', false) || interaction.member
    let user = await bot.fetchUser(bot, member.id, interaction.guild.id)

    const embed = new MessageEmbed()
      .setTitle(`${member.user.username}'s Balance`)
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .setDescription(
        `💳**Wallet**: ${user.coinsInWallet.toLocaleString()}\n🏦**Bank**: ${user.coinsInBank.toLocaleString()}/${user.bankSpace.toLocaleString()}\n🌐**Total Net Worth**: ${(
          user.coinsInWallet + user.coinsInBank
        ).toLocaleString()}`
      )
      .setColor('RANDOM')
    interaction.reply({ embeds: [embed] })
  }
}
