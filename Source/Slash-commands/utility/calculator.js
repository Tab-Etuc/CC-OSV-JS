const calculator = require('../../models/calc')
module.exports = {
    name: "計算機",
    description: "一個以按鈕作為操作介面的計算機。",
    category: "實用",
    async execute(bot, interaction) {
        await interaction.deferReply();
        calculator(interaction, {
            slash: true,
        })
    }
}