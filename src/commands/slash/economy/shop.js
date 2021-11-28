const { MessageEmbed } = require('discord.js')
const embedPages = require('../../../models/embedPages')
module.exports = {
  name: '商店',
  description: '前往市廛，採購琳瑯滿目的商品。',
  category: '經濟',
  async execute (bot, interaction) {
    await interaction.deferReply()

    let page = [
      '🍪 **餅乾 - __3__** __元__\n`id: 餅乾`\n美味的點心:)食用它來讓自己發福:))) \n🔒 **掛鎖 - __20__** __元__\n`id: 掛鎖`\n防止您的錢包被預謀不軌的土匪搶走。\n🍀 **幸運草 - __1__,__999__** __元__\n`id: 幸運草`\n增加些許運氣。在賭博性質的遊戲得天獨厚。',
      '🔫 **槍 - __2__,__250__** __元__\n`id: 槍`\n狩獵動物。\n🪓 **斧頭 - __34__** __元__\n`id: 斧頭`\n砍伐樹木。\n🎣 **釣竿 - __49__** __元__\n`id: 釣竿`\n釣魚。\n⛏️ **十字鎬 - __29__** __元__\n`id: 十字鎬`\n挖掘寶石。',
      ':watch: **手錶 - __279__** __元__\n`id: 手錶`\n可以於伺服器最上方看見<#852346393141182484>頻道。'
    ]

    const embed1 = new MessageEmbed()
      .setAuthor(`歡迎 ${interaction.user?.tag}`)
      .setColor('RANDOM')
      .setTitle(`· · - ┈┈━━ ˚ . ✿ . ˚ ━━┈┈ - · ·`)
      .setThumbnail(interaction.user?.displayAvatarURL({ dynamic: true }))
      .setFooter(`頁數 1 / ${page.length}`)
      .setDescription(page[0])

    const embed2 = new MessageEmbed()
      .setAuthor(`歡迎 ${interaction.user?.tag}`)
      .setColor('RANDOM')
      .setTitle(`· · - ┈┈━━ ˚ . ✿ . ˚ ━━┈┈ - · ·`)
      .setThumbnail(interaction.user?.displayAvatarURL({ dynamic: true }))
      .setFooter(`頁數 2 / ${page.length}`)
      .setDescription(page[1])

    const embed3 = new MessageEmbed()
      .setAuthor(`歡迎 ${interaction.user?.tag}`)
      .setColor('RANDOM')
      .setTitle(`· · - ┈┈━━ ˚ . ✿ . ˚ ━━┈┈ - · ·`)
      .setThumbnail(interaction.user?.displayAvatarURL({ dynamic: true }))
      .setFooter(`頁數 3 / ${page.length}`)
      .setDescription(page[2])

    let pages = [embed1, embed2, embed3] // REQUIRED

    // its still possible without embed
    // let pages = ['page1', 'page2', 'page3']

    embedPages(bot, interaction, pages, {
      slash: true
    })
  }
}
