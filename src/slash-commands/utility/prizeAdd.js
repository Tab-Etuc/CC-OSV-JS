const Prizes = require("../../models/mongoDB/Prizes.js");
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "prizeadd",
    description: "新增於玩家升等時所賦予之身分組。",
    category: "實用",
    permission: "ADMINISTRATOR",
    options: [{
        name: "等級",
        type: "INTEGER",
        description: "您欲於幾等賦予玩家身分組？",
        required: true
    },
    {
        name: "身分組",
        type: "ROLE",
        description: "您欲添加之身分組。",
        required: true,
    }],
    async execute(bot, interaction) {
        let level = interaction.options.getInteger("等級", false);

        let prizeData = await Prizes.findOne({ guildId: interaction.guild.id });
        let role = interaction.options.getRole("身分組", false);

        let embed = new MessageEmbed()
            .setColor("RANDOM")
            .setAuthor(
                interaction.member.user.username,
                interaction.member.user.displayAvatarURL({ dynamic: true })
            );

        if (level < 0) return interaction.reply({
            embeds: [
                embed.setDescription(
                    `等級不可為負！`
                )
            ]
        });

        if (!prizeData) {
            let newPrize = new Prizes({
                guildId: interaction.guild.id,
                levelPrizes: [{ level: level, role: role.id }]
            }).save();
        } else {
            if (prizeData.levelPrizes.find(x => x.level == level && x.role == role.id)) {
                interaction.reply({
                    embeds: [
                        embed.setDescription(
                            `未成功執行此操作。\n\`${role} 身分組早已於 ${level} 等時添加。\``
                        )
                    ]
                });
            } else {
                prizeData.levelPrizes.push({ level: level, role: role.id });
                prizeData.save();
                interaction.reply({
                    embeds: [
                        embed.setDescription(
                            `成功執行。\n\`現在將於 ${level} 等時添加 ${role} 身分組。\``
                        )
                    ]
                });
            };
        }
    }
};
