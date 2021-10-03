const Discord = require('discord.js')
module.exports = {
    name: "井字遊戲",
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
        try {


            let opponent = interaction.options.getUser('玩家')

            
            foot = '©️ CC-OSV'
            

            let acceptEmbed = new Discord.interactionEmbed()
                .setTitle(`等待 ${opponent.tag} 同意！`)
                .setAuthor(interaction.user.tag, interaction.user.displayAvatarURL())
                .setColor(0x075FFF)
                .setFooter(foot)

            let accept = new Discord.interactionButton()
                .setLabel('同意')
                .setStyle('SUCCESS')
                .setCustomId('acceptttt')

            let decline = new Discord.interactionButton()
                .setLabel('婉拒')
                .setStyle('DANGER')
                .setCustomId('declinettt')

            let accep = new Discord.interactionActionRow()
                .addComponents([accept, decline])
            interaction.followUp({
                content: '<@' + opponent.id + '>您收到了一個遊戲邀請！',
                embeds: [acceptEmbed],
                components: [accep]
            })
            let m = await interaction.fetchReply()
            let filter = (button) => button.user.id == opponent.id
            const collector = m.createinteractionComponentCollector({ type: 'BUTTON', time: 30000, filter: filter })
            collector.on('collect', async (button) => {
                if (button.customId == 'declinettt') {
                    button.deferUpdate()
                    return collector.stop('decline')
                } else if (button.customId == 'acceptttt') {
                    collector.stop()
                    button.interaction.delete()

                    let fighters = [interaction.user.id, opponent.id].sort(() => (Math.random() > .5) ? 1 : -1)

                    let x_emoji =  "❌"
                    let o_emoji =  "⭕"

                    let dashmoji = "➖"

                    let Args = {
                        user: 0,
                        a1: {
                            style: "SECONDARY",
                            emoji: dashmoji,
                            disabled: false
                        },
                        a2: {
                            style: "SECONDARY",
                            emoji: dashmoji,
                            disabled: false
                        },
                        a3: {
                            style: "SECONDARY",
                            emoji: dashmoji,
                            disabled: false
                        },
                        b1: {
                            style: "SECONDARY",
                            emoji: dashmoji,
                            disabled: false
                        },
                        b2: {
                            style: "SECONDARY",
                            emoji: dashmoji,
                            disabled: false
                        },
                        b3: {
                            style: "SECONDARY",
                            emoji: dashmoji,
                            disabled: false
                        },
                        c1: {
                            style: "SECONDARY",
                            emoji: dashmoji,
                            disabled: false
                        },
                        c2: {
                            style: "SECONDARY",
                            emoji: dashmoji,
                            disabled: false
                        },
                        c3: {
                            style: "SECONDARY",
                            emoji: dashmoji,
                            disabled: false
                        }
                    }
                    const { interactionActionRow, interactionButton } = require('discord.js');

                    const xoemb = new Discord.interactionEmbed()
                        .setTitle('井字遊戲')
                        .setDescription(`**如何遊玩？ ?**\n*等待您的回合，點擊按鈕以繪製您的符號。*`)
                        .setColor(0x075FFF)
                        .setFooter(foot)
                        .setTimestamp()
                    let infomsg = interaction.editReply({ embeds: [xoemb] })

                    let msg = await interaction.channel.send({ content: `等待 | <@!${Args.userid}>, 您的符號： ${o_emoji}` })
                    tictactoe(msg)

                    async function tictactoe(m) {
                        Args.userid = fighters[Args.user]
                        let won = {
                            "<:O_:863314110560993340>": false,
                            "<:X_:863314044781723668>": false
                        }
                        if (Args.a1.emoji == o_emoji && Args.b1.emoji == o_emoji && Args.c1.emoji == o_emoji) won["<:O_:863314110560993340>"] = true
                        if (Args.a2.emoji == o_emoji && Args.b2.emoji == o_emoji && Args.c2.emoji == o_emoji) won["<:O_:863314110560993340>"] = true
                        if (Args.a3.emoji == o_emoji && Args.b3.emoji == o_emoji && Args.c3.emoji == o_emoji) won["<:O_:863314110560993340>"] = true
                        if (Args.a1.emoji == o_emoji && Args.b2.emoji == o_emoji && Args.c3.emoji == o_emoji) won["<:O_:863314110560993340>"] = true
                        if (Args.a3.emoji == o_emoji && Args.b2.emoji == o_emoji && Args.c1.emoji == o_emoji) won["<:O_:863314110560993340>"] = true
                        if (Args.a1.emoji == o_emoji && Args.a2.emoji == o_emoji && Args.a3.emoji == o_emoji) won["<:O_:863314110560993340>"] = true
                        if (Args.b1.emoji == o_emoji && Args.b2.emoji == o_emoji && Args.b3.emoji == o_emoji) won["<:O_:863314110560993340>"] = true
                        if (Args.c1.emoji == o_emoji && Args.c2.emoji == o_emoji && Args.c3.emoji == o_emoji) won["<:O_:863314110560993340>"] = true
                        if (won["<:O_:863314110560993340>"] != false) {
                            if (Args.user == 0) return m.edit({ content: `<@!${fighters[1]}> (${o_emoji}) 贏了，真是場精彩的遊戲。`, components: [] }); else if (Args.user == 1) return m.edit({ content: `<@!${fighters[0]}> (${o_emoji}) 贏了，真是場精彩的遊戲。`, components: [] });
                        }
                        if (Args.a1.emoji == x_emoji && Args.b1.emoji == x_emoji && Args.c1.emoji == x_emoji) won["<:X_:863314044781723668>"] = true
                        if (Args.a2.emoji == x_emoji && Args.b2.emoji == x_emoji && Args.c2.emoji == x_emoji) won["<:X_:863314044781723668>"] = true
                        if (Args.a3.emoji == x_emoji && Args.b3.emoji == x_emoji && Args.c3.emoji == x_emoji) won["<:X_:863314044781723668>"] = true
                        if (Args.a1.emoji == x_emoji && Args.b2.emoji == x_emoji && Args.c3.emoji == x_emoji) won["<:X_:863314044781723668>"] = true
                        if (Args.a3.emoji == x_emoji && Args.b2.emoji == x_emoji && Args.c1.emoji == x_emoji) won["<:X_:863314044781723668>"] = true
                        if (Args.a1.emoji == x_emoji && Args.a2.emoji == x_emoji && Args.a3.emoji == x_emoji) won["<:X_:863314044781723668>"] = true
                        if (Args.b1.emoji == x_emoji && Args.b2.emoji == x_emoji && Args.b3.emoji == x_emoji) won["<:X_:863314044781723668>"] = true
                        if (Args.c1.emoji == x_emoji && Args.c2.emoji == x_emoji && Args.c3.emoji == x_emoji) won["<:X_:863314044781723668>"] = true
                        if (won["<:X_:863314044781723668>"] != false) {
                            if (Args.user == 0) return m.edit({ content: `<@!${fighters[1]}> (${x_emoji}) 贏了，真是場精彩的遊戲。`, components: [] }); else if (Args.user == 1) return m.edit({ content: `<@!${fighters[0]}> (${x_emoji}) 贏了，真是場精彩的遊戲。`, components: [] });
                        }
                        let a1 = new interactionButton()
                            .setStyle(Args.a1.style)
                            .setEmoji(Args.a1.emoji)
                            .setCustomId('a1')
                            .setDisabled(Args.a1.disabled);
                        let a2 = new interactionButton()
                            .setStyle(Args.a2.style)
                            .setEmoji(Args.a2.emoji)
                            .setCustomId('a2')
                            .setDisabled(Args.a2.disabled);
                        let a3 = new interactionButton()
                            .setStyle(Args.a3.style)
                            .setEmoji(Args.a3.emoji)
                            .setCustomId('a3')
                            .setDisabled(Args.a3.disabled);
                        let b1 = new interactionButton()
                            .setStyle(Args.b1.style)
                            .setEmoji(Args.b1.emoji)
                            .setCustomId('b1')
                            .setDisabled(Args.b1.disabled);
                        let b2 = new interactionButton()
                            .setStyle(Args.b2.style)
                            .setEmoji(Args.b2.emoji)
                            .setCustomId('b2')
                            .setDisabled(Args.b2.disabled);
                        let b3 = new interactionButton()
                            .setStyle(Args.b3.style)
                            .setEmoji(Args.b3.emoji)
                            .setCustomId('b3')
                            .setDisabled(Args.b3.disabled);
                        let c1 = new interactionButton()
                            .setStyle(Args.c1.style)
                            .setEmoji(Args.c1.emoji)
                            .setCustomId('c1')
                            .setDisabled(Args.c1.disabled);
                        let c2 = new interactionButton()
                            .setStyle(Args.c2.style)
                            .setEmoji(Args.c2.emoji)
                            .setCustomId('c2')
                            .setDisabled(Args.c2.disabled);
                        let c3 = new interactionButton()
                            .setStyle(Args.c3.style)
                            .setEmoji(Args.c3.emoji)
                            .setCustomId('c3')
                            .setDisabled(Args.c3.disabled);
                        let a = new interactionActionRow()
                            .addComponents([a1, a2, a3])
                        let b = new interactionActionRow()
                            .addComponents([b1, b2, b3])
                        let c = new interactionActionRow()
                            .addComponents([c1, c2, c3])
                        let buttons = { components: [a, b, c] }

                        m.edit({ content: `等待 | <@!${Args.userid}> | 您的符號是： ${Args.user == 0 ? `${o_emoji}` : `${x_emoji}`}`, components: [a, b, c] })
                        const filter = (button) => button.user.id === Args.userid;

                        const collector = m.createinteractionComponentCollector({ filter, componentType: 'BUTTON', max: 1, time: 30000 });

                        collector.on('collect', b => {

                            if (b.user.id !== Args.userid) return b.reply({ content: '等待你的回合。', ephemeral: true })

                            if (Args.user == 0) {
                                Args.user = 1
                                Args[b.customId] = {
                                    style: "SUCCESS",
                                    emoji: o_emoji,
                                    disabled: true
                                }
                            } else {
                                Args.user = 0
                                Args[b.customId] = {
                                    style: "DANGER",
                                    emoji: x_emoji,
                                    disabled: true
                                }
                            }
                            b.deferUpdate()
                            const map = (obj, fun) =>
                                Object.entries(obj).reduce(
                                    (prev, [key, value]) => ({
                                        ...prev,
                                        [key]: fun(key, value)
                                    }),
                                    {}
                                );
                            const objectFilter = (obj, predicate) =>
                                Object.keys(obj)
                                    .filter(key => predicate(obj[key]))
                                    .reduce((res, key) => (res[key] = obj[key], res), {});
                            let Brgs = objectFilter(map(Args, (_, fruit) => fruit.emoji == dashmoji), num => num == true);
                            if (Object.keys(Brgs).length == 0) return m.edit({ content: '平手！', components: [] })
                            tictactoe(m)
                        });
                        collector.on('end', collected => {
                            if (collected.size == 0) m.edit({ content: `<@!${Args.userid}> 沒有在時間內做出回應。`, components: [] })
                        });
                    }

                }
            })

            collector.on('end', (collected, reason) => {
                if (reason == 'time') {
                    let embed = new Discord.interactionEmbed()
                        .setTitle('對方未在時間內接受邀請。')
                        .setAuthor(interaction.user.tag, interaction.user.displayAvatarURL())
                        .setColor(0xc90000)
                        .setFooter(foot)
                        .setDescription('時間限制：30秒')
                    m.edit({
                        embeds: [embed],
                        components: []
                    })
                }
                if (reason == 'decline') {
                    let embed = new Discord.interactionEmbed()
                        .setTitle("遊戲被拒絕了！")
                        .setAuthor(interaction.user.tag, interaction.user.displayAvatarURL())
                        .setColor(0xc90000)
                        .setFooter(foot)
                        .setDescription(`${opponent.user.tag} 拒絕了您的遊戲邀請。`)
                    m.edit({
                        embeds: [embed],
                        components: []
                    })
                }
            })


        }
        catch (err) {
            console.log(`錯誤日誌 | 井字遊戲 | Error: ${err}`)
        }
    }
}