const itemss = require('../../../models/economy/items')
const UserManager = require('../../../models/economy/UserManager')

module.exports = {
  name: '購買',
  description: '購買市廛上的商品。',
  category: '經濟',
  options: [
    {
      name: '商品',
      type: 'STRING',
      description: '請輸入欲購買之商品的"ID"',
      required: true
    },
    {
      name: '數量',
      type: 'STRING',
      description: '請輸入欲購買之商品數',
      required: false
    }
  ],
  async execute (bot, interaction) {
    await interaction.deferReply()

    let user = await UserManager.fetchUser(
      bot,
      interaction.member.id,
      interaction.guild.id
    )
    const arg = interaction.options.getString('商品', false)
    const item = itemss.find(
      x =>
        x.name.toLowerCase() ===
          arg
            .join(' ')
            .toString()
            .toLowerCase() ||
        x.name.toLowerCase() === arg.toString().toLowerCase() ||
        x.name.toLowerCase() ===
          `${arg.toString().toLowerCase()} ${arg.toString().toLowerCase()}`
    )
    if (!item) {
      return interaction.editReply('您無法購買不存在的商品。請使用正確的商品ID')
    }
    if (item.canBuy == false) {
      return interaction.editReply(':thinking: 您不能購買這項商品。')
    }
    let buyAmount = interaction.options
      .getString('數量', false)
      .toString()
      .match(/([1-9][0-9]*)/)
    if (!buyAmount) buyAmount = 1
    else buyAmount = buyAmount[0]
    if (
      item.price > user.coinsInWallet ||
      buyAmount * item.price > user.coinsInWallet
    ) {
      return interaction.editReply('您沒有足夠的金錢購買此商品。')
    }
    let founditem = user.items.find(
      x => x.name.toLowerCase() === item.name.toLowerCase()
    )
    let array = []
    array = user.items.filter(x => x.name !== item.name)
    if (founditem) {
      array.push({
        name: item.name,
        amount: parseInt(founditem.amount) + parseInt(buyAmount),
        description: item.description
      })
      user.items = array
      await user.save()
    } else {
      user.items.push({
        name: item.name,
        amount: buyAmount,
        description: item.description
      })
      await user.save()
    }
    user.coinsInWallet -= parseInt(item.price) * parseInt(buyAmount)
    await user.save()
    interaction.editReply(
      `感謝您購買 **${parseInt(buyAmount).toLocaleString()}**個\`${item.name}\``
    )
  }
}
