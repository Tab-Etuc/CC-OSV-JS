const Embed = require('../../models/embed')
module.exports = {
  name: 'embed',
  description: '簡單地創建一個Embed訊息。',
  category: '實用',
  async execute (bot, interaction) {
    await interaction.deferReply()

    Embed(interaction, {
      slash: true
    })
  }
}
