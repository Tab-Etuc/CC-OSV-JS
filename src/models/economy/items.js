const UserManager = require('./UserManager')

const array = [
  {
    name: '餅乾',
    description: '美味的點心:)食用它來讓自己發福:)))',
    canUse: true,
    canBuy: true,
    displayOnShop: true,
    sellAmount: 10,
    price: 50,
    keep: false,
    run: async (bot, message, args) => {
      const cookieRandom = [
        '您剛吃了一塊美味的餅乾！\n獲得了些許快樂和隨之而來的`空虛`。',
        '您在吃餅乾時差點嗆到半死。',
        '這塊餅乾吃起來不錯。',
        '您在吃餅乾時獲得了些許`體悟`'
      ]
      const yes = cookieRandom[Math.floor(Math.random() * cookieRandom.length)]
      message.channel.send(`${yes}`)
    }
  },
  {
    name: '掛鎖',
    description: '防止您的錢包被預謀不軌的土匪搶走。',
    canUse: false,
    canBuy: true,
    displayOnShop: true,
    sellAmount: 2000,
    price: 10000,
    keep: true,
    run: async (bot, message, args) => {}
  },
  {
    name: '釣竿',
    description: '釣魚。',
    canUse: true,
    canBuy: true,
    displayOnShop: true,
    sellAmount: 3000,
    price: 15000,
    keep: true,
    run: async (bot, message, args) => {
      const fishAmount = Math.round(Math.random() * 1) + 1
      const data = await UserManager.fetchUser(bot, message.author.id, message.guildId)
      message.channel.send(
        `You went fishing and came back with **${fishAmount}** fish 🐟`
      )
      const findItem = data.items.find(i => i.name.toLowerCase() == 'fish')
      let userInv = data.items.filter(i => i.name.toLowerCase() !== 'fish')
      if (findItem) {
        userInv.push({
          name: 'fish',
          amount: findItem.amount + fishAmount,
          description: 'Sell the fish to make money.'
        })
        data.items = userInv
        await data.save()
      } else {
        userInv.push({
          name: 'fish',
          amount: fishAmount,
          description: 'Sell the fish to make money.'
        })
        data.items = userInv
        await data.save()
      }
    }
  },
  {
    name: '魚',
    description: '販賣魚肉以賺取利潤。',
    canUse: false,
    canBuy: false,
    displayOnShop: false,
    sellAmount: 125,
    price: 0,
    keep: true,
    run: async (bot, message, args) => {}
  },
  {
    name: '槍',
    description: '狩獵動物。',
    canUse: true,
    canBuy: true,
    displayOnShop: true,
    sellAmount: 3000,
    price: 22500,
    keep: true,
    run: async (bot, message, args) => {
      const deerAmount = Math.round(Math.random() * 1) + 1
      const data = await UserManager.fetchUser(bot, message.author.id, message.guildId)
      message.channel.send(
        `You went hunting and came back with **${deerAmount}** deer 🦌`
      )
      const findItem = data.items.find(i => i.name.toLowerCase() == 'deer')
      let userInv = data.items.filter(i => i.name.toLowerCase() !== 'deer')
      if (findItem) {
        userInv.push({
          name: 'deer',
          amount: findItem.amount + deerAmount,
          description: 'Sell deer to make money.'
        })
        data.items = userInv
        await data.save()
      } else {
        userInv.push({
          name: 'deer',
          amount: deerAmount,
          description: 'Sell the fish to make money.'
        })
        data.items = userInv
        await data.save()
      }
    }
  },
  {
    name: '鹿肉',
    description: '販賣鹿肉以賺取利潤。',
    canUse: false,
    canBuy: false,
    displayOnShop: false,
    sellAmount: 250,
    price: 0,
    keep: true,
    run: async (bot, message, args) => {}
  },
  {
    name: '十字鎬',
    description: '挖掘寶石。',
    canUse: true,
    canBuy: true,
    displayOnShop: true,
    sellAmount: 3000,
    price: 30000,
    keep: true,
    run: async (bot, message, args) => {
      const gemAmount = Math.round(Math.random() * 1) + 1
      const data = await UserManager.fetchUser(bot, message.author.id, message.guildId)
      message.channel.send(
        `You went mining and came back with **${gemAmount}** gem 💎`
      )
      const findItem = data.items.find(i => i.name.toLowerCase() == 'gem')
      let userInv = data.items.filter(i => i.name.toLowerCase() !== 'gem')
      if (findItem) {
        userInv.push({
          name: 'gem',
          amount: findItem.amount + gemAmount,
          description: '販賣寶石以賺取利潤。'
        })
        data.items = userInv
        await data.save()
      } else {
        userInv.push({
          name: 'gem',
          amount: gemAmount,
          description: '販賣寶石以賺取利潤。'
        })
        data.items = userInv
        await data.save()
      }
    }
  },
  {
    name: '寶石',
    description: '販賣寶石以賺取利潤。',
    canUse: false,
    canBuy: false,
    displayOnShop: false,
    sellAmount: 500,
    price: 0,
    keep: true,
    run: async (bot, message, args) => {}
  },
  {
    name: '斧頭',
    description: '砍伐樹木。',
    canUse: true,
    canBuy: true,
    displayOnShop: true,
    sellAmount: 3000,
    price: 20000,
    keep: true,
    run: async (bot, message, args) => {
      const treeAmount = Math.round(Math.random() * 1) + 1
      const data = await UserManager.fetchUser(bot, message.author.id, message.guildId)
      message.channel.send(
        `您走進了樹林並把其中**${treeAmount}**棵倒楣的樹🌲砍了下來。`
      )
      const findItem = data.items.find(i => i.name.toLowerCase() == '木材')
      let userInv = data.items.filter(i => i.name.toLowerCase() !== '木材')
      if (findItem) {
        userInv.push({
          name: '木材',
          amount: findItem.amount + treeAmount,
          description: '販賣木材以賺取利潤。'
        })
        data.items = userInv
        await data.save()
      } else {
        userInv.push({
          name: '木材',
          amount: treeAmount,
          description: '販賣木材以賺取利潤。'
        })
        data.items = userInv
        await data.save()
      }
    }
  },
  {
    name: '木材',
    description: '販賣木材以賺取利潤。',
    canUse: false,
    canBuy: false,
    displayOnShop: false,
    sellAmount: 500,
    price: 0,
    keep: true,
    run: async (bot, message, args) => {}
  },
  {
    name: '幸運草',
    description: '增加些許運氣。在賭博性質的遊戲得天獨厚。',
    canUse: false,
    canBuy: true,
    displayOnShop: true,
    sellAmount: 4000,
    price: 10000,
    keep: false,
    run: async (bot, message, args) => {}
  }
]

module.exports = array
