module.exports = {
    name: "raw",
    once: false,
    async execute(bot, packet) {
        if (!['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(packet.t)) return;
        const channel = bot.channels.cache.get(packet.d.channel_id);
        if (channel.messages.cache.has(packet.d.message_id)) return;

        // packet.d.emoji.id
        var data = {
            858140566268411924: {
                '837971561725952020Emoji': '837971561725952020',
                '861185706336845834Emoji': '861185706336845834',
                '🌻Emoji': '🌻',
                '🆙Emoji': '🆙',
                '🌻(Message_On_Add)': '您已獲得進入\`墓園\`之通行證。',
                '🆙(Message_On_Add)': '您已獲得進入\`練等專區\`之通行證。',
                '837971561725952020(Message_On_Add)': '您已獲得進入\`紅燈區\`之通行證。',
                '861185706336845834(Message_On_Add)': '您已獲得進入\`CC-OSV待辦事項區\`之通行證。',
                '837971561725952020(Message_On_Remove)': '您已被禁止進入\`紅燈區\`。',
                '861185706336845834(Message_On_Remove)': '您已被禁止進入\`CC-OSV待辦事項區\`。',
                '🌻(Message_On_Remove)': '您已被禁止進入\`墓園\`。',
                '🆙(Message_On_Remove)': '您已被禁止進入\`練等專區\`。',
                '837971561725952020(role)': '837975201915994153',
                '861185706336845834(role)': '863639159461773322',
                '🌻(role)': '863628692802240522',
                '🆙(role)': '863629520719839242',
            },

            847029838546993163: {
                '847026711064346655Emoji': '847026711064346655',
                '847026710780051477Emoji': '847026710780051477',
                '847026710780051477(Message_On_Add)': '您已成功變更名稱顏色。',
                '847026711064346655(Message_On_Add)': '您已成功變更名稱顏色。',
                '847026711064346655(Message_On_Remove)': '您已成功移除名稱顏色。',
                '847026710780051477(Message_On_Remove)': '您已成功移除名稱顏色。',
                '847026711064346655(role)': '846317257990733855',
                '847026710780051477(role)': '846317182577278998',
            },
            847031310358544394: {
                '847026710780051477Emoji': '847026710780051477',
                '847026711064346655Emoji': '847026711064346655',
                '847026710780051477(Message_On_Add)': '您已成功變更名稱顏色。',
                '847026711064346655(Message_On_Add)': '您已成功變更名稱顏色。',
                '847026710780051477(Message_On_Remove)': '您已成功移除名稱顏色。',
                '847026711064346655(Message_On_Remove)': '您已成功移除名稱顏色。',
                '847026710780051477(role)': '846317273244762142',
                '847026711064346655(role)': '846317375346704445',
            },
            847031700969095188: {
                '847026710780051477Emoji': '847026710780051477',
                '847026711064346655Emoji': '847026711064346655',
                '847026710780051477(Message_On_Add)': '您已成功變更名稱顏色。',
                '847026711064346655(Message_On_Add)': '您已成功變更名稱顏色。',
                '847026710780051477(Message_On_Remove)': '您已成功移除名稱顏色。',
                '847026711064346655(Message_On_Remove)': '您已成功移除名稱顏色。',
                '847026710780051477(role)': '846317390551842846',
                '847026711064346655(role)': '846317401469485116',
            },
            847033542990626816: {
                '847026710780051477Emoji': '847026710780051477',
                '847026711064346655Emoji': '847026711064346655',
                '847026710850568243Emoji': '847026710850568243',
                '847026711106420776Emoji': '847026711106420776',
                '847026710780051477Emoji': '847026710780051477',
                '847026710780051477(Message_On_Add)': '您已成功變更名稱顏色。',
                '847026711064346655(Message_On_Add)': '您已成功變更名稱顏色。',
                '847026710850568243(Message_On_Add)': '您已成功變更名稱顏色。',
                '847026711106420776(Message_On_Add)': '您已成功變更名稱顏色。',
                '847026710780051477(Message_On_Add)': '您已成功變更名稱顏色。',
                '847026710780051477(Message_On_Remove)': '您已成功移除名稱顏色。',
                '847026711064346655(Message_On_Remove)': '您已成功移除名稱顏色。',
                '847026710850568243(Message_On_Remove)': '您已成功移除名稱顏色。',
                '847026711106420776(Message_On_Remove)': '您已成功移除名稱顏色。',
                '847026710780051477(Message_On_Remove)': '您已成功移除名稱顏色。',
                '847026710780051477(role)': '846317443924361246',
                '847026711064346655(role)': '846317486235582485',
                '847026710850568243(role)': '846317533912891403',
                '847026711106420776(role)': '846317418540302416',
                '847026710842179585(role)': '846317429466595348',
            },
        }
        try {
            if (['MESSAGE_REACTION_ADD'].includes(packet.t)) {
                if (packet.d.message_id.toString() === '858160262606880818') {
                    if (packet.d.emoji.id.toString() === '858154997640331274') {
                        guild = await bot.guilds.fetch(packet.d.guild_id)
                        user = await guild.members.cache.get(packet.d.user_id);
                        role = guild.roles.cache.find(
                            r => r.id === '834430171171258417'
                        )
                        role2 = guild.roles.cache.find(
                            r => r.id === '891233331096723476'
                        )
                        await user.roles.add(role)
                        await user.roles.add(role2)
                        
                        return user.send(`您已成功進入我國國境。\n\`\`\`您現在的身分是平民\`\`\``)
                    }
                }
                if (parseInt(packet.d.message_id) in data) {
                    console.log(packet.d.message_id)
                    if (packet.d.emoji.id ? packet.d.emoji.id.toString() + 'Emoji' : packet.d.emoji.name.toString() + 'Emoji' in data[parseInt(packet.d.message_id)]) {
                        console.log(packet.d.emoji.name)
                        guild = await bot.guilds.fetch(packet.d.guild_id)
                        user = await guild.members.cache.get(packet.d.user_id);
                        role = guild.roles.cache.find(
                            r => r.id === data[
                                parseInt(packet.d.message_id)
                            ][packet.d.emoji.id ? packet.d.emoji.id.toString() + '(role)' : packet.d.emoji.name.toString() + '(role)'
                            ])

                        await user.roles.add(role)
                        await user.send(data[
                            parseInt(packet.d.message_id)
                        ][
                            packet.d.emoji.id ? packet.d.emoji.id.toString() + '(Message_On_Add)' : packet.d.emoji.name + '(Message_On_Add)'
                        ])
                    }

                }
            } else if (['MESSAGE_REACTION_REMOVE'].includes(packet.t)) {
                if (parseInt(packet.d.message_id) in data) {

                    if (packet.d.emoji.id ? packet.d.emoji.id.toString() + 'Emoji' : packet.d.emoji.name.toString() + 'Emoji' in data[parseInt(packet.d.message_id)]) {
                        guild = await bot.guilds.fetch(packet.d.guild_id)
                        user = await guild.members.cache.get(packet.d.user_id);
                        role = guild.roles.cache.find(
                            r => r.id === data[
                                parseInt(packet.d.message_id)
                            ][packet.d.emoji.id ? packet.d.emoji.id.toString() + '(role)' : packet.d.emoji.name.toString() + '(role)'
                            ])

                        await user.roles.remove(role)
                        await user.send(data[
                            parseInt(packet.d.message_id)
                        ][
                            packet.d.emoji.id ? packet.d.emoji.id.toString() + '(Message_On_Remove)' : packet.d.emoji.name + '(Message_On_Remove)'
                        ])
                    }

                }
            }
        } catch (err){
            console.log(err)
        }
    }
}