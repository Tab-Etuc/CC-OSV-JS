const calculator = require('../../models/simply-djs/src/calc')
module.exports = {
    name: "calculator",
    description: "一個以按鈕作為操作介面的計算機。",
    category: "實用",
    async execute(bot, interaction) {
        await interaction.deferReply();
        calculator(interaction, {
            slash: true,
        })
    }
}