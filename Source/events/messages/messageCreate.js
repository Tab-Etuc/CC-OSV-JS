
const Prizes = require("../../models/Prizes.js");
const Levels = require("../../models/Levels.js");
const Discord = require("discord.js")

module.exports = {
    name: "messageCreate",
    async execute(bot, message) {
        if (message.author.bot || !message.guild) return;

        // chat level
        let levelData = await Levels.findOne({ guildId: message.guild.id, userId: message.author.id });
        let rankData = await Prizes.findOne({ guildId: message.guild.id });

        if (!rankData) {
            let newRank = new Prizes({
                guildId: message.guild.id
            }).save();
        };

        if (!levelData) {
            let newLevel = new Levels({
                guildId: message.guild.id,
                userId: message.author.id,
                userName: message.author.name
            }).save();
        } else {
            let addedXp = Math.floor(Math.random() * (5 - 1) + 1);
            levelData.xp += addedXp
            levelData.totalXp += addedXp
            levelData.save().then(data => {
                if (data.xp >= data.xpToLevel) {
                    levelData.xp = 0;
                    levelData.level++;
                    levelData.xpToLevel = data.level * 100;
                    levelData.save().then(async _data => {
                        const embed = new Discord.MessageEmbed()
                            .setColor("#a8e1fa")
                            .setAuthor(message.guild.name, message.guild.iconURL({ dynamic: true }))
                            .setThumbnail(message.guild.iconURL({ dynamic: true }))
                            .setDescription(`恭喜 <@${message.author.id}> 升級\nʚ・⋯⋯⋯⋯⋯・୨୧・⋯⋯⋯⋯⋯・ɞ\n您現在是等級 **${levelData.level}**\n繼續聊天可解鎖更多等級身份\nʚ・⋯⋯⋯⋯⋯・୨୧・⋯⋯⋯⋯⋯・ɞ`);
                        message.reply({ embeds: [embed] }).then((msg) => {
                            if (rankData && rankData.levelPrizes.find(x => x.level == _data.level)) {
                                rankData.levelPrizes.filter(x => x.level == _data.level).forEach(x => {
                                    message.member.roles.add(x.role).catch(e => console.log(e));
                                    const embed = new Discord.MessageEmbed()
                                        .setColor("#a8e1fa")
                                        .setAuthor(message.guild.name, message.guild.iconURL({ dynamic: true }))
                                        .setThumbnail(message.guild.iconURL({ dynamic: true }))
                                        .setDescription(`恭喜 <@${message.author.id}> 升級\nʚ・⋯⋯⋯⋯⋯・୨୧・⋯⋯⋯⋯⋯・ɞ\n您現在是等級 **${levelData.level}**\n您剛解鎖了身分組：<@&${x.role}>\n繼續聊天可解鎖更多等級身份\nʚ・⋯⋯⋯⋯⋯・୨୧・⋯⋯⋯⋯⋯・ɞ`);
                                    msg.edit({ embeds: [embed] })
                                });
                            }
                        })
                    });
                };
            })
        }



        // NQN
        let substringArray = get_substrings_between(message.content, ":", ":");
        let msg = message.content;
        if (!substringArray.length) return;


        substringArray.forEach(m => {
            let emoji = bot.emojis.cache.find(x => x.name === m);
            if (emoji['animated']) {

                var replace = `:${m}:`;
                var rexreplace = new RegExp(replace, 'g');

                if (emoji && !msg.split(" ").find(x => x === emoji.toString()) && !msg.includes(`<a${replace}${emoji.id}>`)) msg = msg.replace(rexreplace, emoji.toString());
            } else {
                return
            }
        })

        msg = bot.utils.toSBC(msg)
        if ('cl3i' in msg.toLowerCase() || 'c襖喔' in msg.toLowerCase()) {
            msg = msg.toLowerCase()
            msg = msg.replace(/cl3i|c襖喔/g, '好喔');
        }
        if (msg === message.content) return;

        let webhook = await message.channel.fetchWebhooks();
        webhook = webhook.find(x => x.name === "NQN");

        if (!webhook) {
            webhook = await message.channel.createWebhook(`NQN`, {
                avatar: bot.user.displayAvatarURL({ dynamic: true })
            });
        }

        await webhook.edit({
            name: message.member.nickname ? message.member.nickname : message.author.username,
            avatar: message.author.displayAvatarURL({ dynamic: true })
        })

        message.delete().catch(m => { })

        webhook.send(msg).catch(m => { });

        await webhook.edit({
            name: `NQN`,
            avatar: bot.user.displayAvatarURL({ dynamic: true })
        })
    }
}

function get_substrings_between(str, startDelimiter, endDelimiter) {
    var contents = [];
    var startDelimiterLength = startDelimiter.length;
    var endDelimiterLength = endDelimiter.length;
    var startFrom = contentStart = contentEnd = 0;

    while (false !== (contentStart = strpos(str, startDelimiter, startFrom))) {
        contentStart += startDelimiterLength;
        contentEnd = strpos(str, endDelimiter, contentStart);
        if (false === contentEnd) {
            break;
        }
        contents.push(str.substr(contentStart, contentEnd - contentStart));
        startFrom = contentEnd + endDelimiterLength;
    }

    return contents;
}


function strpos(haystack, needle, offset) {
    var i = (haystack + '').indexOf(needle, (offset || 0));
    return i === -1 ? false : i;
}