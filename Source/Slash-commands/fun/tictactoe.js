const Discord = require('discord.js');
const ttt = require('../../models/simply-djs/src/ttt')
module.exports = {
    name: "ttt",
    description: "遊玩一局井字遊戲。",
    category: "樂趣",
    options: [{
        name: '玩家',
        type: 'USER',
        description: '您欲挑戰之玩家。',
        required: true,
    }],
    async execute(bot, interaction) {
        interaction.deferReply()
        ttt(interaction, {
            slash: true,
        })
    }
}