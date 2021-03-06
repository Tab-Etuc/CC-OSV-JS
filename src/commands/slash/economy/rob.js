const UserManager = require('../../../models/economy/UserManager')

module.exports = {
  name: '搶劫',
  description: '試圖搶某人的錢。',
  category: '經濟',
  options: [
    {
      name: '玩家',
      type: 'USER',
      description: '您欲搶劫的人。',
      required: true
    }
  ],
  async execute (bot, interaction) {
    await interaction.deferReply()

    const member =
      interaction.options.getString('指令', false) || interaction.member

    const user = await UserManager.fetchUser(
      bot,
      interaction.member.id,
      interaction.guild.id
    )

    if (member.bot)
      return interaction.editReply(
        `您不能搶劫一個機器人。\n\`您不會覺得能靠搶劫身無分文的機器人發家致富...吧？\``
      )

    const robbedUser = await UserManager.fetchUser(bot, member.id, member.guildId)
    if (robbedUser.coinsInWallet < 1000) {
      return interaction.editReply('他剩的錢不多了，放過他吧！')
    }
    if (user.items.find(x => x.name == '幸運草')) {
      const newInv = user.items.filter(i => i.name != '幸運草')
      const bypass = user.items.find(i => i.name == '幸運草')
      if (bypass.amount == 1) {
        user.items = newInv
      } else {
        newInv.push({
          name: '幸運草',
          amount: bypass.amount - 1,
          description: bypass.description
        })
        user.items = newInv
      }
    } else {
      const random = Math.floor(Math.random() * 3)
      if (random === 1) {
        return interaction.editReply(
          `您嘗試搶劫 **${member.user.tag}** ，但是被👮抓住了! `
        )
      }
    }
    let array = robbedUser.items.filter(x => x.name !== '掛鎖')
    const padlock = robbedUser.items.find(x => x.name === '掛鎖')
    if (padlock) {
      interaction.editReply(
        `您嘗試搶劫 **${member.user.tag}** ，但是他有 **掛鎖**🔒，此次行動失敗。`
      )
      if (padlock.amount === 1) {
        robbedUser.items = array
        await robbedUser.save()
        return
      } else {
        array.push({
          name: '掛鎖',
          amount: padlock.amount - 1,
          description: padlock.description
        })
        robbedUser.items = array
        await robbedUser.save()
        return
      }
    }
    const randomAmount = Math.round(Math.random() * robbedUser.coinsInWallet)
    user.coinsInWallet += randomAmount
    robbedUser.coinsInWallet -= randomAmount
    await user.save()
    await robbedUser.save()
    interaction.editReply(
      `:moneybag: 您從 **${member}** 身上搶到了 **${randomAmount.toLocaleString()}** 元！`
    )
  }
}
