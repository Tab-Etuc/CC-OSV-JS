module.exports = {
    name: "raw",
    async execute(bot, packet) {
        if (!['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(packet.t)) return;
        const channel = bot.channels.cache.get(packet.d.channel_id);
        if (channel.messages.cache.has(packet.d.message_id)) return;

        // packet.d.emoji.id
        var data = {
            858140566268411924: {
                '837971561725952020Emoji': '837971561725952020',
                '861185706336845834Emoji': '861185706336845834',
                '837971561725952020(Message_On_Add)': '您已獲得進入紅燈區之通行證。',
                '861185706336845834(Message_On_Add)': '您已獲得進入CC-OSV待辦事項區之通行證。',
                '837971561725952020(Message_On_Remove)': '您已被禁止進入紅燈區。',
                '861185706336845834(Message_On_Remove)': '您已被禁止進入CC-OSV待辦事項區',
                '837971561725952020(role)': '837975201915994153',
                '861185706336845834(role)': '863639159461773322',
            },

            847029838546993163: {
                '847026711064346655Emoji': '847026711064346655',
                '847026710780051477Emoji': '847026710780051477',
                '847026710780051477(Message_On_Add)': '您已成功變更名稱顏色。',
                '847026711064346655(Message_On_Add)': '您已成功變更名稱顏色。',
                '837971561725952020(Message_On_Remove)': '您已成功移除名稱顏色。',
                '847026710780051477(Message_On_Remove)': '您已成功移除名稱顏色。',
                '837971561725952020(role)': '846317257990733855',
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
                '847026711064346655(role)': '860396953551634432',
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
        if (['MESSAGE_REACTION_ADD'].includes(packet.t)) {
            if (parseInt(packet.d.message_id) in data) {

                if (packet.d.emoji.id.toString() + 'Emoji' in data[parseInt(packet.d.message_id)]) {
                    guild = await bot.guilds.fetch(packet.d.guild_id)
                    user = await guild.members.cache.get(packet.d.user_id);
                    role = guild.roles.cache.find(
                        r => r.id === data[
                            parseInt(packet.d.message_id)
                        ][packet.d.emoji.id.toString() + '(role)'
                        ])

                    await user.roles.add(role)
                    await user.send(data[
                        parseInt(packet.d.message_id)
                    ][
                        packet.d.emoji.id.toString() + '(Message_On_Add)'
                    ])
                }

            }
        }else if (['MESSAGE_REACTION_REMOVE'].includes(packet.t)) {
            if (parseInt(packet.d.message_id) in data) {

                if (packet.d.emoji.id.toString() + 'Emoji' in data[parseInt(packet.d.message_id)]) {
                    guild = await bot.guilds.fetch(packet.d.guild_id)
                    user = await guild.members.cache.get(packet.d.user_id);
                    role = guild.roles.cache.find(
                        r => r.id === data[
                            parseInt(packet.d.message_id)
                        ][packet.d.emoji.id.toString() + '(role)'
                        ])

                    await user.roles.remove(role)
                    await user.send(data[
                        parseInt(packet.d.message_id)
                    ][
                        packet.d.emoji.id.toString() + '(Message_On_Remove)'
                    ])
                }

            }
        }
    }
}