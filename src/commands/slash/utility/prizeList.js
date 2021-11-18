const Prizes = require("../../../models/mongoDB/Prizes.js");
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "prizelist",
    description: "展示您在升等時會得到的身分組。",
    category: "實用",
    async execute(bot, interaction) {
        let prizeData = await Prizes.findOne({ guildId: interaction.guild.id });
        let embed = new MessageEmbed()
            .setColor("RANDOM")
            .setAuthor(interaction.guild.name, interaction.guild.iconURL({ dynamic: true }))
            .setThumbnail(interaction.guild
                .iconURL({ dynamic: true }));

        if (!prizeData) {
            interaction.reply({
                embeds: [
                    embed.setDescription(
                        `**${interaction.guild.name}** \n\n查無數據。`
                    )
                ]
            });
        } else {
            prizeData = prizeData.levelPrizes.filter(x => interaction.guild.roles.cache.has(x.role)).sort((x, y) => y.level - x.level).map(x => `<@&${x.role}> - **${x.level}**`).join("\n");
            interaction.reply({
                embeds: [
                    embed.setDescription(
                        `**${interaction.guild.name}**  \n\n` + prizeData
                    )
                ]
            });
        };
    }
};
