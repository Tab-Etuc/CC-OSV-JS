const UserManager = require('../../../models/economy/UserManager')

module.exports = {
    name: "提款",
    description: "從銀行取出現金。",
    category: "經濟",
    options: [{
        name: '金額',
        type: 'STRING',
        description: '您欲存入的現金金額。（註：輸入"all"、"所有"等，可一次性存入所有現金。）',
        required: true,
    }],
    async execute(bot, interaction) {
        let data = await UserManager.fetchUser(bot, interaction.member.id, interaction.guild.id);
        const arg = interaction.options.getString("金額", false);
        if (arg.toLowerCase() === 'all' || arg === '全部' || arg === '全' || arg === '所有' || arg === 'a' || arg === 'ＡＬＬ' || arg === 'ａｌｌ' || arg === 'ａ') {
            data.coinsInWallet += data.coinsInBank;

            await interaction.reply(`已取出 \`${data.coinsInBank}\` 元！`);

            data.coinsInBank -= data.coinsInBank;

            await data.save();
        } else {
            if (isNaN(arg)) {
                return interaction.reply('請您輸入一個正確的數字。');
            }

            if (parseInt(arg) > data.coinsInBank) {
                return interaction.reply('您的銀行存額不足，請提升。');
            }

            data.coinsInWallet += parseInt(arg);

            await interaction.reply(`已取出 \`${arg}\` 元！`);

            data.coinsInBank -= parseInt(arg);

            await data.save();
        }
    }
}