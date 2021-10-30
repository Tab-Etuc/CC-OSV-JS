module.exports = {
    name: "purge",
    description: "清除指定數量的訊息。",
    category: "實用",
    subCommands: ["<數量>**\n欲清除之訊息數量。"],
    options: [{
        name: "數量",
        type: "INTEGER",
        description: "您欲清除之訊息數量。",
        required: true
    },
    {
        name: "訊息顯示",
        type: "BOOLEAN",
        description: "是否將訊息清除完畢之訊息發送至頻道",
        required: false
    }],
    async execute(bot, interaction) {

        const integer = interaction.options.getInteger('數量');
        const BOOLEAN_ = interaction.options.getBoolean('訊息顯示');

        if (integer < 1) return;
        const hundreds = Math.floor(integer / 100);
        const remainder = integer % 100;
        let totalDeleted = 0;

        if (remainder > 0) {
            const e = await interaction.channel.bulkDelete(remainder, true);
            totalDeleted += e.size;
        }
        for (let i = 0; i < hundreds; ++i) {
            const e = await interaction.channel.bulkDelete(100, true);
            totalDeleted += e.size;
        }


        if (BOOLEAN_) {
            const embed = bot.say.rootEmbed(interaction)
                .setTitle("`執行完畢！`")
                .setDescription(`\`${integer}\` 則訊息已刪除。`)
                .setTimestamp()
                .setFooter(`頻道：${interaction.channel.name}`);
            await interaction.reply({ content: `提示：將\`訊息顯示\`調成False 來取消發送執行完畢訊息`, embeds: [embed] });
        } else {
            const embed = bot.say.rootEmbed(interaction)
                .setTitle("`執行完畢！`")
                .setDescription(`\`${integer}\` 則訊息已刪除。`)
                .setTimestamp()
                .setFooter(`頻道：${interaction.channel.name}`);
            return interaction.reply({ embeds: [embed], ephemeral: true });

        }

    }
};