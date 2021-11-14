
const { MessageEmbed } = require('discord.js');
const economy = require('../../models/mongoDB/Economy');
module.exports = {
    name: "top",
    description: "查看伺服器中的富豪榜。",
    category: "經濟",
    async execute(bot, interaction) {
        let data = await economy.find().sort([['coinsInWallet', 'descending']])
        data = data.filter(x => interaction.guild.members.cache.get(x.userId) && interaction.guild.members.cache.get(x.userId).bot != true).slice(0, 6);
        if (data.length == 0) return interaction.reply('查無數據。'); 
        
        const emojis = [':first_place:', ':second_place:', ':third_place:'];
        data = data.map((x, i) => `${emojis[i] || '🔹'} **${x.coinsInWallet.toLocaleString()}** - ${bot.users.cache.get(x.userId).tag || '未知#0000'}`);
    
        const embed = new MessageEmbed()
            .setAuthor(`${interaction.guild.name} 富豪榜`)
            .setDescription(`${data.join('\n')}`)
            .setColor('RANDOM')
            .setFooter('希望我能有這麼多錢......');
        interaction.reply({embeds:[embed]});
    }
}