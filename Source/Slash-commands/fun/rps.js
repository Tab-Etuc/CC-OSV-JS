const Discord = require('discord.js')
const ms = require('ms')


module.exports = {
    name: "rps",
    description: "遊玩一場猜拳遊戲。",
    category: "fun",
    async execute(bot, interaction) {

        try {

            let botPick;
            let botEmoji;
            let botChoose;
            let playerScore = 0;
            let botScore = 0;
            let rock = "🗻 石頭";
            let paper = "📰 紙";
            let scissors = "✂ 剪刀";

            let row = new Discord.MessageActionRow().addComponents(

                new Discord.MessageButton()
                    .setCustomId('rock')
                    .setStyle('PRIMARY')
                    .setEmoji('🗻')
                    .setLabel('石頭'),

                new Discord.MessageButton()
                    .setCustomId('paper')
                    .setStyle('SUCCESS')
                    .setEmoji('📰')
                    .setLabel('紙'),

                new Discord.MessageButton()
                    .setCustomId('scissors')
                    .setStyle('DANGER')
                    .setEmoji('✂')
                    .setLabel('剪刀'),

            )

            let rpsEmbed = new Discord.MessageEmbed()
                .setColor('#3d35cc')
                .setDescription('**-**')
                .addField(`遊戲分數`, `\`->\` ${interaction.user}： **${playerScore} 分**\n\`->\` ${bot.user}： **${botScore} 分**`)

            await interaction.reply({ embeds: [rpsEmbed], components: [row] })
            const rpsPage = await interaction.fetchReply();

            const filter = i => {
                return i.user.id === interaction.user.id;
            }

            const col = await rpsPage.createMessageComponentCollector({
                filter,
                componentType: 'BUTTON',
                time: ms('30s'),
            })

            col.on('collect', i => {

                botPick = Math.floor(Math.random() * 3) + 1

                if (botPick === 1) {
                    botChoose = "rock"
                }

                if (botPick === 2) {
                    botChoose = "paper"
                }

                if (botPick === 3) {
                    botChoose = "scissors"
                }

                const embed1 = new Discord.MessageEmbed()
                    .setColor('#3d35cc')
                    .setDescription('**-**')
                    .addField(`遊戲分數`, `\`->\` ${interaction.user}： **${playerScore} 分**\n\`->\` ${bot.user}： **${botScore} 分**`)

                if (i.customId === 'rock') {

                    botPick = Math.floor(Math.random() * 3) + 1

                    if (botChoose === 'paper') {
                        botScore++

                        let embed2 = new Discord.MessageEmbed()
                            .setColor('#3d35cc')
                            .setDescription('**-**')
                            .addField(`遊戲分數`, `\`->\` ${interaction.user}： **${playerScore} 分**\n\`->\` ${bot.user}： **${botScore} 分**`)

                        return i.update({ content: `我選擇了 **${paper}**\n你選擇了 **${rock}**\n**結果：** 你輸了!`, embeds: [embed2], components: [row] })
                    }

                    if (botChoose === 'rock') {
                        return i.update({ content: `我選擇了 **${rock}**\n你選擇了 **${rock}**\n**結果：** 平手!`, embeds: [embed1], components: [row] })
                    }

                    if (botChoose === 'scissors') {
                        playerScore++

                        let embed2 = new Discord.MessageEmbed()
                            .setColor('#3d35cc')
                            .setDescription('**-**')
                            .addField(`遊戲分數`, `\`->\` ${interaction.user}: **${playerScore} 分**\n\`->\` ${bot.user}： **${botScore} 分**`)

                        return i.update({ content: `我選擇了 **${scissors}**\n你選擇了 **${rock}**\n**結果:** 你贏了!`, embeds: [embed2], components: [row] })
                    }

                }

                if (i.customId === 'paper') {

                    botPick = Math.floor(Math.random() * 3) + 1

                    if (botChoose === 'scissors') {
                        botScore++

                        let embed2 = new Discord.MessageEmbed()
                            .setColor('#3d35cc')
                            .setDescription('**-**')
                            .addField(`遊戲分數`, `\`->\` ${interaction.user}： **${playerScore} 分**\n\`->\` ${bot.user}： **${botScore} 分**`)

                        return i.update({ content: `我選擇了 **${scissors}**\n你選擇了 **${paper}**\n**結果：** 你輸了!`, embeds: [embed2], components: [row] })
                    }

                    if (botChoose === 'paper') {
                        return i.update({ content: `我選擇了 **${paper}**\n你選擇了 **${paper}**\n**結果:** 平手!`, embeds: [embed1], components: [row] })
                    }

                    if (botChoose === 'rock') {
                        playerScore++

                        let embed2 = new Discord.MessageEmbed()
                            .setColor('#3d35cc')
                            .setDescription('**-**')
                            .addField(`遊戲分數`, `\`->\` ${interaction.user}: **${playerScore} 分**\n\`->\` ${bot.user}: **${botScore} 分**`)

                        return i.update({ content: `我選擇了 **${rock}**\n你選擇了 **${paper}**\n**結果:** 你贏了!`, embeds: [embed2], components: [row] })
                    }

                }

                if (i.customId === 'scissors') {

                    botPick = Math.floor(Math.random() * 3) + 1

                    if (botChoose === 'rock') {
                        botScore++

                        let embed2 = new Discord.MessageEmbed()
                            .setColor('#3d35cc')
                            .setDescription('**-**')
                            .addField(`遊戲分數`, `\`->\` ${interaction.user}: **${playerScore} 分**\n\`->\` ${bot.user}: **${botScore} 分**`)

                        return i.update({ content: `我選擇了 **${rock}**\n你選擇了 **${scissors}**\n**結果:** 你輸了!`, embeds: [embed2], components: [row] })
                    }

                    if (botChoose === 'scissors') {
                        return i.update({ content: `我選擇了 **${scissors}**\n你選擇了 **${scissors}**\n**結果:** 平手!`, embeds: [embed1], components: [row] })
                    }

                    if (botChoose === 'paper') {
                        playerScore++

                        let embed2 = new Discord.MessageEmbed()
                            .setColor('#3d35cc')
                            .setDescription('**-**')
                            .addField(`遊戲分數`, `\`->\` ${interaction.user}: **${playerScore} 分**\n\`->\` ${bot.user}: **${botScore} 分**`)

                        return i.update({ content: `我選擇了 **${paper}**\n你選擇了 **${scissors}**\n**結果:** 你贏了!`, embeds: [embed2], components: [row] })
                    }

                }
            })

            col.on('end', async (x) => {

                if (x.size === 0) {

                    const nointEmbed = new Discord.MessageEmbed()
                        .setColor('#3d35cc')
                        .setDescription('😭 - 沒有人想和我一起玩RPS！')

                    i.update({ content: null, embeds: [nointEmbed], components: [] })

                } else if (x.size > 0) {

                    if (playerScore === botScore) {

                        let embed2 = new Discord.MessageEmbed()
                            .setColor('#3d35cc')
                            .setDescription('**平手**')
                            .addField(`遊戲分數`, `\`->\` ${interaction.user}: **${playerScore} 分**\n\`->\` ${bot.user}: **${botScore} 分**`)

                        i.update({ content: null, embeds: [embed2], components: [] })

                    } else if (playerScore > botScore) {

                        let embed2 = new Discord.MessageEmbed()
                            .setColor('#3d35cc')
                            .setDescription(`獲勝者：${interaction.user}`)
                            .addField(`遊戲分數`, `\`->\` ${interaction.user}: **${playerScore} 分**\n\`->\` ${bot.user}: **${botScore} 分**`)

                        i.update({ content: null, embeds: [embed2], components: [] })

                    } else if (playerScore < botScore) {

                        let embed2 = new Discord.MessageEmbed()
                            .setColor('#3d35cc')
                            .setDescription(`獲勝者： ${bot.user}`)
                            .addField(`遊戲分數`, `\`->\` ${interaction.user}: **${playerScore} 分**\n\`->\` ${bot.user}: **${botScore} 分**`)

                        i.update({ content: null, embeds: [embed2], components: [] })

                    }
                }
            })

        } catch (err) {

            const errEmbed = new Discord.MessageEmbed()
                .setColor('RED')
                .setDescription("‼️ - An error occured continuing with this action, please recheck whether you've selected the right things from the menu or not!")

            interaction.followUp({ embeds: [errEmbed] })
            console.log(err)

        }
    }
}