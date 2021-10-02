const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "背包",
    description: "查看您的背包。",
    category: "經濟",
    async execute(bot, interaction) {
        const user = await bot.mongo.fetchUser(bot, interaction.member.id);

        let page;
        if (user.items.length <= 5) page = 1;
        else if (user.items.length <= 10) page = 2;
        else if (user.items.length <= 15) page = 3;
        else if (user.items.length <= 20) page = 4;

        let item = user.items.slice(0, 5);
        if (item.length < 1) {
            return interaction.reply('您的背包內空無一物。||根本笑死||');
        }
        const items = item.map(x => `**${x.name}** - ${x.amount.toLocaleString()}\n${x.description}`);
        const embed = new MessageEmbed()
            .setTitle(`${interaction.user?.tag} 的背包`)
            .setDescription(`${items.join('\n\n')}`)
            .setColor('RANDOM');
        interaction.reply(embed);
    }
}